import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { formatWeddingDate, getCountdown } from '../../utils/formatting';
import { getThemeComputedStyles } from '../../utils/themeStyles';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  GoldDivider,
  CornerFlourish,
  BotanicalCrest,
  WeddingRingsOrnament,
  MonogramBadge,
} from './DecorativeOrnaments';
import {
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Camera,
  Heart,
  Share2,
  CalendarPlus,
  Users,
  Sparkles,
  Utensils,
  PartyPopper,
  Music,
  CheckCircle,
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
  const { couple, venue, receiver, specialNote, theme } = invitation;
  const styles = getThemeComputedStyles(theme);

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(getCountdown(couple.weddingDate));

  // Generate QR Code that points to public photo access
  useEffect(() => {
    const photoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;
    generateQrCode(photoUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: theme.preset === 'modern' ? '#0F172A' : '#292524',
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl);
  }, [invitation.slug, theme.preset]);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(couple.weddingDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [couple.weddingDate]);

  const brideInitial = couple.brideName.charAt(0).toUpperCase() || 'B';
  const groomInitial = couple.groomName.charAt(0).toUpperCase() || 'G';

  // Helper for schedule icon
  const renderScheduleIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Camera':
        return <Camera className="w-4 h-4 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'PartyPopper':
        return <PartyPopper className="w-4 h-4 text-amber-600" />;
      case 'Music':
        return <Music className="w-4 h-4 text-amber-600" />;
      default:
        return <Heart className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div
      className={`relative w-full transition-all duration-300 ${
        isMobilePreview ? 'max-w-[390px] mx-auto text-sm' : 'max-w-3xl mx-auto'
      }`}
    >
      <div
        id="wedding-invitation-card"
        className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-14 ${styles.cardBgClass} ${styles.borderClass}`}
      >
        {/* Ornate Corner Accents */}
        {theme.borderStyle !== 'minimal-thin' && (
          <>
            <CornerFlourish position="tl" color={styles.ornamentColor} />
            <CornerFlourish position="tr" color={styles.ornamentColor} />
            <CornerFlourish position="bl" color={styles.ornamentColor} />
            <CornerFlourish position="br" color={styles.ornamentColor} />
          </>
        )}

        {/* Header Ribbon / Status badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest mb-4 bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Solemn Wedding Invitation</span>
          </div>

          {/* Decorative crest */}
          {theme.decorativeElement === 'monogram' ? (
            <MonogramBadge
              brideInitial={brideInitial}
              groomInitial={groomInitial}
              color={styles.ornamentColor}
              className="mb-4"
            />
          ) : theme.decorativeElement === 'rings' ? (
            <WeddingRingsOrnament color={styles.ornamentColor} className="mb-4" />
          ) : theme.decorativeElement === 'botanical' ? (
            <BotanicalCrest color={styles.ornamentColor} className="mb-4" />
          ) : null}

          {/* Invitation intro text */}
          <p className={`text-xs sm:text-sm tracking-widest uppercase mb-3 ${styles.mutedTextColorClass}`}>
            Together with their families
          </p>

          {/* Couple Names */}
          <div className="space-y-1 sm:space-y-2">
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight ${styles.textColorClass} ${styles.fontHeadingClass}`}
            >
              {couple.brideName || 'The Bride'}
            </h1>
            <div className="flex items-center justify-center space-x-3 py-1">
              <span className="h-[1px] w-8 sm:w-16 bg-current opacity-30" />
              <span className="font-script text-2xl sm:text-4xl text-amber-600 italic px-2">and</span>
              <span className="h-[1px] w-8 sm:w-16 bg-current opacity-30" />
            </div>
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide leading-tight ${styles.textColorClass} ${styles.fontHeadingClass}`}
            >
              {couple.groomName || 'The Groom'}
            </h1>
          </div>

          <p className={`mt-4 text-xs sm:text-sm max-w-md mx-auto italic font-serif-elegant ${styles.secondaryTextColorClass}`}>
            request the pleasure of your company to celebrate their wedding ceremony & auspicious reception
          </p>
        </div>

        <GoldDivider color={styles.ornamentColor} />

        {/* Date, Time & Countdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="flex items-center p-4 rounded-xl bg-black/[0.02] border border-black/[0.06] dark:bg-white/[0.03] dark:border-white/[0.08]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-600 shrink-0 mr-3">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-60">Wedding Date</p>
              <p className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                {formatWeddingDate(couple.weddingDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-xl bg-black/[0.02] border border-black/[0.06] dark:bg-white/[0.03] dark:border-white/[0.08]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-600 shrink-0 mr-3">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold opacity-60">Celebration Timings</p>
              <p className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                {couple.mainEventTime || '12:00 PM'} Main Ceremony
              </p>
              <p className="text-xs opacity-75">
                {couple.functionStartTime || '11:00 AM'} to {couple.functionEndTime || '05:00 PM'}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        {!countdown.isPast && (
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 border border-amber-500/20 text-center">
            <p className="text-[11px] uppercase tracking-widest text-amber-700 dark:text-amber-300 font-semibold mb-2">
              Counting Down To The Joyous Day
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              <div className="bg-white/80 dark:bg-stone-900/80 rounded-xl p-2 shadow-sm border border-black/5 dark:border-white/10">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-amber-700 dark:text-amber-400">
                  {countdown.days}
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">Days</span>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 rounded-xl p-2 shadow-sm border border-black/5 dark:border-white/10">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-amber-700 dark:text-amber-400">
                  {countdown.hours}
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">Hours</span>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 rounded-xl p-2 shadow-sm border border-black/5 dark:border-white/10">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-amber-700 dark:text-amber-400">
                  {countdown.minutes}
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">Mins</span>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 rounded-xl p-2 shadow-sm border border-black/5 dark:border-white/10">
                <span className="block text-lg sm:text-2xl font-bold font-heading text-amber-700 dark:text-amber-400">
                  {countdown.seconds}
                </span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Venue Section */}
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-black/[0.02] border border-black/[0.06] dark:bg-white/[0.03] dark:border-white/[0.08]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center space-x-2 text-amber-600 font-semibold text-xs tracking-wider uppercase">
                <MapPin className="w-4 h-4" />
                <span>Wedding Venue & Location</span>
              </div>
              <h3 className={`text-lg sm:text-xl font-bold ${styles.textColorClass}`}>
                {venue.venueName || 'Venue Name TBA'}
              </h3>
              <p className={`text-xs sm:text-sm ${styles.secondaryTextColorClass}`}>
                {venue.venueAddress || 'Address details'}
              </p>
              {venue.locationDescription && (
                <p className="text-xs italic opacity-75 pt-1">
                  {venue.locationDescription}
                </p>
              )}
            </div>

            {venue.mapsUrl && (
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <MapPin className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
          </div>
        </div>

        {/* Guest Reception Information */}
        {receiver.receiverName && (
          <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-300">
                Warm Reception By
              </p>
              <h4 className={`text-base font-bold ${styles.textColorClass}`}>
                {receiver.receiverName}
                {receiver.receiverRole && (
                  <span className="text-xs font-normal opacity-80 ml-2 font-serif-elegant">
                    ({receiver.receiverRole})
                  </span>
                )}
              </h4>
              {receiver.additionalInfo && (
                <p className={`text-xs mt-0.5 ${styles.secondaryTextColorClass}`}>
                  {receiver.additionalInfo}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Special Note (Conditional) */}
        {specialNote && specialNote.trim().length > 0 && (
          <div className="my-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 border border-amber-400/20 text-center">
            <p className="text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold mb-2">
              A Personal Note From The Couple
            </p>
            <blockquote className={`italic text-sm sm:text-base font-serif-elegant max-w-xl mx-auto leading-relaxed ${styles.secondaryTextColorClass}`}>
              &ldquo;{specialNote}&rdquo;
            </blockquote>
          </div>
        )}

        {/* Event Schedule Timeline */}
        {schedule.length > 0 && (
          <div className="my-8">
            <div className="text-center mb-6">
              <h3 className={`text-lg sm:text-xl font-heading font-bold tracking-wider ${styles.textColorClass}`}>
                Order of Events & Timeline
              </h3>
              <p className={`text-xs ${styles.mutedTextColorClass}`}>
                Please join us through every memorable moment
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-400/40 space-y-6 max-w-xl mx-auto">
              {schedule.map((item, index) => (
                <div key={item.id || index} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-stone-900 border-2 border-amber-500 flex items-center justify-center shadow-sm">
                    {renderScheduleIcon(item.iconName)}
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-black/[0.02] border border-black/[0.05] dark:bg-white/[0.03] dark:border-white/[0.06] hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <h4 className={`font-semibold text-sm sm:text-base ${styles.textColorClass}`}>
                        {item.title}
                      </h4>
                      <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                      </span>
                    </div>
                    {item.description && (
                      <p className={`text-xs mt-1 leading-relaxed ${styles.secondaryTextColorClass}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wedding Photos QR Section */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/30">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {qrCodeDataUrl ? (
              <div className="relative p-2.5 bg-white rounded-2xl shadow-lg border border-amber-200/80 shrink-0">
                <img
                  src={qrCodeDataUrl}
                  alt="Wedding Photo Gallery QR Code"
                  className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-xl"
                />
                <span className="block text-center text-[10px] font-mono font-bold text-stone-600 mt-1 uppercase tracking-wider">
                  Scan for Photos
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 bg-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                <Camera className="w-8 h-8 text-stone-400" />
              </div>
            )}

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-800 dark:text-amber-300">
                <Camera className="w-3.5 h-3.5" />
                <span>Wedding Memories Portal</span>
              </div>
              <h4 className={`text-base sm:text-lg font-bold ${styles.textColorClass}`}>
                Access Live Wedding Photographs
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${styles.secondaryTextColorClass}`}>
                Scan this QR code with your phone camera or click the button below to view the newlyweds&apos; official photo gallery and candid captures as they become available.
              </p>

              {onNavigateToPhotos && (
                <button
                  type="button"
                  onClick={onNavigateToPhotos}
                  className="inline-flex items-center space-x-2 mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-400 dark:text-stone-950 dark:hover:bg-amber-300 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>View Photo Gallery</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons for Guest (Calendar + RSVP) */}
        {!isTicketMode && (
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-center gap-3 no-print">
            <a
              href={createGoogleCalendarUrl(invitation)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 shadow-sm transition"
            >
              <CalendarPlus className="w-4 h-4 text-amber-600" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => downloadIcsFile(invitation)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 shadow-sm transition"
            >
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Download iCal (.ics)</span>
            </button>

            {invitation.rsvpEnabled && onOpenRsvp && (
              <button
                type="button"
                onClick={onOpenRsvp}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" />
                <span>RSVP Your Attendance</span>
              </button>
            )}
          </div>
        )}

        {/* Footer Seal */}
        <div className="mt-8 text-center text-[11px] opacity-60">
          <p className="font-heading tracking-widest uppercase">
            Dawat &bull; Digital Wedding Keepsake &bull; {couple.coupleDisplayName || `${couple.brideName} & ${couple.groomName}`}
          </p>
        </div>
      </div>
    </div>
  );
};
