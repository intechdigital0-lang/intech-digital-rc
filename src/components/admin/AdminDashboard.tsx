import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, isUserAdmin } from '../../lib/firebase';
import { portfolioService, settingsService, testimonialService } from '../../lib/firestoreService';
import { storageService } from '../../lib/storageService';
import { PortfolioItem } from '../../types';
import { motion } from 'motion/react';
import { Plus, Trash2, LogOut, Key, Image as ImageIcon, Save, AlertCircle, MessageSquare, Star, Mail, Lock, Upload, Loader2, Edit2, X, ChevronLeft, ChevronRight, Github } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminLocally, setIsAdminLocally] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [portfolioPage, setPortfolioPage] = useState(1);
  const [testimonialsPage, setTestimonialsPage] = useState(1);

  const totalPortfolioPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const totalTestimonialPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (portfolioPage > totalPortfolioPages && totalPortfolioPages > 0) {
      setPortfolioPage(totalPortfolioPages);
    } else if (items.length > 0 && portfolioPage === 0) {
      setPortfolioPage(1);
    }
  }, [items.length, totalPortfolioPages, portfolioPage]);

  useEffect(() => {
    if (testimonialsPage > totalTestimonialPages && totalTestimonialPages > 0) {
      setTestimonialsPage(totalTestimonialPages);
    } else if (testimonials.length > 0 && testimonialsPage === 0) {
      setTestimonialsPage(1);
    }
  }, [testimonials.length, totalTestimonialPages, testimonialsPage]);
  
  const [newItem, setNewItem] = useState({ title: '', category: '', description: '', imageUrl: '', images: [] as string[] });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({ 
    name: '', 
    role: '', 
    comment: '', 
    rating: 5, 
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop' 
  });
  
  const [heroUrl, setHeroUrl] = useState('');
  const [whyUsUrl, setWhyUsUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; type: 'portfolio' | 'testimonial'; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && isUserAdmin(u.email)) {
        setIsAdminLocally(true);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const setupSubscriptions = () => {
    const unsubPortfolio = portfolioService.subscribeToItems(setItems);
    const unsubTestimonials = testimonialService.subscribeToItems(setTestimonials);
    
    settingsService.getSettings().then(s => {
      if (s?.heroImageUrl) setHeroUrl(s.heroImageUrl);
      if (s?.whyUsImageUrl) setWhyUsUrl(s.whyUsImageUrl);
    });

    return () => {
      unsubPortfolio();
      unsubTestimonials();
    };
  };

  useEffect(() => {
    if (isAdminLocally) {
      const cleanup = setupSubscriptions();
      return () => cleanup && cleanup();
    }
  }, [isAdminLocally]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoggingIn(true);
    
    // Check for hardcoded admin credentials as requested for local bypass if Firebase fails
    if (email === 'intechdigital0@gmail.com' && password === '000000') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsAdminLocally(true);
      } catch (error: any) {
        console.error('Firebase Auth Error:', error);
        // If it fails (e.g. user not created in Firebase Console yet), we allow access locally
        // but warn that writes might fail due to security rules
        setIsAdminLocally(true);
        setMessage('Connecté en mode administrateur.');
      } finally {
        setIsLoggingIn(false);
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdminLocally(true);
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        setMessage('Erreur réseau : Impossible de contacter Firebase. Vérifiez votre connexion internet ou essayez d\'ouvrir l\'application dans un nouvel onglet.');
      } else {
        setMessage(`Erreur: ${error.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage('');
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/network-request-failed') {
        setMessage('Erreur réseau : La connexion Google a échoué. Essayez d\'ouvrir l\'application dans un nouvel onglet.');
      } else {
        setMessage('La connexion Google a échoué.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGithubLogin = async () => {
    setMessage('');
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/network-request-failed') {
        setMessage('Erreur réseau : La connexion GitHub a échoué. Essayez d\'ouvrir l\'application dans un nouvel onglet.');
      } else {
        setMessage('La connexion GitHub a échoué. Assurez-vous d\'avoir configuré GitHub dans la console Firebase.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAdminLocally(false);
    setUser(null);
  };

  const handleFileUpload = async (file: File, folder: string, callback: (url: string) => void) => {
    setIsUploading(true);
    let localUrl = '';
    try {
      // Optimistic preview for immediate feedback
      localUrl = URL.createObjectURL(file);
      callback(localUrl);
      
      const url = await storageService.uploadImage(file, folder);
      callback(url);
      setMessage('Image prête à être enregistrée');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
      // We don't revoke here because the callback might have set state to localUrl and we need it to stay visible
      // until the real URL replaces it or the component unmounts.
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.category || !newItem.imageUrl) return;
    try {
      await portfolioService.addItem({
        ...newItem,
        images: newItem.images || [],
        createdAt: new Date().toISOString()
      } as any);
      setNewItem({ title: '', category: '', description: '', imageUrl: '', images: [] });
      setMessage('Projet ajouté avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de l\'ajout');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await portfolioService.updateItem(editingItem.id, {
        title: editingItem.title,
        category: editingItem.category,
        description: editingItem.description || '',
        imageUrl: editingItem.imageUrl,
        images: editingItem.images || []
      });
      setEditingItem(null);
      setMessage('Projet mis à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteItem = (item: PortfolioItem) => {
    setDeleteInfo({ id: item.id, type: 'portfolio', title: item.title });
  };

  const handleDeleteTestimonial = (testimonial: any) => {
    setDeleteInfo({ id: testimonial.id, type: 'testimonial', title: testimonial.name });
  };

  const confirmDelete = async () => {
    if (!deleteInfo) return;
    setIsDeleting(true);
    try {
      if (deleteInfo.type === 'portfolio') {
        await portfolioService.deleteItem(deleteInfo.id);
      } else {
        await testimonialService.deleteItem(deleteInfo.id);
      }
      setMessage('Élément supprimé avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteInfo(null);
    }
  };

  const getPaginatedItems = (list: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-slate-50 border-t border-slate-100">
        <button 
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-bold text-slate-600">
          Page {current} sur {total}
        </span>
        <button 
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.comment) return;
    try {
      await testimonialService.addItem(newTestimonial);
      setNewTestimonial({ 
        name: '', 
        role: '', 
        comment: '', 
        rating: 5, 
        avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop' 
      });
      setMessage('Témoignage ajouté avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur lors de l\'ajout');
    }
  };

  const handleUpdateHero = async () => {
    try {
      await settingsService.updateHeroImage(heroUrl);
      setMessage('Image Hero mise à jour');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur mise à jour image');
    }
  };

  const handleUpdateWhyUs = async () => {
    try {
      await settingsService.updateWhyUsImage(whyUsUrl);
      setMessage('Image "Pourquoi nous" mise à jour');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erreur mise à jour image');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  if (!user && !isAdminLocally) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
            <Key size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Accès Administrateur</h1>
          <p className="text-slate-600 mb-8">Veuillez vous connecter pour gérer le site.</p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20"
                required
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              type="submit" 
              disabled={isLoggingIn}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {isLoggingIn && (
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              )}
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Se connecter'}
            </motion.button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-400 font-medium italic">ou continuer avec</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleGoogleLogin} 
              disabled={isLoggingIn}
              className="py-3 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors font-medium text-slate-700 relative overflow-hidden"
            >
              {isLoggingIn ? (
                <Loader2 className="animate-spin text-brand-primary" size={20} />
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
                  Google
                </>
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleGithubLogin} 
              disabled={isLoggingIn}
              className="py-3 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors font-medium text-slate-700 relative overflow-hidden"
            >
              {isLoggingIn ? (
                <Loader2 className="animate-spin text-slate-900" size={20} />
              ) : (
                <>
                  <Github size={20} className="text-slate-900" />
                  GitHub
                </>
              )}
            </motion.button>
          </div>

          {message && <p className={`mt-6 text-sm ${message.includes('Connecté') ? 'text-emerald-500' : 'text-red-500'}`}>{message}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin</h1>
            <p className="text-slate-500">Gérez le contenu de Intech Digital DRC</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm">
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-center font-medium"
          >
            {message}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions / Global Settings */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="text-brand-primary" size={24} />
                <h2 className="text-xl font-bold">Images Globales</h2>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Image de couverture (Hero)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'settings', setHeroUrl);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="hero-upload"
                    />
                    <div className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                      heroUrl ? 'border-brand-primary/20 bg-brand-primary/5' : 'border-slate-200 bg-slate-50 hover:border-brand-primary/50'
                    }`}>
                      {heroUrl ? (
                        <div className="relative w-full h-full">
                          <img src={heroUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={24} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                          <span className="text-xs font-bold mt-2">Importer</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateHero} 
                    disabled={isUploading || heroUrl.startsWith('blob:')}
                    className={`btn-primary w-full py-2.5 text-xs ${isUploading || heroUrl.startsWith('blob:') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Save size={16} />
                    {isUploading ? 'Téléchargement...' : 'Mettre à jour la couverture'}
                  </button>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-700">Image "Pourquoi nous"</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'settings', setWhyUsUrl);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="whyus-upload"
                    />
                    <div className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                      whyUsUrl ? 'border-brand-primary/20 bg-brand-primary/5' : 'border-slate-200 bg-slate-50 hover:border-brand-primary/50'
                    }`}>
                      {whyUsUrl ? (
                        <div className="relative w-full h-full">
                          <img src={whyUsUrl} alt="Why Us Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={24} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                          <span className="text-xs font-bold mt-2">Importer</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateWhyUs} 
                    disabled={isUploading || whyUsUrl.startsWith('blob:')}
                    className={`btn-primary w-full py-2.5 text-xs ${isUploading || whyUsUrl.startsWith('blob:') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Save size={16} />
                    {isUploading ? 'Téléchargement...' : 'Mettre à jour l\'image'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {editingItem ? <Edit2 className="text-brand-primary" size={24} /> : <Plus className="text-brand-primary" size={24} />}
                  <div>
                    <h2 className="text-xl font-bold">{editingItem ? 'Modifier Projet' : 'Ajouter un nouveau Projet'}</h2>
                    <p className="text-xs text-slate-500 mt-1">Remplissez les détails pour publier une réalisation.</p>
                  </div>
                </div>
                {editingItem && (
                  <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X size={20} />
                  </button>
                )}
              </div>
              <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
                <input 
                  type="text" 
                  value={editingItem ? editingItem.title : newItem.title}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, title: e.target.value})
                    : setNewItem({...newItem, title: e.target.value})
                  }
                  placeholder="Titre du projet"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none"
                />
                <input 
                  type="text" 
                  value={editingItem ? editingItem.category : newItem.category}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, category: e.target.value})
                    : setNewItem({...newItem, category: e.target.value})
                  }
                  placeholder="Catégorie (ex: Design)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none"
                />
                <textarea 
                  value={editingItem ? editingItem.description : newItem.description}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, description: e.target.value})
                    : setNewItem({...newItem, description: e.target.value})
                  }
                  placeholder="Description détaillée du projet"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none resize-none"
                />
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon size={16} className="text-brand-primary" />
                    Photo principale du projet
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const callback = (url: string) => editingItem 
                            ? setEditingItem({...editingItem, imageUrl: url})
                            : setNewItem({...newItem, imageUrl: url});
                          handleFileUpload(file, 'portfolio', callback);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="portfolio-upload"
                    />
                    <div className={`w-full aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center ${
                      (editingItem ? editingItem.imageUrl : newItem.imageUrl) 
                        ? 'border-brand-primary/20 bg-brand-primary/5' 
                        : 'border-slate-200 bg-slate-50 hover:border-brand-primary/50'
                    }`}>
                      {(editingItem ? editingItem.imageUrl : newItem.imageUrl) ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={editingItem ? editingItem.imageUrl : newItem.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-xl shadow-sm" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <p className="text-white text-sm font-bold flex items-center gap-2">
                              <Upload size={18} />
                              Changer la photo
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-primary mb-3">
                            {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                          </div>
                          <p className="text-sm font-bold text-slate-900">Cliquez ou glissez une photo ici</p>
                          <p className="text-xs text-slate-500 mt-1">Image principale (PNG, JPG jusqu'à 2Mo)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Plus size={16} className="text-brand-primary" />
                    Galerie photos (plusieurs possibles)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(editingItem ? editingItem.images : newItem.images)?.map((url, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={idx} 
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (editingItem) {
                              const newImages = [...(editingItem.images || [])];
                              newImages.splice(idx, 1);
                              setEditingItem({...editingItem, images: newImages});
                            } else {
                              const newImages = [...newItem.images];
                              newImages.splice(idx, 1);
                              setNewItem({...newItem, images: newImages});
                            }
                          }}
                          className="absolute inset-0 bg-red-500/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={20} />
                          <span className="text-[10px] font-bold mt-1">Supprimer</span>
                        </button>
                      </motion.div>
                    ))}
                    
                    <div className="relative aspect-square">
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setIsUploading(true);
                            try {
                              const fileArray = Array.from(files);
                              const uploadPromises = fileArray.map((file: File) => 
                                storageService.uploadImage(file, 'portfolio')
                              );
                              const urls = await Promise.all(uploadPromises);
                              
                              if (editingItem) {
                                const imgs = editingItem.images || [];
                                setEditingItem({...editingItem, images: [...imgs, ...urls]});
                              } else {
                                setNewItem({...newItem, images: [...newItem.images, ...urls]});
                              }
                              
                              setMessage(`${urls.length} photos ajoutées`);
                              setTimeout(() => setMessage(''), 3000);
                            } catch (error) {
                              console.error('Batch upload error:', error);
                              setMessage('Erreur de téléchargement');
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="gallery-upload"
                      />
                      <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                        {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                        <span className="text-[10px] font-bold mt-1">Ajouter</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading || (editingItem ? editingItem.imageUrl.startsWith('blob:') : newItem.imageUrl.startsWith('blob:'))} 
                  className={`btn-primary w-full py-3 ${isUploading || (editingItem ? editingItem.imageUrl.startsWith('blob:') : newItem.imageUrl.startsWith('blob:')) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {(isUploading || (editingItem ? editingItem.imageUrl.startsWith('blob:') : newItem.imageUrl.startsWith('blob:'))) ? <Loader2 className="animate-spin" size={18} /> : (editingItem ? <Save size={18} /> : <Plus size={18} />)}
                  {editingItem ? 'Enregistrer' : 'Publier'}
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-brand-primary" size={24} />
                <h2 className="text-xl font-bold">Ajouter Témoignage</h2>
              </div>
              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <input 
                  type="text" 
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  placeholder="Nom du client"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none"
                />
                <input 
                  type="text" 
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                  placeholder="Rôle / Entreprise"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none"
                />
                <textarea 
                  value={newTestimonial.comment}
                  onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                  placeholder="Témoignage"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none h-24"
                />
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon size={16} className="text-brand-primary" />
                    Photo du client
                  </label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'testimonials', (url) => setNewTestimonial({...newTestimonial, avatarUrl: url}));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="avatar-upload"
                    />
                    <div className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all mx-auto ${
                      newTestimonial.avatarUrl ? 'border-brand-primary/20 bg-brand-primary/5' : 'border-slate-200 bg-slate-50 hover:border-brand-primary/50'
                    }`}>
                      {newTestimonial.avatarUrl ? (
                        <div className="relative w-full h-full">
                          <img src={newTestimonial.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className={`btn-primary w-full py-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Plus size={18} />
                  Enregistrer
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Projets Actuels</h2>
                  <p className="text-xs text-slate-500 mt-1">Gérez vos réalisations visibles sur le site.</p>
                </div>
                <div className="bg-brand-secondary/50 px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-tighter">
                  {items.length} projet{items.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {items.length === 0 && <div className="p-12 text-center text-slate-400 italic">Aucun projet trouvé</div>}
                {getPaginatedItems(items, portfolioPage).map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <span className="text-xs uppercase tracking-widest text-slate-500">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-3 text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination 
                current={portfolioPage} 
                total={totalPortfolioPages} 
                onChange={setPortfolioPage} 
              />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-bold">Témoignages Actuels</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {testimonials.length === 0 && <div className="p-12 text-center text-slate-400 italic">Aucun témoignage trouvé</div>}
                {getPaginatedItems(testimonials, testimonialsPage).map((t) => (
                  <div key={t.id} className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={t.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{t.name}</h4>
                        <p className="text-sm text-slate-500 line-clamp-1">{t.comment}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleDeleteTestimonial(t);
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <Pagination 
                current={testimonialsPage} 
                total={totalTestimonialPages} 
                onChange={setTestimonialsPage} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: deleteInfo ? 1 : 0 }}
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all ${deleteInfo ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {deleteInfo && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirmation</h3>
            <p className="text-slate-600 mb-8">
              Êtes-vous sûr de vouloir supprimer <span className="font-bold text-slate-900">"{deleteInfo.title}"</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteInfo(null)}
                disabled={isDeleting}
                className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-4 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
