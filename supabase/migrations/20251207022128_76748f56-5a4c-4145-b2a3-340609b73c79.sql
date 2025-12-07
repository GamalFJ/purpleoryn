-- Create testimonials table for client recommendations
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view testimonials (public display)
CREATE POLICY "Anyone can view testimonials"
ON public.testimonials
FOR SELECT
USING (true);

-- Anyone can submit a testimonial (auto-publish)
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (true);