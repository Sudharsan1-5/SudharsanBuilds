import { ShoppingCart, Layers, Palette, CreditCard } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <ShoppingCart className="w-10 h-10" />,
      title: 'E-commerce Development',
      description: 'Complete online stores with product management, shopping carts, and secure checkout systems.',
      features: ['Product Catalogs', 'Payment Integration', 'Order Management', 'Mobile Responsive']
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: 'SaaS Products',
      description: 'Subscription-based platforms with user management, billing, and feature-rich dashboards.',
      features: ['User Authentication', 'Subscription Billing', 'Admin Dashboards', 'API Integration']
    },
    {
      icon: <Palette className="w-10 h-10" />,
      title: 'Web App UI/UX',
      description: 'Beautiful, intuitive interfaces designed for optimal user experience and conversion.',
      features: ['Modern Design', 'User Research', 'Prototyping', 'Responsive Layouts']
    },
    {
      icon: <CreditCard className="w-10 h-10" />,
      title: 'Payment Integration',
      description: 'Secure payment processing with popular gateways and cryptocurrency support.',
      features: ['Stripe/PayPal', 'Crypto Payments', 'Subscription Plans', 'Secure Checkout']
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 text-slate-900">
          Services <span className="text-cyan-600">Offered</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  {service.icon}
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>

                  <ul className="space-y-2 pt-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
