import React, { useState, useEffect } from 'react';
import { Invitation } from '../types/invitation';
import { ScheduleItem } from '../types/schedule';
import { invitationService } from '../services/invitationService';
import { scheduleService } from '../services/scheduleService';
import { InvitationCard } from '../components/common/InvitationCard';
import {
  Smartphone,
  Tablet,
  Monitor,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface PreviewPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PreviewPage: React.FC<PreviewPageProps> = ({ slug, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const inv = await invitationService.getInvitationBySlug(slug);
      if (inv) {
        setInvitation(inv);
        const sch = await scheduleService.getScheduleByInvitationId(inv.id);
        setSchedule(sch);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading || !invitation) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
        <p>Loading Live Preview...</p>
      </div>
    );
  }

  const getFrameWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[400px]';
      case 'tablet':
        return 'max-w-[640px]';
      case 'desktop':
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      {/* Top Device Switcher Bar */}
      <header className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between z-30">
        <button
          type="button"
          onClick={() => onNavigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Preview</span>
        </button>

        {/* Device toggles */}
        <div className="flex items-center space-x-1 bg-stone-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              device === 'mobile' ? 'bg-[#350010] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              device === 'tablet' ? 'bg-[#350010] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              device === 'desktop' ? 'bg-[#350010] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
        </div>

        <a
          href={`/#/invite/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-900 hover:bg-stone-200 transition"
        >
          <span>Open Public Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Frame Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className={`w-full ${getFrameWidth()} transition-all duration-300 ${
            device === 'mobile'
              ? 'p-4 bg-stone-900 rounded-[44px] shadow-2xl border-4 border-stone-800 my-4'
              : device === 'tablet'
              ? 'p-6 bg-stone-900 rounded-[32px] shadow-2xl border-4 border-stone-800 my-4'
              : 'my-4'
          }`}
        >
          {device === 'mobile' && (
            <div className="w-28 h-4 bg-stone-800 rounded-full mx-auto mb-4" />
          )}

          <div className="overflow-hidden rounded-2xl">
            <InvitationCard
              invitation={invitation}
              schedule={schedule}
              isMobilePreview={device === 'mobile'}
              onNavigateToPhotos={() => onNavigate(`/photos/${slug}`)}
            />
          </div>

          {device === 'mobile' && (
            <div className="w-24 h-1 bg-stone-700 rounded-full mx-auto mt-4" />
          )}
        </div>
      </div>
    </div>
  );
};
