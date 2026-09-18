import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  "link-expired": "That link expired or was already used. Request a new one.",
  "no-access": "This account doesn't have access to the panel.",
};

type SearchParams = Promise<{ error?: string }>;

// The one admin surface that isn't behind requireAdmin yet, so it keeps the
// same deep-plum glow as the public site's closing CTA rather than the
// panel's own lighter chrome.
export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  return (
    <main className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden bg-plum px-4">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#a21caf]/45 blur-3xl" />
        <div className="animate-drift absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-[#6d2fd8]/50 blur-3xl [--drift-x:-50px] [animation-duration:20s]" />
        <div className="animate-drift absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#f59e0b]/25 blur-3xl [--drift-x:40px] [--drift-y:-40px] [animation-duration:24s]" />
      </div>
      <div className="w-full max-w-sm">
        <Image src="/media/logo.webp" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
        <h1 className="mt-5 text-3xl font-semibold text-plum-ink">Purple Cove Labs Admin</h1>
        <p className="mt-2 text-[15px] text-plum-muted">We&rsquo;ll email you a sign-in link. No password needed.</p>
        {error && ERRORS[error] && (
          <p role="alert" className="mt-5 rounded-[var(--radius-field)] bg-danger/15 px-4 py-3 text-[15px] text-danger">
            {ERRORS[error]}
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
