// Lets anything on the page open the Oryn chat panel without lifting the
// launcher's state into a provider. ChatLauncher listens for this event.
export const OPEN_CHAT_EVENT = "pcl:open-chat";

export function openChat(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}
