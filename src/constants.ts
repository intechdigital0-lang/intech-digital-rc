import { Service, PortfolioItem, Testimonial } from './types';

export const WHATSAPP_NUMBER = "+243895409557";
export const EMAIL = "contact.intechdigitaldrc@gmail.com";
export const ADDRESS = "Kinshasa, RDC";

export const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
};

export const SERVICES: Service[] = [
  {
    id: 'design',
    title: 'Design Graphique',
    description: 'Logos mémorables, flyers percutants et affiches qui captent l\'attention de vos clients.',
    iconName: 'Palette',
    whatsappMessage: 'Bonjour Intech Digital DRC, je souhaiterais commander un service de Design Graphique.'
  },
  {
    id: 'web',
    title: 'Création de Site Web',
    description: 'Des sites web modernes, rapides et optimisés pour convertir vos visiteurs en clients.',
    iconName: 'Globe',
    whatsappMessage: 'Bonjour Intech Digital DRC, je souhaiterais commander la création d\'un site web.'
  },
  {
    id: 'marketing',
    title: 'Marketing Digital',
    description: 'Stratégies publicitaires ciblées pour augmenter votre visibilité et vos ventes en ligne.',
    iconName: 'TrendingUp',
    whatsappMessage: 'Bonjour Intech Digital DRC, je suis intéressé par vos services de Marketing Digital.'
  },
  {
    id: 'community',
    title: 'Community Management',
    description: 'Gestion professionnelle de vos réseaux sociaux pour bâtir une communauté engagée.',
    iconName: 'Users',
    whatsappMessage: 'Bonjour Intech Digital DRC, je souhaiterais confier la gestion de mes réseaux sociaux à votre agence.'
  },
  {
    id: 'mobile-software',
    title: 'Application Mobile & Logiciel',
    description: 'Développement d\'applications mobiles intuitives et de logiciels sur mesure pour automatiser vos processus.',
    iconName: 'Smartphone',
    whatsappMessage: 'Bonjour Intech Digital DRC, je souhaiterais obtenir un devis pour la création d\'une application mobile ou d\'un logiciel.'
  },
  {
    id: 'ads-campaigns',
    title: 'Campagnes Publicitaires pour tout vos réseaux',
    description: 'Création et gestion de campagnes publicitaires percutantes pour maximiser votre visibilité sur Facebook, Instagram, LinkedIn et plus.',
    iconName: 'Megaphone',
    whatsappMessage: 'Bonjour Intech Digital DRC, je souhaiterais confier la création de mes campagnes publicitaires à votre agence.'
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'Branding Local pour Kinshasa',
    category: 'Design Graphique',
    imageUrl: 'https://images.unsplash.com/photo-1516248676881-5b71944615ea?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'E-commerce Mode Africaine',
    category: 'Développement Web',
    imageUrl: 'https://images.unsplash.com/photo-1523240693567-510e1274c938?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Campagne Digitale Startup RDC',
    category: 'Marketing Digital',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Identité Visuelle Event',
    category: 'Design Graphique',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Jean Mukendi',
    role: 'CEO, ShopTech RDC',
    comment: 'Une équipe incroyablement créative et réactive. Mon chiffre d\'affaires a doublé après leur intervention.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Sarah Kalanga',
    role: 'Fondatrice, Glow Kinshasa',
    comment: 'Le site web qu\'ils ont créé pour ma boutique est magnifique. Mes clients adorent l\'expérience fluide.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Marc Bolamba',
    role: 'Directeur Marketing',
    comment: 'Professionnalisme et résultats concrets. La gestion de nos réseaux sociaux est désormais entre de bonnes mains.',
    rating: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=150&auto=format&fit=crop'
  }
];
