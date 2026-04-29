import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { getWhatsAppLink } from '../../constants';
import { settingsService } from '../../lib/firestoreService';

const Hero = () => {
  const [heroImg, setHeroImg] = useState('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop');

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary text-brand-primary border border-brand-primary/20 text-sm font-semibold mb-6 mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Mieux fait, Vite fait
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight mb-8">
              Faites décoller <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-brand-primary">votre activité</span> maintenant
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Design, marketing et solutions digitales sur mesure pour propulser votre business vers de nouveaux sommets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={heroImg}
                alt="Digital Marketing Team"
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 p-6 glass-card shadow-xl hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-xl">99%</div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider font-bold">Taux de succès</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 p-6 glass-card shadow-xl hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-secondary">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-xl">24/7</div>
                  <div className="text-slate-500 text-xs uppercase tracking-wider font-bold">Support Client</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
