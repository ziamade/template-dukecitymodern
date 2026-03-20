export interface Client {
  name: string;
  foundingYear: number | null;
  license: string;
  industry: string;
  delivery: Record<string, string>;
  socials: { facebook: string; instagram: string; google: string; yelp: string };
  domain: string;
}

export interface ColorPalette {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
}

export interface Brand {
  light: ColorPalette;
  dark: ColorPalette;
  nameFont: string;
  headingFont: string;
  bodyFont: string;
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
  sectionOrder: string[];
  heroVariant: number;
  accentStyle: string;
  faviconShape: string;
  industry: string;
  defaultMode: 'light' | 'dark';
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
  featured?: boolean;
  photo?: string | null;
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

export interface Project {
  title: string;
  description: string;
  before: string;
  after: string;
  during?: string;
  service: string;
}

export interface Projects {
  projects: Project[];
}
