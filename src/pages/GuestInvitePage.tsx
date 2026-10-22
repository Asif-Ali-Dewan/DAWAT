import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Invitation } from '../types/invitation';
import { ScheduleItem } from '../types/schedule';
import { invitationService } from '../services/invitationService';
import { scheduleService } from '../services/scheduleService';
import { InvitationCard } from '../components/common/InvitationCard';
import { RsvpModal } from '../components/common/RsvpModal';
import { getThemeComputedStyles } from '../utils/themeStyles';
import {
  Heart,
  Camera,
  CheckCircle,
  Volume2,
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

  useEffect(() => {
    let isMounted = true;
    const fetchInvite = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await invitationService.getInvitationBySlug(slug);
        if (!isMounted) return;

        if (data) {
          setInvitation(data);
          const scheduleData = await scheduleService.getScheduleByInvitationId(data.id);
          if (isMounted) setSchedule(scheduleData);
        } else {
          setError('Invitation not found. Please verify the URL.');
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load this invitation. Please try again.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInvite();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Gentle celebration sound synthesizer using Web Audio API
  const playHarmonicChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setAudioPlaying(true);

      const notes = [261.63, 329.63, 392.0, 523.25]; // C Major Chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });

      setTimeout(() => setAudioPlaying(false), 1600);
    } catch {
      // Audio playback might be restricted without user interaction
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    playHarmonicChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#350010', '#290EA0', '#D4AF37', '#FAF7F2'],
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-3 border-[#350010] border-t-transparent animate-spin mx-auto" />
          <h2 className="text-xl font-heading font-bold text-stone-800">
            Unfolding Your Royal Invitation...
          </h2>
          <p className="text-xs text-stone-500">Preparing celebration moments & venue details</p>
        </div>
      </div>
    );
  }

  // Error / Not Found State
  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#350010]/10 text-[#350010] flex items-center justify-center mx-auto">
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] transition"
            >
              Open Sample Demo Invitation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const styles = getThemeComputedStyles(invitation.theme);
  const isCorporate = invitation.eventType === 'corporate';
  const displayTitle = isCorporate && invitation.corporate
    ? invitation.corporate.eventHeading
    : (invitation.couple.coupleDisplayName ||
       `${invitation.couple.brideName} & ${invitation.couple.groomName}`);

  return (
    <div className={`min-h-screen ${styles.bgClass} transition-colors duration-500 py-6 sm:py-12 px-3 sm:px-6`}>
      {/* Floating Audio & Demo Bar */}
      <div className="fixed top-4 right-4 z-40 flex items-center space-x-2">
        <button
          type="button"
          onClick={playHarmonicChime}
          className="p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-[#350010] hover:scale-105 transition shadow-xs"
          title="Play Celebration Chime"
        >
          {audioPlaying ? <Volume2 className="w-4 h-4 animate-bounce text-[#350010]" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-xs font-bold text-stone-800 hover:bg-[#350010] hover:text-white transition shadow-xs"
        >
          DAWAT Card Studio
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* ENVELOPE / WAX SEAL OPENING EXPERIENCE */}
        {!isOpened ? (
          <div className="my-8 sm:my-16 max-w-lg mx-auto text-center space-y-6 animate-fade-in">
            {/* Envelope Card */}
            <div className="relative p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#D4AF37]/50 overflow-hidden text-center space-y-6">
              {/* Decorative Envelope Flap Line */}
              <div className="w-full h-1 bg-[#D4AF37]/60 mb-4" />

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#350010]">
                  {isCorporate ? 'Official Entrance Pass & Keynote Invitation' : 'You Have Received An Auspicious Invitation'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-stone-900">
                  {displayTitle}
                </h1>
                <p className="text-xs text-stone-500 font-serif-elegant italic">
                  {isCorporate && invitation.corporate
                    ? `Presented by ${invitation.corporate.organizationName}`
                    : 'Request the honor of your gracious presence'}
                </p>
              </div>

              {/* Wax Seal Button */}
              <div className="py-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleOpenEnvelope}
                  className="group relative w-24 h-24 rounded-full bg-[#350010] text-[#D4AF37] flex flex-col items-center justify-center border-4 border-[#D4AF37] hover:scale-105 active:scale-95 transition-transform"
                >
                  <Heart className="w-8 h-8 fill-[#D4AF37] text-[#D4AF37] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-heading font-bold tracking-widest uppercase mt-1 text-[#FAF7F2]">
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

            {/* Quick Guest Actions */}
            <div className="text-center pt-4 pb-8 space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {(invitation.driveFolderUrl || invitation.photoFolderUrl) && (
                  <a
                    href={invitation.driveFolderUrl || invitation.photoFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 transition shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#350010]" />
                    <span>View Photos on Google Drive</span>
                  </a>
                )}

                {invitation.rsvpEnabled && (
                  <button
                    type="button"
                    onClick={() => setRsvpModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] transition border border-[#D4AF37]/30"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>RSVP Attendance</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-stone-400 font-sans">
                Crafted with elegance on DAWAT &bull; Digital Event Invitations
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal Dialog */}
      <RsvpModal
        isOpen={rsvpModalOpen}
        invitationId={invitation.id}
        coupleName={displayTitle}
        onClose={() => setRsvpModalOpen(false)}
      />
    </div>
  );
};
