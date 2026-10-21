import React from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Camera,
  Share2,
  Palette,
  QrCode,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  activeSlug: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, activeSlug }) => {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 selection:bg-amber-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-200/20 via-rose-100/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 border border-amber-500/20 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Next-Generation Wedding-Tech</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-normal tracking-tight text-stone-900 leading-[1.1]">
              Elevate Your Special Day With A <span className="gold-gradient-text italic font-serif-elegant">Bespoke</span> Digital Invitation
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto font-sans">
              Create an unforgettable first impression. Replace paper chaos with interactive digital wedding cards, real-time Google Maps directions, visual timelines, and effortless wedding photo QR portals.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/create')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-sm sm:text-base bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-xl shadow-amber-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Create Your Wedding Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate(`/invite/${activeSlug}`)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm sm:text-base bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 shadow-md hover:border-amber-400 transition-all flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span>Experience Live Guest Card</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>

            {/* Quick feature pill tags */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-stone-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>No Guest Login Required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Mobile-First Luxury Layout</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant Photo QR Access</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Supabase Ready Architecture</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Showcase Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-300/40 via-amber-200/20 to-stone-200 shadow-2xl shadow-stone-900/10">
              <div className="rounded-[22px] bg-white p-6 sm:p-10 border border-stone-100 flex flex-col md:flex-row items-center gap-8">
                {/* Visual left */}
                <div className="w-full md:w-1/2 p-6 rounded-2xl bg-[#fcfaf7] border-2 border-amber-200/70 text-center relative overflow-hidden shadow-inner">
                  <div className="absolute top-2 right-2 text-xs font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    SAMPLE TICKET
                  </div>
                  <div className="w-12 h-12 rounded-full border border-dashed border-amber-600 text-amber-700 mx-auto mb-3 flex items-center justify-center font-heading font-bold text-sm">
                    A &bull; A
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400">Wedding Celebration</p>
                  <h3 className="text-2xl font-heading font-bold text-stone-900 mt-1">
                    Ayesha & Arif
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold mt-1">
                    Friday, 18 December 2026
                  </p>
                  <div className="h-[1px] w-16 bg-amber-300 mx-auto my-3" />
                  <p className="text-xs text-stone-600">The Grand Regal Palace &bull; Gulshan</p>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                      Directions Active
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                      Timeline Included
                    </span>
                  </div>
                </div>

                {/* Content right */}
                <div className="w-full md:w-1/2 space-y-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    Why Modern Couples Choose Dawat
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
                    Everything Your Guests Need, At Their Fingertips
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Say goodbye to endless WhatsApp location queries and lost paper invites. Dawat turns your wedding invitation into an interactive keepsake with one-tap venue directions, live ceremony schedule, and instant QR photo access.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('/dashboard')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition"
                    >
                      Explore Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/photos/${activeSlug}`)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 transition flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Test Photo QR State</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-stone-100/60 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Thoughtful Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-stone-900">
              Designed For The Discerning Host
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Every detail crafted with refined aesthetics, smooth micro-interactions, and flawless mobile responsiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                Curated Luxury Themes
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Choose between Classic Royale, Minimalist Alabaster, Champagne Silk, Emerald Heritage, and Midnight Glamour. Tailored fonts, borders, and color harmonies.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                Instant Google Maps Venue
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Your guests tap once and navigate directly to the venue parking and hall entrance without getting lost in city traffic.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                Interactive Event Timeline
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Display the ceremony, photography session, and royal feast schedule in a beautiful chronological timeline with real-time countdown.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                Wedding Photo QR Portal
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Each invitation includes a dedicated QR code. Connect Google Drive or cloud folders, with playful wedding-themed states when photos are still developing.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                One-Click Multi-Channel Sharing
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Share via WhatsApp with pre-filled gracious greetings, Messenger, email, direct link copy, or export high-resolution downloadable digital cards.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-stone-900">
                Production-Ready Clean Architecture
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Modular decoupled TypeScript services, clean data contracts, and complete isolation prepared for future seamless Supabase integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inviter vs Guest Experience Overview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Two Harmonious Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-stone-900">
            Engineered For Both Inviter & Guests
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inviter Experience Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 to-stone-100 border border-amber-300/60 space-y-5">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white uppercase tracking-wider">
              Experience A &bull; The Inviter
            </div>
            <h3 className="text-2xl font-heading font-bold text-stone-900">
              Complete Command & Customization
            </h3>
            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Multi-step creation wizard with live real-time preview</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Custom design tokens: Fonts, layouts, colors, and crests</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Interactive timeline manager: reorder, add, and edit functions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Toggle photo availability & configure photographer quotes</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>RSVP dashboard with attendance counts and guest messages</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition"
            >
              Open Inviter Dashboard &rarr;
            </button>
          </div>

          {/* Guest Experience Box */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-stone-900 text-white uppercase tracking-wider">
              Experience B &bull; The Guest
            </div>
            <h3 className="text-2xl font-heading font-bold text-stone-900">
              Effortless, Fast, Zero Login
            </h3>
            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Opens instantly on mobile without signup or app installation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Direct Google Maps integration for smooth venue navigation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-stone-800 shrink-0" />
                <span>One-tap RSVP with celebration confetti feedback</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Add to Google Calendar & Apple/Outlook (.ics) with one click</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Dedicated QR scan to access wedding photos & albums</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => onNavigate(`/invite/${activeSlug}`)}
              className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              Launch Public Guest Page &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heart className="w-10 h-10 text-amber-400 mx-auto fill-amber-400" />
          <h2 className="text-3xl sm:text-5xl font-heading font-normal">
            Ready To Create Your Wedding Invitation?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Craft a memorable experience for your families and guests in minutes.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/create')}
              className="px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Start Creating Now — It&apos;s Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
