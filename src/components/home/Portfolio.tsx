import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO as STATIC_PORTFOLIO } from '../../constants';
import { portfolioService } from '../../lib/firestoreService';
import { PortfolioItem } from '../../types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const unsubscribe = portfolioService.subscribeToItems((newItems) => {
      setItems(newItems);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Tous', ...Array.from(new Set(items.map((item) => item.category)))];

  const filteredItems = selectedCategory === 'Tous' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const openGallery = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentImageIdx(0);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedItem(null);
    setIsZoomed(false);
    document.body.style.overflow = 'auto';
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const [direction, setDirection] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setDirection(1);
    setIsZoomed(false);
    const gallery = [selectedItem.imageUrl, ...(selectedItem.images || [])];
    setCurrentImageIdx((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setDirection(-1);
    setIsZoomed(false);
    const gallery = [selectedItem.imageUrl, ...(selectedItem.images || [])];
    setCurrentImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const goToImage = (idx: number) => {
    setDirection(idx > currentImageIdx ? 1 : -1);
    setCurrentImageIdx(idx);
    setIsZoomed(false);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.05
    })
  };

  const currentGallery = selectedItem ? [selectedItem.imageUrl, ...(selectedItem.images || [])] : [];

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-primary font-bold tracking-widest text-sm uppercase mb-4"
            >
              Nos Réalisations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-bold text-slate-900 leading-tight"
            >
              Découvrez nos derniers succès
            </motion.h2>
          </div>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a href="#portfolio" className="btn-secondary">Voir plus de réalisations</a>
            </motion.div>
          )}
        </div>
        
        {items.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-primary hover:text-brand-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-brand-secondary border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-medium">Chargement des pépites...</p>
          </div>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center border-2 border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Maximize2 size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Notre portfolio est en cours de mise à jour</h3>
            <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
              Nous préparons actuellement la présentation de nos derniers succès. Revenez très bientôt pour découvrir nos réalisations exceptionnelles !
            </p>
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-50 rounded-[3rem] p-12 md:p-20 text-center border-2 border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Maximize2 size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Aucun projet trouvé</h3>
            <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
              Il semble qu'aucun projet ne corresponde à la catégorie <span className="font-bold text-brand-primary">"{selectedCategory}"</span> pour le moment.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openGallery(item)}
                  role="button"
                  aria-label={`Voir les détails du projet ${item.title}`}
                  className="group relative rounded-3xl overflow-hidden shadow-lg h-[400px] cursor-pointer"
                >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={20} aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">{item.category}</span>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                      {item.images && item.images.length > 0 ? `${item.images.length + 1} photos` : '1 photo'}
                    </span>
                  </div>
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                  <div className="w-10 h-px bg-white/30 group-hover:w-full transition-all duration-500 mt-4" />
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox / Gallery Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={closeGallery}
              aria-label="Fermer la galerie"
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10"
            >
              <X size={32} aria-hidden="true" />
            </button>

            <div className={`relative w-full max-w-5xl flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-out ${isZoomed ? 'h-full' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={`relative w-full flex items-center justify-center overflow-hidden ${isZoomed ? 'flex-1' : 'aspect-video'}`}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={currentImageIdx}
                    src={currentGallery[currentImageIdx]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.4 }
                    }}
                    alt={`${selectedItem.title} - Image ${currentImageIdx + 1}`}
                    onClick={toggleZoom}
                    aria-label={isZoomed ? "Réduire l'image" : "Agrandir l'image"}
                    className={`max-w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-700 cursor-pointer ${isZoomed ? 'cursor-zoom-out z-50 scale-125' : 'cursor-zoom-in'}`}
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {!isZoomed && currentGallery.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      aria-label="Image précédente"
                      className="absolute left-0 -translate-x-full hidden md:flex h-12 w-12 items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={48} aria-hidden="true" />
                    </button>
                    <button 
                      onClick={nextImage}
                      aria-label="Image suivante"
                      className="absolute right-0 translate-x-full hidden md:flex h-12 w-12 items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                      <ChevronRight size={48} aria-hidden="true" />
                    </button>
                    
                    {/* Mobile nav buttons */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 md:hidden">
                      <button onClick={prevImage} aria-label="Image précédente" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><ChevronLeft aria-hidden="true" /></button>
                      <button onClick={nextImage} aria-label="Image suivante" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"><ChevronRight aria-hidden="true" /></button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute -bottom-12 flex gap-3" role="tablist">
                      {currentGallery.map((_, idx) => (
                        <button 
                          key={idx}
                          onClick={() => goToImage(idx)}
                          role="tab"
                          aria-selected={idx === currentImageIdx}
                          aria-label={`Aller à l'image ${idx + 1}`}
                          className={`h-2 rounded-full transition-all duration-500 ${idx === currentImageIdx ? 'bg-brand-primary w-12 shadow-[0_0_12px_rgba(255,204,0,0.5)]' : 'bg-white/10 hover:bg-white/30 w-2'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {!isZoomed && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center max-w-2xl"
                >
                  <span className="text-brand-primary font-bold text-xs uppercase tracking-widest block mb-2">{selectedItem.category}</span>
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedItem.title}</h4>
                  {selectedItem.description && (
                    <p className="text-white/70 text-base md:text-lg leading-relaxed">
                      {selectedItem.description}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
