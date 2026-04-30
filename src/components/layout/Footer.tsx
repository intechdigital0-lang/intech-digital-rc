import React from 'react';
import { motion } from 'motion/react';
import { WHATSAPP_NUMBER, EMAIL, ADDRESS, SERVICES } from '../../constants';
import { MessageCircle, Mail, MapPin, ExternalLink, Lock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-center">
          <div className="space-y-6 flex flex-col items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="h-20 w-auto bg-transparent flex items-center justify-center">
                <img 
                  src="https://lh3.googleusercontent.com/d/1cxIXjits5QZ9ROgeNKyiP__nVNmi6Xx5" 
                  alt="Intech Digital Logo" 
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>
            <p className="text-slate-400 leading-relaxed font-medium italic">
              "Mieux fait, Vite fait"
            </p>
            <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
              Votre partenaire de confiance pour une transformation digitale réussie en RDC et partout dans le monde
            </p>

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

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>© {currentYear} Intech Digital DRC. Tous droits réservés.</p>
          
          <a 
            href="/admin" 
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all group shadow-lg"
          >
            <Lock size={14} className="group-hover:text-brand-primary" />
            <span>Connection Admin</span>
            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
