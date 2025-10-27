import { ShoppingCart, Layers, Palette, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services() {
  const services = [
    {
      icon: <ShoppingCart className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'E-commerce Development',
      description: 'Complete online stores with product management, shopping carts, and secure checkout.',
      features: ['Product Catalogs', 'Payment Integration', 'Order Management', 'Mobile Responsive']
    },
    {
      icon: <Layers className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'SaaS Products',
      description: 'Subscription platforms with user management, billing, and feature-rich dashboards.',
      features: ['User Authentication', 'Subscription Billing', 'Admin Dashboards', 'API Integration']
    },
    {
      icon: <Palette className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'Web App UI/UX',
      description: 'Beautiful, intuitive interfaces designed for optimal user experience and conversion.',
      features: ['Modern Design', 'User Research', 'Prototyping', 'Responsive Layouts']
    },
    {
      icon: <CreditCard className="w-8 h-8 md:w-10 md:h-10" />,
      title: 'Payment Integration',
      description: 'Secure payment processing with popular gateways and cryptocurrency support.',
      features: ['Stripe/PayPal', 'Crypto Payments', 'Subscription Plans', 'Secure Checkout']
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-slate-900">
          Services <span className="text-cyan-600">Offered</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                    {service.title}
                  </h3>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>

                <ul className="space-y-2 pt-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 text-sm md:text-base">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
