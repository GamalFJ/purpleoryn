'use client';

import { useId } from 'react';
import { Target, Calculator } from '@phosphor-icons/react';
import type { MarketPrices } from '@/markets/types';
import { cn } from '@/lib/cn';

interface MarketRoiCalculatorProps {
  prices: MarketPrices;
  locale: string;
  selectedPlan: 'presence' | 'conversion' | 'authority';
  onSelectPlan: (plan: 'presence' | 'conversion' | 'authority') => void;
  averageSaleValue: number | null;
  onAverageSaleChange: (val: number | null) => void;
}

export function MarketRoiCalculator({
  prices,
  locale,
  selectedPlan,
  onSelectPlan,
  averageSaleValue,
  onAverageSaleChange,
}: MarketRoiCalculatorProps) {
  const isFrench = locale.startsWith('fr');
  const inputId = useId();

  const tier = prices[selectedPlan];
  const year1Total =
    tier.year1Total ?? (tier.setup ?? 0) + (tier.monthly ?? 0) * 12;

  const breakEvenSales =
    averageSaleValue && averageSaleValue > 0
      ? Math.ceil(year1Total / averageSaleValue)
      : null;

  const targetSalesYear =
    averageSaleValue && averageSaleValue > 0
      ? Math.ceil((year1Total * 3) / averageSaleValue)
      : null;

  const targetSalesMonth =
    targetSalesYear !== null
      ? (targetSalesYear / 12).toFixed(1)
      : null;

  const labels = {
    badge: isFrench ? 'Calculateur de Rendement (ROI)' : 'Commercial ROI Calculator',
    title: isFrench
      ? 'Combien de ventes pour rentabiliser l’investissement?'
      : 'How many sales to pay for the complete system?',
    subtitle: isFrench
      ? 'Indiquez la valeur moyenne de vente d’un client. Le système calcule immédiatement le nombre de ventes requises sur l’année entière.'
      : 'Enter your average customer transaction value. The calculator shows the exact number of clients needed to fully pay for your year-one investment.',
    inputLabel: isFrench ? 'Valeur moyenne d’un client ou contrat:' : 'Your average client or transaction value:',
    inputPlaceholder: isFrench ? 'Ex: 500' : 'e.g. 750',
    choosePlan: isFrench ? 'Formule sélectionnée:' : 'Selected tier:',
    yearOneLabel: isFrench ? 'Investissement total an 1' : 'Total Year-1 Investment',
    breakEvenLabel: isFrench ? 'Ventes pour amortir le système' : 'Sales to pay for the system',
    breakEvenNote: isFrench
      ? 'À partir de ce seuil, le système s’est entièrement autofinancé.'
      : 'Beyond this number, your entire digital infrastructure runs on pure profit.',
    target3xLabel: isFrench ? 'Objectif 3x (ventes / an)' : '3x Target (Sales / Year)',
    target3xMonth: isFrench ? 'Objectif 3x (ventes / mois)' : '3x Target (Sales / Month)',
    helperText: isFrench
      ? `Avec une transaction moyenne de ${prices.currencySymbol}${averageSaleValue?.toLocaleString('en-US')}, seulement ${breakEvenSales} client(s) sur une année complète suffisent à rentabiliser Oryn Presence.`
      : `With an average customer value of ${prices.currencySymbol}${averageSaleValue?.toLocaleString('en-US')}, just ${breakEvenSales} closed client(s) in an entire year completely pays for Oryn Presence.`,
  };

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-10 shadow-xs">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Calculator size={16} weight="bold" />
          {labels.badge}
        </span>
        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl text-ink">
          {labels.title}
        </h3>
        <p className="mt-2 text-base text-body leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* Input & Tier Selector */}
        <div className="space-y-6 rounded-2xl border border-line/60 bg-paper/60 p-5 sm:p-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2.5">
              {labels.choosePlan}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['presence', 'conversion', 'authority'] as const).map((p) => {
                const isSelected = selectedPlan === p;
                const displayName =
                  p === 'presence'
                    ? isFrench ? 'Présence' : 'Presence'
                    : p === 'conversion'
                    ? isFrench ? 'Conversion' : 'Conversion'
                    : isFrench ? 'Autorité' : 'Authority';

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSelectPlan(p)}
                    className={cn(
                      'rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer',
                      isSelected
                        ? 'border-accent bg-accent text-accent-ink shadow-xs'
                        : 'border-line bg-surface text-body hover:border-accent/40 hover:text-ink',
                    )}
                  >
                    <span>{displayName}</span>
                    {p === 'conversion' && (
                      <span className="block text-[9px] font-normal opacity-90">
                        {isFrench ? 'Recommandé' : 'Recommended'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor={inputId} className="text-sm font-semibold text-ink block mb-2">
              {labels.inputLabel}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm font-semibold text-muted">
                {prices.currencySymbol}
              </span>
              <input
                id={inputId}
                type="number"
                min="1"
                step="any"
                value={averageSaleValue ?? ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onAverageSaleChange(Number.isFinite(val) && val > 0 ? val : null);
                }}
                placeholder={labels.inputPlaceholder}
                className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-base font-semibold text-ink outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>

          <div className="rounded-xl border border-line/40 bg-surface/50 p-4 text-xs text-muted leading-relaxed">
            <span className="font-semibold text-ink">{labels.yearOneLabel}:</span>{' '}
            <span className="font-mono font-semibold text-warm-ink">
              {prices.currencySymbol}
              {year1Total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>{' '}
            ({prices.currencySymbol}{tier.setup?.toLocaleString('en-US', { minimumFractionDigits: 2 })} {isFrench ? 'mise en place' : 'setup'} + 12 × {prices.currencySymbol}{tier.monthly?.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{isFrench ? 'mois' : 'mo'})
          </div>
        </div>

        {/* Results Card */}
        <div className="rounded-2xl border border-accent/20 bg-accent-soft/30 p-6 sm:p-7">
          {breakEvenSales !== null ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-muted">
                  {labels.breakEvenLabel}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-4xl sm:text-5xl font-bold text-accent">
                    {breakEvenSales}
                  </span>
                  <span className="text-sm font-medium text-ink">
                    {isFrench ? 'client(s) sur l’année' : 'client(s) in Year 1'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-body leading-relaxed">
                  {labels.breakEvenNote}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-accent/15 pt-5 text-xs">
                <div>
                  <p className="font-semibold text-muted uppercase tracking-wider text-[11px]">
                    {labels.target3xLabel}
                  </p>
                  <p className="mt-1 text-xl font-bold text-ink">
                    {targetSalesYear} <span className="text-xs font-normal text-muted">{isFrench ? 'ventes' : 'sales'}</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-muted uppercase tracking-wider text-[11px]">
                    {labels.target3xMonth}
                  </p>
                  <p className="mt-1 text-xl font-bold text-teal-ink">
                    {targetSalesMonth} <span className="text-xs font-normal text-muted">/{isFrench ? 'mois' : 'mo'}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-accent/30 bg-surface/80 p-3.5 text-xs text-body leading-relaxed">
                {labels.helperText}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted">
              <Target size={36} className="text-accent/60 mb-3" />
              <p className="text-sm font-medium text-ink">
                {isFrench ? 'Entrez votre valeur de vente moyenne' : 'Enter your average transaction value'}
              </p>
              <p className="text-xs text-muted mt-1 max-w-[26ch]">
                {isFrench
                  ? 'Voyez en direct combien de clients couvrent 100% de l’investissement.'
                  : 'See immediately how many clients recover 100% of your year-one investment.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
