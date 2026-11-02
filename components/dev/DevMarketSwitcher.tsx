"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GearSix, X, Check, Eye } from "@phosphor-icons/react";

interface DevMarketSwitcherProps {
  currentMarket: string;
  currentLocale: string;
}

const MARKETS = [
  { id: "dr", label: "🇩🇴 DR", locale: "es", name: "Dominican Republic (RD$)" },
  { id: "us", label: "🇺🇸 US", locale: "en", name: "United States (USD)" },
  { id: "ca", label: "🇨🇦 CA (EN)", locale: "en", name: "Canada - EN (CAD)" },
  { id: "ca", label: "🇨🇦 CA (FR)", locale: "fr", name: "Canada - FR (CAD)" },
  { id: "ht", label: "🇭🇹 HT (FR)", locale: "fr", name: "Haiti - FR (USD)" },
  { id: "ht", label: "🇭🇹 HT (EN)", locale: "en", name: "Haiti - EN (USD)" },
];

export function DevMarketSwitcher({ currentMarket, currentLocale }: DevMarketSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Detect whether dev mode is enabled: localhost or pcl_dev_market cookie exists
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    const hasDevCookie = document.cookie.includes("pcl_dev_market=");
    const hasDevQuery = window.location.search.includes("dev=true") || window.location.search.includes("preview=");
    setIsDev(isLocal || hasDevCookie || hasDevQuery);
  }, []);

  if (!mounted || !isDev) return null;

  function switchMarket(marketId: string, localeChoice: string) {
    // Set 30-day developer cookie
    document.cookie = `pcl_dev_market=${marketId}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    
    // Navigate with query parameters to immediately trigger middleware rewrite
    const params = new URLSearchParams(searchParams.toString());
    params.set("preview", marketId);
    params.set("locale", localeChoice);
    
    const targetUrl = `${pathname === "/choose" ? "/" : pathname}?${params.toString()}`;
    window.location.href = targetUrl;
  }

  function clearOverride() {
    document.cookie = "pcl_dev_market=; path=/; max-age=0";
    window.location.href = "/?clear_dev=true";
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-xs">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/90 px-3.5 py-2 font-medium text-purple-200 shadow-xl backdrop-blur-md transition-all hover:border-purple-400 hover:bg-purple-900 hover:text-white"
          title="Developer Market Switcher"
        >
          <GearSix size={16} className="animate-spin-slow text-purple-300" />
          <span>Dev Market:</span>
          <span className="font-semibold uppercase text-amber-300">{currentMarket}</span>
          <span className="rounded bg-purple-800/80 px-1.5 py-0.5 text-[10px] uppercase font-mono text-purple-200">
            {currentLocale}
          </span>
          <span className="ml-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <Eye size={12} weight="bold" /> Prices ON
          </span>
        </button>
      ) : (
        <div className="w-80 rounded-2xl border border-purple-500/40 bg-purple-950/95 p-4 text-purple-100 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-purple-800/60 pb-2.5">
            <div className="flex items-center gap-2">
              <GearSix size={18} className="text-purple-300" />
              <div>
                <p className="font-semibold text-white">Local Dev Market Switcher</p>
                <p className="text-[10px] text-purple-300">View any market with full pricing enabled</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="rounded-full p-1 text-purple-300 hover:bg-purple-800 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 space-y-1.5">
            {MARKETS.map((m) => {
              const active = currentMarket === m.id && currentLocale.startsWith(m.locale);
              return (
                <button
                  key={`${m.id}-${m.locale}`}
                  type="button"
                  onClick={() => switchMarket(m.id, m.locale)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                    active
                      ? "border border-amber-400/50 bg-purple-800/90 font-semibold text-white shadow-inner"
                      : "border border-transparent bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.label.split(" ")[0]}</span>
                    <div>
                      <p className="text-xs leading-none">{m.name}</p>
                      <span className="text-[10px] text-purple-400 uppercase font-mono">
                        {m.id} • {m.locale}
                      </span>
                    </div>
                  </div>
                  {active && <Check size={16} weight="bold" className="text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-purple-800/60 pt-2.5">
            <button
              type="button"
              onClick={clearOverride}
              className="text-[11px] text-purple-400 hover:text-rose-300 hover:underline"
            >
              Reset to Auto IP
            </button>
            <span className="text-[10px] text-emerald-400 font-mono">Prices Forced: TRUE</span>
          </div>
        </div>
      )}
    </div>
  );
}
