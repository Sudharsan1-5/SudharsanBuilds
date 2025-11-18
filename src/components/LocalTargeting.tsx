import { MapPin, Clock, Heart, Users, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LocalTargeting() {
  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Same Timezone',
      description: 'Work during your business hours with instant communication'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Local Market Knowledge',
      description: 'Understanding of Trichy and Tamil Nadu business culture'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Meet in Person',
      description: 'Face-to-face meetings available for Trichy clients'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Support Local',
      description: 'Work with a local developer, support the community'
    }
  ];

  const whoIHelp = [
    'Local Shops & Retail Stores',
    'Freelancers & Consultants',
    'Startups & Small Businesses',
    'Restaurants & Food Services',
    'Service-based Businesses',
    'Educational Institutions'
  ];

  const approach = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Turnaround',
      description: 'Fast delivery without compromising quality'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Affordable Pricing',
      description: 'Transparent pricing designed for local businesses'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Quality Focused',
      description: 'Professional websites that convert visitors to customers'
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="local-services" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-cyan-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Web Development Services in <span className="text-cyan-600">Trichy</span>
            </h2>
          </div>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mt-4">
            I'm a local web developer in <strong>Tiruchirappalli</strong> helping businesses go online
          </p>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-2">
            Professional websites for Trichy businesses at affordable prices
          </p>
        </motion.div>

        {/* Why Choose a Local Developer */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900"
          >
            Why Choose a <span className="text-cyan-600">Local Developer?</span>
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h4>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Who I Help */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900"
          >
            Who I <span className="text-cyan-600">Help</span>
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto border border-slate-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {whoIHelp.map((business, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                  <span className="text-slate-700 font-medium">{business}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* My Approach */}
        <div className="mb-12">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-900"
          >
            My <span className="text-cyan-600">Approach</span>
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {approach.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-white"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-cyan-50">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Local CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 md:p-12 rounded-2xl max-w-3xl mx-auto border-2 border-cyan-200">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Ready to Take Your Trichy Business Online?
            </h3>
            <p className="text-lg text-slate-700 mb-6">
              Get your free website consultation today and start attracting more customers
            </p>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              Get Your Free Consultation
            </button>
            <p className="text-sm text-slate-600 mt-4">
              Serving businesses in Trichy, Tamil Nadu, and across India
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
