'use server';

import { after } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { getMarketConfig } from '@/markets';
import type { MarketId } from '@/markets/types';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { serviceClient } from '@/lib/supabase/service';
import { notifyMarketOrder, notifyUsWebsiteLead } from '@/lib/telegram';
import { checkRateLimit, normalizeEmail, normalizePhone } from '@/lib/lead-validation';

const marketOrderSchema = z.object({
  marketId: z.enum(['us', 'ca', 'ht', 'dr']),
  locale: z.string().default('en'),
  plan: z.enum(['presence', 'conversion', 'authority', 'starter', 'premium']),
  withVoiceAddon: z.boolean().default(false),
  businessName: z.string().trim().min(2, 'Please enter your business name.'),
  contactName: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  website: z.string().trim().max(300).optional(),
  preferredContact: z.enum(['sms', 'whatsapp', 'email', 'phone']).default('sms'),
  trade: z.string().optional(),
  notes: z.string().trim().max(1000).optional(),
  averageSaleValue: z.number().nullable().optional(),
  confirmed: z.boolean().refine((val) => val === true, {
    message: 'Please confirm your request.',
  }),
  utmSource: z.string().optional(),
  referrer: z.string().optional(),
  // Honeypot field for bot spam prevention: should always be empty
  hp_field: z.string().max(200).optional(),
});

export type MarketOrderInput = z.infer<typeof marketOrderSchema>;

export interface MarketOrderResult {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  spotReservedDays?: number;
}

export async function submitMarketOrder(data: MarketOrderInput): Promise<MarketOrderResult> {
  // 1. Silent spam honeypot check: If bot filled the honeypot, fake success without saving
  if (data.hp_field && data.hp_field.trim().length > 0) {
    return {
      success: true,
      spotReservedDays: 7,
      message: 'Your onboarding spot has been reserved for 7 calendar days.',
    };
  }

  // 2. Rate limiting check per client IP
  try {
    const headerList = await headers();
    const forwarded = headerList.get('x-forwarded-for');
    const realIp = headerList.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

    const rateLimit = checkRateLimit(ip, 5, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return {
        success: false,
        message: 'Too many submissions. Please wait a few minutes before submitting again.',
      };
    }
  } catch (err) {
    // If headers() is unavailable in certain test environments, proceed safely
    console.warn('[market-order] rate limit header lookup skipped:', err);
  }

  // 3. Schema validation
  const parsed = marketOrderSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: 'Please correct the fields above.',
      fieldErrors,
    };
  }

  const input = parsed.data;
  const config = await getMarketConfig(input.marketId as MarketId);
  const tierPrice =
    input.plan === 'starter'
      ? config.prices.starter
      : input.plan === 'premium'
      ? config.prices.premium
      : input.plan === 'conversion'
      ? config.prices.conversion
      : input.plan === 'authority'
      ? config.prices.authority
      : config.prices.presence;
  const voicePrice = config.prices.voiceAddon;

  const planSetup = tierPrice?.setup ?? 0;
  const planDeposit = tierPrice?.deposit ?? Math.round(planSetup * 0.5 * 100) / 100;
  const planMonthly = tierPrice?.monthly ?? 0;
  const voiceSetup = input.withVoiceAddon ? (voicePrice?.setup ?? 0) : 0;
  const voiceMonthly = input.withVoiceAddon ? (voicePrice?.monthly ?? 0) : 0;

  // Deposit for plan + 100% voice add-on upfront
  const oneTimeTotal = Math.round((planDeposit + voiceSetup) * 100) / 100;
  const monthlyTotal = Math.round((planMonthly + voiceMonthly) * 100) / 100;

  // 4. Input Normalization
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedPhone = normalizePhone(input.phone);
  const leadSource =
    input.marketId === 'us'
      ? input.utmSource
        ? `US_WEBSITE [utm: ${input.utmSource}]`
        : 'US_WEBSITE'
      : input.utmSource || input.referrer || 'direct';

  if (isSupabaseConfigured()) {
    try {
      const supabase = serviceClient();

      const { data: leadRow, error: leadError } = await supabase
        .from('market_leads')
        .insert({
          market_id: input.marketId,
          name: input.contactName,
          business_name: input.businessName,
          email: normalizedEmail,
          phone: normalizedPhone,
          website: input.website || null,
          service_category: input.trade || (input.marketId === 'us' ? 'HVAC/Plumbing' : 'General'),
          notes: input.notes || null,
          channel: 'form',
          tier_interest: `${input.plan}${input.withVoiceAddon ? ' + voice' : ''}`,
          message: `${input.trade ? `[Trade: ${input.trade}] ` : ''}Preferred contact: ${input.preferredContact}. Notes: ${input.notes || 'None'}`,
          source: leadSource,
          status: 'new',
          last_activity_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (leadError) {
        console.error('[market-order] lead insert failed:', leadError.message);
      }

      const { error: orderError } = await supabase.from('orders').insert({
        lead_id: leadRow?.id ?? null,
        market_id: input.marketId,
        tier_key: input.plan,
        addon: input.withVoiceAddon ? 'voice' : null,
        one_time_price: oneTimeTotal,
        monthly_price: monthlyTotal,
        currency: config.prices.currency,
        payment_status: 'pending_first_payment',
      });

      if (orderError) {
        console.error('[market-order] order insert failed:', orderError.message);
      }
    } catch (err) {
      console.error('[market-order] Supabase operation exception:', err);
    }
  }

  // 5. Telegram alerts sent asynchronously
  after(async () => {
    const planDisplayNames: Record<string, string> = {
      starter: 'Starter Sprint ($1,250)',
      premium: 'Premium System ($2,500)',
      presence: 'Presence',
      conversion: 'Conversion (Recommended)',
      authority: 'Authority',
    };

    // Specific alert for US website leads
    if (input.marketId === 'us') {
      await notifyUsWebsiteLead({
        contactName: input.contactName,
        businessName: input.businessName,
        phone: normalizedPhone,
        email: normalizedEmail,
        trade: input.trade,
        plan: planDisplayNames[input.plan] || input.plan,
        withVoiceAddon: input.withVoiceAddon,
        notes: input.notes,
        source: leadSource,
      });
    }

    // Retain existing multi-market order alert
    await notifyMarketOrder({
      marketId: input.marketId,
      host: config.host,
      planName: planDisplayNames[input.plan] || input.plan,
      withVoiceAddon: input.withVoiceAddon,
      currency: config.prices.currencySymbol,
      oneTimeTotal,
      monthlyTotal,
      businessName: input.businessName,
      contactName: input.contactName,
      email: normalizedEmail,
      phone: normalizedPhone,
      preferredContact: input.preferredContact,
      notes: input.notes,
      averageSaleValue: input.averageSaleValue,
      utmSource: input.utmSource,
    });
  });

  return {
    success: true,
    spotReservedDays: 7,
    message: 'Your onboarding spot has been reserved for 7 calendar days.',
  };
}
