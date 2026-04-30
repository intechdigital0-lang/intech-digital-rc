import React from 'react';
import { motion } from 'motion/react';
import { SERVICES, getWhatsAppLink } from '../../constants';
import Icon from '../Icon';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary font-bold tracking-widest text-sm uppercase mb-4"
          >
            Nos Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight"
          >
            Des solutions innovantes pour votre croissance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            Nous combinons créativité et technologie pour offrir des résultats tangibles à chaque étape de votre parcours digital.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -12,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 ease-in-out" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-brand-secondary/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:rotate-6 transition-all duration-300 shadow-sm group-hover:shadow-brand-primary/40">
                  <Icon name={service.iconName} size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-brand-primary transition-colors duration-300">
                  {service.title}
                </h3>
              </div>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed relative z-10">
                {service.description}
              </p>
              
              <motion.a
                href={getWhatsAppLink(service.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 w-full h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 group/btn"
              >
                <span>Obtenir un Devis</span>
                <ArrowRight size={20} className="transition-all duration-300 group-hover/btn:translate-x-1" />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
