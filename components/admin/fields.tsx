"use client";

import { startTransition, useActionState, useId, type ReactNode } from "react";
import type { AdminActionState } from "@/app/admin/(panel)/actions";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-[var(--radius-field)] border border-line bg-paper px-4 text-base outline-none transition-colors focus:border-accent";

// Submits through onSubmit (not the form `action` prop) so React doesn't reset
// the uncontrolled fields when the server returns an error.
export function useAdminForm(action: (prev: AdminActionState, fd: FormData) => Promise<AdminActionState>) {
  const [state, run, pending] = useActionState(action, { status: "idle" });
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => run(fd));
  };
  return { state, pending, onSubmit };
}

export function TextField({
  name,
  label,
  defaultValue,
  help,
  multiline,
  rows = 3,
  required,
  inputMode,
  className,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  help?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  const id = `${useId()}-${name}`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} name={name} rows={rows} defaultValue={defaultValue ?? ""} required={required} className={cn(inputClass, "py-3")} />
      ) : (
        <input id={id} name={name} defaultValue={defaultValue ?? ""} required={required} inputMode={inputMode} className={cn(inputClass, "h-12")} />
      )}
      {help && <p className="text-sm text-muted">{help}</p>}
    </div>
  );
}

export function SaveBar({ state, pending, label = "Save changes", extra }: { state: AdminActionState; pending: boolean; label?: string; extra?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? "Saving..." : label}
      </button>
      {extra}
      <p aria-live="polite" className={cn("text-sm", state.status === "error" ? "text-danger" : "text-success")}>
        {state.status !== "idle" && !pending ? state.message : ""}
      </p>
    </div>
  );
}
