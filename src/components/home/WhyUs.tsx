import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Zap, ShieldCheck, HeartPulse } from 'lucide-react';
import { settingsService } from '../../lib/firestoreService';

const WhyUs = () => {
  const [whyUsImg, setWhyUsImg] = useState('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop');

  useEffect(() => {
    settingsService.getSettings().then(s => {
      if (s?.whyUsImageUrl) setWhyUsImg(s.whyUsImageUrl);
    });
  }, []);
  const highlights = [
    {
      title: 'Expertise Locale',
      desc: 'Nous comprenons le marché de Kinshasa et les besoins réels des entreprises congolaises.',
      icon: <Target className="text-white" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'Vitesse & Agilité',
      desc: 'Vitesse d\'exécution sans compromis sur la qualité pour devancer la concurrence.',
      icon: <Zap className="text-white" />,
      color: 'bg-amber-500'
    },
    {
      title: 'Résultats Mesurables',
      desc: 'Chaque action est guidée par les données pour garantir un retour sur investissement.',
      icon: <ShieldCheck className="text-white" />,
      color: 'bg-emerald-500'
    },
    {
      title: 'Proximité Client',
      desc: 'Nous bâtissons des relations durables basées sur la transparence et l\'écoute.',
      icon: <HeartPulse className="text-white" />,
      color: 'bg-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8 leading-tight">
              Pourquoi faire confiance à <br />
              <span className="text-brand-primary">Intech Digital DRC ?</span>
            </h2>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto lg:mx-0">
              Au-delà d'une simple agence, nous sommes votre extension créative et digitale. Notre mission est de transformer votre potentiel en succès concret.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-center sm:text-left">
              {highlights.map((item, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start gap-4">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-2`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-brand-primary/5 rounded-[4rem] absolute inset-0 transform -rotate-6" />
            <img
              src={whyUsImg}
              alt="Collaboration Intech Digital DRC"
              className="rounded-[4rem] relative z-10 w-full h-full object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
