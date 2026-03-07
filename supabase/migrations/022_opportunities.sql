-- ── Migration 022: Scholarship / Opportunity Discovery Engine ────────────────

-- Opportunities table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  organization     TEXT        NOT NULL,
  description      TEXT,
  country          TEXT,
  degree_level     TEXT,        -- 'bachelor' | 'masters' | 'phd' | 'any'
  field_of_study   TEXT[],
  eligibility      TEXT,
  funding_type     TEXT,        -- 'full' | 'partial' | 'stipend' | 'other'
  deadline         DATE,
  application_link TEXT,
  opportunity_type TEXT NOT NULL DEFAULT 'scholarship', -- 'scholarship' | 'fellowship' | 'internship'
  is_published     BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  opportunity_id  UUID        NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline      ON public.opportunities(deadline ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_type          ON public.opportunities(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_opportunities_degree        ON public.opportunities(degree_level);
CREATE INDEX IF NOT EXISTS idx_opportunities_country       ON public.opportunities(country);
CREATE INDEX IF NOT EXISTS idx_opportunities_funding       ON public.opportunities(funding_type);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user    ON public.saved_opportunities(user_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.opportunities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Opportunities: anyone can read published ones
CREATE POLICY "opportunities: public read"
  ON public.opportunities FOR SELECT
  USING (is_published = true);

-- Opportunities: admins can insert/update/delete
CREATE POLICY "opportunities: admin insert"
  ON public.opportunities FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "opportunities: admin update"
  ON public.opportunities FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "opportunities: admin delete"
  ON public.opportunities FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Saved opportunities: users manage their own bookmarks
CREATE POLICY "saved_opportunities: owner read"
  ON public.saved_opportunities FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "saved_opportunities: owner insert"
  ON public.saved_opportunities FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_opportunities: owner delete"
  ON public.saved_opportunities FOR DELETE
  USING (user_id = auth.uid());

-- ── Auto-update updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS opportunities_updated_at ON public.opportunities;
CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Seed: sample opportunities ────────────────────────────────────────────────
INSERT INTO public.opportunities (title, organization, description, country, degree_level, field_of_study, eligibility, funding_type, deadline, application_link, opportunity_type) VALUES

('Fulbright Foreign Student Program',
 'U.S. Department of State',
 'The Fulbright Program offers grants for graduate study, advanced research, and teaching in the United States to students and scholars from over 160 countries.',
 'United States',
 'masters',
 ARRAY['any'],
 'Citizens of participating countries outside the U.S. Undergraduate degree required.',
 'full',
 '2025-10-15',
 'https://foreign.fulbrightonline.org/',
 'fellowship'),

('Gates Cambridge Scholarship',
 'Bill & Melinda Gates Foundation',
 'Full-cost scholarships to outstanding applicants from outside the UK to pursue postgraduate study at the University of Cambridge.',
 'United Kingdom',
 'phd',
 ARRAY['any'],
 'Citizens of any country outside the UK. Must be applying to a full-time postgraduate course at Cambridge.',
 'full',
 '2025-10-09',
 'https://www.gatescambridge.org/',
 'scholarship'),

('Chevening Scholarships',
 'UK Foreign, Commonwealth & Development Office',
 'UK government''s global scholarship programme, funded by the Foreign, Commonwealth & Development Office (FCDO) and partner organisations.',
 'United Kingdom',
 'masters',
 ARRAY['any'],
 'Citizens of Chevening-eligible countries with at least 2 years work experience.',
 'full',
 '2025-11-05',
 'https://www.chevening.org/',
 'scholarship'),

('DAAD Scholarships',
 'German Academic Exchange Service',
 'DAAD offers scholarships for international students and researchers to study and conduct research in Germany.',
 'Germany',
 'any',
 ARRAY['any'],
 'International students and researchers. Requirements vary by program.',
 'full',
 '2025-10-31',
 'https://www.daad.de/en/',
 'scholarship'),

('Commonwealth Scholarship',
 'Commonwealth Scholarship Commission',
 'Scholarships for citizens of Commonwealth countries to study in the UK at masters and PhD level.',
 'United Kingdom',
 'masters',
 ARRAY['any'],
 'Citizens of Commonwealth countries. Must have first-class undergraduate degree.',
 'full',
 '2025-12-17',
 'https://cscuk.fcdo.gov.uk/',
 'scholarship'),

('USDA Agricultural Research Fellowship',
 'U.S. Department of Agriculture',
 'Fellowship program supporting graduate students conducting research in agriculture, food science, and natural resources.',
 'United States',
 'phd',
 ARRAY['Agriculture', 'Food Science', 'Natural Resources', 'Environmental Science'],
 'Graduate students enrolled in accredited U.S. universities.',
 'stipend',
 '2025-08-01',
 'https://www.usda.gov/',
 'fellowship'),

('Google Summer of Code',
 'Google',
 'A global program focused on bringing more student developers into open source software development.',
 'Remote',
 'bachelor',
 ARRAY['Computer Science', 'Software Engineering', 'Data Science'],
 'Students 18+ enrolled in higher education. All nationalities welcome.',
 'stipend',
 '2025-04-02',
 'https://summerofcode.withgoogle.com/',
 'internship'),

('African Development Bank Internship',
 'African Development Bank',
 'Internship program offering opportunities in economics, finance, infrastructure, agriculture, and governance.',
 'Côte d''Ivoire',
 'masters',
 ARRAY['Economics', 'Finance', 'Agriculture', 'Engineering', 'Law'],
 'Currently enrolled students and recent graduates from African countries.',
 'stipend',
 '2025-09-30',
 'https://www.afdb.org/',
 'internship'),

('Aga Khan Foundation International Scholarship',
 'Aga Khan Foundation',
 'Provides a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries.',
 'Multiple',
 'masters',
 ARRAY['any'],
 'Students from select developing countries with no other means to fund their education.',
 'partial',
 '2025-03-31',
 'https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme',
 'scholarship'),

('UN Young Professionals Programme',
 'United Nations',
 'Competitive examination to recruit highly qualified professionals at the beginning of their careers into the UN Secretariat.',
 'Multiple',
 'masters',
 ARRAY['International Relations', 'Economics', 'Law', 'Public Administration', 'Finance'],
 'Citizens of UN member states under 32 years with a master''s degree or equivalent.',
 'full',
 '2025-07-31',
 'https://careers.un.org/ypphome',
 'fellowship');
