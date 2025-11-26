import { useState, useEffect } from 'react';
import { Settings, Globe, Mail, Link as LinkIcon, Code, Star, Layout, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchSiteSettings,
  updateSetting,
  fetchAllContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  fetchAllSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  fetchAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  fetchAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  type SiteSetting,
  type ContactInfo,
  type SocialLink,
  type Skill,
  type Achievement
} from '../../utils/comprehensiveCmsApi';

type TabType = 'general' | 'contact' | 'social' | 'skills' | 'achievements';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);

  // Site Settings
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // Contact Info
  const [contacts, setContacts] = useState<ContactInfo[]>([]);

  // Social Links
  const [socials, setSocials] = useState<SocialLink[]>([]);

  // Skills
  const [skills, setSkills] = useState<Skill[]>([]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, contactsData, socialsData, skillsData, achievementsData] = await Promise.all([
        fetchSiteSettings(),
        fetchAllContactInfo(),
        fetchAllSocialLinks(),
        fetchAllSkills(),
        fetchAllAchievements()
      ]);

      setSettings(settingsData);
      setContacts(contactsData);
      setSocials(socialsData);
      setSkills(skillsData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
    setSettingsChanged(true);
  };

  const handleSaveSettings = async () => {
    try {
      for (const setting of settings) {
        await updateSetting(setting.setting_key, setting.setting_value);
      }
      setSettingsChanged(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const tabs = [
    { id: 'general' as TabType, label: 'General', icon: Settings },
    { id: 'contact' as TabType, label: 'Contact Info', icon: Mail },
    { id: 'social' as TabType, label: 'Social Links', icon: LinkIcon },
    { id: 'skills' as TabType, label: 'Skills', icon: Code },
    { id: 'achievements' as TabType, label: 'Achievements', icon: Star }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-cyan-400" />
          Site Settings
        </h1>
        <p className="text-slate-400 mt-2">Manage your site configuration and content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>

            {settings.map(setting => (
              <div key={setting.id}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                {setting.description && (
                  <p className="text-xs text-slate-500 mb-2">{setting.description}</p>
                )}
                <input
                  type={setting.setting_type === 'number' ? 'number' : setting.setting_type === 'email' ? 'email' : 'text'}
                  value={setting.setting_value}
                  onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
            ))}

            {settingsChanged && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    loadData();
                    setSettingsChanged(false);
                  }}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contact Info */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Contact Information</h2>
              <button
                onClick={async () => {
                  const label = prompt('Contact label (e.g., Email):');
                  const value = prompt('Contact value:');
                  if (label && value) {
                    await createContactInfo({ label, value, is_visible: true, display_order: contacts.length });
                    loadData();
                  }
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
              >
                Add Contact
              </button>
            </div>

            {contacts.map(contact => (
              <div key={contact.id} className="bg-slate-900 p-4 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-semibold">{contact.label}</p>
                  <p className="text-slate-400 text-sm">{contact.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{contact.info_type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await updateContactInfo(contact.id, { is_visible: !contact.is_visible });
                      loadData();
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      contact.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {contact.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this contact?')) {
                        await deleteContactInfo(contact.id);
                        loadData();
                      }
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Social Media Links</h2>
              <button
                onClick={async () => {
                  const platform = prompt('Platform (e.g., github):');
                  const url = prompt('URL:');
                  if (platform && url) {
                    await createSocialLink({ platform, url, is_visible: true, display_order: socials.length });
                    loadData();
                  }
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
              >
                Add Social Link
              </button>
            </div>

            {socials.map(social => (
              <div key={social.id} className="bg-slate-900 p-4 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white font-semibold">{social.platform}</p>
                  <p className="text-slate-400 text-sm">{social.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await updateSocialLink(social.id, { is_visible: !social.is_visible });
                      loadData();
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      social.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {social.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Delete this link?')) {
                        await deleteSocialLink(social.id);
                        loadData();
                      }
                    }}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Skills & Technologies</h2>
              <button
                onClick={async () => {
                  const name = prompt('Skill name (e.g., React):');
                  const category = prompt('Category (e.g., frontend):');
                  if (name && category) {
                    await createSkill({ name, category, proficiency: 80, is_visible: true, is_featured: false, display_order: skills.length });
                    loadData();
                  }
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
              >
                Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="bg-slate-900 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{skill.name}</p>
                    <span className="text-cyan-400 text-sm">{skill.proficiency}%</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-2">{skill.category}</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        await updateSkill(skill.id, { is_featured: !skill.is_featured });
                        loadData();
                      }}
                      className={`px-2 py-1 rounded text-xs ${
                        skill.is_featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {skill.is_featured ? 'Featured' : 'Not Featured'}
                    </button>
                    <button
                      onClick={async () => {
                        await updateSkill(skill.id, { is_visible: !skill.is_visible });
                        loadData();
                      }}
                      className={`px-2 py-1 rounded text-xs ${
                        skill.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {skill.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this skill?')) {
                          await deleteSkill(skill.id);
                          loadData();
                        }
                      }}
                      className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Achievements & Stats</h2>
              <button
                onClick={async () => {
                  const label = prompt('Achievement label (e.g., Projects Completed):');
                  const value = prompt('Value (e.g., 50+):');
                  if (label && value) {
                    await createAchievement({ label, value, is_visible: true, display_order: achievements.length });
                    loadData();
                  }
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
              >
                Add Achievement
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="bg-slate-900 p-6 rounded-lg text-center">
                  <p className="text-4xl font-bold text-cyan-400 mb-2">{achievement.value}</p>
                  <p className="text-white font-semibold mb-2">{achievement.label}</p>
                  {achievement.description && (
                    <p className="text-slate-400 text-sm mb-3">{achievement.description}</p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={async () => {
                        await updateAchievement(achievement.id, { is_visible: !achievement.is_visible });
                        loadData();
                      }}
                      className={`px-3 py-1 rounded text-xs ${
                        achievement.is_visible ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {achievement.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this achievement?')) {
                          await deleteAchievement(achievement.id);
                          loadData();
                        }
                      }}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
