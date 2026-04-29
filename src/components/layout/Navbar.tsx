import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageSquare, Home, Sparkles, Briefcase, Mail } from 'lucide-react';
import { getWhatsAppLink } from '../../constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '#', icon: <Home size={18} /> },
    { name: 'Services', href: '#services', icon: <Sparkles size={18} /> },
    { name: 'Réalisations', href: '#portfolio', icon: <Briefcase size={18} /> },
    { name: 'Contact', href: '#contact', icon: <Mail size={18} /> },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 border border-brand-primary/20">
                <span className="text-brand-primary font-bold text-xl font-display">I</span>
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                Intech<span className="text-brand-primary"> Digital DRC</span>
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 text-slate-600 hover:text-brand-primary font-medium transition-colors"
              >
                <span className="opacity-70 group-hover:opacity-100">{link.icon}</span>
                {link.name}
              </a>
            ))}
            <a
              href={getWhatsAppLink('Bonjour Intech Digital DRC, je souhaiterais obtenir un devis.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2 px-6 text-sm"
            >
              <MessageSquare size={16} />
              Devis Gratuit
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-brand-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: {
                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.25 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                opacity: { duration: 0.2 }
              }
            }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
          >
            <motion.div 
              className="px-4 pt-4 pb-8 space-y-2"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 }
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-700 hover:text-brand-primary hover:bg-brand-secondary/30 rounded-2xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary">
                    {link.icon}
                  </div>
                  {link.name}
                </motion.a>
              ))}
              <motion.div 
                className="pt-6 px-4"
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 10 }
                }}
              >
                <a
                  href={getWhatsAppLink('Bonjour Intech Digital DRC, je souhaiterais obtenir un devis.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-4 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20"
                >
                  <MessageSquare size={20} />
                  Devis Gratuit
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
