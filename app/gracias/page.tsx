import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buttonClass } from "@/components/ui/button";
import { getTiers } from "@/lib/content";
import { calUrl, whatsappUrl } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";
import { CTA } from "@/lib/site";
import { isTierSlug } from "@/lib/tiers";
import { LeadConversion } from "./LeadConversion";

export const metadata = pageMetadata({
  title: "Solicitud recibida",
  description: "Recibimos tu solicitud.",
  path: "/gracias",
  noIndex: true,
});

type SearchParams = Promise<{ plan?: string; origen?: string }>;

// Two arrivals: after the plan form (?plan=...) and after booking a call, if
// the Cal.com event redirects here (?origen=llamada). GA4 goals key off this URL.
export default async function GraciasPage({ searchParams }: { searchParams: SearchParams }) {
  const { plan: planParam, origen } = await searchParams;
  const tiers = await getTiers();
  const plan = isTierSlug(planParam) ? tiers.find((t) => t.slug === planParam) : undefined;
  const fromCall = origen === "llamada";

  return (
    <>
      <Header />
      <main id="contenido" className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 md:pt-20">
        {!fromCall && <LeadConversion plan={plan?.slug} />}
        <CheckCircle size={44} weight="duotone" className="text-success" aria-hidden="true" />

        {fromCall ? (
          <>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Tu llamada está agendada</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Te llegará la confirmación por correo con el enlace de la reunión. Si necesitas cambiar la hora, usa el enlace de ese correo.
            </p>
            <Link href="/servicios" className={buttonClass("secondary", "lg", "mt-8")}>
              Ver los planes antes de la llamada
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Recibimos tu solicitud</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {plan ? `Guardamos tus datos para el plan ${plan.name}. ` : "Guardamos tus datos. "}
              Te escribiremos por WhatsApp. Si quieres adelantar, elige una de estas opciones.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={calUrl(plan)}
                event="cal_click"
                location="gracias"
                plan={plan?.slug}
                className={buttonClass("primary", "lg")}
              >
                {CTA.call}
              </TrackedLink>
              <TrackedLink
                href={whatsappUrl(
                  plan
                    ? `Hola Purple Cove Labs, acabo de enviar la solicitud del plan ${plan.name}.`
                    : "Hola Purple Cove Labs, acabo de enviar una solicitud en su sitio web.",
                )}
                event="whatsapp_click"
                location="gracias"
                plan={plan?.slug}
                className={buttonClass("secondary", "lg")}
              >
                {CTA.whatsapp}
              </TrackedLink>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
