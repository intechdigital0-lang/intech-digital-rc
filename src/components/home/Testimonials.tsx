import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS as STATIC_TESTIMONIALS } from '../../constants';
import { Star, Quote } from 'lucide-react';
import { testimonialService } from '../../lib/firestoreService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = testimonialService.subscribeToItems((items) => {
      setTestimonials(items.length > 0 ? items : STATIC_TESTIMONIALS);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative quotes */}
      <Quote className="absolute -top-10 -left-10 w-64 h-64 text-brand-primary/5 -rotate-12" />
      <Quote className="absolute -bottom-10 -right-10 w-64 h-64 text-brand-secondary/5 rotate-180" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-slate-900"
          >
            Ce que disent nos clients
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center h-full"
            >
              <div className="flex gap-1 mb-6 text-brand-primary">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < (testimonial.rating || 5) ? "currentColor" : "none"}
                    className={i < (testimonial.rating || 5) ? "" : "text-slate-200"}
                  />
                ))}
              </div>
              
              <p className="text-slate-700 italic mb-8 flex-grow leading-relaxed break-words">"{testimonial.comment}"</p>
              
              <div className="flex flex-col items-center gap-4 pt-6 border-t border-slate-50 w-full">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-brand-primary/10 mb-2"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{testimonial.name}</h3>
                  <p className="text-slate-500 text-xs uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
