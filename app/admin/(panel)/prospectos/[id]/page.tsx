import Link from "next/link";
import { notFound } from "next/navigation";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buttonClass } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin";
import type { AddonSnapshot } from "@/lib/addons";
import { getTiers } from "@/lib/content";
import { formatCount, formatRD } from "@/lib/format";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, type LeadStatus } from "@/lib/leads";
import { socialProfileUrl } from "@/lib/links";
import { orderTotals } from "@/lib/orders";
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
  const totals = orderTotals(plan, addons);
  const roi = (lead.roi_snapshot ?? null) as RoiSnapshot | null;
  // The ROI snapshot was computed with the prices at submission time.
  const snapshotPrices =
    plan && roi?.oneTime !== undefined && roi.monthly !== undefined && (roi.oneTime !== plan.oneTime || roi.monthly !== plan.monthly)
      ? { oneTime: roi.oneTime, monthly: roi.monthly }
      : null;
  const firstName = String(lead.name).split(" ")[0];
  // Sent to a Dominican client over WhatsApp: stays in Spanish regardless of
  // the admin panel's own display language.
  const waText = `Hola ${firstName}, te escribe Gamal de Purple Cove Labs. Recibimos tu solicitud${plan ? ` del plan ${plan.name}` : ""} para ${lead.business}.`;
  const waHref = `https://wa.me/${String(lead.whatsapp).replace("+", "")}?text=${encodeURIComponent(waText)}`;

  return (
    <div>
      <Link href="/admin/prospectos" className="text-sm text-muted hover:text-ink">
        Back to leads
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{lead.name}</h1>
        <StatusBadge status={lead.status as LeadStatus} />
      </div>
      <p className="mt-1 text-muted">
        {lead.business} · received {formatDate(lead.created_at)}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={waHref} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md")}>
          <WhatsappLogo size={18} weight="bold" />
          Message on WhatsApp
        </a>
        {lead.email && (
          <a href={`mailto:${lead.email}`} className={buttonClass("secondary", "md")}>
            Send email
          </a>
        )}
        <form action={updateLeadStatus.bind(null, lead.id)} className="flex items-center gap-2">
          <label htmlFor="status" className="sr-only">
            Status
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
            Change status
          </button>
        </form>
      </div>

      {/* Always visible, not tucked inside the plan row: what this order is
          worth now, and what it's worth every month after. Two colors so
          they're never misread as the same number. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[var(--radius-panel)] border border-accent/25 bg-accent-soft px-5 py-4">
          <p className="text-sm font-medium text-accent">Order total (due upfront)</p>
          <p className="tabular mt-1 text-2xl font-semibold text-accent">{formatRD(totals.oneTime)}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-warm-line bg-warm-soft px-5 py-4">
          <p className="text-sm font-medium text-warm-ink">Monthly retainer total</p>
          <p className="tabular mt-1 text-2xl font-semibold text-warm-ink">{formatRD(totals.monthly)}</p>
        </div>
      </div>

      <section className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
        <dl className="divide-y divide-line">
          <Row label="Plan">{plan ? `${plan.name} (${formatRD(plan.oneTime)} + ${formatRD(plan.monthly)}/mo)` : "No plan"}</Row>
          <Row label="Add-ons">
            {addons.length ? (
              <ul className="space-y-1">
                {addons.map((a) => (
                  <li key={a.slug}>
                    {a.name} ({formatRD(a.oneTime)} + {formatRD(a.monthly)}/mo){" "}
                    <span className="text-sm text-muted">100% upfront</span>
                  </li>
                ))}
              </ul>
            ) : (
              "None"
            )}
          </Row>
          <Row label="WhatsApp">
            <span className="tabular">{lead.whatsapp}</span>
          </Row>
          <Row label="Email">{lead.email || "Not given"}</Row>
          <Row label="Business">{lead.business}</Row>
          <Row label="Niche">{lead.business_niche || "Not given"}</Row>
          <Row label="Social">
            {lead.social_handle ? (
              <a
                href={socialProfileUrl(String(lead.social_handle))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {lead.social_handle}
              </a>
            ) : (
              "Not given"
            )}
          </Row>
          <Row label="Message">{lead.message ? <span className="whitespace-pre-wrap">{lead.message}</span> : "No message"}</Row>
        </dl>
      </section>

      {lead.average_sale_value && (
        <section className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
          <h2 className="pt-3 text-lg font-semibold">ROI calculation they ran</h2>
          {snapshotPrices && (
            <p className="pt-1 text-sm text-muted">
              Calculated with prices at that time: {formatRD(snapshotPrices.oneTime)} + {formatRD(snapshotPrices.monthly)}/mo.
            </p>
          )}
          <dl className="divide-y divide-line">
            <Row label="Average sale value">{formatRD(Number(lead.average_sale_value))}</Row>
            {roi?.yearOneInvestment !== undefined && <Row label="Year 1 investment">{formatRD(roi.yearOneInvestment)}</Row>}
            {roi?.breakEvenSales !== undefined && <Row label="Sales to break even">{formatCount(Math.ceil(roi.breakEvenSales))}</Row>}
            {roi?.targetSalesPerYear !== undefined && (
              <Row label="3x target">
                {formatCount(Math.ceil(roi.targetSalesPerYear))}/year, {formatCount(Math.ceil(roi.targetSalesPerMonth ?? 0))}/month
              </Row>
            )}
          </dl>
        </section>
      )}

      <section className="mt-6 rounded-[var(--radius-panel)] border border-line bg-surface px-6 py-3 sm:px-8">
        <h2 className="pt-3 text-lg font-semibold">Where it came from</h2>
        <dl className="divide-y divide-line">
          <Row label="Source (utm_source)">{lead.utm_source || "Direct or untagged"}</Row>
          <Row label="Medium / campaign">{[lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "Not given"}</Row>
          <Row label="Landing page">{lead.landing_page || "Not given"}</Row>
          <Row label="Referrer">{lead.referrer || "Not given"}</Row>
        </dl>
      </section>

      <div className="mt-12 border-t border-line pt-6">
        <DeleteLeadButton id={lead.id} name={lead.name} />
      </div>
    </div>
  );
}
