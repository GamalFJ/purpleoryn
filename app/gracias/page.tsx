import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buttonClass } from "@/components/ui/button";
import { getAddons, getTiers } from "@/lib/content";
import { calUrl, whatsappUrl } from "@/lib/links";
import { getCurrentMarket } from "@/lib/market";
import { pageMetadata } from "@/lib/seo";
import { CTA } from "@/lib/site";
import { isTierSlug } from "@/lib/tiers";
import { LeadConversion } from "./LeadConversion";

type SearchParams = Promise<{ plan?: string; origen?: string; modulos?: string }>;

// Only the plan-form arrival is an order, so only it gets the order title.
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const { origen } = await searchParams;
  const fromCall = origen === "llamada";
  return pageMetadata({
    title: fromCall ? "Llamada agendada" : "Asesoría solicitada",
    description: fromCall ? "Su llamada quedó agendada." : "Su solicitud de asesoría fue recibida.",
    path: "/gracias",
    noIndex: true,
  });
}

// Two arrivals: after the plan form (?plan=...) and after booking a call,
// if the Cal.com event redirects here (?origen=llamada).
export default async function GraciasPage({ searchParams }: { searchParams: SearchParams }) {
  const { plan: planParam, origen, modulos } = await searchParams;
  const [tiers, addons, currentMarket] = await Promise.all([getTiers(), getAddons(), getCurrentMarket()]);
  const marketId = currentMarket.market?.id ?? "do";
  // Display only: the order itself was saved with its own add-on snapshot.
  const orderedAddons = (modulos ?? "")
    .split(",")
    .map((slug) => addons.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);
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
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Su llamada está agendada</h1>
            <p className="mt-4 text-lg leading-relaxed text-body">
              Le llegará la confirmación por correo con el enlace de la reunión. Si necesita cambiar la hora, use el enlace de ese correo.
            </p>
            <Link href="/servicios" className={buttonClass("secondary", "lg", "mt-8")}>
              Ver los planes antes de la llamada
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Solicitud de asesoría recibida</h1>
            <p className="mt-4 text-lg leading-relaxed text-body">
              {plan ? `Registramos su interés en el plan ${plan.name}` : "Registramos su solicitud"}
              {orderedAddons.length > 0 && ` con ${orderedAddons.map((a) => `el módulo ${a.name}`).join(" y ")}`}
              {". "}
              El siguiente paso es elegir el día y la hora de su llamada para evaluar si su negocio califica para Oryn Presence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={calUrl(plan)}
                event="cal_click"
                location="gracias"
                plan={plan?.slug}
                className={buttonClass("primary", "lg")}
              >
                Elegir fecha y hora de la asesoría
              </TrackedLink>
              <TrackedLink
                href={whatsappUrl(
                  plan
                    ? `Hola Purple Cove Labs, acabo de solicitar una asesoría para el plan ${plan.name}.`
                    : "Hola Purple Cove Labs, acabo de solicitar una asesoría en su sitio web.",
                )}
                event="whatsapp_click"
                market={marketId}
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
