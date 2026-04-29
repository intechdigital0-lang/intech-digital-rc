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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-primary/30 hover:shadow-2xl transition-all group flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 relative z-10 shadow-sm group-hover:shadow-brand-primary/40">
                <Icon name={service.iconName} size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-primary group-hover:scale-105 transition-all duration-300 relative z-10">{service.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed break-words relative z-10">
                {service.description}
              </p>
              <a
                href={getWhatsAppLink(service.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-4 px-6 rounded-2xl bg-white border-2 border-brand-primary/10 text-brand-primary font-bold flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white hover:border-brand-primary hover:scale-105 hover:shadow-xl hover:shadow-brand-primary/20 transition-all duration-300 active:scale-95 group/btn"
              >
                <span>Commander</span>
                <ArrowRight size={20} className="transition-all duration-300 group-hover/btn:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
