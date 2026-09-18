import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buttonClass } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import type { AddonSnapshot } from "@/lib/addons";
import { getTiers } from "@/lib/content";
import { formatCount, formatRD } from "@/lib/format";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";
import { updateLeadStatus } from "../../actions";
import { StatusBadge, formatDate } from "../shared";
import { DeleteLeadButton } from "./DeleteLeadButton";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

interface RoiSnapshot {
  oneTime?: number;
  monthly?: number;
  yearOneInvestment?: number;
  breakEvenSales?: number;
  targetSalesPerYear?: number;
  targetSalesPerMonth?: number;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-[15px]">{children}</dd>
    </div>
  );
}

export default async function ProspectoPage({ params }: { params: Params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  // Live plan data (DEFAULT_TIERS only if the tiers table is unreachable).
  const [{ data: lead }, tiers] = await Promise.all([supabase.from("leads").select("*").eq("id", id).maybeSingle(), getTiers()]);
  if (!lead) notFound();

  const plan = tiers.find((t) => t.slug === lead.plan);
  // Older leads predate the column; treat anything that is not an array as none.
  const addons: AddonSnapshot[] = Array.isArray(lead.addons) ? (lead.addons as AddonSnapshot[]) : [];
  const roi = (lead.roi_snapshot ?? null) as RoiSnapshot | null;
  // The ROI snapshot was computed with the prices at submission time.
  const snapshotPrices =
    plan && roi?.oneTime !== undefined && roi.monthly !== undefined && (roi.oneTime !== plan.oneTime || roi.monthly !== plan.monthly)
      ? { oneTime: roi.oneTime, monthly: roi.monthly }
      : null;
  const firstName = String(lead.name).split(" ")[0];
  const waText = `Hola ${firstName}, te escribe Gamal de Purple Cove Labs. Recibimos tu solicitud${plan ? ` del plan ${plan.name}` : ""} para ${lead.business}.`;
  const waHref = `https://wa.me/${String(lead.whatsapp).replace("+", "")}?text=${encodeURIComponent(waText)}`;

  return (
    <div>
      <Link href="/admin/prospectos" className="text-sm text-muted hover:text-ink">
        Volver a prospectos
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{lead.name}</h1>
        <StatusBadge status={lead.status as LeadStatus} />
      </div>
      <p className="mt-1 text-muted">
        {lead.business} · recibido el {formatDate(lead.created_at)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={waHref} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md")}>
          <WhatsappLogo size={18} weight="bold" />
          Escribir por WhatsApp
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`} className={buttonClass("secondary", "md")}>
            Enviar correo
          </a>
        )}
        <form action={updateLeadStatus.bind(null, lead.id)} className="flex items-center gap-2">
          <label htmlFor="status" className="sr-only">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={lead.status}
            className="h-12 rounded-full border border-line bg-surface px-4 text-[15px] outline-none focus:border-accent"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button type="submit" className={buttonClass("secondary", "md")}>
            Cambiar estado
          </button>
        </form>
      </div>

      <section className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
        <dl className="divide-y divide-line">
          <Row label="Plan">{plan ? `${plan.name} (${formatRD(plan.oneTime)} + ${formatRD(plan.monthly)}/mes)` : "Sin plan"}</Row>
          <Row label="Módulos">
            {addons.length ? (
              <ul className="space-y-1">
                {addons.map((a) => (
                  <li key={a.slug}>
                    {a.name} ({formatRD(a.oneTime)} + {formatRD(a.monthly)}/mes){" "}
                    <span className="text-sm text-muted">100% por adelantado</span>
                  </li>
                ))}
              </ul>
            ) : (
              "Ninguno"
            )}
          </Row>
          <Row label="WhatsApp">
            <span className="tabular">{lead.whatsapp}</span>
          </Row>
          <Row label="Correo">{lead.email || "No indicado"}</Row>
          <Row label="Negocio">{lead.business}</Row>
          <Row label="Mensaje">{lead.message ? <span className="whitespace-pre-wrap">{lead.message}</span> : "Sin mensaje"}</Row>
        </dl>
      </section>

      {lead.average_sale_value && (
        <section className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
          <h2 className="pt-3 text-lg font-semibold">Cálculo de retorno que hizo</h2>
          {snapshotPrices && (
            <p className="pt-1 text-sm text-muted">
              Calculado con los precios de ese momento: {formatRD(snapshotPrices.oneTime)} + {formatRD(snapshotPrices.monthly)}/mes.
            </p>
          )}
          <dl className="divide-y divide-line">
            <Row label="Venta promedio">{formatRD(Number(lead.average_sale_value))}</Row>
            {roi?.yearOneInvestment !== undefined && <Row label="Inversión primer año">{formatRD(roi.yearOneInvestment)}</Row>}
            {roi?.breakEvenSales !== undefined && <Row label="Ventas para recuperarla">{formatCount(Math.ceil(roi.breakEvenSales))}</Row>}
            {roi?.targetSalesPerYear !== undefined && (
              <Row label="Meta 3x">
                {formatCount(Math.ceil(roi.targetSalesPerYear))} al año, {formatCount(Math.ceil(roi.targetSalesPerMonth ?? 0))} al mes
              </Row>
            )}
          </dl>
        </section>
      )}

      <section className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
        <h2 className="pt-3 text-lg font-semibold">De dónde llegó</h2>
        <dl className="divide-y divide-line">
          <Row label="Fuente (utm_source)">{lead.utm_source || "Directo o sin etiquetar"}</Row>
          <Row label="Medio / campaña">{[lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "No indicado"}</Row>
          <Row label="Página de entrada">{lead.landing_page || "No indicada"}</Row>
          <Row label="Referencia">{lead.referrer || "No indicada"}</Row>
        </dl>
      </section>

      <div className="mt-12 border-t border-line pt-6">
        <DeleteLeadButton id={lead.id} name={lead.name} />
      </div>
    </div>
  );
}
