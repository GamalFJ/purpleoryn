import { ProviderError, type AgentMessage, type ChatProvider, type ChatRequest, type ChatResponse } from "./types";

const DEFAULT_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type OpenRouterMessage =
  | { role: "system" | "user"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: { id: string; type: "function"; function: { name: string; arguments: string } }[];
    }
  | { role: "tool"; tool_call_id: string; content: string };

function toOpenRouter(system: string, messages: AgentMessage[]): OpenRouterMessage[] {
  return [
    { role: "system", content: system },
    ...messages.map((message): OpenRouterMessage => {
      if (message.role === "tool") {
        return { role: "tool", tool_call_id: message.toolCallId, content: message.content };
      }
      if (message.role === "assistant") {
        return {
          role: "assistant",
          content: message.content || null,
          tool_calls: message.toolCalls?.length
            ? message.toolCalls.map((call) => ({
                id: call.id,
                type: "function",
                function: { name: call.name, arguments: JSON.stringify(call.arguments) },
              }))
            : undefined,
        };
      }
      return { role: "user", content: message.content };
    }),
  ];
}

function providerError(status: number, detail?: string): ProviderError {
  if (status === 401 || status === 403) return new ProviderError("OpenRouter authentication failed.", status, "unauthorized", detail);
  if (status === 429) return new ProviderError("OpenRouter rate limit reached.", status, "rate_limit", detail);
  return new ProviderError(status >= 500 ? "OpenRouter is temporarily unavailable." : "OpenRouter request failed.", status, "upstream", detail);
}

// What OpenRouter said about a failed request, reduced to a short log line: the model we asked for,
// its error code/type, the upstream provider it routed to and a capped message. Never the request.
async function failureDetail(response: Response, model: string): Promise<string> {
  const text = await response.text().catch(() => "");
  let parsed: { error?: { code?: unknown; type?: unknown; message?: unknown; metadata?: { provider_name?: unknown } } } | null = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Not JSON; fall through with the model only.
  }
  const error = parsed?.error;
  const parts = [`model=${model}`];
  if (error?.code !== undefined) parts.push(`code=${String(error.code).slice(0, 40)}`);
  if (typeof error?.type === "string") parts.push(`type=${error.type.slice(0, 40)}`);
  if (typeof error?.metadata?.provider_name === "string") parts.push(`upstream=${error.metadata.provider_name.slice(0, 40)}`);
  if (typeof error?.message === "string") parts.push(`message="${error.message.replace(/\s+/g, " ").slice(0, 160)}"`);
  return parts.join(" ");
}

export function createOpenRouterProvider(apiKey: string, model = process.env.AI_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_MODEL): ChatProvider {
  return {
    name: "openrouter",
    async chat({ system, messages, tools, maxOutputTokens = 700 }: ChatRequest): Promise<ChatResponse> {
      if (!apiKey) throw new ProviderError("OpenRouter is not configured.", undefined, "configuration");

      let response: Response;
      try {
        response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...(process.env.NEXT_PUBLIC_SITE_URL ? { "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL } : {}),
            "X-Title": "Purple Cove Labs Oryn",
          },
          body: JSON.stringify({
            model,
            messages: toOpenRouter(system, messages),
            tools: tools.map((tool) => ({ type: "function", function: tool })),
            tool_choice: "auto",
            max_tokens: maxOutputTokens,
          }),
          signal: AbortSignal.timeout(25_000),
        });
      } catch (error) {
        if (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError")) {
          throw new ProviderError("OpenRouter request timed out.", undefined, "timeout");
        }
        throw new ProviderError("Could not reach OpenRouter.", undefined, "upstream");
      }

      if (!response.ok) {
        throw providerError(response.status, await failureDetail(response, model));
      }

      const json = (await response.json().catch(() => null)) as {
        choices?: { message?: { content?: string | null; tool_calls?: { id?: string; function?: { name?: string; arguments?: string } }[] } }[];
      } | null;
      const message = json?.choices?.[0]?.message;
      if (!message || typeof message.content !== "string" && message.content !== null || !Array.isArray(message.tool_calls ?? [])) {
        throw new ProviderError("OpenRouter returned an invalid response.", undefined, "malformed_response");
      }

      return {
        text: message.content ?? "",
        toolCalls: (message.tool_calls ?? []).map((call) => {
          if (!call.id || !call.function?.name) {
            throw new ProviderError("OpenRouter returned an invalid tool call.", undefined, "malformed_response");
          }
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(call.function.arguments || "{}");
          } catch {
            throw new ProviderError("OpenRouter returned invalid tool arguments.", undefined, "malformed_response");
          }
          return { id: call.id, name: call.function.name, arguments: args };
        }),
      };
    },
  };
}
