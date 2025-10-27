import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Entrepreneur',
      avatar: 'SJ',
      rating: 5,
      text: 'Absolutely incredible work! My online store was delivered ahead of schedule and exceeded all expectations.'
    },
    {
      name: 'Michael Chen',
      role: 'SaaS Founder',
      avatar: 'MC',
      rating: 5,
      text: 'Best decision I made was hiring for my SaaS platform. The subscription system works flawlessly!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Small Business Owner',
      avatar: 'ER',
      rating: 5,
      text: 'Professional and talented. My booking system has transformed how I manage appointments.'
    },
    {
      name: 'David Park',
      role: 'Startup Founder',
      avatar: 'DP',
      rating: 5,
      text: 'Exceptional quality and attention to detail. Delivered exactly what we needed on time!'
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-white">
          Client <span className="text-cyan-400">Testimonials</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 p-5 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-700"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg md:text-xl font-bold text-white truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-cyan-400 text-xs md:text-sm truncate">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed italic text-sm md:text-base">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
