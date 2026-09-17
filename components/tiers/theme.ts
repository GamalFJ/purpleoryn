import { ChartLineUp, ChatsCircle, Crown, Globe, Headset, MagnifyingGlass, MapPin, Robot, Storefront, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { TierSlug } from "@/lib/tiers";
import type { Tone } from "@/lib/tone";

// Visual identity per plan (UI only, not content).
export const TIER_THEME: Record<TierSlug, { tone: Tone; icon: typeof Crown }> = {
  presencia: { tone: "teal", icon: Storefront },
  conversion: { tone: "violet", icon: TrendUp },
  autoridad: { tone: "rose", icon: Crown },
};

// Icon per comparison row, keyed by TIER_ROWS label.
export const ROW_THEME: Record<string, { tone: Tone; icon: typeof Crown }> = {
  "Sitio web": { tone: "violet", icon: Globe },
  SEO: { tone: "teal", icon: MagnifyingGlass },
  "Google Business Profile": { tone: "rose", icon: MapPin },
  Analítica: { tone: "amber", icon: ChartLineUp },
  "Agente de IA": { tone: "violet", icon: Robot },
  "Conversaciones del agente": { tone: "teal", icon: ChatsCircle },
  Soporte: { tone: "rose", icon: Headset },
};
