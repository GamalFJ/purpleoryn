import { createOpenAIProvider } from "./openai";
import type { ChatProvider, ChatRequest, ChatResponse } from "./types";

// Provider order. Target: Claude primary, OpenAI and Gemini as fallbacks.
// Only OpenAI is implemented today; adding Claude = write lib/ai/anthropic.ts
// and push it to the front of this list when ANTHROPIC_API_KEY is set.
function configuredProviders(): ChatProvider[] {
  const providers: ChatProvider[] = [];
  if (process.env.OPENAI_API_KEY) providers.push(createOpenAIProvider(process.env.OPENAI_API_KEY));
  return providers;
}

export function isAgentConfigured(): boolean {
  return configuredProviders().length > 0;
}

// Tries each configured provider in order and returns the first success.
export async function chatWithFallback(request: ChatRequest): Promise<ChatResponse & { provider: string }> {
  const providers = configuredProviders();
  let lastError: unknown = new Error("No AI provider configured");
  for (const provider of providers) {
    try {
      return { ...(await provider.chat(request)), provider: provider.name };
    } catch (err) {
      lastError = err;
      console.error(`[agent] ${provider.name} failed:`, err instanceof Error ? err.message : err);
    }
  }
  throw lastError;
}
