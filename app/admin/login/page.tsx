import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  enlace: "El enlace expiró o ya se usó. Pide uno nuevo.",
  "sin-acceso": "Esta cuenta no tiene acceso al panel.",
};

type SearchParams = Promise<{ error?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Image src="/media/logo.webp" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
        <h1 className="mt-5 text-3xl font-semibold">Panel de Purple Cove Labs</h1>
        <p className="mt-2 text-[15px] text-muted">Te enviamos un enlace de acceso a tu correo. No hace falta contraseña.</p>
        {error && ERRORS[error] && (
          <p role="alert" className="mt-5 rounded-[var(--radius-field)] bg-danger/10 px-4 py-3 text-[15px] text-danger">
            {ERRORS[error]}
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
