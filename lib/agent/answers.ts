import { numbersIn, type Qualification, type QualificationKey } from "@/lib/agent/qualification";

// Code-side reading of the visitor's answer to the question the agent asked last. The model is asked
// to save every fact with record_qualification, but it sometimes forgets, and the next turn then
// plans with a missing fact (a skipped customer_interaction reads as "unsure" and sends the visitor
// to the wrong plan). This is a safety net, not a replacement: whatever the model saves wins.

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// A unit price, a volume or a recurring total instead of what ONE customer spends in ONE purchase.
const UNIT_OR_VOLUME_RE =
  /\b(unidad|unidades|por unidad|c\/u|cada (uno|una)|la caja|cajas? de|al dia|diari[oa]s?|al mes|mensual(es)?|por semana|semanal(es)?|al ano|anual(es)?|por docena|la docena|el kilo|la libra|por libra|por kilo)\b/;

export function looksLikeUnitOrVolume(text: string): boolean {
  return UNIT_OR_VOLUME_RE.test(fold(text));
}

// True when the number is one the visitor wrote and the sentence it came from is not a unit price or a volume.
export function isSingleSaleValue(visitorText: string, value: number): boolean {
  const said = numbersIn(visitorText).some((n) => Math.abs(n - value) < 0.01);
  if (!said) return false;
  // The sentence(s) that contain the number.
  const sentences = visitorText.split(/[.!?\n]+/).filter((s) => numbersIn(s).some((n) => Math.abs(n - value) < 0.01));
  return !sentences.some(looksLikeUnitOrVolume);
}

const INTERACTION_RULES: readonly (readonly [NonNullable<Qualification["customer_interaction"]>, RegExp])[] = [
  ["unsure", /\b(no se|no estoy segur[oa]|no tengo idea|lo que (usted )?recomiende|no he pensado|cualquiera)\b/],
  ["qualify_followup", /(califi|seguimiento|yo (cierro|me encargo)|me (lo|los|la|las) pas[ae]|que me (lo|los|la|las) pase)/],
  ["presence_only", /(me encuentren|presencia|informacion basica|preguntas basicas|solo (quiero )?(aparecer|estar en google|tener (una )?pagina)|estoy (empezando|lanzando)|apenas (empiezo|arranco))/],
  ["agent_completes", /(por si (solo|sola|mismo|misma)|\bsolo\b.*\b(agende|tome|resuelva|atienda|se encargue)|que (el agente )?(lo|la|los|las)?\s*(agende|tome|resuelva|atienda|se encargue)|automatic|sin que yo|el agente (agende|tome|resuelva|atienda))/],
];

// The answer to `key`, or nothing when the message does not say. Only for the keys the agent asks about.
const FILLER_RE = /^(hola|buenas|buenos|ok|okay|si|no|gracias|claro|dale|perfecto|bueno)\b/;

export function inferAnswer(key: QualificationKey, message: string): Qualification {
  const raw = message.trim();
  if (!raw || raw.includes("?")) return {};
  const text = fold(raw);
  // Free-text answers are only taken from a message that says something.
  if ((key === "business_type" || key === "pain" || key === "goal") && FILLER_RE.test(text)) return {};

  switch (key) {
    case "business_type": {
      const value = raw.replace(/^(tengo|soy|es|manejo|trabajo con|tenemos|me dedico a)\s+(una|un|unas|unos)?\s*/i, "").replace(/[.!]+$/, "").trim();
      return value && value.length <= 80 ? { business_type: value } : {};
    }
    case "pain":
      return raw.length <= 120 ? { pain: raw.replace(/[.!]+$/, "") } : {};
    case "goal":
      return raw.length <= 120 ? { goal: raw.replace(/[.!]+$/, "") } : {};
    case "business_model": {
      if (/\b(ambas|ambos|los dos|las dos)\b|servicios? y productos?|productos? y servicios?/.test(text)) return { business_model: "both" };
      if (/servicio/.test(text)) return { business_model: "services" };
      if (/producto|mercanc|articulo/.test(text)) return { business_model: "products" };
      return {};
    }
    case "customer_interaction": {
      const hit = INTERACTION_RULES.find(([, re]) => re.test(text));
      return hit ? { customer_interaction: hit[0] } : {};
    }
    case "average_sale": {
      if (looksLikeUnitOrVolume(text)) return {};
      const numbers = [...new Set(numbersIn(raw).filter((n) => n >= 50))];
      return numbers.length === 1 ? { average_sale: numbers[0] } : {};
    }
    default:
      return {};
  }
}
