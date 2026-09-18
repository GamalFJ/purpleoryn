"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { OPEN_CHAT_EVENT } from "@/lib/chat";

// The panel (and its logic) only downloads once someone opens the chat.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function ChatLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const launch = useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  // Links elsewhere on the site (the plan order form) open the panel too.
  useEffect(() => {
    window.addEventListener(OPEN_CHAT_EVENT, launch);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, launch);
  }, [launch]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={launch}
          aria-haspopup="dialog"
          className="fixed bottom-4 right-4 z-40 flex h-14 cursor-pointer items-center gap-2.5 rounded-full border border-line bg-surface py-2 pl-2 pr-2 text-[15px] font-medium shadow-[0_12px_32px_-12px_rgb(28_16_48/0.45)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:pr-5"
        >
          <Image src="/media/oryn.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
          <span className="hidden sm:inline">Pregúntale a Oryn</span>
          <span className="sr-only sm:hidden">Abrir asistente Oryn</span>
        </button>
      )}
      {loaded && <ChatPanel open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
