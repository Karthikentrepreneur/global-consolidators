-- Create table to store per-page SEO metadata
CREATE TABLE public.page_seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Optional index to speed up lookups by page name
CREATE INDEX page_seo_settings_page_name_idx ON public.page_seo_settings (page_name);

-- Enable Row Level Security
ALTER TABLE public.page_seo_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for SEO data
CREATE POLICY "Anyone can read page SEO"
  ON public.page_seo_settings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert records
CREATE POLICY "Authenticated users can insert page SEO"
  ON public.page_seo_settings
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update records
CREATE POLICY "Authenticated users can update page SEO"
  ON public.page_seo_settings
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete records if needed
CREATE POLICY "Authenticated users can delete page SEO"
  ON public.page_seo_settings
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
