import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'E-commerce Entrepreneur',
      avatar: 'SJ',
      rating: 5,
      text: 'Absolutely incredible work! My online store was delivered ahead of schedule and exceeded all expectations. The attention to detail and professionalism was outstanding.'
    },
    {
      name: 'Michael Chen',
      role: 'SaaS Founder',
      avatar: 'MC',
      rating: 5,
      text: 'Best decision I made was hiring for my SaaS platform. The subscription system works flawlessly, and my users love the interface. Highly recommended!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Small Business Owner',
      avatar: 'ER',
      rating: 5,
      text: 'Professional, responsive, and talented. My booking system has transformed how I manage appointments. The automation features save me hours every week!'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-16 text-white">
          Client <span className="text-cyan-400">Testimonials</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                  <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
