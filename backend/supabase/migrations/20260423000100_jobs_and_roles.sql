-- Add role support for stronger admin authorization
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'candidate'
CHECK (role IN ('candidate', 'admin'));

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@talentscout.com';

-- Shared helper for admin-aware RLS checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Allow admins to inspect candidate data
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all education" ON public.education
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all experience" ON public.experience
  FOR SELECT USING (public.is_admin());

-- Replace signup handler so admin seed email gets admin role automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'admin@talentscout.com' THEN 'admin' ELSE 'candidate' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  employment_type TEXT NOT NULL DEFAULT 'internship'
    CHECK (employment_type IN ('internship', 'full-time', 'part-time', 'contract', 'remote', 'hybrid')),
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  stipend_min NUMERIC,
  stipend_max NUMERIC,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage jobs" ON public.jobs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view published jobs" ON public.jobs
  FOR SELECT USING (
    public.is_admin()
    OR (
      status = 'published'
      AND (deadline IS NULL OR deadline >= now())
    )
  );

-- Job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  cover_letter TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  application_status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (application_status IN ('submitted', 'shortlisted', 'rejected', 'accepted')),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, user_id)
);

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can apply to published jobs" ON public.job_applications
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.jobs j
      WHERE j.id = job_id
        AND j.status = 'published'
        AND (j.deadline IS NULL OR j.deadline >= now())
    )
  );

CREATE POLICY "Users can view own applications and admins can view all" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update application status" ON public.job_applications
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Let admins download/view candidate resumes from private bucket
CREATE POLICY "Admins can view all resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND public.is_admin());
