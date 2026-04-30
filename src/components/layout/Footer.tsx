import React from 'react';
import { motion } from 'motion/react';
import { WHATSAPP_NUMBER, EMAIL, ADDRESS, SERVICES } from '../../constants';
import { MessageCircle, Mail, MapPin, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center">
          <div className="space-y-6 lg:col-span-1 flex flex-col items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center border border-brand-primary/20">
                <span className="text-brand-primary font-bold text-xl font-display">I</span>
              </div>
              <span className="text-xl font-bold font-display tracking-tight">
                Intech<span className="text-brand-primary">Digital</span>
              </span>
            </a>
            <p className="text-slate-400 leading-relaxed font-medium italic">
              "Mieux fait, Vite fait"
            </p>
            <p className="text-slate-400 leading-relaxed">
              Votre partenaire de confiance pour une transformation digitale réussie en RDC et partout dans le monde
            </p>
            <div className="flex items-center justify-center gap-4">
              {[
                { icon: <Facebook size={20} />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <Instagram size={20} />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <Linkedin size={20} />, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: <MessageCircle size={20} />, href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}`, label: 'WhatsApp' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all hover:-translate-y-1 shadow-lg shadow-black/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Liens Rapides</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#portfolio" className="text-slate-400 hover:text-white transition-colors">Réalisations</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Nos Services</h4>
            <ul className="space-y-4">
              {SERVICES.slice(0, 4).map((service) => (
                <li key={service.id}>
                  <a href="#services" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contactez-nous</h4>
            <ul className="space-y-4">
              <li className="flex flex-col items-center gap-2">
                <MapPin className="text-brand-primary shrink-0" size={20} />
                <span className="text-slate-400">{ADDRESS}</span>
              </li>
              <li className="flex flex-col items-center gap-2">
                <Mail className="text-brand-primary shrink-0" size={20} />
                <a href={`mailto:${EMAIL}`} className="text-slate-400 hover:text-white transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex flex-col items-center gap-2">
                <MessageCircle className="text-brand-primary shrink-0" size={20} />
                <span className="text-slate-400">{WHATSAPP_NUMBER}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {currentYear} Intech Digital DRC. Tous droits réservés. Design by <a href="/admin" className="hover:text-white transition-colors">Intech Digital DRC</a>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
