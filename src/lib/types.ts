export interface Client {
  name: string;
  foundingYear: number | null;
  license: string;
  industry: string;
  delivery: Record<string, string>;
  socials: { facebook: string; instagram: string; google: string; yelp: string };
  domain: string;
}

export interface Brand {
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  headerColor: string;
  bodyTextColor: string;
  bodyTextColorWhite: string;
  offWhite: string;
  cream: string;
  dark: string;
  medium: string;
  accentDark: string;
  silver: string;
}

export interface Contact {
  email: string;
  phoneForTel: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mapLink: string;
  lat?: number;
  lng?: number;
}

export interface HoursDay {
  day: string;
  open: string | null;
  close: string | null;
}

export interface Hours {
  days: HoursDay[];
}

export interface SEO {
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface Theme {
  heroVariant: number;
  accentStyle: string;
  faviconShape: string;
}

export interface Alert {
  enabled: boolean;
  text: string;
}

export interface Hero {
  heroImage: string;
  heroTagline: string;
  heroSubtitle: string;
  fallbackImage?: string;
}

export interface Testimonial {
  text: string;
  author: string;
  initials: string;
  role: string;
  rating: number;
  source: string;
  url: string;
}

export interface Testimonials {
  items: Testimonial[];
}

export interface FaqItem {
  question: string;
  answer: string;
  source?: string;
}

export interface Faq {
  items: FaqItem[];
}

export interface GalleryImage {
  url: string;
  alt: string;
  fallbackUrl: string;
}

export interface Gallery {
  images: GalleryImage[];
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
}

export interface About {
  heading: string;
  text: string;
}
