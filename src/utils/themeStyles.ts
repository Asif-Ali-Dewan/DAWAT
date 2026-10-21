import { ThemeConfiguration } from '../types/invitation';

export interface ThemeComputedStyles {
  bgClass: string;
  cardBgClass: string;
  textColorClass: string;
  secondaryTextColorClass: string;
  mutedTextColorClass: string;
  accentTextColorClass: string;
  borderClass: string;
  badgeBgClass: string;
  ornamentColor: string;
  fontHeadingClass: string;
  fontBodyClass: string;
}

export function getThemeComputedStyles(theme: ThemeConfiguration): ThemeComputedStyles {
  switch (theme.preset) {
    case 'royal-sapphire':
      return {
        bgClass: 'bg-[#12054a]',
        cardBgClass: 'bg-[#290EA0] text-[#EEF2FF]',
        textColorClass: 'text-white',
        secondaryTextColorClass: 'text-[#F3DF93]',
        mutedTextColorClass: 'text-indigo-200/70',
        accentTextColorClass: 'text-[#D4AF37]',
        borderClass: 'border-2 border-[#D4AF37]/60',
        badgeBgClass: 'bg-[#19086a] text-[#F3DF93] border border-[#D4AF37]/50',
        ornamentColor: '#D4AF37',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };

    case 'corporate-noir':
      return {
        bgClass: 'bg-[#0B1120]',
        cardBgClass: 'bg-[#0F172A] text-slate-100',
        textColorClass: 'text-white',
        secondaryTextColorClass: 'text-slate-300',
        mutedTextColorClass: 'text-slate-400',
        accentTextColorClass: 'text-[#C5A059]',
        borderClass: 'border border-slate-700',
        badgeBgClass: 'bg-slate-800 text-slate-200 border border-slate-600',
        ornamentColor: '#C5A059',
        fontHeadingClass: 'font-sans font-bold tracking-tight',
        fontBodyClass: 'font-sans',
      };

    case 'minimal-ivory':
      return {
        bgClass: 'bg-[#FAF7F2]',
        cardBgClass: 'bg-white text-stone-900',
        textColorClass: 'text-[#350010]',
        secondaryTextColorClass: 'text-stone-700',
        mutedTextColorClass: 'text-stone-500',
        accentTextColorClass: 'text-[#350010]',
        borderClass: 'border border-stone-300',
        badgeBgClass: 'bg-stone-100 text-[#350010] border border-stone-300',
        ornamentColor: '#350010',
        fontHeadingClass: 'font-heading font-semibold tracking-wide',
        fontBodyClass: 'font-sans',
      };

    case 'traditional-burgundy':
    default:
      return {
        bgClass: 'bg-[#20000a]',
        cardBgClass: 'bg-[#350010] text-[#FFFBEB]',
        textColorClass: 'text-[#FFFBEB]',
        secondaryTextColorClass: 'text-[#F3DF93]',
        mutedTextColorClass: 'text-[#F3DF93]/70',
        accentTextColorClass: 'text-[#D4AF37]',
        borderClass: 'border-2 border-[#D4AF37]/70',
        badgeBgClass: 'bg-[#52081d] text-[#F3DF93] border border-[#D4AF37]/50',
        ornamentColor: '#D4AF37',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };
  }
}
