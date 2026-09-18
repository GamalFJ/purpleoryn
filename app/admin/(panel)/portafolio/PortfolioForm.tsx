"use client";

import Link from "next/link";
import { GalleryUploader, ImageUploader } from "@/components/admin/ImageUploader";
import { SaveBar, TextField, useAdminForm } from "@/components/admin/fields";
import { deletePortfolioItem, savePortfolioItem } from "../actions";

export interface PortfolioRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  results: string;
  results_source: string;
  link: string | null;
  cover_image_url: string | null;
  image_urls: string[];
  published: boolean;
  sort_order: number;
}

export function PortfolioForm({ item, justCreated }: { item: PortfolioRow | null; justCreated?: boolean }) {
  const { state, pending, onSubmit } = useAdminForm(savePortfolioItem.bind(null, item?.id ?? null));
  const folder = `portafolio/${item?.id ?? "nuevo"}`;

  return (
    <>
      {justCreated && state.status === "idle" && (
        <p className="mt-6 rounded-[var(--radius-field)] bg-success/10 px-4 py-3 text-[15px] text-success">Case study created.</p>
      )}
      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <section className="grid gap-5 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8">
          <TextField name="title" label="Title" defaultValue={item?.title} required />
          <TextField name="slug" label="Slug" defaultValue={item?.slug} help="Generated from the title if left blank." />
          <TextField name="summary" label="Short summary" defaultValue={item?.summary} className="sm:col-span-2" />
          <TextField name="description" label="Description" defaultValue={item?.description} multiline rows={6} className="sm:col-span-2" />
          <TextField name="link" label="Project link" defaultValue={item?.link} help="https://..." className="sm:col-span-2" />
        </section>

        <section className="grid gap-5 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="mt-1 text-[15px] text-muted">Real results only. If you write a result, say where it comes from so it can be published.</p>
          </div>
          <TextField name="results" label="Result" defaultValue={item?.results} multiline rows={2} />
          <TextField
            name="results_source"
            label="Result source"
            defaultValue={item?.results_source}
            help="E.g.: client's Google Analytics, March to May 2027."
          />
        </section>

        <section className="grid gap-8 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <ImageUploader name="cover_image_url" label="Cover image" folder={folder} defaultUrl={item?.cover_image_url ?? null} ratio="landscape" />
          <GalleryUploader name="image_urls" folder={folder} defaultUrls={item?.image_urls ?? []} />
        </section>

        <section className="flex flex-wrap items-center gap-6 rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
          <label className="flex cursor-pointer items-center gap-3 text-[15px] font-medium">
            <input type="checkbox" name="published" defaultChecked={item?.published ?? false} className="h-5 w-5 accent-[var(--accent)]" />
            Published on the site
          </label>
          <TextField name="sort_order" label="Order" defaultValue={item?.sort_order ?? 0} inputMode="numeric" className="w-28" />
        </section>

        <SaveBar
          state={state}
          pending={pending}
          label={item ? "Save case study" : "Create case study"}
          extra={
            <Link href="/admin/portafolio" className="text-sm text-muted hover:text-ink">
              Back
            </Link>
          }
        />
      </form>

      {item && (
        <form
          action={deletePortfolioItem.bind(null, item.id)}
          onSubmit={(e) => {
            if (!confirm(`Delete "${item.title}" and its images? This can't be undone.`)) e.preventDefault();
          }}
          className="mt-12 border-t border-line pt-6"
        >
          <button type="submit" className="cursor-pointer text-sm font-medium text-danger hover:underline">
            Delete this case study
          </button>
        </form>
      )}
    </>
  );
}
