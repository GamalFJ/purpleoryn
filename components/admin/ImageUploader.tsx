"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageSquare, Trash, UploadSimple } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { ImagePrepError, prepareImage } from "@/lib/image";
import { MEDIA_BUCKET, storagePathFromUrl } from "@/lib/storage";

async function uploadPrepared(file: File, folder: string): Promise<string> {
  const { blob, extension, contentType } = await prepareImage(file);
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, { contentType, cacheControl: "31536000", upsert: false });
  if (error) throw new Error("No se pudo subir la imagen. Vuelve a intentarlo.");
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Uploads that haven't been saved yet can be deleted right away when removed.
// Previously saved images are only deleted by the server action after the
// record is saved, so abandoning the form never breaks the live site.
async function discardIfUnsaved(url: string, savedUrls: Set<string>) {
  if (savedUrls.has(url)) return;
  const path = storagePathFromUrl(url);
  if (path) await createClient().storage.from(MEDIA_BUCKET).remove([path]);
}

function errorText(err: unknown) {
  return err instanceof ImagePrepError || err instanceof Error ? err.message : "No se pudo subir la imagen.";
}

export function ImageUploader({
  name,
  label,
  folder,
  defaultUrl,
  fallbackUrl,
  aspect = "aspect-[4/3]",
}: {
  name: string;
  label: string;
  folder: string;
  defaultUrl: string | null;
  fallbackUrl?: string;
  aspect?: string;
}) {
  const saved = useRef(new Set(defaultUrl ? [defaultUrl] : []));
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = url || fallbackUrl;

  async function onFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const next = await uploadPrepared(file, folder);
      if (url) await discardIfUnsaved(url, saved.current);
      setUrl(next);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className={`relative w-full max-w-xs overflow-hidden rounded-[var(--radius-field)] border border-line bg-paper ${aspect}`}>
        {preview ? (
          <Image src={preview} alt="" fill sizes="320px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <ImageSquare size={32} />
          </div>
        )}
        {!url && fallbackUrl && (
          <span className="absolute bottom-2 left-2 rounded-full bg-surface px-2.5 py-1 text-xs text-muted">Imagen por defecto</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium hover:border-accent">
          <UploadSimple size={16} />
          {busy ? "Subiendo..." : url ? "Cambiar imagen" : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
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
              await discardIfUnsaved(url, saved.current);
              setUrl("");
            }}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm text-danger hover:bg-danger/10"
          >
            <Trash size={16} /> Quitar
          </button>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export function GalleryUploader({ name, folder, defaultUrls }: { name: string; folder: string; defaultUrls: string[] }) {
  const saved = useRef(new Set(defaultUrls));
  const [urls, setUrls] = useState(defaultUrls);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    setError(null);
    setBusy(true);
    for (const file of files) {
      try {
        const next = await uploadPrepared(file, folder);
        setUrls((prev) => [...prev, next]);
      } catch (err) {
        setError(`${file.name}: ${errorText(err)}`);
      }
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[15px] font-semibold">Galería</span>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}
      {urls.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((u) => (
            <li key={u} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-field)] border border-line">
              <Image src={u} alt="" fill sizes="200px" className="object-cover" />
              <button
                type="button"
                aria-label="Quitar imagen"
                onClick={async () => {
                  await discardIfUnsaved(u, saved.current);
                  setUrls((prev) => prev.filter((x) => x !== u));
                }}
                className="absolute right-1.5 top-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-danger shadow"
              >
                <Trash size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <label className="inline-flex h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium hover:border-accent">
        <UploadSimple size={16} />
        {busy ? "Subiendo..." : "Agregar imágenes"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void onFiles(files);
          }}
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
