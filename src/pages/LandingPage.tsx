import React, { useState } from 'react';
import { Invitation } from '../types/invitation';
import { INITIAL_MOCK_INVITATION, INITIAL_CORPORATE_INVITATION, INITIAL_MOCK_SCHEDULE } from '../data/mockData';
import { THEME_PRESETS, EVENT_TEMPLATES } from '../config/themes';
import { InvitationCard } from '../components/common/InvitationCard';
import {
  Heart,
  Briefcase,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Layers,
  MapPin,
  Clock,
  QrCode,
  Share2,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  activeSlug: string;
  onSelectTemplate?: (templateType: 'wedding' | 'corporate' | 'celebration' | 'custom') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  activeSlug,
  onSelectTemplate,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<
    'traditional-burgundy' | 'corporate-noir' | 'royal-sapphire' | 'minimal-ivory'
  >('traditional-burgundy');

  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'desktop'>('mobile');

  // Build sample invitations corresponding to the selected variant
  const getPreviewInvitation = (): Invitation => {
    switch (selectedVariant) {
      case 'corporate-noir':
        return INITIAL_CORPORATE_INVITATION;
      case 'royal-sapphire':
        return {
          ...INITIAL_MOCK_INVITATION,
          id: 'preview-sapphire',
          eventType: 'celebration',
          title: 'Farhana & Tanvir Holud & Sangeet Night',
          couple: {
            ...INITIAL_MOCK_INVITATION.couple,
            coupleDisplayName: 'Farhana & Tanvir Sangeet Night',
          },
          theme: THEME_PRESETS['royal-sapphire'].config,
        };
      case 'minimal-ivory':
        return {
          ...INITIAL_MOCK_INVITATION,
          id: 'preview-minimal',
          theme: THEME_PRESETS['minimal-ivory'].config,
        };
      case 'traditional-burgundy':
      default:
        return INITIAL_MOCK_INVITATION;
    }
  };

  const previewInv = getPreviewInvitation();

  const handleStartWithTemplate = (type: 'wedding' | 'corporate' | 'celebration' | 'custom') => {
    if (onSelectTemplate) {
      onSelectTemplate(type);
    }
    onNavigate('/create');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900">
      {/* 1. PROPER HOSPITABLE WELCOME SECTION */}
      <section className="pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#350010]/10 text-[#350010] border border-[#350010]/20">
            <Sparkles className="w-4 h-4 text-[#350010]" />
            <span>স্বাগতম &bull; Khushamdeed &bull; Welcome to Dawat</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-stone-900 tracking-tight leading-tight">
            Create Your Digital Invitation in Seconds
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto font-light leading-relaxed">
            Choose what you are celebrating below to generate your personalized mobile invitation card, Google Maps venue link, timeline, and photo pass.
          </p>

          {/* Quick Start Event Options (3-4 clear options + Custom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-left">
            {/* 1. Traditional Wedding */}
            <div
              onClick={() => handleStartWithTemplate('wedding')}
              className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#350010] bg-[#faf8f5] hover:bg-white transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#350010] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#350010]">
                    Desi Wedding Vibe
                  </span>
                  <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-[#350010] transition">
                    Traditional Wedding
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Biye, Shadi, Walima & Nikah. Deep Burgundy & Gold.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-[#350010] flex items-center space-x-1"
              >
                <span>Select & Create</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 2. Corporate Function */}
            <div
              onClick={() => handleStartWithTemplate('corporate')}
              className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#0F172A] bg-[#faf8f5] hover:bg-white transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                    Corporate Standard
                  </span>
                  <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-slate-900 transition">
                    Office Function
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Annual Dinner, Executive Gala, Conference & Awards.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-slate-800 flex items-center space-x-1"
              >
                <span>Select & Create</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 3. Festive Celebration */}
            <div
              onClick={() => handleStartWithTemplate('celebration')}
              className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#290EA0] bg-[#faf8f5] hover:bg-white transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#290EA0] text-[#D4AF37] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#290EA0]">
                    Festive Night
                  </span>
                  <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-[#290EA0] transition">
                    Holud & Sangeet
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Gaye Holud, Mehendi, Anniversary & Parties.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-[#290EA0] flex items-center space-x-1"
              >
                <span>Select & Create</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4. Custom Card */}
            <div
              onClick={() => handleStartWithTemplate('custom')}
              className="p-5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-600 bg-white hover:bg-stone-50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Bespoke Freedom
                  </span>
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    Make Custom Card
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Match any theme, color code, or event structure.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 text-xs font-bold text-stone-800 flex items-center space-x-1"
              >
                <span>Build From Scratch</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARD VARIANT SHOWCASE & LIVE INTERACTIVE PREVIEW */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#350010]">
            Card Designs & Variations
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-stone-900">
            Preview The 4 Dedicated Card Aesthetics
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Solid rich backgrounds, celestial stardust texture, and authentic typography.
          </p>

          {/* Variant Switcher Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              {
                id: 'traditional-burgundy' as const,
                label: 'Traditional Burgundy (#350010)',
                color: '#350010',
              },
              {
                id: 'royal-sapphire' as const,
                label: 'Royal Sapphire (#290EA0)',
                color: '#290EA0',
              },
              {
                id: 'corporate-noir' as const,
                label: 'Executive Corporate (#0F172A)',
                color: '#0F172A',
              },
              {
                id: 'minimal-ivory' as const,
                label: 'Alabaster Minimal (#FAF7F2)',
                color: '#FAF7F2',
              },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition ${
                  selectedVariant === v.id
                    ? 'border-[#350010] bg-[#350010] text-white shadow-sm'
                    : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: v.color }}
                />
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          {/* Viewport switch: Mobile vs Desktop */}
          <div className="pt-3 flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${
                previewViewport === 'mobile'
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${
                previewViewport === 'desktop'
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Desktop Preview</span>
            </button>
          </div>
        </div>

        {/* Live Card Render Frame */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-300 mx-auto ${
              previewViewport === 'mobile'
                ? 'max-w-[400px] p-4 bg-stone-900 rounded-[42px] border-4 border-stone-800 shadow-2xl'
                : 'w-full'
            }`}
          >
            {previewViewport === 'mobile' && (
              <div className="w-24 h-3.5 bg-stone-800 rounded-full mx-auto mb-3" />
            )}

            <div className="overflow-hidden rounded-2xl">
              <InvitationCard
                invitation={previewInv}
                schedule={INITIAL_MOCK_SCHEDULE}
                isMobilePreview={previewViewport === 'mobile'}
                onNavigateToPhotos={() => onNavigate(`/photos/${previewInv.slug}`)}
              />
            </div>

            {previewViewport === 'mobile' && (
              <div className="w-20 h-1 bg-stone-700 rounded-full mx-auto mt-3" />
            )}
          </div>
        </div>
      </section>

      {/* 3. ESSENTIAL CAPABILITIES SUMMARY */}
      <section className="py-14 bg-white border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
              <MapPin className="w-6 h-6 text-[#350010]" />
              <h4 className="font-bold text-sm text-stone-900">One-Tap Google Maps Venue</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Guests tap the venue button directly on their phone and get turn-by-turn driving & parking directions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
              <Clock className="w-6 h-6 text-[#350010]" />
              <h4 className="font-bold text-sm text-stone-900">Visual Timeline & Schedule</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Clearly display Nikah, Reception banquet, feast timings, or corporate keynote agendas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
              <QrCode className="w-6 h-6 text-[#350010]" />
              <h4 className="font-bold text-sm text-stone-900">Photo QR & WhatsApp Share</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Send to WhatsApp in one tap, and give guests a QR code for wedding photos and digital admission.
              </p>
            </div>
          </div>

          {/* Quick CTA Bottom */}
          <div className="mt-12 text-center space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('/create')}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-[#350010] hover:bg-[#52081d] text-white shadow transition-all hover:scale-105 active:scale-95"
            >
              Start Generating Your Invitation Card
            </button>
            <p className="text-[11px] text-stone-400">
              No registration required for guests &bull; 100% mobile-optimized
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
