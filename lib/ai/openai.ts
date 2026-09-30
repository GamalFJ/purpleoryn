import { ProviderError, type AgentMessage, type ChatProvider, type ChatRequest, type ChatResponse } from "./types";

// Cost-efficient GPT-5.6 tier with function calling in Chat Completions.
const DEFAULT_MODEL = "gpt-5.6-luna";

type OpenAIMessage =
  | { role: "system" | "user"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: { id: string; type: "function"; function: { name: string; arguments: string } }[];
    }
  | { role: "tool"; tool_call_id: string; content: string };

function toOpenAI(system: string, messages: AgentMessage[]): OpenAIMessage[] {
  return [
    { role: "system", content: system },
    ...messages.map((m): OpenAIMessage => {
      if (m.role === "tool") return { role: "tool", tool_call_id: m.toolCallId, content: m.content };
      if (m.role === "assistant") {
        return {
          role: "assistant",
          content: m.content || null,
          tool_calls: m.toolCalls?.length
            ? m.toolCalls.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: JSON.stringify(c.arguments) } }))
            : undefined,
        };
      }
      return { role: "user", content: m.content };
    }),
  ];
}

export function createOpenAIProvider(apiKey: string, model = process.env.OPENAI_MODEL || DEFAULT_MODEL): ChatProvider {
  return {
    name: "openai",
    async chat({ system, messages, tools, maxOutputTokens = 700 }: ChatRequest): Promise<ChatResponse> {
      if (!apiKey) throw new ProviderError("OpenAI is not configured.", undefined, "configuration");

      let res: Response;
      try {
        res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: toOpenAI(system, messages),
            tools: tools.map((t) => ({ type: "function", function: t })),
            tool_choice: "auto",
            max_completion_tokens: maxOutputTokens,
          }),
          signal: AbortSignal.timeout(25_000),
        });
      } catch (error) {
        if (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError")) {
          throw new ProviderError("OpenAI request timed out.", undefined, "timeout");
        }
        throw new ProviderError("Could not reach OpenAI.", undefined, "upstream");
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) throw new ProviderError("OpenAI authentication failed.", res.status, "unauthorized");
        if (res.status === 429) throw new ProviderError("OpenAI rate limit reached.", res.status, "rate_limit");
        await res.arrayBuffer().catch(() => undefined);
        throw new ProviderError(res.status >= 500 ? "OpenAI is temporarily unavailable." : "OpenAI request failed.", res.status, "upstream");
      }

      const json = (await res.json().catch(() => null)) as {
        choices?: { message?: { content?: string | null; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[];
      } | null;
      const message = json?.choices?.[0]?.message;
      if (!message || (typeof message.content !== "string" && message.content !== null) || !Array.isArray(message.tool_calls ?? [])) {
        throw new ProviderError("OpenAI returned an invalid response.", undefined, "malformed_response");
      }
      return {
        text: message?.content ?? "",
        toolCalls: (message?.tool_calls ?? []).map((c) => {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(c.function.arguments || "{}");
          } catch {
            // Malformed arguments: the tool executor rejects empty input.
          }
          return { id: c.id, name: c.function.name, arguments: args };
        }),
      };
    },
  };
}
