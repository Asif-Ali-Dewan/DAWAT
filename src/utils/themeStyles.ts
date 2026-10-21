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
    case 'minimal':
      return {
        bgClass: 'bg-stone-50',
        cardBgClass: 'bg-white shadow-xl shadow-stone-200/50',
        textColorClass: 'text-stone-900',
        secondaryTextColorClass: 'text-stone-600',
        mutedTextColorClass: 'text-stone-400',
        accentTextColorClass: 'text-stone-900',
        borderClass: 'border border-stone-200',
        badgeBgClass: 'bg-stone-100 text-stone-800 border border-stone-200',
        ornamentColor: '#1c1917',
        fontHeadingClass: 'font-sans font-semibold tracking-wide',
        fontBodyClass: 'font-sans',
      };

    case 'elegant':
      return {
        bgClass: 'bg-gradient-to-b from-rose-50/60 via-amber-50/30 to-rose-50/60',
        cardBgClass: 'bg-white/95 backdrop-blur-md shadow-2xl shadow-rose-950/5',
        textColorClass: 'text-rose-950',
        secondaryTextColorClass: 'text-rose-800/80',
        mutedTextColorClass: 'text-rose-900/50',
        accentTextColorClass: 'text-amber-700',
        borderClass: 'border-2 border-amber-200/70',
        badgeBgClass: 'bg-amber-50 text-amber-900 border border-amber-200/60',
        ornamentColor: '#d97706',
        fontHeadingClass: 'font-script tracking-wider',
        fontBodyClass: 'font-serif-elegant',
      };

    case 'traditional':
      return {
        bgClass: 'bg-[#042f24] text-emerald-50',
        cardBgClass: 'bg-[#064e3b]/90 backdrop-blur-md border border-amber-400/40 shadow-2xl shadow-black/40',
        textColorClass: 'text-amber-100',
        secondaryTextColorClass: 'text-emerald-100/80',
        mutedTextColorClass: 'text-emerald-200/50',
        accentTextColorClass: 'text-amber-300',
        borderClass: 'border-2 border-amber-400/60',
        badgeBgClass: 'bg-amber-400/10 text-amber-300 border border-amber-400/40',
        ornamentColor: '#fbbf24',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };

    case 'modern':
      return {
        bgClass: 'bg-slate-950 text-slate-100',
        cardBgClass: 'bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/60',
        textColorClass: 'text-slate-100',
        secondaryTextColorClass: 'text-slate-300',
        mutedTextColorClass: 'text-slate-500',
        accentTextColorClass: 'text-amber-400',
        borderClass: 'border border-amber-400/40',
        badgeBgClass: 'bg-slate-800 text-amber-300 border border-amber-400/30',
        ornamentColor: '#fbbf24',
        fontHeadingClass: 'font-sans font-bold tracking-tight',
        fontBodyClass: 'font-sans',
      };

    case 'luxury':
      return {
        bgClass: 'bg-[#20000a] text-amber-50',
        cardBgClass: 'bg-[#350010] border-2 border-amber-400/60 shadow-[0_12px_40px_rgba(53,0,16,0.65)]',
        textColorClass: 'text-amber-100',
        secondaryTextColorClass: 'text-amber-200/90',
        mutedTextColorClass: 'text-amber-300/50',
        accentTextColorClass: 'text-amber-300',
        borderClass: 'border-2 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.2)]',
        badgeBgClass: 'bg-amber-400/15 text-amber-300 border border-amber-400/50',
        ornamentColor: '#fbbf24',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };

    case 'sapphire':
      return {
        bgClass: 'bg-[#180860] text-indigo-50',
        cardBgClass: 'bg-[#290EA0] border-2 border-amber-300/60 shadow-[0_12px_40px_rgba(41,14,160,0.65)]',
        textColorClass: 'text-white',
        secondaryTextColorClass: 'text-indigo-100/90',
        mutedTextColorClass: 'text-indigo-200/60',
        accentTextColorClass: 'text-amber-300',
        borderClass: 'border-2 border-amber-300/70 shadow-[0_0_20px_rgba(251,191,36,0.25)]',
        badgeBgClass: 'bg-amber-400/20 text-amber-300 border border-amber-400/50',
        ornamentColor: '#fbbf24',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };

    case 'classic':
    default:
      return {
        bgClass: 'bg-[#fcfaf7]',
        cardBgClass: 'bg-white/95 backdrop-blur-sm shadow-2xl shadow-stone-900/5',
        textColorClass: 'text-stone-900',
        secondaryTextColorClass: 'text-stone-700',
        mutedTextColorClass: 'text-stone-400',
        accentTextColorClass: 'text-amber-700',
        borderClass: 'border-2 border-amber-200/80 ring-1 ring-amber-300/30',
        badgeBgClass: 'bg-amber-50 text-amber-900 border border-amber-200',
        ornamentColor: '#c59b27',
        fontHeadingClass: 'font-heading tracking-widest',
        fontBodyClass: 'font-serif-elegant',
      };
  }
}
