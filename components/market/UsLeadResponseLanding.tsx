'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wrench,
  Thermometer,
  PhoneCall,
  ChatCircleText,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Sparkle,
  WarningCircle,
  Lightning,
  Desktop,
  UsersThree,
  FileText,
  CheckSquare,
  RocketLaunch,
  EnvelopeSimple,
  X,
  ArrowSquareOut,
  Info,
} from '@phosphor-icons/react';
import { buttonClass } from '@/components/ui/button';
import { IconTile } from '@/components/ui/IconTile';
import { cn } from '@/lib/cn';
import type { MarketConfig } from '@/markets/types';
import { submitMarketOrder, type MarketOrderResult } from '@/app/actions/market-order';
import { CAL_URL } from '@/lib/site';

interface UsLeadResponseLandingProps {
  config: MarketConfig;
}

export function UsLeadResponseLanding({ config }: UsLeadResponseLandingProps) {
  // Demo Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'starter' | 'premium'>('premium');
  const [tradeSelection, setTradeSelection] = useState<'HVAC' | 'Plumbing' | 'Other'>('HVAC');

  // Form State
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<MarketOrderResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Workflow Demo Simulation State
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'hvac' | 'plumbing'>('hvac');

  const openDemoModal = (pkg: 'starter' | 'premium' = 'premium') => {
    setSelectedPackage(pkg);
    setSubmitResult(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    startTransition(async () => {
      const result = await submitMarketOrder({
        marketId: 'us',
        locale: 'en',
        plan: selectedPackage,
        withVoiceAddon: selectedPackage === 'premium',
        businessName: businessName || 'Not specified',
        contactName: contactName || 'Not specified',
        email,
        phone,
        trade: tradeSelection,
        preferredContact: 'phone',
        notes: `Selected Package: ${selectedPackage.toUpperCase()}. Trade: ${tradeSelection}. ${notes ? `Notes: ${notes}` : ''}`,
        confirmed: true,
      });

      setSubmitResult(result);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
    });
  };

  return (
    <div className="min-h-screen bg-paper text-body selection:bg-accent selection:text-accent-ink">
      {/* ─── Sticky Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <Link href="/us" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/media/logo.webp"
              alt="Purple Oryn Logo"
              width={34}
              height={34}
              className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full"
              priority
            />
            <div className="flex items-center gap-2">
              <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
                Purple Oryn
              </span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-mono font-medium text-accent">
                U.S. Home Services
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted">
            <a href="#challenges" className="hover:text-ink transition-colors">
              Challenges
            </a>
            <a href="#how-it-works" className="hover:text-ink transition-colors">
              How It Works
            </a>
            <a href="#workflow-demo" className="hover:text-ink transition-colors">
              Workflow Demo
            </a>
            <a href="#pricing" className="hover:text-ink transition-colors">
              Packages &amp; Pricing
            </a>
            <a href="#implementation" className="hover:text-ink transition-colors">
              Implementation
            </a>
            <a href="#faq" className="hover:text-ink transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => openDemoModal('premium')}
              className={buttonClass('primary', 'sm', 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm')}
            >
              <CalendarCheck size={16} weight="bold" />
              <span>Book Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden">
        {/* Ambient background glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
        >
          <div className="animate-drift absolute -left-20 -top-32 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-3xl" />
          <div className="animate-drift absolute -top-10 right-[10%] h-[22rem] w-[22rem] rounded-full bg-fuchsia/15 blur-3xl [--drift-x:-50px] [--drift-y:40px] [animation-duration:20s]" />
          <div className="animate-drift absolute bottom-[-8rem] left-[35%] h-[20rem] w-[20rem] rounded-full bg-warm/15 blur-3xl [--drift-x:40px] [--drift-y:-20px] [animation-duration:22s]" />
        </div>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 sm:px-6 md:grid-cols-[1.3fr_0.7fr] md:gap-12 md:pt-16">
          <div className="pb-4 md:pb-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                <Sparkle size={14} weight="fill" />
                Purple Oryn Lead Response System
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                <span>📍 Dallas–Fort Worth &amp; U.S. Contractors</span>
              </span>
            </div>

            <h1 className="text-gradient-brand mt-4 text-[2.1rem] xs:text-[2.6rem] font-semibold leading-[1.08] sm:text-[3.1rem] lg:text-[3.5rem] break-words">
              {"Your Next Customer Shouldn't Have to Wait."}
            </h1>

            <p className="mt-4 sm:mt-5 max-w-[50ch] text-base sm:text-lg leading-relaxed text-body">
              Capture, qualify, and follow up with potential customers automatically—so your team can focus on delivering great service.
            </p>

            {/* Target contractor badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-ink">
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
                <Thermometer size={16} className="text-accent" weight="bold" />
                <span>HVAC Contractors</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
                <Wrench size={16} className="text-teal-ink" weight="bold" />
                <span>Plumbing Contractors</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 shadow-2xs">
                <Clock size={16} className="text-warm-ink" weight="bold" />
                <span>Instant Qualification</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openDemoModal('premium')}
                className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}
              >
                <CalendarCheck size={18} weight="bold" />
                <span>Book a Free 15-Minute Demo</span>
              </button>

              <a
                href="#how-it-works"
                className={buttonClass('secondary', 'lg', 'w-full sm:w-auto')}
              >
                <span>See How It Works</span>
                <ArrowRight size={16} weight="bold" />
              </a>
            </div>
            <p className="mt-2.5 text-xs text-muted">
              Live 15-minute walkthrough. No high-pressure sales, no commitments.
            </p>
          </div>

          {/* Hero Visual Workflow Card */}
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[24px] sm:rounded-[28px] border border-line bg-surface p-5 sm:p-6 shadow-[0_24px_50px_-20px_rgb(28_16_48/0.2)] md:max-w-none">
            <div className="flex items-center gap-3.5 border-b border-line pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <RocketLaunch size={26} weight="duotone" />
              </div>
              <div>
                <p className="font-display text-base sm:text-lg font-semibold text-ink">
                  Lead Response System
                </p>
                <p className="text-xs text-muted">Practical Customer Inquiry Intake</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 rounded-xl bg-paper p-3 border border-line/60">
                <Desktop size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                <div>
                  <p className="font-semibold text-ink">Website Assistant</p>
                  <p className="text-muted mt-0.5">Captures customer inquiries, emergency notes &amp; service type.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-paper p-3 border border-line/60">
                <PhoneCall size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                <div>
                  <p className="font-semibold text-ink">Inbound Voice Receptionist</p>
                  <p className="text-muted mt-0.5">Answers calls 24/7 with human-grade conversational voice.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-paper p-3 border border-line/60">
                <Lightning size={18} className="text-warm-ink shrink-0 mt-0.5" weight="bold" />
                <div>
                  <p className="font-semibold text-ink">Instant Lead Routing</p>
                  <p className="text-muted mt-0.5">Summaries dispatched instantly to technicians via SMS/email.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-accent/20 bg-accent-soft/40 p-3 text-xs text-ink">
              <div className="flex items-center justify-between font-semibold">
                <span>Response Speed</span>
                <span className="font-mono text-accent">Under 15 Seconds</span>
              </div>
              <p className="mt-1 text-[11px] text-muted">
                Keeps high-intent callers and visitors engaged before they contact another contractor.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Problem Section ─────────────────────────────────────────── */}
      <section id="challenges" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-ink">
            <WarningCircle size={16} weight="bold" />
            Common Operational Challenges
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold leading-tight sm:text-4xl text-ink break-words">
            {"What Happens Between a Customer's Call and Your Callback?"}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-body">
            Independent HVAC and plumbing contractors often face the same operational friction when handling new inquiries:
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Challenge 1 */}
          <div className="group rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-xs hover:border-rose/40 transition-colors">
            <IconTile icon={PhoneCall} tone="rose" size="md" />
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Missed Inquiries While Technicians Are Working
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              When technicians are in attics, crawlspaces, or on job sites, inbound calls often go straight to voicemail. Homeowners in urgent need rarely leave messages—they dial the next number.
            </p>
          </div>

          {/* Challenge 2 */}
          <div className="group rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-xs hover:border-rose/40 transition-colors">
            <IconTile icon={EnvelopeSimple} tone="rose" size="md" />
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Website Forms That Wait in an Inbox
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Standard website contact forms sit unread in general office inboxes for hours or overnight. By the time someone opens the email, the homeowner has already booked someone else.
            </p>
          </div>

          {/* Challenge 3 */}
          <div className="group rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-xs hover:border-rose/40 transition-colors">
            <IconTile icon={Clock} tone="rose" size="md" />
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Repetitive Questions Consuming Office Time
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Office coordinators spend hours answering the exact same preliminary questions: {`"Do you service my zip code?", "What is your diagnostic fee?", "When is your earliest opening?"`}
            </p>
          </div>

          {/* Challenge 4 */}
          <div className="group rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-xs hover:border-rose/40 transition-colors">
            <IconTile icon={Lightning} tone="rose" size="md" />
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Leads That Need a Timely Callback
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Speed to lead is critical in home services. An inquiry left unanswered for more than 15 minutes drops significantly in conversion probability as buyer urgency transitions elsewhere.
            </p>
          </div>

          {/* Challenge 5 */}
          <div className="group rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-xs hover:border-rose/40 transition-colors sm:col-span-2 lg:col-span-2">
            <IconTile icon={FileText} tone="rose" size="md" />
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Incomplete Customer Information When Following Up
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              {"When office staff calls back, they often only have a bare phone number. They don't know the equipment age, unit brand, problem symptoms, or property address—forcing a repetitive discovery conversation from scratch."}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-paper/60 p-4 text-xs text-muted flex items-start gap-2.5">
          <Info size={16} className="text-muted shrink-0 mt-0.5" />
          <p>
            {"Note: These represent common industry operational patterns observed across U.S. residential service contractors, not confirmed facts about every visitor's specific business."}
          </p>
        </div>
      </section>

      {/* ─── Solution Section ────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            The Solution
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold leading-tight sm:text-4xl text-ink break-words">
            A Practical Four-Step Response Workflow
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-body">
            How the Purple Oryn Lead Response System handles customer inquiries cleanly from initial contact to dispatch:
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-4 md:items-stretch">
          {/* Step 1 */}
          <li className="relative flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <span className="tabular flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              01
            </span>
            <div className="mt-4">
              <IconTile icon={Desktop} tone="violet" size="md" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              1. Customer Contacts the Business
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              A potential customer visits your website or dials your business phone line needing HVAC or plumbing service.
            </p>
          </li>

          {/* Step 2 */}
          <li className="relative flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <span className="tabular flex h-7 w-7 items-center justify-center rounded-full bg-teal-soft text-xs font-bold text-teal-ink">
              02
            </span>
            <div className="mt-4">
              <IconTile icon={ChatCircleText} tone="teal" size="md" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              2. Assistant Responds &amp; Collects Details
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The assistant responds within seconds, answers approved FAQs, and collects equipment symptoms, unit location, and contact information.
            </p>
          </li>

          {/* Step 3 */}
          <li className="relative flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <span className="tabular flex h-7 w-7 items-center justify-center rounded-full bg-warm-soft text-xs font-bold text-warm-ink">
              03
            </span>
            <div className="mt-4">
              <IconTile icon={ShieldCheck} tone="amber" size="md" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              3. System Qualifies &amp; Records Inquiry
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              The workflow assesses urgency (emergency vs. routine tune-up), verifies the service area, and prepares a structured inquiry record.
            </p>
          </li>

          {/* Step 4 */}
          <li className="relative flex flex-col rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-xs">
            <span className="tabular flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
              04
            </span>
            <div className="mt-4">
              <IconTile icon={UsersThree} tone="violet" size="md" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              4. Business Team Takes Over
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-body">
              Your dispatcher or technician receives an instant summary alert via SMS/email and confirms the service window with full context in hand.
            </p>
          </li>
        </ol>
      </section>

      {/* ─── Product Demonstration Section ───────────────────────────── */}
      <section id="workflow-demo" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-ink">
            Interactive Walkthrough
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold leading-tight sm:text-4xl text-ink break-words">
            See the Lead Response Workflow in Action
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-body">
            Below is an illustrative demonstration of how customer inquiries are captured, qualified, and routed for home-service contractors.
          </p>
        </div>

        {/* Trade Switcher Tabs */}
        <div className="mt-8 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveWorkflowTab('hvac')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all',
              activeWorkflowTab === 'hvac'
                ? 'bg-gradient-action text-accent-ink shadow-xs'
                : 'border border-line bg-surface text-muted hover:text-ink'
            )}
          >
            <Thermometer size={16} weight="bold" />
            <span>HVAC: Emergency AC Repair</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveWorkflowTab('plumbing')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all',
              activeWorkflowTab === 'plumbing'
                ? 'bg-gradient-action text-accent-ink shadow-xs'
                : 'border border-line bg-surface text-muted hover:text-ink'
            )}
          >
            <Wrench size={16} weight="bold" />
            <span>Plumbing: Water Heater Leak</span>
          </button>
        </div>

        {/* Interactive Mock Container */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Customer Facing Assistant Simulation */}
          <div className="overflow-hidden rounded-[24px] border border-line bg-surface shadow-md">
            <div className="border-b border-line bg-paper/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 rounded-full bg-success"></span>
                <span className="text-xs font-semibold text-ink">
                  {activeWorkflowTab === 'hvac'
                    ? 'Apex Heating & Air Assistant (Website / Inbound Voice)'
                    : 'BlueLine Plumbing Assistant (Website / Inbound Voice)'}
                </span>
              </div>
              <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-mono text-accent">
                Active Simulation
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm leading-relaxed bg-[#fafafb] dark:bg-[#151518] min-h-[340px]">
              {activeWorkflowTab === 'hvac' ? (
                <>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink border border-line/60 shadow-2xs">
                    <p className="text-[11px] font-semibold text-muted mb-1">Homeowner (Plano, TX)</p>
                    <p>{`"Hi, our AC unit outside just stopped cooling and is making a humming sound. It is 88° in the house. Do you have a technician who can come today?"`}</p>
                    <span className="mt-1 block text-right text-[10px] text-muted">2:14 PM</span>
                  </div>

                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                    <p className="text-[11px] font-semibold text-accent-soft/90 mb-1">Purple Oryn Assistant</p>
                    <p>{`"I'm sorry to hear that—staying cool in this heat is a priority. Yes, we service Plano. Is the outside fan blade spinning at all, and is this a central heat pump or standard split AC system?"`}</p>
                    <span className="mt-1 block text-right text-[10px] text-accent-ink/80">2:14 PM (Instant)</span>
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink border border-line/60 shadow-2xs">
                    <p className="text-[11px] font-semibold text-muted mb-1">Homeowner</p>
                    <p>{`"It's a central split system. Fan isn't spinning, just humming. We have elderly parents here so sooner is better."`}</p>
                    <span className="mt-1 block text-right text-[10px] text-muted">2:15 PM</span>
                  </div>

                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                    <p className="text-[11px] font-semibold text-accent-soft/90 mb-1">Purple Oryn Assistant</p>
                    <p>{`"Understood. I have logged this as an urgent cooling dispatch. Could you confirm your address and the best cell phone number for our lead technician?"`}</p>
                    <span className="mt-1 block text-right text-[10px] text-accent-ink/80">2:15 PM</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink border border-line/60 shadow-2xs">
                    <p className="text-[11px] font-semibold text-muted mb-1">Homeowner (Fort Worth, TX)</p>
                    <p>{`"Hello, water is pooling under our 50-gallon water heater in the garage. Need someone to inspect or replace it as soon as possible."`}</p>
                    <span className="mt-1 block text-right text-[10px] text-muted">7:42 AM</span>
                  </div>

                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                    <p className="text-[11px] font-semibold text-accent-soft/90 mb-1">Purple Oryn Assistant</p>
                    <p>{`"Hello! Water heater leaks need prompt attention. Is it a gas or electric water heater, and have you been able to shut off the cold water supply valve to minimize pooling?"`}</p>
                    <span className="mt-1 block text-right text-[10px] text-accent-ink/80">7:42 AM (Instant)</span>
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface p-3 text-ink border border-line/60 shadow-2xs">
                    <p className="text-[11px] font-semibold text-muted mb-1">Homeowner</p>
                    <p>{`"It is gas, 9 years old. Yes, valve is off now. We'd prefer replacement if it's rusted."`}</p>
                    <span className="mt-1 block text-right text-[10px] text-muted">7:43 AM</span>
                  </div>

                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-action p-3 text-accent-ink shadow-xs">
                    <p className="text-[11px] font-semibold text-accent-soft/90 mb-1">Purple Oryn Assistant</p>
                    <p>{`"Got it. A 9-year-old gas unit with tank leakage typically indicates tank failure. I've noted this for priority replacement. What is your address and phone number?"`}</p>
                    <span className="mt-1 block text-right text-[10px] text-accent-ink/80">7:43 AM</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business Owner / Dispatcher Notification View */}
          <div className="space-y-4">
            <div className="rounded-[24px] border border-line bg-surface p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-ink">
                  <CheckSquare size={16} weight="bold" />
                  <span>Dispatcher / Technician Mobile Alert</span>
                </div>
                <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[11px] font-mono font-semibold text-teal-ink">
                  Delivered in 12s
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                {activeWorkflowTab === 'hvac' ? (
                  <>
                    <div className="rounded-lg bg-paper p-3 border border-line">
                      <p className="font-semibold text-ink text-sm">🔥 NEW URGENT HVAC INQUIRY</p>
                      <div className="mt-2 space-y-1 text-body">
                        <p><span className="font-medium text-ink">Urgency:</span> High (88° indoor temp, elderly residents)</p>
                        <p><span className="font-medium text-ink">Issue:</span> Outside fan not spinning, humming sound</p>
                        <p><span className="font-medium text-ink">System:</span> Split AC System</p>
                        <p><span className="font-medium text-ink">City:</span> Plano, TX (Service Area Verified)</p>
                        <p><span className="font-medium text-ink">Next Step:</span> Dispatch technician for capacitor/motor diagnostic</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-paper p-3 border border-line">
                      <p className="font-semibold text-ink text-sm">💧 NEW PLUMBING REPAIR INQUIRY</p>
                      <div className="mt-2 space-y-1 text-body">
                        <p><span className="font-medium text-ink">Urgency:</span> Priority (Water pooling in garage)</p>
                        <p><span className="font-medium text-ink">Issue:</span> 50-Gal Gas Water Heater leak (9 yrs old)</p>
                        <p><span className="font-medium text-ink">Status:</span> Shut-off valve closed by homeowner</p>
                        <p><span className="font-medium text-ink">City:</span> Fort Worth, TX (Service Area Verified)</p>
                        <p><span className="font-medium text-ink">Next Step:</span> Quote replacement options &amp; schedule dispatch</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="rounded-lg bg-accent-soft/40 p-3 text-[11px] text-ink border border-accent/20">
                  <p className="font-semibold">Workflow Status:</p>
                  <p className="text-muted mt-0.5">
                    Lead recorded in tracking sheet / CRM. Technician notified via SMS alert with one-touch dial callback.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => openDemoModal('premium')}
                  className={buttonClass('secondary', 'md', 'w-full')}
                >
                  <CalendarCheck size={16} weight="bold" />
                  <span>Request a Custom Trade Walkthrough</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-paper/60 p-4 text-xs text-muted">
              <p className="font-medium text-ink">Illustrative Workflow Note:</p>
              <p className="mt-1">
                The above simulation reflects the standard question-qualification flow customized for your specific trades, service zones, and emergency dispatch rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Package Pricing Section ─────────────────────────────────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-warm-ink">
            Packages &amp; Pricing
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold leading-tight sm:text-4xl text-ink break-words">
            Transparent Pricing for Home-Service Contractors
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-body">
            Clear, honest pricing with separate implementation and ongoing maintenance terms. No hidden platform markup.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 items-stretch">
          {/* STARTER PACKAGE */}
          <div className="flex">
            <article className="group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8 shadow-xs hover:border-accent/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/20 bg-teal-soft px-3 py-1 text-xs font-semibold uppercase text-teal-ink">
                  <Sparkle size={14} weight="fill" />
                  Starter
                </span>
                <span className="text-xs text-muted font-mono">Website Focus</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-ink">
                Lead Response Sprint
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Essential website customer inquiry capture and qualification for contractors ready to stop losing web leads.
              </p>

              {/* Price Breakdown */}
              <div className="mt-6 border-t border-line pt-5 space-y-4">
                <div>
                  <p className="text-xs text-muted uppercase font-semibold tracking-wider">
                    One-Time Implementation
                  </p>
                  <p className="text-3xl font-bold text-ink">$1,250</p>
                  <div className="mt-1.5 flex flex-col gap-1 text-xs text-muted font-medium">
                    <span className="text-teal-ink font-semibold">• Deposit to start: $875</span>
                    <span>• Remaining balance before production launch: $375</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-line/60">
                  <p className="text-xs text-muted uppercase font-semibold tracking-wider">
                    Ongoing Service &amp; Maintenance
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-ink">$297</span>
                    <span className="text-sm text-muted">/month</span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Billed monthly starting the month after your system goes live.
                  </p>
                </div>
              </div>

              {/* Inclusions */}
              <div className="mt-6 border-t border-line pt-5 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
                  {"What's Included:"}
                </p>
                <ul className="space-y-2.5 text-sm text-body">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>One website assistant:</strong> Connects directly to your existing website.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Approved business info &amp; FAQs:</strong> Loaded exclusively with your approved trade offerings and policies.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Customer inquiry capture:</strong> Gathers customer problem, address, and contact details.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Service &amp; urgency qualification:</strong> Distinguishes emergency dispatches from standard requests.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Lead notifications:</strong> Instant structured dispatch alerts via email and SMS.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>One agreed follow-up workflow:</strong> Configured follow-up sequence for customer callback.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-teal-ink shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Basic lead tracking:</strong> Centralized log of all inquiries for your team.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openDemoModal('starter')}
                className={buttonClass('secondary', 'md', 'mt-8 w-full')}
              >
                <span>Select Starter Sprint</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </article>
          </div>

          {/* PREMIUM PACKAGE (FEATURED) */}
          <div className="flex">
            <article className="group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-panel)] border-2 border-accent bg-surface p-6 sm:p-8 shadow-[0_28px_56px_-30px_rgb(109_47_216/0.4)]">
              {/* Highlight ribbon */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1.5 bg-gradient-action"
              />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase text-accent-ink">
                  <RocketLaunch size={14} weight="fill" />
                  Premium • Recommended
                </span>
                <span className="rounded-full bg-warm px-2.5 py-0.5 text-xs font-semibold text-on-warm">
                  Phone + Web
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-accent">
                Phone + Web Conversion System
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                Complete multi-channel capture for contractors who want every phone call and website inquiry answered and qualified immediately.
              </p>

              {/* Price Breakdown */}
              <div className="mt-6 border-t border-line pt-5 space-y-4">
                <div>
                  <p className="text-xs text-muted uppercase font-semibold tracking-wider">
                    One-Time Implementation
                  </p>
                  <p className="text-3xl font-bold text-ink">$2,500</p>
                  <div className="mt-1.5 flex flex-col gap-1 text-xs text-muted font-medium">
                    <span className="text-accent font-semibold">• Deposit to start: $1,750</span>
                    <span>• Remaining balance before production launch: $750</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-line/60">
                  <p className="text-xs text-muted uppercase font-semibold tracking-wider">
                    Ongoing Service &amp; Maintenance
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-accent">$397</span>
                    <span className="text-sm text-muted">/month</span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Billed monthly starting the month after your system goes live.
                  </p>
                </div>
              </div>

              {/* Inclusions */}
              <div className="mt-6 border-t border-line pt-5 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
                  Everything in Starter, Plus:
                </p>
                <ul className="space-y-2.5 text-sm text-body">
                  <li className="flex items-start gap-2.5 font-medium text-ink">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                    <span><strong>One inbound voice receptionist workflow:</strong> Answers inbound customer calls 24/7 with natural conversational speech.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Call summaries &amp; lead routing:</strong> Automatic transcription, structured symptom notes, and routing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                    <span><strong>One supported calendar or CRM integration:</strong> Connects to your booking calendar or CRM (where technically available).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Human escalation workflow:</strong> Instant emergency phone/SMS transfer when complex scenarios or urgent repairs occur.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" weight="bold" />
                    <span><strong>Comprehensive multi-channel support:</strong> Covers both inbound website chats and direct incoming calls.</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => openDemoModal('premium')}
                className={buttonClass('primary', 'md', 'mt-8 w-full shadow-md')}
              >
                <span>Select Premium System</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </article>
          </div>
        </div>

        {/* Pricing Rules & Disclaimers Box */}
        <div className="mt-8 rounded-[var(--radius-panel)] border border-line bg-surface/70 p-5 sm:p-6 text-xs text-body leading-relaxed space-y-2 shadow-2xs">
          <p className="font-semibold text-ink text-sm flex items-center gap-2">
            <ShieldCheck size={18} className="text-accent" weight="bold" />
            Important Pricing Transparency &amp; Usage Rules
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted">
            <li><strong>Separate Implementation and Ongoing Fees:</strong> Implementation covers custom build, prompt architecture, integration, and testing. Ongoing service covers hosting, system monitoring, prompt maintenance, and technical upkeep.</li>
            <li><strong>Third-Party Costs Are Separate:</strong> Telephony provider minutes, carrier SMS text charges, and third-party AI provider inference are billed separately based on actual monthly consumption without artificial markup.</li>
            <li><strong>No Implied Unlimited Usage:</strong> Workflows operate within approved telephony and message rate limits to preserve system reliability and prevent spam abuse.</li>
            <li><strong>No Unverified Guarantees:</strong> We provide an engineered, tested software system; we do not guarantee specific booking numbers, closed revenues, or inbound lead volumes.</li>
          </ul>
        </div>
      </section>

      {/* ─── How Implementation Works ────────────────────────────────── */}
      <section id="implementation" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Process
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold leading-tight sm:text-4xl text-ink break-words">
            How Implementation Works
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-body">
            A structured five-step rollout so your team knows exactly what to expect from kickoff to launch.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {/* Step 1 */}
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent font-bold text-lg">
              01
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                Discovery &amp; Business Information Collection
              </h3>
              <p className="mt-1 text-sm text-body leading-relaxed">
                We collect your approved service offerings, dispatch zip codes, emergency policies, standard diagnostic pricing, and frequently asked customer questions.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-soft text-teal-ink font-bold text-lg">
              02
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                Workflow Configuration
              </h3>
              <p className="mt-1 text-sm text-body leading-relaxed">
                We build the custom website assistant, voice receptionist dialog flows, emergency qualification logic, and notification pathways (SMS/email/CRM).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warm-soft text-warm-ink font-bold text-lg">
              03
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                Testing &amp; Client Approval
              </h3>
              <p className="mt-1 text-sm text-body leading-relaxed">
                We test realistic customer scenarios, edge-case inquiries, and after-hours questions alongside your team. You review and approve the responses before going live.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent font-bold text-lg">
              04
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                Production Launch &amp; Handover
              </h3>
              <p className="mt-1 text-sm text-body leading-relaxed">
                The assistant code is embedded on your website, your dedicated phone line is activated, and we walk your office staff through notification handling.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper text-muted font-bold text-lg border border-line">
              05
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                Ongoing Maintenance &amp; Support
              </h3>
              <p className="mt-1 text-sm text-body leading-relaxed">
                Continuous uptime monitoring, prompt maintenance, FAQ updates when your services change, and proactive technical support for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 md:pt-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            FAQ
          </span>
          <h2 className="mt-2 text-2xl xs:text-3xl font-semibold sm:text-4xl text-ink break-words">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-body">
            Accurate answers about system capabilities, telephony, and day-to-day operation.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {config.content.en.faq.map((item) => (
            <div
              key={item.question}
              className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 sm:p-6 shadow-2xs hover:border-accent/30 transition-colors"
            >
              <h3 className="text-base sm:text-lg font-semibold text-ink break-words">
                {item.question}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-body break-words">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section id="demo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-32">
        <div className="relative isolate overflow-hidden rounded-[24px] sm:rounded-[28px] bg-plum p-6 text-plum-ink shadow-2xl sm:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-plum-accent/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-plum-accent/20 px-3 py-1 text-xs font-semibold uppercase text-plum-accent">
              <Sparkle size={14} weight="fill" />
              Get Started
            </span>
            <h2 className="mt-4 font-display text-2xl xs:text-3xl sm:text-4xl font-semibold text-plum-ink leading-tight break-words">
              See What a Better Lead Response Process Could Look Like for Your Business.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-plum-muted">
              Book a free 15-minute demo to see how the Purple Oryn Lead Response System captures, qualifies, and routes customer inquiries for your trade.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => openDemoModal('premium')}
                className={buttonClass('onPlum', 'lg', 'w-full sm:w-auto')}
              >
                <CalendarCheck size={18} weight="bold" />
                <span>Book Your Free 15-Minute Demo</span>
              </button>

              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass('onPlumSecondary', 'lg', 'w-full sm:w-auto')}
              >
                <span>Direct Calendar Link</span>
                <ArrowSquareOut size={16} weight="bold" />
              </a>
            </div>
            <p className="mt-3 text-xs text-plum-muted">
              No obligation. We will review your current response flow and demonstrate practical trade scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface/50 py-10 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left sm:px-6 text-xs text-muted">
          <div className="flex items-center gap-2.5">
            <Image
              src="/media/logo.webp"
              alt="Purple Cove Labs"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full"
            />
            <div>
              <p className="font-display text-sm font-semibold text-ink">Purple Oryn</p>
              <p className="text-[11px] text-muted">A Purple Cove Labs Solution • U.S. Home Services</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <Link href="/privacidad" className="hover:text-ink transition-colors">
              Privacy Policy
            </Link>
            <a
              href="mailto:gamal.jastram@purpleoryn.com"
              className="hover:text-ink transition-colors"
            >
              gamal.jastram@purpleoryn.com
            </a>
            <p>© {new Date().getFullYear()} Purple Cove Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ─── Demo Booking / Request Modal ─────────────────────────────── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] border border-line bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-paper hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              <X size={20} weight="bold" />
            </button>

            {submitResult?.success ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-soft text-teal-ink">
                  <CheckCircle size={32} weight="duotone" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-ink">Demo Request Received!</h3>
                <p className="mt-2 text-sm text-body leading-relaxed">
                  {"Thank you! We've received your request for the"}{' '}
                  <strong className="text-ink">
                    {selectedPackage === 'premium' ? 'Premium System' : 'Starter Sprint'}
                  </strong>.
                  Our team will reach out promptly at your provided contact info.
                </p>

                <div className="mt-6 rounded-xl border border-line bg-paper p-4 text-xs text-left">
                  <p className="font-semibold text-ink">Would you like to pick a specific time right now?</p>
                  <p className="text-muted mt-1">
                    You can book directly on our calendar to lock in your preferred 15-minute slot immediately:
                  </p>
                  <a
                    href={CAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('primary', 'sm', 'mt-3 w-full')}
                  >
                    <CalendarCheck size={16} weight="bold" />
                    <span>Open Calendar Scheduling</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={buttonClass('secondary', 'sm', 'mt-4 w-full')}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="border-b border-line pb-4 pr-8">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent font-mono">
                    Free 15-Minute Consultation
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-ink">
                    Book Your Lead Response Demo
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {"We'll show you how the system captures, qualifies, and routes inquiries for your specific trade."}
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5 text-xs">
                  {/* Package Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-ink uppercase tracking-wider mb-1.5">
                      Selected Package
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPackage('starter')}
                        className={cn(
                          'rounded-xl border p-2.5 text-left transition-all',
                          selectedPackage === 'starter'
                            ? 'border-accent bg-accent-soft/40 text-ink shadow-2xs font-semibold'
                            : 'border-line bg-paper text-muted hover:text-ink'
                        )}
                      >
                        <p className="text-xs">Starter Sprint</p>
                        <p className="text-[11px] font-mono text-muted mt-0.5">$1,250 + $297/mo</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPackage('premium')}
                        className={cn(
                          'rounded-xl border p-2.5 text-left transition-all',
                          selectedPackage === 'premium'
                            ? 'border-accent bg-accent-soft/40 text-ink shadow-2xs font-semibold'
                            : 'border-line bg-paper text-muted hover:text-ink'
                        )}
                      >
                        <p className="text-xs flex items-center justify-between">
                          <span>Premium</span>
                          <span className="text-[9px] text-accent uppercase font-bold">Rec.</span>
                        </p>
                        <p className="text-[11px] font-mono text-muted mt-0.5">$2,500 + $397/mo</p>
                      </button>
                    </div>
                  </div>

                  {/* Trade Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-ink uppercase tracking-wider mb-1.5">
                      Your Primary Trade
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['HVAC', 'Plumbing', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTradeSelection(t)}
                          className={cn(
                            'rounded-xl border py-2 text-center text-xs font-medium transition-all',
                            tradeSelection === t
                              ? 'border-teal-ink bg-teal-soft text-teal-ink font-semibold'
                              : 'border-line bg-paper text-muted hover:text-ink'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-ink mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                      />
                      {fieldErrors.contactName && (
                        <p className="text-danger text-[10px] mt-1">{fieldErrors.contactName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-ink mb-1">Business Name *</label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Apex Heating & Air"
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                      />
                      {fieldErrors.businessName && (
                        <p className="text-danger text-[10px] mt-1">{fieldErrors.businessName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-ink mb-1">Phone Number (SMS/Call) *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(214) 555-0192"
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                      />
                      {fieldErrors.phone && (
                        <p className="text-danger text-[10px] mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium text-ink mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@apexairdfw.com"
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent"
                      />
                      {fieldErrors.email && (
                        <p className="text-danger text-[10px] mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-ink mb-1">
                      Notes or Current Inbound Challenges (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Currently missing calls after 5 PM and need better qualification before dispatching."
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={buttonClass('primary', 'md', 'w-full')}
                    >
                      {isPending ? 'Submitting Request...' : 'Confirm Demo Request'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-line/60">
                    <span>Or book directly on calendar:</span>
                    <a
                      href={CAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Direct Cal.com Link</span>
                      <ArrowSquareOut size={12} />
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UsLeadResponseLanding;
