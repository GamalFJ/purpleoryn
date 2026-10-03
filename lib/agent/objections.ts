// Deterministic objection detection for the sales path, in the same spirit as classifyIntent():
// regexes over one visitor message, no model. Deliberately only a few types to start; every
// extra type is another source of false positives. Used by code to advance the sales stage
// (flow.ts); the stage machine, not the model, decides when to stop pitching.
export type Objection = "price" | "think" | "partner" | "not_now" | "decline";

const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const PATTERNS: readonly (readonly [Objection, RegExp])[] = [
  // A clear no ends the pitch.
  ["decline", /^(no,? gracias|no gracias|no me interesa|no quiero|no voy a (comprar|contratar)|no por ahora,? gracias)\b/],
  // Needs another person, or is comparing another quote.
  [
    "partner",
    /(socio|socia|esposa|esposo|pareja|jefe|jefa|contador|contadora|familia)\b.*\b(hablar|consultar|decidir|ver|preguntar)|\b(hablarlo|consultarlo|decidirlo|verlo) con\b|otr[oa]s? (cotizacion|cotizaciones|propuesta|propuestas|agencia|agencias|empresa|empresas)|me (cobra|cobran|ofrecen|ofrece) (menos|mas barato|[0-9])/,
  ],
  // The price.
  [
    "price",
    /\b(caro|cara|carisimo|carisima|muy costoso|costoso|demasiado|mucho dinero|se me sale|no me alcanza)\b|no tengo (el )?(presupuesto|dinero|plata)|fuera de (mi )?presupuesto|(es|esta) (un )?(poco )?(alto|elevado)/,
  ],
  // Wants time.
  [
    "think",
    /(dejeme|dejame|voy a|lo voy a|tengo que|necesito|quiero) (pensar|pensarlo|analizar|analizarlo|revisar|revisarlo)|\blo pienso\b|lo voy a pensar|despues (le|te) (aviso|escribo|contacto)|\bte aviso\b|\ble aviso\b/,
  ],
  // Not now.
  ["not_now", /(mas adelante|otro (mes|dia)|ahora no|por ahora no|en unos? (meses|dias|semanas)|el (proximo )?mes que viene|estoy (en otra cosa|ocupad[oa]))/],
];

export function classifyObjection(message: string): Objection | null {
  const text = fold(message);
  for (const [type, pattern] of PATTERNS) {
    if (pattern.test(text)) return type;
  }
  return null;
}
