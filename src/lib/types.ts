export interface Client {
  name: string;
  foundingYear: number | null;
  license: string;
  industry: string;
  delivery: Record<string, string>;
  socials: { facebook: string; instagram: string; google: string; yelp: string };
  domain: string;
  logoUrl?: string;
  orderUrl?: string;
  serviceArea?: string;
  insured?: boolean;
}

export interface ColorPalette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  border: string;
  borderSubtle?: string;
}

export interface NamePart {
  text: string;
  font: 'name' | 'heading' | 'body';
  color: 'accent' | 'primary' | 'text' | 'textMuted' | 'gradient';
}

export interface NameTreatment {
  parts: NamePart[];
  layout: 'inline' | 'stacked';
}

export interface Brand {
  palette: ColorPalette;
  nameFont: string;
  headingFont: string;
  bodyFont: string;
  monoFont?: string;
  nameTreatment?: NameTreatment;
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

export interface LayoutTokens {
  cardRadius?: 'sharp' | 'soft' | 'round';
  sectionGap?: 'tight' | 'normal' | 'spacious';
  buttonStyle?: 'rounded' | 'pill' | 'square';
  headerStyle?: 'solid' | 'glass' | 'transparent';
  cardStyle?: 'bordered' | 'shadow' | 'flat' | 'elevated' | 'luxury';
  typographyScale?: 'compact' | 'standard' | 'editorial' | 'display';
  imageStyle?: 'rounded' | 'sharp' | 'masked';
  sectionPattern?: 'none' | 'alternating' | 'gradient' | 'wave';
  headerPosition?: 'sticky' | 'static' | 'hidden-on-scroll';
  motionIntensity?: 'none' | 'subtle' | 'standard' | 'dramatic';
  atmosphereLevel?: 'none' | 'minimal' | 'rich' | 'cinematic';
  heroStyle?: 'split' | 'overlay' | 'video' | 'minimal';
  buttonVariant?: 'solid' | 'ghost' | 'tactile';
  dividerStyle?: 'line' | 'glow' | 'fade' | 'none';
}

export interface SectionEntry {
  id: string;
  variant?: string | number;
}

export interface Theme {
  sectionOrder?: string[];
  heroVariant?: number;
  accentStyle?: string;
  faviconShape?: string;
  industry: string;
  sections?: SectionEntry[];
  layout?: LayoutTokens;
  marqueeItems?: string[];
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
  videoUrl?: string;
  videoPoster?: string;
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
  reviewCount?: number;
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
