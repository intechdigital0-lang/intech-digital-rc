import React, { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, isUserAdmin, checkAdminStatus } from '../../lib/firebase';
import { portfolioService } from '../../lib/firestoreService';
import { storageService } from '../../lib/storageService';
import { PortfolioItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, LogOut, Image as ImageIcon, Save, AlertCircle, CheckCircle2, Upload, Loader2, Edit2, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminLocally, setIsAdminLocally] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [portfolioPage, setPortfolioPage] = useState(1);
  const totalPortfolioPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (portfolioPage > totalPortfolioPages && totalPortfolioPages > 0) {
      setPortfolioPage(totalPortfolioPages);
    } else if (items.length > 0 && portfolioPage === 0) {
      setPortfolioPage(1);
    }
  }, [items.length, totalPortfolioPages, portfolioPage]);
  
  const [newItem, setNewItem] = useState({ title: '', category: '', description: '', imageUrl: '', images: [] as string[] });
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<{ id: string; type: 'portfolio'; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isEmailAdmin = isUserAdmin(u.email);
        const isDbAdmin = await checkAdminStatus(u.uid);
        setIsAdminLocally(isEmailAdmin || isDbAdmin);
      } else {
        setIsAdminLocally(false);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const setupSubscriptions = () => {
    const unsubPortfolio = portfolioService.subscribeToItems(setItems);
    return () => unsubPortfolio();
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
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Connecté avec succès.');
    } catch (error: any) {
      console.error('Firebase Auth Error:', error);
      
      if (error.code === 'auth/network-request-failed') {
        const domain = window.location.hostname;
        setMessage(`Erreur réseau de sécurité : Votre navigateur bloque la connexion Firebase à cause de l'Iframe.

ACTIONS REQUISES :
1. Ajoutez "${domain}" dans "Domaines autorisés" de votre console Firebase (Authentication > Settings).
2. Cliquez sur le bouton ci-dessous pour ouvrir l'admin en dehors de l'Iframe.`);
      } else if (error.code === 'auth/user-not-found') {
        setMessage('Compte non trouvé. Vérifiez votre email.');
      } else if (error.code === 'auth/wrong-password') {
        setMessage('Mot de passe incorrect.');
      } else {
        setMessage(`Erreur: ${error.message}`);
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

  const [uploadProgress, setUploadProgress] = useState(0);

  const getDirectDriveLink = (url: string) => {
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/(.+?)\/(?:view|edit|usp=)/) || url.match(/id=(.+?)(?:&|$)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
    return url;
  };

  const handleFileUpload = async (file: File, folder: string, callback: (url: string) => void) => {
    if (!file) return;
    
    if (!auth.currentUser) {
      setMessage("Erreur: Vous devez être connecté pour effectuer cette action.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    let localUrl = '';
    const previousUrl = editingItem ? editingItem.imageUrl : newItem.imageUrl;
    
    try {
      localUrl = URL.createObjectURL(file);
      callback(localUrl);
      
      console.log(`Starting upload for ${file.name} to ${folder}...`);
      setMessage('Traitement de l\'image en cours...');
      
      const url = await storageService.uploadImage(file, folder, (progress) => {
        setUploadProgress(Math.round(progress));
        if (progress < 100) {
          setMessage(`Téléchargement en cours: ${Math.round(progress)}%`);
        } else {
          setMessage('Finalisation du téléchargement...');
        }
      });
      
      console.log(`Upload successful: ${url}`);
      callback(url);
      setMessage('Image téléchargée avec succès. N\'oubliez pas d\'enregistrer les modifications.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      console.error('Upload error detail:', error);
      // Revert to previous URL on failure
      callback(previousUrl);
      
      let errorMsg = error.message || 'Le service Firebase Storage a rejeté la requête.';
      if (error.code === 'storage/unauthorized') {
        errorMsg = "Accès refusé. Vérifiez vos règles de sécurité Firebase Storage ou votre authentification.";
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMsg = "Temps d'attente dépassé. Vérifiez votre connexion internet.";
      }
      setMessage(`Erreur: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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

  const confirmDelete = async () => {
    if (!deleteInfo) return;
    setIsDeleting(true);
    try {
      await portfolioService.deleteItem(deleteInfo.id);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;

  if (!user && !isAdminLocally) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl text-center"
        >
          <div className="mb-6 flex justify-center">
            <img 
              src="https://lh3.googleusercontent.com/d/1cxIXjits5QZ9ROgeNKyiP__nVNmi6Xx5" 
              alt="Intech Digital Logo" 
              className="h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-primary">
            <Key size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Accès Administrateur</h1>
          <p className="text-slate-600 mb-8">Veuillez vous connecter pour gérer le site.</p>
          
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Identifiant ou Email"
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


          {message && (
            <div className="mt-6 text-center space-y-4">
              <p className={`text-sm ${message.includes('succès') || message.includes('Connecté') ? 'text-emerald-500' : 'text-red-500'} whitespace-pre-line`}>
                {message}
              </p>
              
              {message.includes('Iframe') && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <a 
                    href={window.location.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20"
                  >
                    <ExternalLink size={18} />
                    Ouvrir en plein écran
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin</h1>
            <p className="text-slate-500">Gérez le contenu et les accès de Intech Digital DRC</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm font-bold text-sm">
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: '-50%' }} 
              animate={{ opacity: 1, y: 0, x: '-50%' }} 
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-[200] max-w-md w-[calc(100%-2rem)] p-5 rounded-3xl shadow-2xl backdrop-blur-xl border flex flex-col gap-4"
              style={{ 
                backgroundColor: message.toLowerCase().includes('erreur') ? 'rgba(254, 242, 242, 0.95)' : 'rgba(236, 253, 245, 0.95)',
                borderColor: message.toLowerCase().includes('erreur') ? 'rgba(252, 165, 165, 0.3)' : 'rgba(110, 231, 183, 0.3)',
                color: message.toLowerCase().includes('erreur') ? '#dc2626' : '#059669'
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  message.toLowerCase().includes('erreur') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : message.toLowerCase().includes('erreur') ? (
                    <AlertCircle size={24} />
                  ) : (
                    <CheckCircle2 size={24} />
                  )}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold leading-tight">
                    {message}
                  </p>
                  {isUploading && uploadProgress > 0 && (
                    <div className="mt-2 w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-current"
                      />
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setMessage('')} 
                  className="p-2 hover:bg-black/5 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {isUploading && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsUploading(false);
                      setUploadProgress(0);
                      setMessage('Opération débloquée manuellement.');
                      setTimeout(() => setMessage(''), 2000);
                    }}
                    className="flex-1 py-3 px-4 bg-white/50 hover:bg-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-black/5 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} className="rotate-90" />
                    Forcer le déblocage
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1 space-y-8">
            {/* Add Portfolio */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {editingItem ? <Edit2 className="text-brand-primary" size={24} /> : <Plus className="text-brand-primary" size={24} />}
                  <div>
                    <h2 className="text-xl font-bold">{editingItem ? 'Modifier Projet' : 'Ajouter un Projet'}</h2>
                    <p className="text-xs text-slate-500 mt-1">Gérez vos réalisations du portfolio.</p>
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
                  placeholder="Description du projet"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none resize-none"
                />
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <ImageIcon size={16} className="text-brand-primary" />
                      Photo du projet
                    </label>
                    <input 
                      type="text" 
                      value={editingItem ? editingItem.imageUrl : newItem.imageUrl}
                      onChange={(e) => {
                        const val = getDirectDriveLink(e.target.value);
                        if (editingItem) {
                          setEditingItem({...editingItem, imageUrl: val});
                        } else {
                          setNewItem({...newItem, imageUrl: val});
                        }
                      }}
                      placeholder="Lien Drive ou URL"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                    />
                    {isUploading && uploadProgress > 0 && (
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-brand-primary"
                        />
                      </div>
                    )}
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
                          <p className="text-sm font-bold text-slate-900">Importer une photo</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Plus size={16} className="text-brand-primary" />
                    Galerie photos
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
                            if (!auth.currentUser) {
                              setMessage("Erreur: Authentification Firebase requise.");
                              return;
                            }

                            setIsUploading(true);
                            setUploadProgress(0);
                            setMessage(`Préparation de ${files.length} photos...`);
                            
                            const fileArray = Array.from(files) as File[];
                            let successCount = 0;
                            
                            for (let i = 0; i < fileArray.length; i++) {
                              const file = fileArray[i];
                              let tempUrl = '';
                              try {
                                tempUrl = URL.createObjectURL(file);
                                if (editingItem) {
                                  setEditingItem(prev => prev ? {...prev, images: [...(prev.images || []), tempUrl]} : null);
                                } else {
                                  setNewItem(prev => ({...prev, images: [...prev.images, tempUrl]}));
                                }

                                setMessage(`Upload photo ${i + 1}/${fileArray.length}...`);
                                const url = await storageService.uploadImage(file, 'portfolio', (progress) => {
                                  setUploadProgress(Math.round(progress));
                                });
                                
                                if (editingItem) {
                                  setEditingItem(prev => {
                                    if (!prev) return null;
                                    const filtered = (prev.images || []).filter(img => img !== tempUrl);
                                    return {...prev, images: [...filtered, url]};
                                  });
                                } else {
                                  setNewItem(prev => {
                                    const filtered = prev.images.filter(img => img !== tempUrl);
                                    return {...prev, images: [...filtered, url]};
                                  });
                                }
                                successCount++;
                              } catch (uploadError: any) {
                                console.error('Error uploading gallery file:', uploadError);
                                setMessage(`Erreur photo ${i + 1}: ${uploadError.message}`);
                                
                                if (editingItem) {
                                  setEditingItem(prev => {
                                    if (!prev) return null;
                                    return {...prev, images: (prev.images || []).filter(img => img !== tempUrl)};
                                  });
                                } else {
                                  setNewItem(prev => ({
                                    ...prev, 
                                    images: prev.images.filter(img => img !== tempUrl)
                                  }));
                                }
                              }
                            }
                            
                            if (successCount > 0) {
                              setMessage(`${successCount} photos ajoutées`);
                            }
                            setIsUploading(false);
                            setUploadProgress(0);
                            setTimeout(() => setMessage(''), 3000);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="gallery-upload"
                      />
                      <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                        {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                        <span className="text-[10px] font-bold mt-1">Galarie</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isUploading || (editingItem ? (editingItem.imageUrl.startsWith('blob:') || editingItem.images?.some(img => img.startsWith('blob:'))) : (newItem.imageUrl.startsWith('blob:') || newItem.images.some(img => img.startsWith('blob:'))))} 
                  className={`btn-primary w-full py-3 ${isUploading || (editingItem ? (editingItem.imageUrl.startsWith('blob:') || editingItem.images?.some(img => img.startsWith('blob:'))) : (newItem.imageUrl.startsWith('blob:') || newItem.images.some(img => img.startsWith('blob:')))) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {(isUploading || (editingItem ? (editingItem.imageUrl.startsWith('blob:') || editingItem.images?.some(img => img.startsWith('blob:'))) : (newItem.imageUrl.startsWith('blob:') || newItem.images.some(img => img.startsWith('blob:'))))) ? <Loader2 className="animate-spin" size={18} /> : (editingItem ? <Save size={18} /> : <Plus size={18} />)}
                  {editingItem ? 'Enregistrer' : 'Publier le projet'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* List Portfolio */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Projets du Portfolio</h2>
                  <p className="text-xs text-slate-500 mt-1">Liste des réalisations affichées sur le site.</p>
                </div>
                <div className="bg-brand-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-tighter">
                  {items.length} projet{items.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {items.length === 0 && <div className="p-12 text-center text-slate-400 italic">Aucun projet trouvé</div>}
                {getPaginatedItems(items, portfolioPage).map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                      <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">{item.category}</span>
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
          </div>
        </motion.div>
      </div>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {deleteInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeleteInfo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Trash2 size={32} className={isDeleting ? 'animate-pulse' : ''} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Confirmation</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer <br />
                <span className="font-bold text-slate-900 leading-loose">"{deleteInfo.title}"</span> ? <br />
                <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full mt-4 inline-block">Action irréversible</span>
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteInfo(null)}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all disabled:opacity-50 active:scale-95"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
