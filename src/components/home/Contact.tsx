import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, MapPin, Send } from 'lucide-react';
import { getWhatsAppLink, WHATSAPP_NUMBER, EMAIL, ADDRESS } from '../../constants';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formattedMessage = `*Nouveau message du formulaire*\n\n*Nom:* ${formData.name}\n*WhatsApp:* ${formData.whatsapp || 'Non spécifié'}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`;
    
    window.open(getWhatsAppLink(formattedMessage), '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-primary rounded-[3rem] overflow-hidden shadow-2xl relative">
          {/* Patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="grid lg:grid-cols-2 relative z-10">
            <div className="p-12 lg:p-20 text-white text-center flex flex-col items-center justify-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
                Prêt à démarrer <br /> votre projet ?
              </h2>
              <p className="text-white/80 text-lg mb-12 max-w-md leading-relaxed mx-auto">
                Contactez Intech Digital DRC aujourd'hui pour discuter de vos idées. Nous sommes là pour vous aider à les concrétiser.
              </p>

              <div className="space-y-8 w-full max-w-sm">
                <a
                  href={getWhatsAppLink('Bonjour Intech Digital DRC, je souhaite démarrer un projet.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group bg-white/5 p-4 rounded-3xl hover:bg-white hover:text-brand-primary transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-white/60 text-xs uppercase tracking-widest font-bold group-hover:text-brand-primary/60">WhatsApp</div>
                    <div className="text-lg font-bold">{WHATSAPP_NUMBER}</div>
                  </div>
                </a>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/5 p-4 rounded-3xl">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <a href={`mailto:${EMAIL}`} className="text-center sm:text-left hover:text-white transition-colors">
                    <div className="text-white/60 text-xs uppercase tracking-widest font-bold">Email</div>
                    <div className="text-lg font-bold break-all">{EMAIL}</div>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white/5 p-4 rounded-3xl">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-white/60 text-xs uppercase tracking-widest font-bold">Adresse</div>
                    <div className="text-lg font-bold">{ADDRESS}</div>
                  </div>
                </div>
              </div>
            </div>

            <div id="contact-form-container" className="p-12 lg:p-20 bg-white/5 backdrop-blur-sm border-l border-white/10 flex flex-col justify-center">
              <div className="bg-white p-10 rounded-[2rem] shadow-xl text-slate-900">
                <h2 id="contact-form-title" className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form className="space-y-4" onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                        {errors.name && <span className="text-[10px] font-bold text-rose-500 uppercase leading-none">{errors.name}</span>}
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all ${
                          errors.name ? 'border-rose-200 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-100 focus:border-brand-primary focus:ring-brand-primary/20'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="whatsapp" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">WhatsApp</label>
                      <input
                        id="whatsapp"
                        type="tel"
                        placeholder="N° WhatsApp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                      {errors.email && <span className="text-[10px] font-bold text-rose-500 uppercase leading-none">{errors.email}</span>}
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Votre email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all ${
                        errors.email ? 'border-rose-200 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-100 focus:border-brand-primary focus:ring-brand-primary/20'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message</label>
                      {errors.message && <span className="text-[10px] font-bold text-rose-500 uppercase leading-none">{errors.message}</span>}
                    </div>
                    <textarea
                      id="message"
                      placeholder="Votre message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50 border outline-none transition-all ${
                        errors.message ? 'border-rose-200 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-100 focus:border-brand-primary focus:ring-brand-primary/20'
                      }`}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-lg" aria-label="Envoyer le message">
                    Envoyer
                    <Send size={20} aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
