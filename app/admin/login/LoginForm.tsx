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
          ? "Se enviaron demasiados enlaces. Espera unos minutos e inténtalo de nuevo."
          : "No pudimos enviar el enlace. Revisa el correo e inténtalo de nuevo.",
      );
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="mt-8 rounded-[var(--radius-field)] border border-line bg-surface px-4 py-4 text-[15px]">
        Revisa <strong>{email}</strong> y abre el enlace en este mismo navegador.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2">
      <label htmlFor="email" className="text-[15px] font-semibold">
        Correo
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-[var(--radius-field)] border border-line bg-surface px-4 text-base outline-none focus:border-accent"
      />
      {status === "error" && <p className="text-sm text-danger">{message}</p>}
      <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "lg", "mt-4")}>
        {status === "sending" ? "Enviando..." : "Enviar enlace de acceso"}
      </button>
    </form>
  );
}
