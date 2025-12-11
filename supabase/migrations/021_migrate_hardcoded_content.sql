-- =====================================================
-- MIGRATE HARDCODED CONTENT TO DATABASE
-- Populates database with existing website content
-- =====================================================

-- =====================================================
-- 1. PROJECTS DATA
-- =====================================================

-- Insert Manoj Kumar Portfolio
INSERT INTO projects (
  id, title, description, link, type, status, role, start_date, end_date,
  is_published, client_name, github_url, case_study_url, created_at
) VALUES (
  'manoj-kumar-portfolio',
  'Finance & Business Analytics Professional Portfolio',
  'Professional portfolio website for an MBA graduate specializing in Finance and Business Analytics. Showcases technical skills in Power BI, Tableau, SQL, and Python, along with academic projects. Also includes an ATS-friendly resume designed to pass through recruitment systems and stand out to hiring managers.',
  'https://manoj-rho-navy.vercel.app/',
  'personal',
  'completed',
  'Full-stack Developer',
  '2024-08-01',
  '2024-09-10',
  true,
  'Manoj Kumar S',
  NULL,
  NULL,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Tech stack for Manoj Kumar
INSERT INTO project_tech_stack (project_id, technology_name, display_order) VALUES
  ('manoj-kumar-portfolio', 'React', 1),
  ('manoj-kumar-portfolio', 'Next.js', 2),
  ('manoj-kumar-portfolio', 'Tailwind CSS', 3),
  ('manoj-kumar-portfolio', 'Responsive Design', 4)
ON CONFLICT DO NOTHING;

-- Screenshots
INSERT INTO project_screenshots (project_id, image_url, display_order) VALUES
  ('manoj-kumar-portfolio', '/images/projects/manoj-kumar/WhatsApp Image 2025-11-17 at 09.02.06_cc9aaa21.jpg', 1),
  ('manoj-kumar-portfolio', '/images/projects/manoj-kumar/WhatsApp Image 2025-11-20 at 18.46.50_099a0e8c.jpg', 2)
ON CONFLICT DO NOTHING;

-- Key Achievements
INSERT INTO project_key_achievements (project_id, achievement, display_order) VALUES
  ('manoj-kumar-portfolio', 'Professional portfolio increases visibility among recruiters and hiring managers', 1),
  ('manoj-kumar-portfolio', 'ATS-optimized resume ensures applications pass through recruitment screening systems', 2),
  ('manoj-kumar-portfolio', 'Clear presentation of technical skills (Power BI, Tableau, SQL, Python) attracts relevant opportunities', 3),
  ('manoj-kumar-portfolio', 'Organized layout makes it easy for recruiters to find key qualifications', 4),
  ('manoj-kumar-portfolio', 'Mobile-responsive design accessible on all devices', 5)
ON CONFLICT DO NOTHING;

-- Client Testimonial
INSERT INTO project_testimonials (project_id, testimonial_text, client_name, client_role) VALUES
  ('manoj-kumar-portfolio',
   'Sudharsan built a clean, professional portfolio that effectively showcases my analytics skills and MBA background. Combined with the ATS-friendly resume he created, I''ve been receiving consistent recruiter inquiries and interview opportunities from companies in my target list.',
   'Manoj Kumar S',
   'MBA Graduate, Finance & Business Analytics')
ON CONFLICT DO NOTHING;

-- Insert Bharath Kumar Portfolio
INSERT INTO projects (
  id, title, description, link, type, status, role, start_date, end_date,
  is_published, client_name, created_at
) VALUES (
  'bharath-kumar-marketing-portfolio',
  'Marketing & Sales Executive Professional Portfolio',
  'Professional portfolio website for a Marketing and Sales Executive seeking opportunities to leverage digital marketing expertise, sales management, and business development skills. Showcases professional experience, marketing campaigns, sales achievements, and career vision with clear call-to-actions for recruiters and business partners.',
  'https://bharathkumar-henna.vercel.app/',
  'personal',
  'completed',
  'Full-stack Developer',
  '2024-08-05',
  '2024-09-05',
  true,
  'Bharath Kumar S',
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_tech_stack (project_id, technology_name, display_order) VALUES
  ('bharath-kumar-marketing-portfolio', 'React', 1),
  ('bharath-kumar-marketing-portfolio', 'Next.js', 2),
  ('bharath-kumar-marketing-portfolio', 'Tailwind CSS', 3),
  ('bharath-kumar-marketing-portfolio', 'Responsive Design', 4)
ON CONFLICT DO NOTHING;

INSERT INTO project_key_achievements (project_id, achievement, display_order) VALUES
  ('bharath-kumar-marketing-portfolio', 'Professional portfolio effectively showcases digital marketing and sales expertise', 1),
  ('bharath-kumar-marketing-portfolio', 'Clear career vision and goals resonate with hiring managers', 2),
  ('bharath-kumar-marketing-portfolio', 'Organized presentation of professional experience and achievements', 3),
  ('bharath-kumar-marketing-portfolio', 'Mobile-responsive design ensures accessibility across all devices', 4),
  ('bharath-kumar-marketing-portfolio', 'Portfolio attracts inquiries from marketing and sales-focused companies', 5),
  ('bharath-kumar-marketing-portfolio', 'Professional credibility elevated through polished online presence', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_testimonials (project_id, testimonial_text, client_name, client_role) VALUES
  ('bharath-kumar-marketing-portfolio',
   'My marketing and sales background deserved a portfolio that would stand out, and that''s exactly what I got. The professional design by Sudharsan perfectly highlights my digital marketing expertise, sales achievements, and career aspirations. Recruiters now have a comprehensive view of my experience and strengths. The clean layout makes it easy for potential employers to understand my value proposition.',
   'Bharath Kumar S',
   'Marketing & Sales Executive')
ON CONFLICT DO NOTHING;

-- Insert Vembarasi Nurse Portfolio
INSERT INTO projects (
  id, title, description, link, type, status, role, start_date, end_date,
  is_published, client_name, created_at
) VALUES (
  'vembarasi-nurse-portfolio',
  'Professional Nurse Portfolio - Germany Job Search',
  'Professional portfolio website for an experienced nurse seeking employment opportunities in Germany. Showcases nursing qualifications, experience, certifications, and professional achievements with a downloadable resume optimized for international healthcare recruitment standards.',
  'https://vembarasi.vercel.app',
  'personal',
  'completed',
  'Full-stack Developer',
  '2024-07-01',
  '2024-08-15',
  true,
  'Vembarasi K',
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_tech_stack (project_id, technology_name, display_order) VALUES
  ('vembarasi-nurse-portfolio', 'React', 1),
  ('vembarasi-nurse-portfolio', 'Next.js', 2),
  ('vembarasi-nurse-portfolio', 'Tailwind CSS', 3),
  ('vembarasi-nurse-portfolio', 'Framer Motion', 4),
  ('vembarasi-nurse-portfolio', 'PDF Download Feature', 5),
  ('vembarasi-nurse-portfolio', 'Responsive Design', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_key_achievements (project_id, achievement, display_order) VALUES
  ('vembarasi-nurse-portfolio', 'Professional portfolio showcases nursing certifications and international experience', 1),
  ('vembarasi-nurse-portfolio', 'One-click resume download feature allows recruiters instant access to qualifications', 2),
  ('vembarasi-nurse-portfolio', 'Optimized for international healthcare recruitment standards (Germany-focused)', 3),
  ('vembarasi-nurse-portfolio', 'Clean, professional design builds credibility with international employers', 4),
  ('vembarasi-nurse-portfolio', 'Mobile-responsive layout accessible on all devices for global reach', 5),
  ('vembarasi-nurse-portfolio', 'Increased visibility among German healthcare recruitment agencies', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_testimonials (project_id, testimonial_text, client_name, client_role) VALUES
  ('vembarasi-nurse-portfolio',
   'Sudharsan created a professional portfolio that perfectly highlights my nursing experience and qualifications for international positions. The one-click downloadable resume feature is convenient for recruiters, and the polished design helped me get noticed by German healthcare employers. It''s been instrumental in my job search abroad.',
   'Vembarasi K',
   'Registered Nurse, Healthcare Professional')
ON CONFLICT DO NOTHING;

-- Insert RSK Enterprises
INSERT INTO projects (
  id, title, description, link, type, status, role, start_date, end_date,
  is_published, client_name, created_at
) VALUES (
  'rsk-enterprises-sevai',
  'e-Sevai Maiyam Website - Government Services Portal',
  'Professional website for RSK Enterprises, an e-Sevai Maiyam service center in Trichy offering Aadhaar, PAN, certificates, bill payments, and printing services. Features Google Maps integration for location discovery, YouTube channel integration, comprehensive service documentation, dynamic shop status display, and detailed working hours to reduce customer inquiries.',
  'https://rsk-enterprises.vercel.app',
  'client',
  'completed',
  'Full-stack Developer',
  '2024-07-15',
  '2024-08-20',
  true,
  'RSK Enterprises',
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_tech_stack (project_id, technology_name, display_order) VALUES
  ('rsk-enterprises-sevai', 'React', 1),
  ('rsk-enterprises-sevai', 'Next.js', 2),
  ('rsk-enterprises-sevai', 'Tailwind CSS', 3),
  ('rsk-enterprises-sevai', 'Google Maps API', 4),
  ('rsk-enterprises-sevai', 'YouTube Integration', 5),
  ('rsk-enterprises-sevai', 'Dynamic Status System', 6),
  ('rsk-enterprises-sevai', 'Responsive Design', 7)
ON CONFLICT DO NOTHING;

INSERT INTO project_screenshots (project_id, image_url, display_order) VALUES
  ('rsk-enterprises-sevai', '/images/projects/rsk-enterprises/homepage.svg', 1),
  ('rsk-enterprises-sevai', '/images/projects/rsk-enterprises/services.svg', 2),
  ('rsk-enterprises-sevai', '/images/projects/rsk-enterprises/contact.svg', 3),
  ('rsk-enterprises-sevai', '/images/projects/rsk-enterprises/about.svg', 4)
ON CONFLICT DO NOTHING;

INSERT INTO project_key_achievements (project_id, achievement, display_order) VALUES
  ('rsk-enterprises-sevai', 'Reduced repetitive customer inquiries by 70% through self-service documentation', 1),
  ('rsk-enterprises-sevai', 'Google Maps integration increased foot traffic from local searches', 2),
  ('rsk-enterprises-sevai', 'Dynamic open/closed status automatically updates based on working hours', 3),
  ('rsk-enterprises-sevai', 'YouTube channel integration increased subscriber engagement', 4),
  ('rsk-enterprises-sevai', 'Comprehensive service details (Aadhaar, PAN, Certificates) available 24/7', 5),
  ('rsk-enterprises-sevai', 'Customers save time by knowing exact documents needed before visiting', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_testimonials (project_id, testimonial_text, client_name, client_role) VALUES
  ('rsk-enterprises-sevai',
   'Sudharsan built an excellent website that has transformed how we handle customer inquiries. The document requirements section and working hours display have reduced our phone calls significantly. Customers appreciate knowing exactly what documents they need and when we''re open. The Google Maps and YouTube integration were great additions!',
   'RSK Enterprises Owner',
   'e-Sevai Maiyam Service Center, Trichy')
ON CONFLICT DO NOTHING;

-- Insert PSquare Menswear
INSERT INTO projects (
  id, title, description, link, type, status, role, start_date, end_date,
  is_published, client_name, created_at
) VALUES (
  'psquare-menswear',
  'PSquare Menswear - Premium E-Commerce Platform',
  'Full-featured e-commerce platform for a premium menswear brand featuring Razorpay and PayPal payment integration, real-time inventory management, dynamic product catalog, shopping cart with session persistence, order tracking system, and comprehensive admin dashboard for managing products, orders, and customers.',
  'https://psquaremenswear.vercel.app',
  'client',
  'completed',
  'Full-stack Developer',
  '2024-09-15',
  '2024-11-20',
  true,
  'Prasanth Kumar',
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO project_tech_stack (project_id, technology_name, display_order) VALUES
  ('psquare-menswear', 'React', 1),
  ('psquare-menswear', 'TypeScript', 2),
  ('psquare-menswear', 'Supabase', 3),
  ('psquare-menswear', 'Razorpay', 4),
  ('psquare-menswear', 'PayPal', 5),
  ('psquare-menswear', 'Tailwind CSS', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_key_achievements (project_id, achievement, display_order) VALUES
  ('psquare-menswear', 'Dual payment gateway integration (Razorpay + PayPal) increases conversion by 40%', 1),
  ('psquare-menswear', 'Real-time inventory management prevents overselling and stockouts', 2),
  ('psquare-menswear', 'Admin dashboard streamlines order fulfillment and reduces processing time by 60%', 3),
  ('psquare-menswear', 'Mobile-responsive design ensures seamless shopping on all devices', 4),
  ('psquare-menswear', 'Shopping cart persistence improves checkout completion rate', 5),
  ('psquare-menswear', 'Order tracking system reduces customer support inquiries by 50%', 6)
ON CONFLICT DO NOTHING;

INSERT INTO project_testimonials (project_id, testimonial_text, client_name, client_role) VALUES
  ('psquare-menswear',
   'Sudharsan delivered an exceptional e-commerce platform that exceeded our expectations. The dual payment integration (Razorpay and PayPal) gives our customers flexibility, and the admin dashboard makes managing our inventory effortless. Since launching, we''ve seen a significant increase in online orders and customer satisfaction. The platform is fast, reliable, and exactly what we needed.',
   'Prasanth Kumar',
   'Founder, PSquare Menswear')
ON CONFLICT DO NOTHING;

-- Log migration
INSERT INTO activity_log (action_type, action_data, user_email)
VALUES (
  'data_migration',
  '{"type": "hardcoded_content_migration", "description": "Migrated 5 projects from hardcoded data to database"}'::jsonb,
  'system'
) ON CONFLICT DO NOTHING;
