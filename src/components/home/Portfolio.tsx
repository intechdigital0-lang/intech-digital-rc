import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO as STATIC_PORTFOLIO } from '../../constants';
import { portfolioService } from '../../lib/firestoreService';
import { PortfolioItem } from '../../types';
import { X, ChevronLeft, ChevronRight, Maximize2, CheckCircle2, Quote, ExternalLink } from 'lucide-react';
import Icon from '../Icon';

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

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

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

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
    <section id="portfolio" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-16 gap-4 md:gap-6">
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
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              >
                <span className={`relative z-10 transition-colors duration-300 ${
                  selectedCategory === cat ? 'text-white' : 'text-slate-500 group-hover:text-brand-primary'
                }`}>
                  {cat}
                </span>
                
                {selectedCategory === cat ? (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white border border-slate-200 rounded-full group-hover:border-brand-primary/50 transition-colors" />
                )}
              </motion.button>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -12,
                      boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.35)"
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      layout: { duration: 0.3 },
                      scale: { type: "spring", stiffness: 300, damping: 20 },
                      y: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onClick={() => openGallery(item)}
                    role="button"
                    aria-label={`Voir les détails du projet ${item.title}`}
                    className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl h-[400px] cursor-pointer"
                  >
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  </div>

                  {/* Inner border glow on hover */}
                  <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/0 group-hover:border-white/20 transition-colors duration-500 z-20 pointer-events-none" />
                  {/* Loading Skeleton */}
                  {!loadedImages[item.id] && (
                    <div className="absolute inset-0 bg-slate-100 flex flex-col p-8 overflow-hidden">
                      <div className="w-full h-full bg-slate-200 animate-pulse rounded-2xl mb-4" />
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 animate-pulse rounded-full w-24" />
                        <div className="h-6 bg-slate-200 animate-pulse rounded-full w-48" />
                      </div>
                    </div>
                  )}
                  
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                      loadedImages[item.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-6 mt-16">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      currentPage === 0 
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-slate-600 bg-white border border-slate-100 hover:border-brand-primary hover:text-brand-primary hover:shadow-lg shadow-brand-primary/10'
                    }`}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${
                          currentPage === i
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-110'
                            : 'bg-white text-slate-500 border border-slate-100 hover:border-brand-primary/50'
                        }`}
                        aria-label={`Page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      currentPage === totalPages - 1 
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-slate-600 bg-white border border-slate-100 hover:border-brand-primary hover:text-brand-primary hover:shadow-lg shadow-brand-primary/10'
                    }`}
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Affichage de {paginatedItems.length} sur {filteredItems.length} projets
                </p>
              </div>
            )}
          </>
        )}

      </div>

      {/* Enhanced Project Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeGallery}
            className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-0 md:p-6 lg:p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-7xl h-full md:h-[90vh] bg-white md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Close button */}
              <button 
                onClick={closeGallery}
                aria-label="Fermer"
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-slate-900/10 hover:bg-slate-900/20 flex items-center justify-center text-slate-900 transition-all z-[110]"
              >
                <X size={24} aria-hidden="true" />
              </button>

              {/* Gallery Section */}
              <div className="w-full lg:w-3/5 h-[40vh] sm:h-[50vh] lg:h-full bg-slate-950 relative overflow-hidden group">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={currentImageIdx}
                    src={currentGallery[currentImageIdx]}
                    custom={direction}
                    variants={{
                      enter: (direction: number) => ({
                        x: direction > 0 ? 500 : -500,
                        opacity: 0,
                        filter: 'blur(10px)'
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        filter: 'blur(0px)'
                      },
                      exit: (direction: number) => ({
                        x: direction < 0 ? 500 : -500,
                        opacity: 0,
                        filter: 'blur(10px)'
                      })
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.3 }
                    }}
                    alt={`${selectedItem.title} - ${currentImageIdx + 1}`}
                    className={`w-full h-full object-contain transition-transform duration-700 cursor-pointer ${isZoomed ? 'scale-150' : 'scale-100'}`}
                    onClick={toggleZoom}
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Gallery Nav */}
                {currentGallery.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={32} />
                    </button>

                    {/* Image count indicator */}
                    <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-slate-950/40 backdrop-blur-md text-white text-xs font-bold ring-1 ring-white/20">
                      {currentImageIdx + 1} / {currentGallery.length}
                    </div>
                  </>
                )}
                
                {/* Thumbnails */}
                {currentGallery.length > 1 && (
                  <div className="absolute bottom-6 right-6 flex gap-2">
                    {currentGallery.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToImage(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIdx ? 'bg-brand-primary w-6' : 'bg-white/30 hover:bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-full lg:w-2/5 h-[60vh] sm:h-[50vh] lg:h-full bg-white flex flex-col p-8 md:p-12 overflow-y-auto custom-scrollbar text-center lg:text-left items-center lg:items-start">
                <div className="mb-10 w-full">
                  <span className="inline-block px-3 py-1 rounded-lg bg-brand-secondary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                    {selectedItem.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 leading-tight mb-6">
                    {selectedItem.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                    {selectedItem.description || "Intech Digital DRC a accompagné ce client dans sa transformation digitale avec une solution sur mesure alliant esthétique et performance."}
                  </p>
                </div>

                {/* Technologies */}
                {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                  <div className="mb-10 w-full">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-1 h-3 bg-brand-primary rounded-full" />
                      Expertise technique
                    </h4>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      {selectedItem.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-4 py-2 rounded-xl bg-slate-50 text-slate-700 text-sm font-medium border border-slate-100 flex items-center gap-2 group"
                        >
                          <CheckCircle2 size={14} className="text-brand-primary" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testimonial */}
                {selectedItem.testimonial && (
                  <div className="mt-auto pt-10 border-t border-slate-100 w-full">
                    <div className="relative p-6 rounded-3xl bg-slate-50/50 flex flex-col items-center lg:items-start text-center lg:text-left">
                      <Quote className="absolute -top-3 -left-3 w-8 h-8 text-brand-primary/20" />
                      <p className="text-slate-700 italic text-lg leading-relaxed mb-6">
                        "{selectedItem.testimonial.comment}"
                      </p>
                      <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-brand-secondary/20 shrink-0">
                          {selectedItem.testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900">{selectedItem.testimonial.name}</h5>
                          <p className="text-slate-500 text-sm">
                            {selectedItem.testimonial.role}{selectedItem.testimonial.company ? ` @ ${selectedItem.testimonial.company}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* CTA In Modal */}
                <div className="mt-12">
                  <a 
                    href={`https://wa.me/243895409557?text=Je suis intéressé par un projet similaire à : ${selectedItem.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
                  >
                    Demander un projet similaire
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
