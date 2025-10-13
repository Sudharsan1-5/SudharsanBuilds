import { Lightbulb, Hammer, Rocket } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      icon: <Lightbulb className="w-12 h-12" />,
      title: 'Plan',
      description: 'We discuss your vision, goals, and requirements to create a detailed project roadmap.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Hammer className="w-12 h-12" />,
      title: 'Build',
      description: 'I develop your application using modern tools and best practices, keeping you updated throughout.',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: <Rocket className="w-12 h-12" />,
      title: 'Deliver',
      description: 'Your fully tested, production-ready application is deployed and ready to launch.',
      color: 'from-green-400 to-teal-500'
    }
  ];

  return (
    <section id="process" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 text-slate-900">
          How I <span className="text-cyan-600">Work</span>
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center space-y-6 group">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {step.icon}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-bold text-slate-300">{index + 1}</span>
                    <h3 className="text-3xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed px-4">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
