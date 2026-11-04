'use client';

import { useState, useTransition } from 'react';
import {
  CheckCircle,
  PaperPlaneTilt,
  Sparkle,
  CalendarCheck,
  ShieldCheck,
  ChatCircleText,
} from '@phosphor-icons/react';
import type { MarketConfig } from '@/markets/types';
import { submitMarketOrder } from '@/app/actions/market-order';
import { buttonClass } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface MarketOrderFormProps {
  config: MarketConfig;
  locale: string;
  selectedPlan: 'presence' | 'conversion' | 'authority';
  onSelectPlan: (plan: 'presence' | 'conversion' | 'authority') => void;
  averageSaleValue: number | null;
}

type PreferredContact = 'sms' | 'whatsapp' | 'email' | 'phone';

const CONTACT_OPTIONS: { id: PreferredContact; label: string }[] = [
  { id: 'sms', label: 'SMS Text' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone Call' },
];

export function MarketOrderForm({
  config,
  locale,
  selectedPlan,
  onSelectPlan,
  averageSaleValue,
}: MarketOrderFormProps) {
  const isFrench = locale.startsWith('fr');
  const [withVoice, setWithVoice] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>(
    config.primaryChannel === 'whatsapp' ? 'whatsapp' : 'sms',
  );
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const prices = config.prices;
  const tierPrice = prices[selectedPlan];
  const voicePrice = prices.voiceAddon;

  const planSetup = tierPrice.setup ?? 0;
  const planMonthly = tierPrice.monthly ?? 0;
  const voiceSetup = withVoice ? (voicePrice.setup ?? 0) : 0;
  const voiceMonthly = withVoice ? (voicePrice.monthly ?? 0) : 0;

  // 50% of plan setup + 100% of voice add-on due upfront
  const initialPayment = Math.round((planSetup * 0.5 + voiceSetup) * 100) / 100;
  const ongoingMonthly = Math.round((planMonthly + voiceMonthly) * 100) / 100;

  const labels = {
    badge: isFrench ? 'Commande Formelle et Réservation' : 'Formal Order & Reservation',
    title: isFrench ? 'Réserver votre déploiement Oryn Presence' : 'Reserve Your Oryn Presence Deployment',
    subtitle: isFrench
      ? 'Ce formulaire constitue une commande formelle. Votre soumission réserve votre créneau d’intégration pendant 7 jours civils.'
      : 'Submitting this form constitutes a formal order and reserves your onboarding spot for 7 calendar days.',
    planSelection: isFrench ? '1. Choisissez votre formule' : '1. Select Your Tier',
    voiceSection: isFrench ? 'Module Vocal IA Complémentaire' : 'AI Voice Agent Add-on',
    voiceDesc: isFrench
      ? `Ajouter l’agent vocal (${prices.currencySymbol}${voicePrice.setup?.toLocaleString('en-US', { minimumFractionDigits: 2 })} mise en place + ${prices.currencySymbol}${voicePrice.monthly?.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mois). 300 minutes incluses.`
      : `Add the AI Voice Agent (${prices.currencySymbol}${voicePrice.setup?.toLocaleString('en-US', { minimumFractionDigits: 2 })} setup + ${prices.currencySymbol}${voicePrice.monthly?.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo). 300 minutes included.`,
    bizLabel: isFrench ? 'Nom de votre entreprise' : 'Business Name',
    nameLabel: isFrench ? 'Votre prénom et nom' : 'Your Full Name',
    emailLabel: isFrench ? 'Adresse courriel' : 'Business Email',
    phoneLabel: isFrench
      ? config.primaryChannel === 'whatsapp'
        ? 'Numéro WhatsApp'
        : 'Numéro de téléphone'
      : config.primaryChannel === 'whatsapp'
      ? 'WhatsApp Number'
      : 'Phone Number (SMS)',
    contactMethodLabel: isFrench ? 'Moyen de contact préféré:' : 'Preferred Contact Method:',
    notesLabel: isFrench ? 'Précisions ou questions éventuelles (facultatif)' : 'Project details or specific questions (optional)',
    confirmCheck: isFrench
      ? 'Je confirme ma commande. Je comprends que 50% de la mise en place du plan (et 100% de la voix si sélectionnée) sont dus à la confirmation pour démarrer les travaux, et que mon créneau est réservé pendant 7 jours civils.'
      : 'I confirm my order. I understand that 50% of plan setup (and 100% of voice add-on if chosen) is due upon order confirmation, and this reserves my spot for 7 calendar days.',
    submitBtn: isFrench ? 'Confirmer la commande' : 'Confirm Order & Reserve Spot',
    submitting: isFrench ? 'Enregistrement en cours...' : 'Submitting Order...',
    totalsHeading: isFrench ? 'Récapitulatif de votre commande' : 'Order Investment Summary',
    upfrontLabel: isFrench ? 'Paiement initial d’acompte:' : 'Due Upon Order Confirmation:',
    upfrontSub: isFrench ? '(50% mise en place du plan + 100% option voix)' : '(50% plan setup + 100% voice add-on)',
    finalDeliveryLabel: isFrench ? 'Paiement final à la livraison:' : 'Due Upon Live Delivery:',
    finalDeliverySub: isFrench ? '(Solde de 50% de mise en place)' : '(Remaining 50% plan setup)',
    monthlyLabel: isFrench ? 'Abonnement mensuel dès le 2e mois:' : 'Monthly retainer starting month 2:',
    paymentTermsNotice: isFrench
      ? config.id === 'ht'
        ? 'Modes de paiement acceptés: MonCash ou virement bancaire. L’abonnement mensuel débute le mois suivant la mise en ligne.'
        : 'Modes de paiement acceptés: virement bancaire ou PayPal. L’abonnement mensuel débute le mois suivant la mise en ligne.'
      : 'Accepted payment rails: bank transfer or PayPal. Monthly retainer begins the month after go-live.',
    successTitle: isFrench ? 'Votre commande est bien reçue!' : 'Your Order Has Been Confirmed!',
    successSub: isFrench
      ? 'Votre créneau d’intégration est officiellement réservé pendant 7 jours civils. Gamal communiquera avec vous dans les prochaines 24 heures avec votre formulaire de configuration et les détails de facturation.'
      : 'Your onboarding spot is officially reserved for 7 calendar days. Gamal will reach out within 24 hours with your onboarding setup form and invoice details.',
    walkthroughCta: isFrench ? 'Planifier un échange de 20 minutes' : 'Schedule a 20-minute walkthrough',
    questionsDirect: isFrench
      ? 'Une question immédiate? Écrivez directement à Gamal sur WhatsApp au +1 809 603 4113.'
      : 'Need immediate answers? Contact Gamal directly on WhatsApp at +1 809 603 4113.',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await submitMarketOrder({
        marketId: config.id,
        locale,
        plan: selectedPlan,
        withVoiceAddon: withVoice,
        businessName,
        contactName,
        email,
        phone,
        preferredContact,
        notes: notes || undefined,
        averageSaleValue,
        confirmed,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Error submitting order');
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      } else {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div id="order" className="rounded-[var(--radius-panel)] border border-teal/40 bg-teal-soft/40 p-8 sm:p-12 shadow-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal text-surface shadow-md">
          <CheckCircle size={36} weight="fill" />
        </div>
        <h3 className="mt-5 text-2xl sm:text-3xl font-bold text-ink">
          {labels.successTitle}
        </h3>
        <p className="mt-3 max-w-xl mx-auto text-base text-body leading-relaxed">
          {labels.successSub}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://cal.com/purple-cove-labs/20-min-cafe-virtual"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('primary', 'md')}
          >
            <CalendarCheck size={18} weight="bold" />
            <span>{labels.walkthroughCta}</span>
          </a>

          <a
            href="https://wa.me/18096034113"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('secondary', 'md')}
          >
            <ChatCircleText size={18} weight="bold" />
            <span>WhatsApp (+1 809 603 4113)</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="order" className="rounded-[var(--radius-panel)] border border-line bg-surface p-4 sm:p-8 md:p-10 shadow-xs">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
          <Sparkle size={14} weight="fill" />
          {labels.badge}
        </span>
        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl text-ink break-words">
          {labels.title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-body leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        {/* Form fields */}
        <div className="space-y-6">
          {/* Plan Radio buttons */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2.5">
              {labels.planSelection}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['presence', 'conversion', 'authority'] as const).map((p) => {
                const isSelected = selectedPlan === p;
                const pPrice = prices[p];
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
                      'flex flex-col items-start rounded-xl border p-3.5 sm:p-4 text-left transition-all cursor-pointer',
                      isSelected
                        ? 'border-accent bg-accent-soft/50 ring-2 ring-accent shadow-xs'
                        : 'border-line bg-paper/50 hover:border-line hover:bg-paper',
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-semibold text-sm text-ink">{displayName}</span>
                      {p === 'conversion' && (
                        <span className="rounded-full bg-warm px-2 py-0.5 text-[9px] font-bold text-on-warm">
                          {isFrench ? 'Recommandé' : 'Recommended'}
                        </span>
                      )}
                    </div>
                    <span className="mt-2 text-xs font-mono font-medium text-muted">
                      {prices.currencySymbol}{pPrice.setup?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[11px] text-body">
                      + {prices.currencySymbol}{pPrice.monthly?.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{isFrench ? 'mois' : 'mo'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Add-on toggle */}
          {prices.voiceAddon && (
            <div className="rounded-xl border border-line/80 bg-paper/60 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withVoice}
                  onChange={(e) => setWithVoice(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-line text-accent focus:ring-accent shrink-0"
                />
                <div>
                  <span className="text-sm font-semibold text-ink block">
                    {labels.voiceSection}
                  </span>
                  <span className="text-xs text-body leading-relaxed block mt-0.5">
                    {labels.voiceDesc}
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Business & Contact Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-1.5">
                {labels.bizLabel} *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-11 sm:h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-base sm:text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder={isFrench ? 'Ex: Clinique Dentaire Apex' : 'e.g. Apex Dental Group'}
              />
              {fieldErrors.businessName && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.businessName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-1.5">
                {labels.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-11 sm:h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-base sm:text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder={isFrench ? 'Ex: Sophie Tremblay' : 'e.g. John Miller'}
              />
              {fieldErrors.contactName && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.contactName}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-1.5">
                {labels.emailLabel} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-base sm:text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder="contact@business.com"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink block mb-1.5">
                {labels.phoneLabel} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 sm:h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-base sm:text-sm text-ink outline-none transition-colors focus:border-accent"
                placeholder={config.id === 'ht' ? '+509 ...' : '+1 ...'}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-danger">{fieldErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Preferred contact channel */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
              {labels.contactMethodLabel}
            </label>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              {CONTACT_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setPreferredContact(c.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 transition-colors cursor-pointer',
                    preferredContact === c.id
                      ? 'border-accent bg-accent text-accent-ink font-semibold'
                      : 'border-line bg-paper text-body hover:border-line hover:text-ink',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1.5">
              {labels.notesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper p-3 text-base sm:text-sm text-ink outline-none transition-colors focus:border-accent"
              placeholder={isFrench ? 'Besoins particuliers, calendrier souhaité...' : 'Specific requirements or preferred timeline...'}
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="rounded-xl border border-line bg-paper/40 p-3.5 sm:p-4">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-body leading-relaxed">
              <input
                type="checkbox"
                required
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent shrink-0"
              />
              <span>{labels.confirmCheck}</span>
            </label>
            {fieldErrors.confirmed && (
              <p className="mt-1.5 text-xs text-danger">{fieldErrors.confirmed}</p>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || !confirmed}
            className={buttonClass('primary', 'lg', 'w-full')}
          >
            <PaperPlaneTilt size={18} weight="bold" />
            <span>{isPending ? labels.submitting : labels.submitBtn}</span>
          </button>
        </div>

        {/* Investment summary breakdown card */}
        <div className="rounded-2xl border border-line bg-paper/60 p-4 sm:p-6 md:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-line pb-4">
            <ShieldCheck size={20} className="text-accent" weight="fill" />
            <h4 className="text-base font-semibold text-ink">{labels.totalsHeading}</h4>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-baseline gap-2">
              <div>
                <p className="font-semibold text-ink text-sm">
                  Oryn {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
                </p>
                <p className="text-muted text-[11px]">
                  {prices.currencySymbol}{planSetup.toLocaleString('en-US', { minimumFractionDigits: 2 })} setup
                </p>
              </div>
              <p className="font-mono font-semibold text-ink text-sm whitespace-nowrap">
                {prices.currencySymbol}{planMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{isFrench ? 'mois' : 'mo'}
              </p>
            </div>

            {withVoice && (
              <div className="flex justify-between items-baseline gap-2 border-t border-line/60 pt-3">
                <div>
                  <p className="font-semibold text-teal-ink">AI Voice Agent</p>
                  <p className="text-muted text-[11px]">
                    {prices.currencySymbol}{voiceSetup.toLocaleString('en-US', { minimumFractionDigits: 2 })} setup
                  </p>
                </div>
                <p className="font-mono font-semibold text-teal-ink whitespace-nowrap">
                  + {prices.currencySymbol}{voiceMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{isFrench ? 'mois' : 'mo'}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-accent/20 bg-accent-soft/40 p-3.5 sm:p-4 space-y-2.5 mt-4">
              <div className="flex justify-between items-baseline gap-2">
                <div>
                  <p className="font-semibold text-accent text-xs">{labels.upfrontLabel}</p>
                  <p className="text-[10px] text-muted">{labels.upfrontSub}</p>
                </div>
                <p className="font-mono font-bold text-base text-accent whitespace-nowrap">
                  {prices.currencySymbol}{initialPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-t border-accent/15 pt-2">
                <div>
                  <p className="font-medium text-ink text-[11px]">{labels.finalDeliveryLabel}</p>
                  <p className="text-[10px] text-muted">{labels.finalDeliverySub}</p>
                </div>
                <p className="font-mono font-semibold text-xs text-ink whitespace-nowrap">
                  {prices.currencySymbol}{(Math.round(planSetup * 0.5 * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-t border-accent/15 pt-2">
                <p className="font-medium text-ink text-[11px]">{labels.monthlyLabel}</p>
                <p className="font-mono font-bold text-xs text-warm-ink whitespace-nowrap">
                  {prices.currencySymbol}{ongoingMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/{isFrench ? 'mois' : 'mo'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-muted leading-relaxed pt-2 break-words">
              {labels.paymentTermsNotice}
            </p>

            <div className="border-t border-line pt-4 text-[11px] text-muted break-words">
              <p>{labels.questionsDirect}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
