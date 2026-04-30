import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '../../constants';
import { settingsService } from '../../lib/firestoreService';

const Hero = () => {
  const [heroImg, setHeroImg] = useState('https://lh3.googleusercontent.com/d/1wUZql49z-_NYTo8PjTFzzKOqAjQvJxMY');

  useEffect(() => {
    settingsService.getSettings().then(s => {
      if (s?.heroImageUrl) setHeroImg(s.heroImageUrl);
    });
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-brand-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Wave Background */}
      <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(253, 186, 18, 0.1)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(29, 44, 94, 0.05)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(253, 186, 18, 0.03)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(255, 255, 255, 0.8)" />
        </g>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary text-white border border-brand-primary/20 text-sm font-semibold mb-6 mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Mieux fait, Vite fait
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.45, 0.32, 0.9] }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight mb-6 md:mb-8"
            >
              Faites décoller <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">votre activité</span> maintenant
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.45, 0.32, 0.9] }}
              className="text-base md:text-xl text-slate-600 mb-8 md:mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0 px-2"
            >
              Design, marketing et solutions digitales sur mesure pour propulser votre business vers de nouveaux sommets.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href={getWhatsAppLink('Bonjour Intech Digital DRC, je suis prêt à commander maintenant.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg"
              >
                Commander maintenant
                <ArrowRight size={20} />
              </a>
              <a
                href="#services"
                className="btn-secondary text-lg"
              >
                Explorer nos services
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1523240693567-510e1274c938?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop'
                ].map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Client"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm text-slate-500">
                Rejoint par <span className="text-slate-900 font-bold">100+ clients satisfaits</span> en RDC et partout au monde
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImg}
                alt="Digital Marketing Team"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
