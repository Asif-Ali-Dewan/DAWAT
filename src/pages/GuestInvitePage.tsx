import React, { useState, useEffect } from 'react';
import { Invitation } from '../types/invitation';
import { ScheduleItem } from '../types/schedule';
import { invitationService } from '../services/invitationService';
import { scheduleService } from '../services/scheduleService';
import { InvitationCard } from '../components/common/InvitationCard';
import { RsvpModal } from '../components/common/RsvpModal';
import { getThemeComputedStyles } from '../utils/themeStyles';
import confetti from 'canvas-confetti';
import {
  Heart,
  Volume2,
  CheckCircle,
  Camera,
} from 'lucide-react';

interface GuestInvitePageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const GuestInvitePage: React.FC<GuestInvitePageProps> = ({ slug, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Play pleasant ambient chime using Web Audio API
  const playHarmonicChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Harmonious chord notes (F#, A#, C#, F)
      const frequencies = [369.99, 466.16, 554.37, 739.99];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1 * idx + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + 0.08 * idx);
        osc.stop(ctx.currentTime + 2.8);
      });
      setAudioPlaying(true);
      setTimeout(() => setAudioPlaying(false), 3000);
    } catch (e) {
      console.warn('Web Audio playback failed or blocked:', e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const inv = await invitationService.getInvitationBySlug(slug);
        if (!isMounted) return;

        if (inv) {
          setInvitation(inv);
          const sch = await scheduleService.getScheduleByInvitationId(inv.id);
          if (isMounted) setSchedule(sch);
        } else {
          setError('This invitation could not be found. It may have expired or the link may be incorrect.');
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load wedding invitation at this moment. Please try again soon.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    playHarmonicChime();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FBBF24', '#F472B6', '#34D399'],
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <h2 className="text-xl font-heading font-bold text-stone-800">
            Unfolding Your Royal Invitation...
          </h2>
          <p className="text-xs text-stone-500">Preparing celebration moments & venue details</p>
        </div>
      </div>
    );
  }

  // Error / Not Found State (Graceful & Friendly)
  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-stone-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-stone-900">
            Invitation Not Found
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {error || 'This invitation could not be found. It may have expired or the link may be incorrect.'}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/invite/ayesha-arif')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              Open Sample Demo Invitation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const styles = getThemeComputedStyles(invitation.theme);

  return (
    <div className={`min-h-screen ${styles.bgClass} transition-colors duration-500 py-6 sm:py-12 px-3 sm:px-6`}>
      {/* Floating Audio & Demo Bar */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
        <button
          type="button"
          onClick={playHarmonicChime}
          className="p-2.5 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-md text-amber-700 dark:text-amber-400 hover:scale-105 transition"
          title="Play Celebration Chime"
        >
          {audioPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/dashboard')}
          className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-md text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-white transition"
        >
          Inviter Dashboard
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* ENVELOPE / WAX SEAL OPENING EXPERIENCE */}
        {!isOpened ? (
          <div className="my-8 sm:my-16 max-w-lg mx-auto text-center space-y-6 animate-fade-in">
            {/* Envelope Card */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-white shadow-2xl border-2 border-amber-300/60 overflow-hidden text-center space-y-6">
              {/* Decorative Envelope Flap Lines */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4" />

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-amber-700">
                  You Have Received An Auspicious Invitation
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-stone-900">
                  {invitation.couple.coupleDisplayName ||
                    `${invitation.couple.brideName} & ${invitation.couple.groomName}`}
                </h1>
                <p className="text-xs text-stone-500 font-serif-elegant italic">
                  request the honor of your gracious presence
                </p>
              </div>

              {/* Wax Seal Button */}
              <div className="py-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenEnvelope}
                  className="group relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-amber-100 shadow-xl shadow-amber-900/30 flex flex-col items-center justify-center border-4 border-amber-300/70 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Heart className="w-8 h-8 fill-amber-200 text-amber-200 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-heading font-bold tracking-widest uppercase mt-1">
                    Open
                  </span>
                </button>
              </div>

              <p className="text-xs text-stone-400">
                Tap the royal seal above to reveal your digital invitation & venue details
              </p>
            </div>
          </div>
        ) : (
          /* UNVEILED INVITATION CARD */
          <div className="animate-fade-in space-y-8">
            <InvitationCard
              invitation={invitation}
              schedule={schedule}
              onOpenRsvp={() => setRsvpModalOpen(true)}
              onNavigateToPhotos={() => onNavigate(`/photos/${invitation.slug}`)}
            />

            {/* Quick Guest Portal Links */}
            <div className="text-center pt-4 pb-8 space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => onNavigate(`/photos/${invitation.slug}`)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 shadow-sm hover:bg-stone-50"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>Check Wedding Photos</span>
                </button>

                {invitation.rsvpEnabled && (
                  <button
                    type="button"
                    onClick={() => setRsvpModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white shadow-sm hover:bg-amber-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>RSVP Attendance</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-stone-400 font-sans">
                Crafted with love on Dawat &bull; No guest login required
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal Dialog */}
      <RsvpModal
        isOpen={rsvpModalOpen}
        invitationId={invitation.id}
        coupleName={
          invitation.couple.coupleDisplayName ||
          `${invitation.couple.brideName} & ${invitation.couple.groomName}`
        }
        onClose={() => setRsvpModalOpen(false)}
      />
    </div>
  );
};
