-- Add approval workflow for testimonials
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;

-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;

-- Create new INSERT policy that still allows public submissions but tracks via approved field
CREATE POLICY "Anyone can submit testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (approved = false);

-- Update SELECT policy to only show approved testimonials (or allow admins to see all)
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;

CREATE POLICY "Anyone can view approved testimonials" 
ON public.testimonials 
FOR SELECT 
USING (approved = true OR has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update testimonials (for approval workflow)
CREATE POLICY "Admins can update testimonials" 
ON public.testimonials 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete testimonials
CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- For waitlist_signups, the current policies are fine (only admins can SELECT)
-- But let's add a unique constraint to prevent duplicate submissions
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT waitlist_signups_email_unique UNIQUE (email);