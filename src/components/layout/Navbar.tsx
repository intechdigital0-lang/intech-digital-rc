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
            <motion.a href="#" className="flex items-center gap-2 group" whileHover="logoHover">
              <motion.div 
                variants={{
                  logoHover: { 
                    y: [0, -8, 0],
                    rotate: [0, -10, 10, 0],
                  }
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.7, 1]
                }}
                className="h-14 flex items-center justify-center overflow-hidden"
              >
                <div className="h-16 w-auto flex items-center">
                  <img 
                    src="https://lh3.googleusercontent.com/d/1cxIXjits5QZ9ROgeNKyiP__nVNmi6Xx5" 
                    alt="Intech Digital Logo" 
                    className="h-full w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </motion.a>
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

          <div className="md:hidden overflow-hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-brand-primary transition-colors relative w-10 h-10"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
               <span className="text-xl font-bold font-display text-slate-900">
                Menu
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={24} />
              </button>
            </div>

            <motion.div 
              className="flex-1 overflow-y-auto px-6 py-8 space-y-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { 
                  transition: { 
                    staggerChildren: 0.1, 
                    delayChildren: 0.1 
                  } 
                },
                closed: { 
                  transition: { 
                    staggerChildren: 0.05, 
                    staggerDirection: -1 
                  } 
                }
              }}
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  variants={{
                    open: { 
                      opacity: 1, 
                      x: 0, 
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)" 
                    },
                    closed: { 
                      opacity: 0, 
                      x: 30, 
                      y: 10,
                      scale: 0.95,
                      filter: "blur(8px)" 
                    }
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="flex items-center gap-5 px-5 py-5 text-xl font-bold text-slate-800 hover:text-brand-primary hover:bg-slate-50 rounded-[1.5rem] transition-all active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-primary shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    {link.icon}
                  </div>
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
            
            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ delay: 0.4 }}
              >
                <motion.a
                  href={getWhatsAppLink('Bonjour Intech Digital DRC, je souhaiterais obtenir un devis.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ 
                    boxShadow: ["0px 10px 30px rgba(253, 186, 18, 0.2)", "0px 10px 40px rgba(253, 186, 18, 0.4)", "0px 10px 30px rgba(253, 186, 18, 0.2)"] 
                  }}
                  transition={{ 
                    boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }}
                  className="w-full h-16 rounded-2xl bg-brand-primary text-white font-bold text-xl flex items-center justify-center gap-4 shadow-xl shadow-brand-primary/30"
                >
                  <MessageSquare size={24} className="animate-bounce" />
                  Devis Gratuit
                </motion.a>
                <p className="text-center text-slate-400 text-sm mt-4 font-medium flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Disponible maintenat
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
