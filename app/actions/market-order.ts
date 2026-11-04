'use server';

import { after } from 'next/server';
import { z } from 'zod';
import { getMarketConfig } from '@/markets';
import type { MarketId } from '@/markets/types';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { serviceClient } from '@/lib/supabase/service';
import { notifyMarketOrder } from '@/lib/telegram';

const marketOrderSchema = z.object({
  marketId: z.enum(['us', 'ca', 'ht', 'dr']),
  locale: z.string().default('en'),
  plan: z.enum(['presence', 'conversion', 'authority']),
  withVoiceAddon: z.boolean().default(false),
  businessName: z.string().trim().min(2, 'Please enter your business name.'),
  contactName: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number.'),
  preferredContact: z.enum(['sms', 'whatsapp', 'email', 'phone']).default('sms'),
  notes: z.string().trim().max(1000).optional(),
  averageSaleValue: z.number().nullable().optional(),
  confirmed: z.boolean().refine((val) => val === true, {
    message: 'Please confirm your order to reserve your spot.',
  }),
  utmSource: z.string().optional(),
  referrer: z.string().optional(),
});

export type MarketOrderInput = z.infer<typeof marketOrderSchema>;

export interface MarketOrderResult {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  spotReservedDays?: number;
}

export async function submitMarketOrder(data: MarketOrderInput): Promise<MarketOrderResult> {
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
  const tierPrice = config.prices[input.plan];
  const voicePrice = config.prices.voiceAddon;

  const planSetup = tierPrice.setup ?? 0;
  const planMonthly = tierPrice.monthly ?? 0;
  const voiceSetup = input.withVoiceAddon ? (voicePrice.setup ?? 0) : 0;
  const voiceMonthly = input.withVoiceAddon ? (voicePrice.monthly ?? 0) : 0;

  // 50% plan setup + 100% voice add-on upfront
  const oneTimeTotal = Math.round((planSetup * 0.5 + voiceSetup) * 100) / 100;
  const monthlyTotal = Math.round((planMonthly + voiceMonthly) * 100) / 100;

  if (isSupabaseConfigured()) {
    try {
      const supabase = serviceClient();

      const { data: leadRow, error: leadError } = await supabase
        .from('market_leads')
        .insert({
          market_id: input.marketId,
          name: input.contactName,
          business_name: input.businessName,
          email: input.email,
          phone: input.phone,
          channel: 'form',
          tier_interest: `${input.plan}${input.withVoiceAddon ? ' + voice' : ''}`,
          message: `Preferred contact: ${input.preferredContact}. Notes: ${input.notes || 'None'}`,
          source: input.utmSource || input.referrer || 'direct',
          status: 'new',
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

  // Telegram alert sent asynchronously
  after(async () => {
    const planDisplayNames: Record<string, string> = {
      presence: 'Presence',
      conversion: 'Conversion (Recommended)',
      authority: 'Authority',
    };

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
      email: input.email,
      phone: input.phone,
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
