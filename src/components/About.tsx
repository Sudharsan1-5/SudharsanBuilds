import { Code2, Palette, Rocket, Zap } from "lucide-react";
import React from "react";

export default function About() {
  const skills = [
    { icon: <Code2 className="w-6 h-6" />, name: "No-Code Development" },
    { icon: <Rocket className="w-6 h-6" />, name: "SaaS Products" },
    { icon: <Palette className="w-6 h-6" />, name: "E-commerce Solutions" },
    { icon: <Zap className="w-6 h-6" />, name: "Workflow Automation" },
  ];

  return (
    <section id="about" className="py-24 bg-slate-50 text-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            About <span className="text-cyan-600">Me</span>
          </h2>
          <p className="text-slate-600 text-lg">
            A creative developer passionate about transforming ideas into reality.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side (Image or Placeholder) */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              {/* ✅ Replace this with your image */}
              <img
                src="/profile.jpg"
                alt="Sudharsan"
                className="object-cover w-full h-full rounded-2xl"
              />
            </div>
          </div>

          {/* Right Side (Text + Skills) */}
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Hi! I'm a passionate developer specializing in transforming ideas into fully functional
              web applications and SaaS products. With expertise in modern no-code and AI-assisted
              development, I help businesses and entrepreneurs bring their visions to life quickly and
              efficiently.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              My goal is to provide high-quality, production-ready solutions that not only look
              stunning but also deliver exceptional user experiences. Whether you need an e-commerce
              platform, a subscription service, or a custom web application, I’ve got you covered.
            </p>

            {/* Skills */}
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">Core Skills</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="text-cyan-600">{skill.icon}</span>
                    <span className="text-slate-800 font-medium">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
