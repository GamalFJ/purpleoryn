"use client";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import type { SiteSettings } from "@/lib/content";
import { updateSettings } from "../actions";

type Row = Partial<Record<"hero_headline" | "hero_subheadline" | "hero_image_url" | "about_image_url" | "about_bio", string>>;

export function SettingsForm({ settings, defaults }: { settings: Row; defaults: SiteSettings }) {
  const { state, pending, onSubmit } = useAdminForm(updateSettings);

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-10">
      <section className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Portada</h2>
        <div className="mt-6 grid gap-5">
          <TextField
            name="hero_headline"
            label="Título principal (H1)"
            defaultValue={settings.hero_headline}
            help={`Por defecto: ${defaults.heroHeadline}`}
          />
          <TextField
            name="hero_subheadline"
            label="Subtítulo"
            defaultValue={settings.hero_subheadline}
            multiline
            rows={2}
            help={`Por defecto: ${defaults.heroSubheadline}`}
          />
          <ImageUploader
            name="hero_image_url"
            label="Imagen de la portada"
            folder="ajustes"
            defaultUrl={settings.hero_image_url || null}
            fallbackUrl={defaults.heroImageUrl}
            aspect="aspect-[4/5]"
          />
        </div>
      </section>

      <section className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Quién está detrás</h2>
        <div className="mt-6 grid gap-5">
          <TextField
            name="about_bio"
            label="Biografía"
            defaultValue={settings.about_bio}
            multiline
            rows={5}
            help={`Por defecto: ${defaults.aboutBio}`}
          />
          <ImageUploader
            name="about_image_url"
            label="Foto"
            folder="ajustes"
            defaultUrl={settings.about_image_url || null}
            fallbackUrl={defaults.aboutImageUrl}
            aspect="aspect-[4/5]"
          />
        </div>
      </section>

      <SaveBar state={state} pending={pending} />
    </form>
  );
}
