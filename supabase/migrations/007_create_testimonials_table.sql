-- Create testimonials table for dynamic testimonial management
-- Replaces hardcoded testimonials array

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  company TEXT,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  service_provided TEXT,
  project_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_is_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_updated_at_trigger
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view published testimonials
CREATE POLICY "Public can view published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

-- Authenticated users (admins) can manage everything
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for testimonial avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-avatars',
  'testimonial-avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for testimonial avatars
CREATE POLICY "Public can view testimonial avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonial-avatars');

CREATE POLICY "Authenticated users can upload testimonial avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'testimonial-avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update testimonial avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'testimonial-avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete testimonial avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'testimonial-avatars'
    AND auth.role() = 'authenticated'
  );

-- Create view for testimonial statistics
CREATE OR REPLACE VIEW testimonial_stats AS
SELECT
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE is_published = true) as published_count,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count,
  AVG(rating) as average_rating,
  COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_count
FROM testimonials;

-- Grant permissions
GRANT SELECT ON testimonial_stats TO anon, authenticated;

COMMENT ON TABLE testimonials IS 'Client testimonials and reviews';
COMMENT ON COLUMN testimonials.is_featured IS 'Show on homepage/featured sections';
COMMENT ON COLUMN testimonials.is_published IS 'Publicly visible on site';
COMMENT ON COLUMN testimonials.display_order IS 'Order to display (lower = first)';
