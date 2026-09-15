import { requireAdmin } from "@/lib/admin";
import { DEFAULT_SETTINGS } from "@/lib/content";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminAjustesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Ajustes del sitio</h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        Si dejas un campo vacío, el sitio muestra el texto o la imagen por defecto (indicados debajo de cada campo).
      </p>
      <SettingsForm settings={data ?? {}} defaults={DEFAULT_SETTINGS} />
    </div>
  );
}
