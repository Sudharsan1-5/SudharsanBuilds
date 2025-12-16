import { useEffect, useState } from 'react';
import { Heart, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchFooterConfig, type FooterConfig } from '../utils/footerApi';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterConfig = async () => {
      try {
        const footerData = await fetchFooterConfig();
        if (footerData) {
          setConfig(footerData);
        }
      } catch (error) {
        console.error('Error loading footer config:', error);
        // Fallback to defaults if fetch fails
      } finally {
        setLoading(false);
      }
    };

    loadFooterConfig();
  }, []);

  const scrollToSection = (id: string) => {
    // If not on homepage, navigate first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Optimized timing: 500ms is enough for lazy components to load while feeling responsive
      setTimeout(() => {
        requestAnimationFrame(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }, 500);
    } else {
      // Already on homepage, scroll immediately with requestAnimationFrame for smoothness
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  if (loading || !config) {
    // Return minimal footer while loading
    return (
      <footer className="bg-slate-900 text-slate-300">
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <p className="text-center text-sm">© {currentYear} All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">{config.company_name}</h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              {config.about_text}
            </p>
            <div className="flex gap-3">
              {config.github_url && (
                <a
                  href={config.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {config.linkedin_url && (
                <a
                  href={config.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {config.twitter_url && (
                <a
                  href={config.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {config.quick_links && config.quick_links.length > 0 ? (
                config.quick_links.map((link) => (
                  <li key={link.section_id}>
                    <button
                      onClick={() => scrollToSection(link.section_id)}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No quick links</li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-slate-400">
              {config.services && config.services.length > 0 ? (
                config.services.map((service, idx) => (
                  <li key={idx}>
                    {service.price ? `${service.name} - ${service.price}` : service.name}
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No services</li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400">{config.location}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <a
                  href={`mailto:${config.email}`}
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {config.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center md:text-left text-sm">
              © {currentYear} {config.company_name}. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-sm">
              {config.footer_text} {config.footer_text.includes('❤️') ? '' : <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}