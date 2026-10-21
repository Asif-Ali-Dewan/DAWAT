import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { formatWeddingDate, getCountdown } from '../../utils/formatting';
import { getThemeComputedStyles } from '../../utils/themeStyles';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  GoldDivider,
  TraditionalCornerFlourish,
  DesiWeddingArch,
  CorporateSealBadge,
  MonogramBadge,
} from './DecorativeOrnaments';
import {
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Camera,
  Heart,
  CalendarPlus,
  Users,
  Sparkles,
  Utensils,
  PartyPopper,
  Music,
  CheckCircle,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

interface InvitationCardProps {
  invitation: Invitation;
  schedule?: ScheduleItem[];
  isMobilePreview?: boolean;
  isTicketMode?: boolean;
  onOpenRsvp?: () => void;
  onNavigateToPhotos?: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  schedule = [],
  isMobilePreview = false,
  isTicketMode = false,
  onOpenRsvp,
  onNavigateToPhotos,
}) => {
  const { couple, venue, receiver, specialNote, theme, corporate, eventType } = invitation;
  const styles = getThemeComputedStyles(theme);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(getCountdown(couple.weddingDate));

  const isCorporate = eventType === 'corporate' || theme.preset === 'corporate-noir';

  useEffect(() => {
    const photoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;
    generateQrCode(photoUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: isCorporate ? '#0F172A' : '#350010',
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl);
  }, [invitation.slug, isCorporate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(couple.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [couple.weddingDate]);

  const brideInitial = couple.brideName.charAt(0).toUpperCase() || 'B';
  const groomInitial = couple.groomName.charAt(0).toUpperCase() || 'G';

  const renderScheduleIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-[#D4AF37]" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-[#D4AF37]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
      case 'PartyPopper':
        return <PartyPopper className="w-4 h-4 text-[#D4AF37]" />;
      case 'Music':
        return <Music className="w-4 h-4 text-[#D4AF37]" />;
      default:
        return <Heart className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const isSolidDark =
    theme.cardColor === '#350010' ||
    theme.cardColor === '#290EA0' ||
    theme.cardColor === '#0F172A' ||
    theme.preset === 'traditional-burgundy' ||
    theme.preset === 'royal-sapphire' ||
    theme.preset === 'corporate-noir';

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.cardColor || (isCorporate ? '#0F172A' : '#350010'),
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isMobilePreview ? 'max-w-[390px] mx-auto text-sm' : 'max-w-3xl mx-auto'
      }`}
    >
      <div
        id="wedding-invitation-card"
        style={cardStyle}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 ${
          theme.hasStarTexture ? 'stardust-pattern' : ''
        } ${styles.cardBgClass} ${styles.borderClass}`}
      >
        {/* Traditional Corner Flourishes */}
        {!isCorporate && theme.borderStyle !== 'clean-borderless' && (
          <>
            <TraditionalCornerFlourish position="tl" color={styles.ornamentColor} />
            <TraditionalCornerFlourish position="tr" color={styles.ornamentColor} />
            <TraditionalCornerFlourish position="bl" color={styles.ornamentColor} />
            <TraditionalCornerFlourish position="br" color={styles.ornamentColor} />
          </>
        )}

        {/* ============================================================== */}
        {/* HEADER SECTION */}
        {/* ============================================================== */}
        {isCorporate ? (
          /* CORPORATE HEADER */
          <div className="flex flex-col items-center text-center mb-8 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest bg-slate-800 text-[#C5A059] border border-slate-700">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Official Executive Invitation</span>
            </div>

            <CorporateSealBadge color="#C5A059" className="my-1" />

            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {corporate?.organizationName || 'Apex Global Holdings'}
            </p>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
              {corporate?.eventHeading || invitation.title}
            </h1>

            {corporate?.eventSubheading && (
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-light">
                {corporate.eventSubheading}
              </p>
            )}

            {corporate?.chiefGuest && (
              <div className="pt-2 text-xs text-[#C5A059] font-medium">
                Chief Guest: <span className="text-white font-semibold">{corporate.chiefGuest}</span>
              </div>
            )}
          </div>
        ) : (
          /* TRADITIONAL PAKISTANI / BANGLADESHI WEDDING HEADER */
          <div className="flex flex-col items-center text-center mb-8 space-y-3">
            {/* Traditional Auspicious Invocation */}
            <div className="text-xs font-serif-elegant italic tracking-widest text-[#F3DF93]/90">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest bg-white/[0.08] text-[#F3DF93] border border-[#D4AF37]/50">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>শুভ বিবাহ &bull; Shadi &bull; Walima</span>
            </div>

            <DesiWeddingArch color={styles.ornamentColor} className="my-1" />

            <p className="text-xs sm:text-sm uppercase tracking-widest text-[#F3DF93]/80 font-serif-elegant">
              With the blessings of our parents & families
            </p>

            {/* Couple Names */}
            <div className="space-y-1 sm:space-y-2 py-1">
              <h1 className={`text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight ${styles.textColorClass} ${styles.fontHeadingClass}`}>
                {couple.brideName || 'The Bride'}
              </h1>
              <div className="flex items-center justify-center space-x-3 py-1">
                <span className="h-[1px] w-8 sm:w-16 bg-[#D4AF37] opacity-60" />
                <span className="font-script text-2xl sm:text-4xl text-[#F3DF93] italic px-2">weds</span>
                <span className="h-[1px] w-8 sm:w-16 bg-[#D4AF37] opacity-60" />
              </div>
              <h1 className={`text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight ${styles.textColorClass} ${styles.fontHeadingClass}`}>
                {couple.groomName || 'The Groom'}
              </h1>
            </div>

            <p className="text-xs sm:text-sm max-w-md mx-auto italic font-serif-elegant text-[#F3DF93]/90 leading-relaxed">
              cordially request the honor of your presence and prayers to celebrate this auspicious union
            </p>
          </div>
        )}

        <GoldDivider color={styles.ornamentColor} />

        {/* ============================================================== */}
        {/* DATE & TIME DETAILS */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
          <div className="flex items-center p-4 rounded-xl bg-white/[0.08] border border-[#D4AF37]/30 shadow-inner">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF37]/20 text-[#D4AF37] shrink-0 mr-3 border border-[#D4AF37]/40">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-75 text-[#F3DF93]">
                {isCorporate ? 'Event Date' : 'Auspicious Date'}
              </p>
              <p className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                {formatWeddingDate(couple.weddingDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-xl bg-white/[0.08] border border-[#D4AF37]/30 shadow-inner">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF37]/20 text-[#D4AF37] shrink-0 mr-3 border border-[#D4AF37]/40">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold opacity-75 text-[#F3DF93]">
                {isCorporate ? 'Schedule Timings' : 'Ceremony Timings'}
              </p>
              <p className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                {couple.mainEventTime || '12:00 PM'} {isCorporate ? 'Keynote' : 'Main Event'}
              </p>
              <p className="text-xs opacity-80 text-[#F3DF93]">
                {couple.functionStartTime || '11:00 AM'} to {couple.functionEndTime || '05:00 PM'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COUNTDOWN */}
        {/* ============================================================== */}
        {!countdown.isPast && (
          <div className="my-6 p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/30 text-center">
            <p className="text-[11px] uppercase tracking-widest text-[#F3DF93] font-semibold mb-2">
              {isCorporate ? 'Event Begins In' : 'Counting Down To The Auspicious Day'}
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              <div className="rounded-xl p-2 bg-black/50 border border-[#D4AF37]/30">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-[#F3DF93]">
                  {countdown.days}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F3DF93]/70">Days</span>
              </div>
              <div className="rounded-xl p-2 bg-black/50 border border-[#D4AF37]/30">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-[#F3DF93]">
                  {countdown.hours}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F3DF93]/70">Hours</span>
              </div>
              <div className="rounded-xl p-2 bg-black/50 border border-[#D4AF37]/30">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-[#F3DF93]">
                  {countdown.minutes}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F3DF93]/70">Mins</span>
              </div>
              <div className="rounded-xl p-2 bg-black/50 border border-[#D4AF37]/30">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-[#F3DF93]">
                  {countdown.seconds}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#F3DF93]/70">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VENUE & MAPS */}
        {/* ============================================================== */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-white/[0.08] border border-[#D4AF37]/30 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-md text-left">
              <div className="flex items-center space-x-1.5 text-[#F3DF93] font-semibold text-xs tracking-wider uppercase">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{isCorporate ? 'Summit Venue' : 'Venue & Feast Location'}</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${styles.textColorClass}`}>
                {venue.venueName || 'Venue Location'}
              </h3>
              <p className="text-xs sm:text-sm text-[#F3DF93]/90">
                {venue.venueAddress || 'Address details'}
              </p>
              {venue.locationDescription && (
                <p className="text-xs italic text-[#F3DF93]/75 pt-1">
                  {venue.locationDescription}
                </p>
              )}
            </div>

            {venue.mapsUrl && (
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f27] text-stone-950 shadow transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RECEPTION INFO */}
        {/* ============================================================== */}
        {receiver.receiverName && (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-white/[0.08] border border-[#D4AF37]/30 flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#F3DF93]">
                {isCorporate ? 'Reception & Check-in Desk' : 'Warm Reception & Welcome By'}
              </p>
              <h4 className={`text-base font-bold ${styles.textColorClass}`}>
                {receiver.receiverName}
                {receiver.receiverRole && (
                  <span className="text-xs font-normal opacity-85 ml-2 font-serif-elegant">
                    ({receiver.receiverRole})
                  </span>
                )}
              </h4>
              {receiver.additionalInfo && (
                <p className="text-xs mt-0.5 text-[#F3DF93]/80">
                  {receiver.additionalInfo}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SPECIAL NOTE */}
        {/* ============================================================== */}
        {specialNote && specialNote.trim().length > 0 && (
          <div className="my-6 p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/30 text-center">
            <p className="text-[11px] uppercase tracking-widest text-[#F3DF93] font-semibold mb-2">
              {isCorporate ? 'Host Note' : 'A Personal Note From The Family'}
            </p>
            <blockquote className="italic text-sm sm:text-base font-serif-elegant max-w-xl mx-auto leading-relaxed text-[#F3DF93]">
              &ldquo;{specialNote}&rdquo;
            </blockquote>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCHEDULE / TIMELINE */}
        {/* ============================================================== */}
        {schedule.length > 0 && (
          <div className="my-8">
            <div className="text-center mb-6">
              <h3 className={`text-lg sm:text-xl font-heading font-bold tracking-wider ${styles.textColorClass}`}>
                {isCorporate ? 'Summit Agenda & Timeline' : 'Order of Auspicious Events'}
              </h3>
              <p className="text-xs text-[#F3DF93]/75">
                {isCorporate ? 'Please adhere to the formal session schedule' : 'Join us in every celebratory moment'}
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D4AF37]/40 space-y-5 max-w-xl mx-auto text-left">
              {schedule.map((item, index) => (
                <div key={item.id || index} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-950 border-2 border-[#D4AF37] flex items-center justify-center shadow">
                    {renderScheduleIcon(item.iconName)}
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.07] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <h4 className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                        {item.title}
                      </h4>
                      <span className="text-xs font-mono font-medium text-[#F3DF93] bg-black/40 border border-[#D4AF37]/30 px-2 py-0.5 rounded-md">
                        {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs mt-1 leading-relaxed text-[#F3DF93]/80 font-light">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PHOTO QR / DIGITAL ADMISSION PORTAL */}
        {/* ============================================================== */}
        <div className="my-8 p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/35 shadow-inner">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {qrCodeDataUrl ? (
              <div className="relative p-2.5 bg-white rounded-2xl shadow-lg border border-[#D4AF37]/60 shrink-0">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-xl"
                />
                <span className="block text-center text-[10px] font-mono font-bold text-stone-800 mt-1 uppercase tracking-wider">
                  {isCorporate ? 'Scan Entry Pass' : 'Scan For Photos'}
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 bg-stone-900 rounded-2xl flex items-center justify-center shrink-0">
                <Camera className="w-8 h-8 text-[#D4AF37]" />
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#D4AF37]/15 text-[#F3DF93] border border-[#D4AF37]/30">
                {isCorporate ? <ShieldCheck className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                <span>{isCorporate ? 'Official Digital Entry Pass' : 'Wedding Memories Portal'}</span>
              </div>
              <h4 className={`text-base sm:text-lg font-bold ${styles.textColorClass}`}>
                {isCorporate ? 'Digital Access & Event Portal' : 'Access Live Wedding Photographs'}
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-[#F3DF93]/80 font-light">
                {isCorporate
                  ? 'Scan the QR pass on admission or tap below to access keynote transcripts and event photo releases.'
                  : 'Scan this QR code with your smartphone camera to access the official photo album and candid captures.'}
              </p>

              {onNavigateToPhotos && (
                <button
                  type="button"
                  onClick={onNavigateToPhotos}
                  className="inline-flex items-center space-x-2 mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] hover:bg-[#c49f27] text-stone-950 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isCorporate ? 'View Event Photos' : 'View Photo Gallery'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ACTIONS (CALENDAR + RSVP) */}
        {/* ============================================================== */}
        {!isTicketMode && (
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-3 no-print">
            <a
              href={createGoogleCalendarUrl(invitation)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border border-[#D4AF37]/40 bg-black/50 text-[#F3DF93] hover:bg-black/70 shadow transition"
            >
              <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => downloadIcsFile(invitation)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium border border-[#D4AF37]/40 bg-black/50 text-[#F3DF93] hover:bg-black/70 shadow transition"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Download iCal (.ics)</span>
            </button>

            {invitation.rsvpEnabled && onOpenRsvp && (
              <button
                type="button"
                onClick={onOpenRsvp}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f27] text-stone-950 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>RSVP Attendance</span>
              </button>
            )}
          </div>
        )}

        {/* Footer Seal */}
        <div className="mt-8 text-center text-[11px] opacity-65 text-[#F3DF93]">
          <p className="font-heading tracking-widest uppercase">
            DAWAT &bull; Digital Event Keepsake &bull; {couple.coupleDisplayName || invitation.title}
          </p>
        </div>
      </div>
    </div>
  );
};
