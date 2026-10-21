import { ThemeConfiguration, ThemePreset } from '../types/invitation';

export interface ThemePresetDefinition {
  id: ThemePreset;
  name: string;
  subtitle: string;
  description: string;
  cardColor: string;
  accentColor: string;
  config: ThemeConfiguration;
}

export const THEME_PRESETS: Record<ThemePreset, ThemePresetDefinition> = {
  'traditional-burgundy': {
    id: 'traditional-burgundy',
    name: 'Traditional Royal Burgundy',
    subtitle: 'Bangladeshi & Pakistani Wedding Vibe',
    description: 'Deep imperial wine velvet (#350010) with clean solid contrast, traditional mehrab arch, and authentic wedding greetings.',
    cardColor: '#350010',
    accentColor: '#D4AF37',
    config: {
      preset: 'traditional-burgundy',
      cardVariant: 'traditional-desi',
      cardColor: '#350010',
      accentColor: '#D4AF37',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
      borderStyle: 'traditional-arch',
      decorativeElement: 'paisley-arch',
      hasStarTexture: false,
    },
  },
  'royal-sapphire': {
    id: 'royal-sapphire',
    name: 'Royal Sapphire Luxe',
    subtitle: 'Majestic Walima & Imperial Evening',
    description: 'Dazzling solid deep royal sapphire (#290EA0) with delicate gold foil filigree and clean admission stub.',
    cardColor: '#290EA0',
    accentColor: '#D4AF37',
    config: {
      preset: 'royal-sapphire',
      cardVariant: 'royal-sapphire',
      cardColor: '#290EA0',
      accentColor: '#D4AF37',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
      borderStyle: 'ornate-gold',
      decorativeElement: 'monogram',
      hasStarTexture: false,
    },
  },
  'corporate-noir': {
    id: 'corporate-noir',
    name: 'Executive Corporate',
    subtitle: 'Annual Summit, Gala & Corporate Function',
    description: 'Refined midnight obsidian (#0F172A) with clean geometric lines, official keynote timeline, and executive admission pass.',
    cardColor: '#0F172A',
    accentColor: '#C5A059',
    config: {
      preset: 'corporate-noir',
      cardVariant: 'corporate-executive',
      cardColor: '#0F172A',
      accentColor: '#C5A059',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      borderStyle: 'corporate-geometric',
      decorativeElement: 'corporate-seal',
      hasStarTexture: false,
    },
  },
  'minimal-ivory': {
    id: 'minimal-ivory',
    name: 'Warm Alabaster Minimal',
    subtitle: 'Daytime Nikah, Holud & Contemporary',
    description: 'Crisp ivory paper (#FAF7F2) with solid burgundy typography (#350010), subtle gold rules, and airy modern layout.',
    cardColor: '#FAF7F2',
    accentColor: '#350010',
    config: {
      preset: 'minimal-ivory',
      cardVariant: 'minimal-ivory',
      cardColor: '#FAF7F2',
      accentColor: '#350010',
      fontHeading: 'Playfair Display',
      fontBody: 'Plus Jakarta Sans',
      borderStyle: 'clean-borderless',
      decorativeElement: 'none',
      hasStarTexture: false,
    },
  },
};

export const EVENT_TEMPLATES = [
  {
    type: 'wedding' as const,
    title: 'Traditional Wedding & Reception',
    subtitle: 'Biye / Shadi / Walima / Nikah',
    badge: 'Desi Wedding Vibe',
    theme: THEME_PRESETS['traditional-burgundy'].config,
  },
  {
    type: 'corporate' as const,
    title: 'Office Function & Executive Gala',
    subtitle: 'Corporate Dinner / Conference / Summit',
    badge: 'Corporate Standard',
    theme: THEME_PRESETS['corporate-noir'].config,
  },
  {
    type: 'celebration' as const,
    title: 'Milestone Celebration & Holud',
    subtitle: 'Gaye Holud / Mehendi / Anniversary',
    badge: 'Festive Vibe',
    theme: THEME_PRESETS['royal-sapphire'].config,
  },
  {
    type: 'custom' as const,
    title: 'Custom Event Invitation',
    subtitle: 'Create a tailored card for any occasion',
    badge: 'Bespoke Freedom',
    theme: THEME_PRESETS['traditional-burgundy'].config,
  },
];

export const PHOTOGRAPHER_QUOTES = [
  "The photographer is still polishing the memories with love. Please check back shortly!",
  "Great celebration photos take a little time to cure. Your gallery will be ready soon!",
  "The camera magic is currently in the editing room. Check back soon to relive the moments!",
];
