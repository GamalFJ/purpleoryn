// The chat widget shows the assistant's reply as plain text, so markdown would
// appear as literal characters ("**Presencia**", "[texto](https://cal.com)").
// The prompt already asks for plain text; this enforces it because the model
// does not always obey. Buttons come from tool actions, never from links in the reply.
export function toPlainText(reply: string): string {
  return reply
    .replace(/\[([^\]\n]+)\]\((?:https?:\/\/|mailto:)[^)\s]*\)/g, "$1")
    .replace(/```/g, "")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/^\s*[*•]\s+/gm, "- ")
    .replace(/\*\*([^*\n]+?)\*\*/g, "$1")
    .replace(/__([^_\n]+?)__/g, "$1")
    .replace(/(?<![\w*])\*(?!\s)([^*\n]+?)(?<!\s)\*(?![\w*])/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}
