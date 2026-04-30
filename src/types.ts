export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  whatsappMessage: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  technologies?: string[];
  testimonial?: {
    name: string;
    comment: string;
    company?: string;
    role?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  role: string;
  avatarUrl: string;
}
