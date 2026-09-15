import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { Accordion } from "@/components/ui/Accordion";
import { FAQ_ITEMS } from "@/lib/faq";

export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div>
          <h2 id="preguntas-titulo" className="text-3xl font-semibold sm:text-4xl md:sticky md:top-24">
            Preguntas frecuentes
          </h2>
        </div>
        <Accordion items={FAQ_ITEMS.map(({ id, q, a }) => ({ id, title: q, content: <p>{a}</p> }))} />
      </div>
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
    </section>
  );
}
