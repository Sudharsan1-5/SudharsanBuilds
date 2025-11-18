import { Globe, Building2, ShoppingCart, Code2, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
  icon: React.ReactNode;
  name: string;
  price: string;
  priceSubtext?: string;
  description: string;
  features: string[];
  timeline: string;
  ctaText: string;
  ctaAction: 'book' | 'quote';
  depositAmount?: string;
  popular?: boolean;
}

export default function Services() {
  const services: Service[] = [
    {
      icon: <Globe className="w-8 h-8 md:w-10 md:h-10" />,
      name: 'Landing Page',
      price: '₹15,000',
      description: '1-2 page website, modern design, mobile responsive, SEO optimized',
      features: [
        'Responsive Design',
        'Contact Form Integration',
        'Google Analytics Setup',
        'SSL Certificate',
        'Fast Loading Speed',
        'Basic SEO Optimization'
      ],
      timeline: '1-2 weeks',
      ctaText: 'Book Now - Pay ₹5,000 Deposit',
      ctaAction: 'book',
      depositAmount: '5000',
    },
    {
      icon: <Building2 className="w-8 h-8 md:w-10 md:h-10" />,
      name: 'Business Website',
      price: '₹30,000',
      description: '5-10 pages, professional design, CMS integration, blog',
      features: [
        'Multi-page Layout (5-10 pages)',
        'CMS Integration (Easy Updates)',
        'Blog Section',
        'Advanced Analytics',
        'SEO Optimization',
        'Contact Forms & Maps'
      ],
      timeline: '3-4 weeks',
      ctaText: 'Book Now - Pay ₹10,000 Deposit',
      ctaAction: 'book',
      depositAmount: '10000',
      popular: true,
    },
    {
      icon: <ShoppingCart className="w-8 h-8 md:w-10 md:h-10" />,
      name: 'E-Commerce Store',
      price: '₹50,000',
      description: 'Complete online store, payment integration, inventory management',
      features: [
        'Product Catalog',
        'Shopping Cart',
        'Razorpay/PayPal Integration',
        'Inventory Management',
        'Order Tracking',
        'Admin Dashboard'
      ],
      timeline: '4-6 weeks',
      ctaText: 'Book Now - Pay ₹15,000 Deposit',
      ctaAction: 'book',
      depositAmount: '15000',
    },
    {
      icon: <Code2 className="w-8 h-8 md:w-10 md:h-10" />,
      name: 'Custom Development',
      price: '₹500-₹1000/hour',
      priceSubtext: 'Negotiable',
      description: 'Custom projects, API integration, complex features',
      features: [
        'Custom Requirements',
        'Full-stack Development',
        'API Integration',
        'Database Design',
        'Third-party Integrations',
        'Ongoing Support'
      ],
      timeline: 'Flexible',
      ctaText: 'Get Quote - Discuss Project',
      ctaAction: 'quote',
    },
  ];

  const handleBooking = (service: Service) => {
    if (service.ctaAction === 'quote') {
      // Scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // For now, scroll to contact - we'll add Razorpay later
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-900"
          >
            Services & <span className="text-cyan-600">Pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Transparent pricing with no hidden fees. Choose the package that fits your needs.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                service.popular ? 'border-cyan-500' : 'border-slate-100'
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${
                  service.popular
                    ? 'from-cyan-500 to-blue-600'
                    : 'from-cyan-400 to-blue-500'
                } rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform hover:rotate-6`}>
                  {service.icon}
                </div>
              </div>

              {/* Service Name */}
              <h3 className="text-2xl md:text-2xl font-bold text-center text-slate-900 mb-2">
                {service.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-4">
                <p className="text-3xl md:text-4xl font-extrabold text-cyan-600">
                  {service.price}
                </p>
                {service.priceSubtext && (
                  <p className="text-sm text-slate-500 mt-1">{service.priceSubtext}</p>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 text-center mb-6 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Timeline */}
              <div className="flex items-center justify-center gap-2 mb-6 text-slate-700">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-semibold">Timeline: {service.timeline}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleBooking(service)}
                className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  service.ctaAction === 'book'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/50'
                    : 'bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:shadow-slate-500/50'
                }`}
              >
                {service.ctaText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-semibold">100% Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-semibold">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                <Code2 className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="font-semibold">Fast Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
