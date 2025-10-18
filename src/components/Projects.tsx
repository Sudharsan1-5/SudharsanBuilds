import { ExternalLink } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      tech: 'React, Supabase, Stripe',
      description: 'Full-featured online store with payment integration, inventory management, and admin dashboard.',
      image: '/assets/professional photo.jpg', // Update with your actual path
      link: 'https://estorebysudharsan.lovable.app'
    },
    {
      title: 'SaaS Analytics Dashboard',
      tech: 'TypeScript, Charts, API Integration',
      description: 'Real-time analytics platform with subscription management and data visualization.',
      image: '/assets/skillpathai.jpg', // Update with your actual path
      link: 'freelancerassistance.lovable.app'
    },
    {
      title: 'Booking Management System',
      tech: 'React, Calendar API, Notifications',
      description: 'Appointment scheduling system with automated reminders and payment processing.',
      image: '/assets/projects/skillpathai.jpg', // Update with your actual path
      link: 'https://your-booking-system.com'
    },
    {
      title: 'Social Media App',
      tech: 'React, Real-time DB, Authentication',
      description: 'Community platform with user profiles, posts, comments, and real-time interactions.',
      image: '/assets/projects/social-app-screenshot.jpg', // Update with your actual path
      link: 'https://your-social-app.com'
    },
    {
      title: 'Task Management Tool',
      tech: 'React, Drag & Drop, Collaboration',
      description: 'Project management solution with team collaboration and progress tracking features.',
      image: '/assets/projects/task-tool-screenshot.jpg', // Update with your actual path
      link: 'https://sudharsanchatbot.lovable.app'
    },
    {
      title: 'Portfolio Generator',
      tech: 'Dynamic Templates, CMS',
      description: 'Automated portfolio builder that creates beautiful websites from user data.',
      image: '/assets/projects/portfolio-generator-screenshot.jpg', // Update with your actual path
      link: 'https://your-portfolio-generator.com'
    }
  ];

  return (
    <section id="projects" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        {/* Branding remains consistent */}
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          Featured <span className="text-cyan-400">Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              // Card styles: darker background, rounded, shadow, transform on hover
              className="group bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* IMAGE CONTAINER: Full-bleed image with a dark overlay and hover effect */}
              <div className={`h-60 relative overflow-hidden`}>
                <img
                  src={project.image}
                  alt={project.title}
                  // Image styling: full size, cover, slight darkening on load
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Dark, semi-transparent overlay - visible on hover to emphasize the link icon */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  {/* External Link Icon - becomes visible and scales up on hover */}
                  <ExternalLink 
                    className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" 
                    aria-label={`View ${project.title}`}
                  />
                </div>
              </div>

              {/* TEXT CONTENT: Padding, spacing, and hover color for the title */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-cyan-400 text-sm font-medium">{project.tech}</p>
                <p className="text-slate-300 leading-relaxed">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}