import { ThemeConfiguration, ThemePreset } from '../types/invitation';

export interface ThemePresetDefinition {
  id: ThemePreset;
  name: string;
  subtitle: string;
  description: string;
  previewBg: string;
  previewAccent: string;
  previewTextColor: string;
  config: ThemeConfiguration;
}

export const THEME_PRESETS: Record<ThemePreset, ThemePresetDefinition> = {
  classic: {
    id: 'classic',
    name: 'Classic Royale',
    subtitle: 'Timeless Ivory & Gold',
    description: 'Sophisticated ivory canvas with lustrous antique gold borders, botanical motifs, and Cormorant serif typography.',
    previewBg: '#FAF7F0',
    previewAccent: '#C59B27',
    previewTextColor: '#292524',
    config: {
      preset: 'classic',
      accentColor: '#C59B27',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
      borderStyle: 'double-gold',
      cardLayout: 'story',
      decorativeElement: 'botanical',
      textAlignment: 'center',
      backgroundStyle: 'ivory-silk',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Modern Minimal',
    subtitle: 'Clean & Contemporary',
    description: 'Understated elegance with crisp typography, fine hairline borders, and balanced whitespace.',
    previewBg: '#FFFFFF',
    previewAccent: '#1C1917',
    previewTextColor: '#1C1917',
    config: {
      preset: 'minimal',
      accentColor: '#1C1917',
      fontHeading: 'Outfit',
      fontBody: 'Plus Jakarta Sans',
      borderStyle: 'minimal-thin',
      cardLayout: 'compact',
      decorativeElement: 'none',
      textAlignment: 'center',
      backgroundStyle: 'sand-stone',
    },
  },
  elegant: {
    id: 'elegant',
    name: 'Champagne Grace',
    subtitle: 'Blush, Silk & Calligraphy',
    description: 'Romantic champagne shimmer with delicate script accents, floral corner emblems, and soft rose gold detailing.',
    previewBg: '#FFF9F5',
    previewAccent: '#D97706',
    previewTextColor: '#431407',
    config: {
      preset: 'elegant',
      accentColor: '#D97706',
      fontHeading: 'Alex Brush',
      fontBody: 'Playfair Display',
      borderStyle: 'floral-corners',
      cardLayout: 'split',
      decorativeElement: 'floral',
      textAlignment: 'center',
      backgroundStyle: 'rose-champagne',
    },
  },
  traditional: {
    id: 'traditional',
    name: 'Royal Heritage',
    subtitle: 'Emerald & Gold Majesty',
    description: 'Regal deep emerald hues graced with ornate gold filigree, classic monograms, and opulent celebration flair.',
    previewBg: '#064E3B',
    previewAccent: '#F59E0B',
    previewTextColor: '#FDFBF7',
    config: {
      preset: 'traditional',
      accentColor: '#F59E0B',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
      borderStyle: 'ornate',
      cardLayout: 'royal-scroll',
      decorativeElement: 'monogram',
      textAlignment: 'center',
      backgroundStyle: 'emerald-luxe',
    },
  },
  modern: {
    id: 'modern',
    name: 'Midnight Glamour',
    subtitle: 'Obsidian & Starlight Gold',
    description: 'Dramatic dark mode luxury with warm gold foil highlights, sleek typography, and contemporary card styling.',
    previewBg: '#0F172A',
    previewAccent: '#FBBF24',
    previewTextColor: '#F8FAFC',
    config: {
      preset: 'modern',
      accentColor: '#FBBF24',
      fontHeading: 'Plus Jakarta Sans',
      fontBody: 'Plus Jakarta Sans',
      borderStyle: 'clean',
      cardLayout: 'story',
      decorativeElement: 'rings',
      textAlignment: 'center',
      backgroundStyle: 'midnight-gold',
    },
  },
  luxury: {
    id: 'luxury',
    name: 'Velvet Noir',
    subtitle: 'Imperial Burgundy & Gold',
    description: 'Deep royal wine velvet canvas adorned with gleaming gold typography, royal crests, and exquisite craftsmanship.',
    previewBg: '#4A0404',
    previewAccent: '#FBBF24',
    previewTextColor: '#FFFBEB',
    config: {
      preset: 'luxury',
      accentColor: '#FBBF24',
      fontHeading: 'Cinzel',
      fontBody: 'Cormorant Garamond',
      borderStyle: 'ornate',
      cardLayout: 'royal-scroll',
      decorativeElement: 'botanical',
      textAlignment: 'center',
      backgroundStyle: 'burgundy-velvet',
    },
  },
};

export const PHOTOGRAPHER_QUOTES = [
  "The photographer is still negotiating with the camera. Please check back soon!",
  "The memories are still being edited with extra love. Give the photographer a little more time.",
  "Great love stories take time to develop — our wedding gallery will be published right here soon!",
  "The photographer is picking out the golden hour magic. Photos will appear here shortly.",
  "Still curing the pixels! Return soon to relive the laughs, hugs, and dance moves.",
];
