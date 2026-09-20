"use client";

import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import type { SiteSettings } from "@/lib/content";
import { updateSettings } from "../actions";

type Row = Partial<
  Record<
    | "hero_headline"
    | "hero_subheadline"
    | "hero_image_url"
    | "about_image_url"
    | "about_bio"
    | "oryn_presence_doc_url"
    | "como_trabajamos_doc_url",
    string
  >
>;

export function SettingsForm({ settings, defaults }: { settings: Row; defaults: SiteSettings }) {
  const { state, pending, onSubmit } = useAdminForm(updateSettings);

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-10">
      <section className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Homepage</h2>
        <div className="mt-6 grid gap-5">
          <TextField
            name="hero_headline"
            label="Main headline (H1)"
            defaultValue={settings.hero_headline}
            help={`Default: ${defaults.heroHeadline}`}
          />
          <TextField
            name="hero_subheadline"
            label="Subheadline"
            defaultValue={settings.hero_subheadline}
            multiline
            rows={2}
            help={`Default: ${defaults.heroSubheadline}`}
          />
          <ImageUploader
            name="hero_image_url"
            label="Hero image"
            folder="ajustes"
            defaultUrl={settings.hero_image_url || null}
            fallbackUrl={defaults.heroImageUrl}
            ratio="portrait"
          />
        </div>
      </section>

      <section className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Who&rsquo;s behind it</h2>
        <div className="mt-6 grid gap-5">
          <TextField
            name="about_bio"
            label="Bio"
            defaultValue={settings.about_bio}
            multiline
            rows={5}
            help={`Default: ${defaults.aboutBio}`}
          />
          <ImageUploader
            name="about_image_url"
            label="Photo"
            folder="ajustes"
            defaultUrl={settings.about_image_url || null}
            fallbackUrl={defaults.aboutImageUrl}
            ratio="portrait"
          />
        </div>
      </section>

      <section className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Documentos</h2>
        <p className="mt-2 max-w-[60ch] text-sm text-muted">
          Reemplaza los PDF descargables del sitio. Si no subes uno, se sigue sirviendo el archivo por defecto en
          /docs.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DocumentUploader
            name="oryn_presence_doc_url"
            label="Oryn Presence"
            folder="documentos"
            defaultUrl={settings.oryn_presence_doc_url || null}
          />
          <DocumentUploader
            name="como_trabajamos_doc_url"
            label="Cómo trabajamos"
            folder="documentos"
            defaultUrl={settings.como_trabajamos_doc_url || null}
          />
        </div>
      </section>

      <SaveBar state={state} pending={pending} />
    </form>
  );
}
