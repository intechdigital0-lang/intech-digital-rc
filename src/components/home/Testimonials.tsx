import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TESTIMONIALS as STATIC_TESTIMONIALS } from '../../constants';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import { testimonialService } from '../../lib/firestoreService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const unsubscribe = testimonialService.subscribeToItems((items) => {
      setTestimonials(items.length > 0 ? items : STATIC_TESTIMONIALS);
    });
    return () => unsubscribe();
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

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

        <div className="relative">
          <motion.div 
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
          </motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={prevPage}
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-600 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm group"
                aria-label="Previous testimonials"
              >
                <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.9 }}>
                  <ArrowLeft size={24} />
                </motion.div>
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentPage === i ? "bg-brand-primary w-8" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-600 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm group"
                aria-label="Next testimonials"
              >
                <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.9 }}>
                  <ArrowRight size={24} />
                </motion.div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
