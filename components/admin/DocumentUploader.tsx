"use client";

import { useState } from "react";
import { FilePdf, Trash, UploadSimple } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { DOCS_BUCKET, docsPathFromUrl } from "@/lib/storage";

const MAX_BYTES = 20 * 1024 * 1024;

function isPdf(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

async function uploadPdf(file: File, folder: string): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}.pdf`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(DOCS_BUCKET)
    .upload(path, file, { contentType: "application/pdf", cacheControl: "300", upsert: false });
  if (error) throw new Error("Couldn't upload the PDF. Try again.");
  return supabase.storage.from(DOCS_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Uploads that haven't been saved yet can be deleted right away when replaced
// or removed. Previously saved files are only deleted by the server action
// after the record is saved, so abandoning the form never breaks a live link.
async function discardIfUnsaved(url: string, savedUrl: string | null) {
  if (url === savedUrl) return;
  const path = docsPathFromUrl(url);
  if (path) await createClient().storage.from(DOCS_BUCKET).remove([path]);
}

export function DocumentUploader({
  name,
  label,
  folder,
  defaultUrl,
  defaultLabel = "Documento por defecto",
}: {
  name: string;
  label: string;
  folder: string;
  defaultUrl: string | null;
  /** Shown when no file has been uploaded, in place of a file name. */
  defaultLabel?: string;
}) {
  const saved = defaultUrl;
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    if (!isPdf(file)) {
      setError("Ese archivo no es un PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El PDF pesa demasiado (máximo 20 MB).");
      return;
    }
    setBusy(true);
    try {
      const next = await uploadPdf(file, folder);
      if (url) await discardIfUnsaved(url, saved);
      setUrl(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3 rounded-[var(--radius-field)] border border-line bg-paper px-4 py-3">
        <FilePdf size={22} className="shrink-0 text-accent" />
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-accent underline-offset-4 hover:underline">
            Ver PDF actual
          </a>
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm text-muted">{defaultLabel}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium hover:border-accent">
          <UploadSimple size={16} />
          {busy ? "Subiendo..." : url ? "Reemplazar PDF" : "Subir PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onFile(file);
            }}
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={async () => {
              await discardIfUnsaved(url, saved);
              setUrl("");
            }}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm text-danger hover:bg-danger/10"
          >
            <Trash size={16} /> Usar el de por defecto
          </button>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
