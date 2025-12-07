-- =====================================================
-- FIX RLS POLICIES - CRITICAL SECURITY UPDATE
-- Replace permissive policies with proper authentication
-- =====================================================

-- =====================================================
-- IMPORTANT: This migration fixes a critical security vulnerability
-- Previous policies used USING (true) which allowed ANYONE to access data
-- Now enforcing proper authentication checks
-- =====================================================

-- =====================================================
-- 1. DROP ALL EXISTING PERMISSIVE POLICIES
-- =====================================================

-- Site Settings
DROP POLICY IF EXISTS "Admins can manage all settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

-- Theme Settings
DROP POLICY IF EXISTS "Admins can manage themes" ON theme_settings;

-- Menu Items
DROP POLICY IF EXISTS "Admins can manage menu items" ON menu_items;

-- Content Blocks
DROP POLICY IF EXISTS "Admins can manage content blocks" ON content_blocks;

-- Feature Flags
DROP POLICY IF EXISTS "Admins can manage feature flags" ON feature_flags;

-- Email Templates
DROP POLICY IF EXISTS "Admin full access to email_templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;

-- Email Sequences
DROP POLICY IF EXISTS "Admin full access to email_sequences" ON email_sequences;
DROP POLICY IF EXISTS "Admins can manage email sequences" ON email_sequences;

-- Email Queue
DROP POLICY IF EXISTS "Admin full access to email_queue" ON email_queue;
DROP POLICY IF EXISTS "Admins can manage email queue" ON email_queue;

-- Email Logs
DROP POLICY IF EXISTS "Admin full access to email_logs" ON email_logs;
DROP POLICY IF EXISTS "Admins can manage email logs" ON email_logs;

-- Automated Reminders
DROP POLICY IF EXISTS "Admin full access to automated_reminders" ON automated_reminders;
DROP POLICY IF EXISTS "Admins can manage automated reminders" ON automated_reminders;

-- Notifications
DROP POLICY IF EXISTS "Admin full access to notifications" ON notifications;

-- Activity Log
DROP POLICY IF EXISTS "Admin full access to activity_log" ON activity_log;

-- Funnels
DROP POLICY IF EXISTS "Admin full access to funnels" ON conversion_funnels;
DROP POLICY IF EXISTS "Admin full access to funnel_events" ON funnel_events;

-- Experiments
DROP POLICY IF EXISTS "Admin full access to experiments" ON ab_test_experiments;
DROP POLICY IF EXISTS "Admin full access to ab_events" ON ab_test_events;

-- Performance
DROP POLICY IF EXISTS "Admin full access to performance" ON performance_metrics;

-- Errors
DROP POLICY IF EXISTS "Admin full access to errors" ON error_logs;

-- Media Library
DROP POLICY IF EXISTS "Admins can manage all media" ON media_library;

-- Media Folders
DROP POLICY IF EXISTS "Admins can manage folders" ON media_library_folders;

-- Content Drafts
DROP POLICY IF EXISTS "Admins can delete drafts" ON content_drafts;

-- SEO Metadata
DROP POLICY IF EXISTS "Admins can manage SEO metadata" ON seo_metadata;

-- Page Templates
DROP POLICY IF EXISTS "Admins can manage templates" ON page_templates;

-- Schedule Queue
DROP POLICY IF EXISTS "Admins can manage schedule queue" ON content_schedule_queue;

-- Upload Sessions
DROP POLICY IF EXISTS "Admins can manage upload sessions" ON bulk_upload_sessions;

-- Newsletter
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;

-- Health Checks
DROP POLICY IF EXISTS "Admins can manage health checks" ON health_checks;

-- Backups
DROP POLICY IF EXISTS "Admins can manage backups" ON system_backups;

-- Checklist
DROP POLICY IF EXISTS "Admins can manage checklist" ON production_checklist;

-- Hero Content
DROP POLICY IF EXISTS "Admins can manage hero content" ON hero_content;

-- Contact Info
DROP POLICY IF EXISTS "Admins can manage contact info" ON contact_info;

-- Social Links
DROP POLICY IF EXISTS "Admins can manage social links" ON social_links;

-- SEO Meta (CMS)
DROP POLICY IF EXISTS "Admins can manage seo meta" ON seo_meta;

-- Navigation
DROP POLICY IF EXISTS "Admins can manage navigation" ON navigation_items;

-- Footer
DROP POLICY IF EXISTS "Admins can manage footer" ON footer_sections;
DROP POLICY IF EXISTS "Admins can manage footer links" ON footer_links;

-- Skills
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;

-- Achievements
DROP POLICY IF EXISTS "Admins can manage achievements" ON achievements;

-- Notification Rules
DROP POLICY IF EXISTS "Admin full access to rules" ON notification_rules;

-- Notification Subscriptions
DROP POLICY IF EXISTS "Admin full access to subscriptions" ON notification_subscriptions;

-- =====================================================
-- 2. CREATE SECURE ADMIN POLICIES
-- Only authenticated users can manage admin data
-- =====================================================

-- Helper function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Site Settings
CREATE POLICY "Authenticated users can manage settings"
  ON site_settings FOR ALL
  USING (is_authenticated());

-- Theme Settings
CREATE POLICY "Authenticated users can manage themes"
  ON theme_settings FOR ALL
  USING (is_authenticated());

-- Menu Items
CREATE POLICY "Authenticated users can manage menus"
  ON menu_items FOR ALL
  USING (is_authenticated());

-- Content Blocks
CREATE POLICY "Authenticated users can manage content blocks"
  ON content_blocks FOR ALL
  USING (is_authenticated());

-- Feature Flags
CREATE POLICY "Authenticated users can manage feature flags"
  ON feature_flags FOR ALL
  USING (is_authenticated());

-- Email Templates
CREATE POLICY "Authenticated users can manage email templates"
  ON email_templates FOR ALL
  USING (is_authenticated());

-- Email Sequences
CREATE POLICY "Authenticated users can manage email sequences"
  ON email_sequences FOR ALL
  USING (is_authenticated());

-- Email Sequence Steps
CREATE POLICY "Authenticated users can manage sequence steps"
  ON email_sequence_steps FOR ALL
  USING (is_authenticated());

-- Email Queue
CREATE POLICY "Authenticated users can manage email queue"
  ON email_queue FOR ALL
  USING (is_authenticated());

-- Email Logs
CREATE POLICY "Authenticated users can view email logs"
  ON email_logs FOR SELECT
  USING (is_authenticated());

-- Automated Reminders
CREATE POLICY "Authenticated users can manage reminders"
  ON automated_reminders FOR ALL
  USING (is_authenticated());

-- Notifications
CREATE POLICY "Authenticated users can manage notifications"
  ON notifications FOR ALL
  USING (is_authenticated());

-- Notification Rules
CREATE POLICY "Authenticated users can manage notification rules"
  ON notification_rules FOR ALL
  USING (is_authenticated());

-- Notification Subscriptions
CREATE POLICY "Authenticated users can manage subscriptions"
  ON notification_subscriptions FOR ALL
  USING (is_authenticated());

-- Activity Log
CREATE POLICY "Authenticated users can view activity log"
  ON activity_log FOR SELECT
  USING (is_authenticated());

-- Conversion Funnels
CREATE POLICY "Authenticated users can manage funnels"
  ON conversion_funnels FOR ALL
  USING (is_authenticated());

CREATE POLICY "Authenticated users can view funnel events"
  ON funnel_events FOR SELECT
  USING (is_authenticated());

-- AB Test Experiments
CREATE POLICY "Authenticated users can manage experiments"
  ON ab_test_experiments FOR ALL
  USING (is_authenticated());

CREATE POLICY "Authenticated users can view ab events"
  ON ab_test_events FOR SELECT
  USING (is_authenticated());

-- Performance Metrics
CREATE POLICY "Authenticated users can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (is_authenticated());

-- Error Logs
CREATE POLICY "Authenticated users can view error logs"
  ON error_logs FOR SELECT
  USING (is_authenticated());

-- Media Library
CREATE POLICY "Authenticated users can manage media"
  ON media_library FOR ALL
  USING (is_authenticated());

-- Media Folders
CREATE POLICY "Authenticated users can manage folders"
  ON media_library_folders FOR ALL
  USING (is_authenticated());

-- Content Drafts
CREATE POLICY "Authenticated users can manage drafts"
  ON content_drafts FOR ALL
  USING (is_authenticated());

-- SEO Metadata
CREATE POLICY "Authenticated users can manage SEO"
  ON seo_metadata FOR ALL
  USING (is_authenticated());

-- Page Templates
CREATE POLICY "Authenticated users can manage templates"
  ON page_templates FOR ALL
  USING (is_authenticated());

-- Schedule Queue
CREATE POLICY "Authenticated users can manage schedule"
  ON content_schedule_queue FOR ALL
  USING (is_authenticated());

-- Bulk Upload Sessions
CREATE POLICY "Authenticated users can manage uploads"
  ON bulk_upload_sessions FOR ALL
  USING (is_authenticated());

-- Newsletter Subscribers
CREATE POLICY "Authenticated users can manage subscribers"
  ON newsletter_subscribers FOR ALL
  USING (is_authenticated());

-- Health Checks
CREATE POLICY "Authenticated users can manage health checks"
  ON health_checks FOR ALL
  USING (is_authenticated());

-- System Backups
CREATE POLICY "Authenticated users can manage backups"
  ON system_backups FOR ALL
  USING (is_authenticated());

-- Production Checklist
CREATE POLICY "Authenticated users can manage checklist"
  ON production_checklist FOR ALL
  USING (is_authenticated());

-- Hero Content
CREATE POLICY "Authenticated users can manage hero"
  ON hero_content FOR ALL
  USING (is_authenticated());

-- Contact Info
CREATE POLICY "Authenticated users can manage contact info"
  ON contact_info FOR ALL
  USING (is_authenticated());

-- Social Links
CREATE POLICY "Authenticated users can manage social links"
  ON social_links FOR ALL
  USING (is_authenticated());

-- SEO Meta (CMS)
CREATE POLICY "Authenticated users can manage seo meta"
  ON seo_meta FOR ALL
  USING (is_authenticated());

-- Navigation Items
CREATE POLICY "Authenticated users can manage navigation"
  ON navigation_items FOR ALL
  USING (is_authenticated());

-- Footer Sections
CREATE POLICY "Authenticated users can manage footer"
  ON footer_sections FOR ALL
  USING (is_authenticated());

CREATE POLICY "Authenticated users can manage footer links"
  ON footer_links FOR ALL
  USING (is_authenticated());

-- Skills
CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  USING (is_authenticated());

-- Achievements
CREATE POLICY "Authenticated users can manage achievements"
  ON achievements FOR ALL
  USING (is_authenticated());

-- =====================================================
-- 3. KEEP PUBLIC READ POLICIES FOR FRONTEND
-- =====================================================

-- These tables need public read for frontend display
-- But only authenticated users can modify

-- Theme (Public can view active theme)
CREATE POLICY "Public can read active theme"
  ON theme_settings FOR SELECT
  USING (is_active = true OR is_authenticated());

-- Menu Items (Public can view visible items)
CREATE POLICY "Public can read visible menus"
  ON menu_items FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- Content Blocks (Public can view published)
CREATE POLICY "Public can read published blocks"
  ON content_blocks FOR SELECT
  USING (is_published = true OR is_authenticated());

-- Feature Flags (Public can check features)
CREATE POLICY "Public can read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

-- Media Library (Public can view public media)
CREATE POLICY "Public can view public media"
  ON media_library FOR SELECT
  USING (is_public = true OR is_authenticated());

-- Hero Content (Public can view active)
CREATE POLICY "Public can view active hero"
  ON hero_content FOR SELECT
  USING (is_active = true OR is_authenticated());

-- Contact Info (Public can view visible)
CREATE POLICY "Public can view contact info"
  ON contact_info FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- Social Links (Public can view visible)
CREATE POLICY "Public can view social links"
  ON social_links FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- SEO Meta (Public can view)
CREATE POLICY "Public can view seo meta"
  ON seo_meta FOR SELECT
  USING (true);

-- Navigation (Public can view visible)
CREATE POLICY "Public can view navigation"
  ON navigation_items FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- Footer (Public can view visible)
CREATE POLICY "Public can view footer"
  ON footer_sections FOR SELECT
  USING (is_visible = true OR is_authenticated());

CREATE POLICY "Public can view footer links"
  ON footer_links FOR SELECT
  USING (true);

-- Skills (Public can view visible)
CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- Achievements (Public can view visible)
CREATE POLICY "Public can view achievements"
  ON achievements FOR SELECT
  USING (is_visible = true OR is_authenticated());

-- =====================================================
-- SECURITY NOTES
-- =====================================================

COMMENT ON FUNCTION is_authenticated() IS 'Helper function to check if user is authenticated. Returns true only for logged-in users.';

-- Log this critical security update
INSERT INTO activity_log (action_type, action_data, user_email)
VALUES (
  'security_update',
  '{"type": "rls_policies_fixed", "description": "Replaced permissive USING (true) policies with proper authentication checks"}'::jsonb,
  'system'
)
ON CONFLICT DO NOTHING;
