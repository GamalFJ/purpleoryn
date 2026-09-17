import { SITE } from "@/lib/site";
import { formatRD } from "@/lib/format";
import type { Addon } from "@/lib/addons";
import type { Tier } from "@/lib/tiers";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escape "<" so a value can't close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Matches the Google Business Profile: Service-Area Business, so areaServed
// instead of a street address. GBP primary category is "Website Designer".
export function businessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneE164,
    email: SITE.email,
    logo: `${SITE.url}/media/logo-512.png`,
    image: `${SITE.url}/media/logo-512.png`,
    description: "Diseño de sitios web, SEO local, Google Business Profile y agentes de IA para negocios en Santo Domingo.",
    knowsAbout: ["Diseño de sitios web", "SEO local", "Google Business Profile", "Agentes de IA"],
    areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
    founder: { "@type": "Person", name: SITE.founder },
    currenciesAccepted: "DOP",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "es-DO",
    publisher: { "@id": `${SITE.url}/#business` },
  };
}

function offer(name: string, description: string, oneTime: number, monthly: number) {
  return {
    "@type": "Offer",
    name,
    description,
    price: oneTime.toFixed(2),
    priceCurrency: "DOP",
    seller: { "@id": `${SITE.url}/#business` },
    priceSpecification: [
      { "@type": "UnitPriceSpecification", price: oneTime.toFixed(2), priceCurrency: "DOP", name: "Pago único" },
      {
        "@type": "UnitPriceSpecification",
        price: monthly.toFixed(2),
        priceCurrency: "DOP",
        name: "Mensualidad",
        billingDuration: "P1M",
        unitCode: "MON",
      },
    ],
  };
}

export function offerCatalogSchema(tiers: Tier[], addons: Addon[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Planes y complementos de Purple Cove Labs",
    url: `${SITE.url}/servicios`,
    itemListElement: [
      ...tiers.map((t) => offer(`Plan ${t.name}`, `${t.tagline} Pago único de ${formatRD(t.oneTime)} más ${formatRD(t.monthly)} al mes.`, t.oneTime, t.monthly)),
      ...addons.map((a) =>
        offer(a.name, `${a.description} Pago único de ${formatRD(a.oneTime)} más ${formatRD(a.monthly)} al mes.`.trim(), a.oneTime, a.monthly),
      ),
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
