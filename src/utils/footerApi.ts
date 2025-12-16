import { supabase } from '../services/supabaseClient';

export interface FooterConfig {
  id: string;
  company_name: string;
  about_text: string;
  email: string;
  location: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  quick_links: Array<{ label: string; section_id: string }>;
  services: Array<{ name: string; price: string }>;
  footer_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch footer configuration
export async function fetchFooterConfig(): Promise<FooterConfig | null> {
  try {
    const { data, error } = await supabase
      .from('footer_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching footer config:', error);
    return null;
  }
}

// Update footer configuration
export async function updateFooterConfig(
  footerData: Partial<FooterConfig>
): Promise<FooterConfig | null> {
  try {
    // Get the existing footer config first
    const existing = await fetchFooterConfig();
    if (!existing) throw new Error('Footer config not found');

    const { data, error } = await supabase
      .from('footer_config')
      .update(footerData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating footer config:', error);
    throw error;
  }
}

// Add quick link
export async function addQuickLink(
  label: string,
  section_id: string
): Promise<FooterConfig | null> {
  try {
    const config = await fetchFooterConfig();
    if (!config) throw new Error('Footer config not found');

    const updatedLinks = [
      ...config.quick_links,
      { label, section_id }
    ];

    return updateFooterConfig({ quick_links: updatedLinks });
  } catch (error) {
    console.error('Error adding quick link:', error);
    throw error;
  }
}

// Remove quick link
export async function removeQuickLink(
  section_id: string
): Promise<FooterConfig | null> {
  try {
    const config = await fetchFooterConfig();
    if (!config) throw new Error('Footer config not found');

    const updatedLinks = config.quick_links.filter(
      (link) => link.section_id !== section_id
    );

    return updateFooterConfig({ quick_links: updatedLinks });
  } catch (error) {
    console.error('Error removing quick link:', error);
    throw error;
  }
}

// Add service
export async function addService(
  name: string,
  price: string
): Promise<FooterConfig | null> {
  try {
    const config = await fetchFooterConfig();
    if (!config) throw new Error('Footer config not found');

    const updatedServices = [
      ...config.services,
      { name, price }
    ];

    return updateFooterConfig({ services: updatedServices });
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
}

// Remove service
export async function removeService(
  serviceName: string
): Promise<FooterConfig | null> {
  try {
    const config = await fetchFooterConfig();
    if (!config) throw new Error('Footer config not found');

    const updatedServices = config.services.filter(
      (service) => service.name !== serviceName
    );

    return updateFooterConfig({ services: updatedServices });
  } catch (error) {
    console.error('Error removing service:', error);
    throw error;
  }
}