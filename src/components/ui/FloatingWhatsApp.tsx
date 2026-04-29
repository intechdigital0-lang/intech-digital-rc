import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../../constants';

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href={getWhatsAppLink('Bonjour Intech Digital DRC, j\'ai une question à propos de vos services.')}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center overflow-hidden group"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <MessageCircle size={30} className="relative z-10" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
