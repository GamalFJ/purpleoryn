import { createOpenAIProvider } from "./openai";
import { createOpenRouterProvider } from "./openrouter";
import { ProviderError, type ChatProvider, type ChatRequest, type ChatResponse } from "./types";

function configuredProviders(): ChatProvider[] {
  const providers: ChatProvider[] = [];
  const selected = process.env.AI_PROVIDER?.trim().toLowerCase();
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const addOpenRouter = () => {
    if (openRouterKey) providers.push(createOpenRouterProvider(openRouterKey));
  };
  const addOpenAI = () => {
    if (openAiKey) providers.push(createOpenAIProvider(openAiKey));
  };

  // Explicit selection determines the primary provider. Other configured
  // providers remain eligible as fallbacks without coupling the API route to a
  // specific vendor.
  if (selected === "openrouter") {
    addOpenRouter();
    addOpenAI();
  } else if (selected === "openai") {
    addOpenAI();
    addOpenRouter();
  } else {
    // Backward-compatible default: OpenAI remains first when AI_PROVIDER is
    // unset, while OpenRouter is available when it is the only configured key.
    addOpenAI();
    addOpenRouter();
  }

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
      if (err instanceof ProviderError) {
        const status = err.status !== undefined ? ` status=${err.status}` : "";
        console.error(`[agent] ${provider.name} failed: ${err.message} (${err.code}${status}${err.detail ? ` ${err.detail}` : ""})`);
      } else {
        console.error(`[agent] ${provider.name} failed:`, err instanceof Error ? err.message : "unknown provider error");
      }
    }
  }
  throw lastError;
}
