import { useState, useEffect } from 'react';
import { Zap, Plus, Edit, Trash2, Eye, EyeOff, Star, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  type HeroContent
} from '../../utils/comprehensiveCmsApi';

export default function AdminHero() {
  const [heroes, setHeroes] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<HeroContent>>({
    title: '',
    subtitle: '',
    description: '',
    cta_primary_text: 'Get Started',
    cta_primary_link: '#contact',
    cta_secondary_text: '',
    cta_secondary_link: '',
    background_image_url: '',
    is_active: false,
    display_order: 0
  });

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      const data = await fetchAllHeroContent();
      setHeroes(data);
    } catch (error) {
      console.error('Error loading hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingHero) {
        await updateHeroContent(editingHero.id, formData);
      } else {
        await createHeroContent(formData);
      }

      await loadHeroes();
      resetForm();
      alert(editingHero ? 'Hero section updated!' : 'Hero section created!');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Failed to save hero section');
    }
  };

  const handleEdit = (hero: HeroContent) => {
    setEditingHero(hero);
    setFormData(hero);
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete hero section "${title}"? This cannot be undone.`)) return;

    try {
      await deleteHeroContent(id);
      await loadHeroes();
      alert('Hero section deleted!');
    } catch (error) {
      console.error('Error deleting hero:', error);
      alert('Failed to delete hero section');
    }
  };

  const handleToggleActive = async (hero: HeroContent) => {
    try {
      // Deactivate all others if activating this one
      if (!hero.is_active) {
        for (const h of heroes) {
          if (h.is_active) {
            await updateHeroContent(h.id, { is_active: false });
          }
        }
      }

      await updateHeroContent(hero.id, { is_active: !hero.is_active });
      await loadHeroes();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      cta_primary_text: 'Get Started',
      cta_primary_link: '#contact',
      cta_secondary_text: '',
      cta_secondary_link: '',
      background_image_url: '',
      is_active: false,
      display_order: 0
    });
    setEditingHero(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading hero sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            Hero Section Management
          </h1>
          <p className="text-slate-400 mt-2">Manage your homepage hero content</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          New Hero Section
        </button>
      </div>

      {/* Hero Sections List or Form */}
      {!showForm ? (
        <div className="space-y-4">
          {heroes.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-slate-800 rounded-lg p-6 border-2 ${
                hero.is_active ? 'border-green-500' : 'border-slate-700'
              } relative`}
            >
              {hero.is_active && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-green-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  ACTIVE
                </div>
              )}

              <div className="mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">{hero.title}</h3>
                {hero.subtitle && <p className="text-lg text-cyan-400 mb-2">{hero.subtitle}</p>}
                {hero.description && <p className="text-slate-400 mb-4">{hero.description}</p>}

                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm">
                    CTA: {hero.cta_primary_text} → {hero.cta_primary_link}
                  </div>
                  {hero.cta_secondary_text && (
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                      CTA 2: {hero.cta_secondary_text}
                    </div>
                  )}
                  <div className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                    Order: {hero.display_order}
                  </div>
                </div>

                {hero.background_image_url && (
                  <div className="mb-4">
                    <img
                      src={hero.background_image_url}
                      alt={hero.title}
                      className="w-full h-32 object-cover rounded border border-slate-700"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(hero)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(hero)}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1 ${
                      hero.is_active
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {hero.is_active ? (
                      <>
                        <Eye className="w-4 h-4" /> Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" /> Inactive
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id, hero.title)}
                    className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {heroes.length === 0 && (
            <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
              <p className="text-slate-400 mb-4">No hero sections yet. Create your first one!</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-semibold"
              >
                Create Hero Section
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Hero Form */
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingHero ? 'Edit Hero Section' : 'New Hero Section'}
            </h2>
            <button onClick={resetForm} className="text-slate-400 hover:text-white text-2xl">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Main Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                required
                placeholder="Welcome to My Portfolio"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                placeholder="Web Developer & Designer"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                placeholder="I build beautiful, responsive websites that help businesses grow..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary CTA Text */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Primary CTA Text *</label>
                <input
                  type="text"
                  value={formData.cta_primary_text}
                  onChange={e => setFormData({ ...formData, cta_primary_text: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  required
                  placeholder="Get Started"
                />
              </div>

              {/* Primary CTA Link */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Primary CTA Link *</label>
                <input
                  type="text"
                  value={formData.cta_primary_link}
                  onChange={e => setFormData({ ...formData, cta_primary_link: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  required
                  placeholder="#contact"
                />
              </div>

              {/* Secondary CTA Text */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Secondary CTA Text</label>
                <input
                  type="text"
                  value={formData.cta_secondary_text}
                  onChange={e => setFormData({ ...formData, cta_secondary_text: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  placeholder="View Projects"
                />
              </div>

              {/* Secondary CTA Link */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Secondary CTA Link</label>
                <input
                  type="text"
                  value={formData.cta_secondary_link}
                  onChange={e => setFormData({ ...formData, cta_secondary_link: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  placeholder="#projects"
                />
              </div>

              {/* Background Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Background Image URL</label>
                <input
                  type="url"
                  value={formData.background_image_url}
                  onChange={e => setFormData({ ...formData, background_image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  min="0"
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-green-500 focus:ring-green-500"
                  />
                  <span className="font-semibold">Set as Active Hero (only one can be active)</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {editingHero ? 'Update Hero Section' : 'Create Hero Section'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
