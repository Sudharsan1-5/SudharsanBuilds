import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit, Save, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchFooterConfig,
  updateFooterConfig,
  addQuickLink,
  removeQuickLink,
  addService,
  removeService,
  type FooterConfig
} from '../../utils/footerApi';

export default function AdminFooter() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<FooterConfig>>({});
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkSection, setNewLinkSection] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  useEffect(() => {
    loadFooterConfig();
  }, []);

  const loadFooterConfig = async () => {
    try {
      setLoading(true);
      const config = await fetchFooterConfig();
      if (config) {
        setFooterConfig(config);
        setFormData(config);
      }
    } catch (error) {
      console.error('Error loading footer config:', error);
      alert('Failed to load footer configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    if (!footerConfig) return;

    setSaving(true);
    try {
      const updated = await updateFooterConfig({
        company_name: formData.company_name,
        about_text: formData.about_text,
        email: formData.email,
        location: formData.location,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        footer_text: formData.footer_text
      });

      if (updated) {
        setFooterConfig(updated);
        setEditMode(false);
        alert('Footer information updated successfully!');
      }
    } catch (error) {
      console.error('Error saving footer config:', error);
      alert('Failed to save footer configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuickLink = async () => {
    if (!newLinkLabel.trim() || !newLinkSection.trim()) {
      alert('Please fill in both label and section ID');
      return;
    }

    try {
      const updated = await addQuickLink(newLinkLabel, newLinkSection);
      if (updated) {
        setFooterConfig(updated);
        setNewLinkLabel('');
        setNewLinkSection('');
        alert('Quick link added successfully!');
      }
    } catch (error) {
      console.error('Error adding quick link:', error);
      alert('Failed to add quick link');
    }
  };

  const handleRemoveQuickLink = async (section_id: string) => {
    if (!confirm('Remove this quick link?')) return;

    try {
      const updated = await removeQuickLink(section_id);
      if (updated) {
        setFooterConfig(updated);
        alert('Quick link removed!');
      }
    } catch (error) {
      console.error('Error removing quick link:', error);
      alert('Failed to remove quick link');
    }
  };

  const handleAddService = async () => {
    if (!newServiceName.trim()) {
      alert('Please enter a service name');
      return;
    }

    try {
      const updated = await addService(newServiceName, newServicePrice);
      if (updated) {
        setFooterConfig(updated);
        setNewServiceName('');
        setNewServicePrice('');
        alert('Service added successfully!');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add service');
    }
  };

  const handleRemoveService = async (serviceName: string) => {
    if (!confirm(`Remove "${serviceName}" service?`)) return;

    try {
      const updated = await removeService(serviceName);
      if (updated) {
        setFooterConfig(updated);
        alert('Service removed!');
      }
    } catch (error) {
      console.error('Error removing service:', error);
      alert('Failed to remove service');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading footer configuration...</p>
        </div>
      </div>
    );
  }

  if (!footerConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">Footer configuration not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-cyan-400" />
            Footer Configuration
          </h1>
          <p className="text-slate-400 mt-2">Manage footer content and social links</p>
        </div>
        {!editMode && (
          <button
            onClick={() => {
              setEditMode(true);
              setFormData(footerConfig);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Edit className="w-5 h-5" />
            Edit Configuration
          </button>
        )}
      </div>

      {/* Basic Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-8 border border-slate-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

        {!editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Company Name</label>
              <p className="text-white font-semibold">{footerConfig.company_name}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Email</label>
              <p className="text-white font-semibold">{footerConfig.email}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">Location</label>
              <p className="text-white font-semibold">{footerConfig.location}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">About Text</label>
              <p className="text-slate-300 whitespace-pre-wrap">{footerConfig.about_text}</p>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1 block">GitHub URL</label>
              <a
                href={footerConfig.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <LinkIcon className="w-4 h-4" />
                Visit Profile
              </a>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">LinkedIn URL</label>
              <a
                href={footerConfig.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <LinkIcon className="w-4 h-4" />
                Visit Profile
              </a>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Twitter URL</label>
              <a
                href={footerConfig.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <LinkIcon className="w-4 h-4" />
                Visit Profile
              </a>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400 mb-1 block">Footer Text</label>
              <p className="text-white">{footerConfig.footer_text}</p>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  About Text
                </label>
                <textarea
                  value={formData.about_text || ''}
                  onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.twitter_url || ''}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={formData.footer_text || ''}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={handleSaveBasicInfo}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 inline mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(footerConfig);
                }}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Quick Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-lg p-8 border border-slate-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>

        {/* Add New Link */}
        <div className="mb-6 p-4 bg-slate-900 rounded-lg">
          <h3 className="text-slate-300 font-semibold mb-3">Add New Quick Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              placeholder="Link Label (e.g., Home)"
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              value={newLinkSection}
              onChange={(e) => setNewLinkSection(e.target.value)}
              placeholder="Section ID (e.g., home)"
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAddQuickLink}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Link
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {footerConfig.quick_links?.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700"
            >
              <div>
                <p className="text-white font-semibold">{link.label}</p>
                <p className="text-slate-400 text-sm">#{link.section_id}</p>
              </div>
              <button
                onClick={() => handleRemoveQuickLink(link.section_id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 rounded-lg p-8 border border-slate-700"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Services</h2>

        {/* Add New Service */}
        <div className="mb-6 p-4 bg-slate-900 rounded-lg">
          <h3 className="text-slate-300 font-semibold mb-3">Add New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Service Name (e.g., Landing Pages)"
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Price (e.g., ₹15,000)"
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Service
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {footerConfig.services?.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700"
            >
              <div>
                <p className="text-white font-semibold">{service.name}</p>
                <p className="text-cyan-400 text-sm">{service.price || 'Custom'}</p>
              </div>
              <button
                onClick={() => handleRemoveService(service.name)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}