import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormData {
  fullName: string;
  businessName: string;
  email: string;
  projectType: string;
  projectDetails: string;
}

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per hour per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// Validate form data server-side
function validateFormData(data: unknown): { valid: boolean; error?: string; data?: FormData } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const formData = data as Record<string, unknown>;
  
  // Validate required fields
  const requiredFields = ['fullName', 'businessName', 'email', 'projectType', 'projectDetails'];
  for (const field of requiredFields) {
    if (typeof formData[field] !== 'string' || !formData[field]) {
      return { valid: false, error: `Missing or invalid field: ${field}` };
    }
  }
  
  // Validate string lengths
  if ((formData.fullName as string).length > 100) {
    return { valid: false, error: 'Full name too long (max 100 characters)' };
  }
  if ((formData.businessName as string).length > 100) {
    return { valid: false, error: 'Business name too long (max 100 characters)' };
  }
  if ((formData.email as string).length > 255) {
    return { valid: false, error: 'Email too long (max 255 characters)' };
  }
  if ((formData.projectDetails as string).length > 2000) {
    return { valid: false, error: 'Project details too long (max 2000 characters)' };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email as string)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return {
    valid: true,
    data: {
      fullName: (formData.fullName as string).trim(),
      businessName: (formData.businessName as string).trim(),
      email: (formData.email as string).trim().toLowerCase(),
      projectType: (formData.projectType as string).trim(),
      projectDetails: (formData.projectDetails as string).trim(),
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    // Check rate limit
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate form data
    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const validation = validateFormData(rawData);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const formData = validation.data;
    console.log('Received form data:', { ...formData, email: '[REDACTED]' });

    // Forward the form data to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString(),
        source: 'december-special-form',
      }),
    });

    if (!response.ok) {
      console.error('n8n webhook error:', response.status);
      return new Response(
        JSON.stringify({ error: 'Failed to submit form' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Form submitted successfully to n8n');
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
