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
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
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

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new ProviderError(`OpenAI ${res.status}: ${detail.slice(0, 300)}`, res.status);
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string | null; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[];
      };
      const message = json.choices?.[0]?.message;
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
