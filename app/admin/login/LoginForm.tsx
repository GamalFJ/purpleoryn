"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // The link must be opened in this same browser (PKCE).
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        shouldCreateUser: false,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(
        error.status === 429
          ? "Too many links were sent. Wait a few minutes and try again."
          : "We couldn't send the link. Check the email address and try again.",
      );
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="mt-8 rounded-[var(--radius-field)] border border-plum-muted/30 bg-plum-ink/5 px-4 py-4 text-[15px] text-plum-ink">
        Check <strong>{email}</strong> and open the link in this same browser.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2">
      <label htmlFor="email" className="text-[15px] font-semibold text-plum-ink">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-[var(--radius-field)] border border-plum-muted/30 bg-plum-ink/5 px-4 text-base text-plum-ink outline-none placeholder:text-plum-muted focus:border-plum-accent"
      />
      {status === "error" && <p className="text-sm text-danger">{message}</p>}
      <button type="submit" disabled={status === "sending"} className={buttonClass("onPlum", "lg", "mt-4")}>
        {status === "sending" ? "Sending..." : "Send sign-in link"}
      </button>
    </form>
  );
}
