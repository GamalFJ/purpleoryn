// Last line of defense on what the assistant says (rules G7, G8, G13, G15 of the agent contract).
// The prompt forbids these; the model sometimes ignores it. A sentence that matches is removed
// from the reply, not rewritten. The patterns are narrow on purpose: a sentence that merely
// mentions a discount or a button ("no ofrecemos descuentos") must survive.
const fold = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const RULES: readonly (readonly [string, RegExp])[] = [
  // G7: asking permission to show a button.
  ["button_permission", /(quieres|quiere|desea|deseas|te gustaria|le gustaria) que (te|le|se) (muestre|ensene|mande|envie|ponga|abra|comparta)\b/],
  ["button_permission", /\bte (muestro|ensenare|mostrare) (el|ese|un) boton\b.*\?/],
  // G8: claiming an action that did not happen or cannot be verified.
  ["false_action", /\b(ya )?(agende|reserve|programe|registre|anote|guarde) (tu|su|tus|sus|la|el|una|un)\b.*\b(cita|llamada|reunion|datos|informacion|solicitud)\b/],
  ["false_action", /\b(ya )?(registre|guarde|anote) (tus|sus) datos\b/],
  // Saving what the visitor said is silent (G8): never mention it.
  ["false_action", /\b(he|ya|hemos) (registrado|anotado|guardado)\b|\bya lo (anote|registre|guarde)\b/],
  // Implies an instant human answer that nothing can promise.
  ["false_action", /\b(contactar|hablar con|escribirle|escribir|comunicarse con) (a )?alguien de inmediato\b/],
  ["false_action", /\b(le|te|lo) (contactaran|llamaran|escribiran|responderan|atenderan) (en|dentro|pronto|hoy|manana|de inmediato|enseguida)/],
  ["false_action", /\b(ya )?(notificamos|avisamos|le (notifique|avise)|te (notifique|avise)) (a|al|de)\b/],
  ["false_action", /\bse (agendo|reservo|programo|confirmo) (su|tu|la) (cita|llamada|reunion)\b/],
  // G13 / G15: pressure and promises the facts do not support.
  ["promise", /\b(garantizamos|le garantizo|te garantizo|garantia de resultados)\b/],
  ["promise", /\bprimer lugar en google\b|\bposicion (1|uno|numero uno) en google\b/],
  ["pressure", /\bsolo por hoy\b|\bquedan pocos (cupos|espacios|lugares)\b|\boferta (especial|limitada)\b|\b(te|le) (damos|ofrecemos|hago|hacemos|puedo hacer) (un |una )?(descuento|rebaja|precio especial)\b/],
];

// Splits at whitespace that follows ". ! ?" or at line breaks, so "RD$15,499.99" stays in one piece.
// Each sentence keeps the separator that followed it.
function sentences(text: string): string[] {
  const parts = text.split(/((?<=[.!?])\s+|\n+)/);
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) out.push(parts[i] + (parts[i + 1] ?? ""));
  return out.filter((s) => s.length > 0);
}

export interface LintResult {
  text: string;
  removed: string[]; // rule ids that fired
}

// A sentence that points at a button when this turn shows none (G7).
const PHANTOM_BUTTON_RE = /\bbot(on|ones)\b.*\b(abajo|a continuacion|debajo)\b|\b(abajo|a continuacion|debajo)\b.*\bbot(on|ones)\b|\bbot(on|ones) (esta|estan|aparece|aparecen)\b/;

export function lintReply(reply: string, options: { hasButtons?: boolean } = {}): LintResult {
  const removed: string[] = [];
  const kept = sentences(reply).filter((sentence) => {
    if (options.hasButtons === false && PHANTOM_BUTTON_RE.test(fold(sentence))) {
      removed.push("phantom_button");
      return false;
    }
    const hit = RULES.find(([, pattern]) => pattern.test(fold(sentence)));
    if (hit) removed.push(hit[0]);
    return !hit;
  });
  return { text: kept.join("").trim(), removed };
}
