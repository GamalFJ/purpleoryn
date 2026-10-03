// Provider-neutral chat types. Each provider (OpenAI now; Claude and Gemini
// later) maps these to its own wire format, so the agent never changes.
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export type AgentMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: ToolCall[] }
  | { role: "tool"; toolCallId: string; name: string; content: string };

export interface ToolDefinition {
  name: string;
  description: string;
  // JSON Schema for the arguments object.
  parameters: Record<string, unknown>;
}

export interface ChatRequest {
  system: string;
  messages: AgentMessage[];
  tools: ToolDefinition[];
  maxOutputTokens?: number;
}

export interface ChatResponse {
  text: string;
  toolCalls: ToolCall[];
}

export interface ChatProvider {
  name: "openai" | "openrouter" | "anthropic" | "gemini";
  chat(request: ChatRequest): Promise<ChatResponse>;
}

export type ProviderErrorCode = "configuration" | "timeout" | "rate_limit" | "unauthorized" | "upstream" | "malformed_response";

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code: ProviderErrorCode = "upstream",
    // Short, server-log-only context (model, upstream error code); never sent to the visitor.
    readonly detail?: string,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
