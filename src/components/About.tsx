import { Code2, Palette, Rocket, Zap } from 'lucide-react';
import { motion } from 'framer-motion'; // add this import for animations

export default function About() {
  const skills = [
    { icon: <Code2 className="w-6 h-6" />, name: 'No-Code Development' },
    { icon: <Rocket className="w-6 h-6" />, name: 'SaaS Products' },
    { icon: <Palette className="w-6 h-6" />, name: 'E-commerce Solutions' },
    { icon: <Zap className="w-6 h-6" />, name: 'Workflow Automation' },
  ];

  return (
    <section id="about" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-slate-900">
            About <span className="text-cyan-600">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* ---------- PROFILE IMAGE WITH ANIMATION ---------- */}
            <div className="space-y-6 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.08, rotateY: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative aspect-square w-72 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center"
              >
                {/* Glowing animated ring (optional aesthetic effect) */}
                <div className="absolute inset-0 animate-spin-slow rounded-2xl border-4 border-cyan-300 opacity-20"></div>

                {/* Profile Image */}
                <img
                  src="/profile.jpg" // replace this with your own image or hosted URL
                  alt="Sudharsan"
                  className="w-full h-full object-cover rounded-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-2"
                />

                {/* Subtle gradient overlay for 3D depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
            </div>
            {/* --------------------------------------------------- */}

            {/* ---------- ABOUT TEXT SECTION ---------- */}
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Hi! I'm a passionate developer specializing in transforming ideas into fully functional web applications and SaaS products. 
                With expertise in modern no-code and AI-assisted development, I help businesses and entrepreneurs bring their visions to life quickly and efficiently.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                My goal is to provide high-quality, production-ready solutions that not only look stunning but also deliver exceptional user experiences. 
                Whether you need an e-commerce platform, a subscription service, or a custom web application, I've got you covered.
              </p>

              <div className="pt-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Core Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                    >
                      <div className="text-cyan-600">{skill.icon}</div>
                      <span className="text-slate-800 font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ----------------------------------------- */}
          </div>
        </div>
      </div>
    </section>
  );
}
