import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl } from '../../utils/calendar';
import {
  BarcodeGraphic,
  CircularTicketStamp,
  RoyalMandalaWatermark,
  GildedCornerSet,
  MonogramBadge,
  CorporateSealBadge,
} from './DecorativeOrnaments';
import {
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  Camera,
  CheckCircle,
  Phone,
  Globe,
  RotateCcw,
  QrCode,
  Sparkles,
  Ticket,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface InvitationCardProps {
  invitation: Invitation;
  schedule?: ScheduleItem[];
  isMobilePreview?: boolean;
  isTicketMode?: boolean;
  onOpenRsvp?: () => void;
  onNavigateToPhotos?: () => void;
}

// Helper to convert hex to rgba with alpha
function hexToRgba(hex: string, alpha: number): string {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return `rgba(212, 175, 55, ${alpha})`;
  const full = clean.length === 3 ? clean.split('').map((x) => x + x).join('') : clean;
  const r = parseInt(full.substring(0, 2), 16) || 212;
  const g = parseInt(full.substring(2, 4), 16) || 175;
  const b = parseInt(full.substring(4, 6), 16) || 55;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function parseHexLuminance(hex: string): number {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return 0.1;
  const full = clean.length === 3 ? clean.split('').map((x) => x + x).join('') : clean;
  const r = parseInt(full.substring(0, 2), 16) || 0;
  const g = parseInt(full.substring(2, 4), 16) || 0;
  const b = parseInt(full.substring(4, 6), 16) || 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getTicketPalette(cardColor: string, accentColor?: string) {
  const lum = parseHexLuminance(cardColor);
  const isDark = lum < 0.55;
  const chosenAccent = accentColor || (isDark ? '#F5D061' : '#A67C1E');
  const accentLum = parseHexLuminance(chosenAccent);

  if (isDark) {
    // Rich Dark Cardstock: Deep Burgundy, Emerald, Sapphire, Midnight Slate
    return {
      isDark: true,
      cardBg: cardColor,
      outerFrame: 'rgba(0, 0, 0, 0.55)',
      outerBorder: hexToRgba(chosenAccent, 0.3),
      textPrimary: '#FFFFFF',
      textSecondary: chosenAccent,
      textBody: '#FDFBF7',
      textMuted: hexToRgba(chosenAccent, 0.85),
      accentGold: chosenAccent,
      borderRule: hexToRgba(chosenAccent, 0.35),
      borderDashed: hexToRgba(chosenAccent, 0.65),
      boxBg: hexToRgba(chosenAccent, 0.12),
      boxBorder: hexToRgba(chosenAccent, 0.45),
      badgeBg: '#FFFFFF',
      badgeText: cardColor,
      badgeBorder: chosenAccent,
      stubBg: 'rgba(0, 0, 0, 0.22)',
      stubBorder: hexToRgba(chosenAccent, 0.3),
      notchBg: 'rgba(10, 5, 5, 0.85)',
      barcodeColor: chosenAccent,
      stampColor: chosenAccent,
      rsvpBtnBg: chosenAccent,
      rsvpBtnText: accentLum > 0.6 ? '#1A0006' : '#FFFFFF',
    };
  } else {
    // Light Cardstock: Warm Alabaster Silk, Ivory, Pearl White
    return {
      isDark: false,
      cardBg: cardColor || '#FAF7F2',
      outerFrame: '#350010',
      outerBorder: hexToRgba(chosenAccent, 0.25),
      textPrimary: '#1C1917',
      textSecondary: chosenAccent,
      textBody: '#262626',
      textMuted: '#786A5E',
      accentGold: chosenAccent,
      borderRule: hexToRgba(chosenAccent, 0.35),
      borderDashed: hexToRgba(chosenAccent, 0.6),
      boxBg: hexToRgba(chosenAccent, 0.08),
      boxBorder: hexToRgba(chosenAccent, 0.35),
      badgeBg: '#FFFFFF',
      badgeText: '#350010',
      badgeBorder: chosenAccent,
      stubBg: hexToRgba(chosenAccent, 0.04),
      stubBorder: hexToRgba(chosenAccent, 0.25),
      notchBg: '#350010',
      barcodeColor: '#1C1917',
      stampColor: chosenAccent,
      rsvpBtnBg: chosenAccent,
      rsvpBtnText: accentLum > 0.6 ? '#1A0006' : '#FFFFFF',
    };
  }
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

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [ticketSide, setTicketSide] = useState<'front' | 'back' | 'both'>('front');
  const [showQr, setShowQr] = useState<boolean>(invitation.showQrCode ?? true);

  const isCorporate =
    eventType === 'corporate' ||
    theme.preset === 'corporate-noir' ||
    theme.cardVariant === 'corporate-executive';

  const isRoyal = theme.cardVariant === 'royal-sapphire';
  const isMinimal = theme.cardVariant === 'minimal-ivory';

  // Dynamic Typography Styles
  const headingFontFamily = theme.fontHeading
    ? `'${theme.fontHeading}', serif`
    : "'Cinzel', serif";
  const bodyFontFamily = theme.fontBody
    ? `'${theme.fontBody}', serif`
    : "'Cormorant Garamond', serif";

  // Dynamic Content & Auspicious Headers based on Layout Architecture
  const headerSubtitle = isCorporate
    ? (corporate?.organizationName || 'OFFICIAL CORPORATE GALA')
    : isRoyal
    ? 'THE IMPERIAL WALIMA CELEBRATION OF'
    : isMinimal
    ? 'THE WEDDING CELEBRATION OF'
    : 'THE WEDDING OF';

  const headerAuspicious = isCorporate
    ? '— ✦ OFFICIAL EXECUTIVE SUMMIT 2026 ✦ —'
    : isRoyal
    ? '— ✦ ROYAL WALIMA & IMPERIAL RECEPTION ✦ —'
    : isMinimal
    ? '— ✦ WITH THE BLESSINGS OF PARENTS ✦ —'
    : '— ✦ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✦ —';

  const headerTag = isCorporate
    ? 'VIP ENTRY'
    : isRoyal
    ? 'ROYAL PASS'
    : isMinimal
    ? 'INVITATION'
    : 'SHUVO BIBAHO';

  const tableOrGateTag = isCorporate
    ? 'GATE: MAIN FOYER'
    : isRoyal
    ? 'TABLE: ROYAL-01'
    : isMinimal
    ? 'PASS: ADMIT ONE'
    : 'TABLE: VIP-07';

  // Fallback schedule
  const displaySchedule: ScheduleItem[] = schedule.length > 0 ? schedule : [
    { id: '1', invitationId: invitation.id, title: 'Welcoming Guests & Refreshments', startTime: '11:30 AM', endTime: '12:30 PM', description: 'Traditional sherbet & floral reception', sortOrder: 1 },
    { id: '2', invitationId: invitation.id, title: 'Solemn Ceremony & Exchange of Vows', startTime: '12:30 PM', endTime: '02:00 PM', description: 'Nikah & auspicious blessings', sortOrder: 2 },
    { id: '3', invitationId: invitation.id, title: 'Royal Wedding Feast', startTime: '02:00 PM', endTime: '04:00 PM', description: 'Kacchi Biryani, Borhani, Jorda & Firni', sortOrder: 3 },
    { id: '4', invitationId: invitation.id, title: 'Photo Sessions & Warm Du’a', startTime: '04:00 PM', endTime: '05:30 PM', description: 'Family portraits & felicitations', sortOrder: 4 },
  ];

  // User requirement: "keep the ticket vertical if inviter add too many things, otherwise keep it simple horizontal or vertical as it looks good"
  const hasLotsOfContent = displaySchedule.length > 2 || Boolean(specialNote && specialNote.length > 60);

  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(() => {
    if (isMobilePreview || hasLotsOfContent) return 'vertical';
    return 'vertical';
  });

  // Calculate dynamic palette according to chosen cardColor and accentColor
  const palette = getTicketPalette(theme.cardColor || (isCorporate ? '#0F172A' : '#350010'), theme.accentColor);

  useEffect(() => {
    const photoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;
    generateQrCode(photoUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl);
  }, [invitation.slug]);

  // Dynamic Framing Inlay responding to theme.borderStyle
  const renderFramingInlay = () => {
    const borderStyle = theme.borderStyle || 'traditional-arch';
    if (borderStyle === 'clean-borderless') {
      return null;
    }
    if (borderStyle === 'ornate-gold') {
      return (
        <>
          <div className="absolute inset-1.5 border-2 border-double rounded-xl pointer-events-none opacity-45" style={{ borderColor: palette.accentGold }} />
          <GildedCornerSet color={palette.accentGold} opacity={palette.isDark ? 0.8 : 0.5} />
        </>
      );
    }
    if (borderStyle === 'corporate-geometric') {
      return (
        <>
          <div className="absolute inset-1.5 border border-solid rounded-lg pointer-events-none opacity-35" style={{ borderColor: palette.accentGold }} />
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 pointer-events-none" style={{ backgroundColor: palette.accentGold, opacity: 0.8 }} />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 pointer-events-none" style={{ backgroundColor: palette.accentGold, opacity: 0.8 }} />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 pointer-events-none" style={{ backgroundColor: palette.accentGold, opacity: 0.8 }} />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 pointer-events-none" style={{ backgroundColor: palette.accentGold, opacity: 0.8 }} />
        </>
      );
    }
    // 'traditional-arch' (default)
    return (
      <>
        <div className="absolute inset-1.5 border border-dashed rounded-xl pointer-events-none opacity-30" style={{ borderColor: palette.accentGold }} />
        <GildedCornerSet color={palette.accentGold} opacity={palette.isDark ? 0.7 : 0.4} />
      </>
    );
  };

  // Dynamic Center Emblem responding to theme.decorativeElement
  const renderCenterEmblem = (sizeClass = 'w-52 h-52') => {
    const dec = theme.decorativeElement || 'paisley-arch';
    if (dec === 'none') {
      return null;
    }
    if (dec === 'monogram') {
      const brideInit = (couple.brideName || 'A')[0].toUpperCase();
      const groomInit = (couple.groomName || 'A')[0].toUpperCase();
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.08] scale-150">
          <MonogramBadge brideInitial={brideInit} groomInitial={groomInit} color={palette.accentGold} />
        </div>
      );
    }
    if (dec === 'corporate-seal') {
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.09] scale-150">
          <CorporateSealBadge color={palette.accentGold} />
        </div>
      );
    }
    return (
      <RoyalMandalaWatermark color={palette.accentGold} className={`top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass} opacity-[0.06]`} />
    );
  };

  // Parse date pieces
  const dateObj = new Date(couple.weddingDate || '2026-12-18');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = dateObj.getDate() || 18;
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const yearNumber = dateObj.getFullYear() || 2026;

  const serialCode = `DAW-${(invitation.id || '2026').slice(-8).toUpperCase()}`;

  // =========================================================================
  // 1. VERTICAL TICKET PASS (EQUAL MATCHING HEIGHT: min-h-[640px])
  // =========================================================================

  const renderVerticalFront = () => (
    <div
      style={{ backgroundColor: palette.outerFrame, borderColor: palette.outerBorder }}
      className="relative rounded-3xl p-3 sm:p-3.5 shadow-2xl border transition-all select-none w-full max-w-md mx-auto"
    >
      <div
        style={{ backgroundColor: palette.cardBg, borderColor: palette.borderRule }}
        className="relative rounded-2xl border flex flex-col justify-between overflow-hidden min-h-[640px]"
      >
        {/* Luxury Tactile White Grain Texture on Dark Cardstock */}
        {palette.isDark && <div className="dark-card-grain" />}

        {/* Framing Inlay (Responds to theme.borderStyle) */}
        {renderFramingInlay()}

        {/* Center Emblem Watermark (Responds to theme.decorativeElement) */}
        {renderCenterEmblem('w-52 h-52')}

        {/* Top Header / Auspicious Invocation */}
        <div className="relative z-10 p-4 sm:p-5 text-center flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase tracking-widest font-bold flex items-center space-x-1" style={{ color: palette.accentGold }}>
                <span>✦</span>
                <span>{headerTag}</span>
                <span>✦</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: palette.textMuted }}>
                PASS #{invitation.id.slice(-6).toUpperCase()}
              </span>
            </div>

            <div className="text-[11px] font-serif-elegant italic tracking-widest font-semibold mb-1" style={{ color: palette.textSecondary, fontFamily: bodyFontFamily }}>
              {headerAuspicious}
            </div>

            <div className="text-[9px] font-mono uppercase tracking-widest font-semibold opacity-85" style={{ color: palette.textMuted }}>
              {headerSubtitle}
            </div>

            {/* Couple Names (Responds to theme.fontHeading) */}
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-tight my-2.5 drop-shadow-xs"
              style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}
            >
              {isCorporate ? (
                corporate?.eventHeading || invitation.title
              ) : (
                <>
                  <span>{couple.brideName}</span>
                  <span className="font-serif-elegant italic font-normal opacity-90 mx-1.5" style={{ color: palette.accentGold }}>&amp;</span>
                  <span>{couple.groomName}</span>
                </>
              )}
            </h1>

            <p className="text-[11px] max-w-xs mx-auto leading-relaxed" style={{ color: palette.textBody, fontFamily: bodyFontFamily }}>
              {isCorporate
                ? (corporate?.eventSubheading || 'Honoring Innovation, Sustainable Leadership & Strategic Partnerships')
                : 'request the honor of your gracious presence and heartfelt prayers'}
            </p>

            {/* Date & Time Box */}
            <div
              className="mt-3.5 p-2.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 shadow-inner"
              style={{ borderColor: palette.boxBorder, backgroundColor: palette.boxBg }}
            >
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold font-mono">
                <span className="tracking-wider" style={{ color: palette.textPrimary }}>
                  {dayName}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded border font-heading text-base sm:text-lg font-black shadow-xs"
                  style={{
                    backgroundColor: palette.badgeBg,
                    color: palette.badgeText,
                    borderColor: palette.badgeBorder,
                  }}
                >
                  {dayNumber}
                </span>
                <span className="tracking-wider" style={{ color: palette.textPrimary }}>
                  {monthName} {yearNumber}
                </span>
              </div>

              <div className="flex items-center space-x-1 text-xs font-mono font-bold" style={{ color: palette.textSecondary }}>
                <Clock className="w-3.5 h-3.5" style={{ color: palette.accentGold }} />
                <span>{couple.mainEventTime || '12:00 PM'}</span>
              </div>
            </div>

            {/* Venue & Location */}
            <div className="mt-3 pt-3 border-t text-center space-y-0.5" style={{ borderColor: palette.borderRule }}>
              <div className="flex items-center justify-center space-x-1.5 font-bold text-xs" style={{ color: palette.textPrimary }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: palette.accentGold }} />
                <span>{venue.venueName}</span>
              </div>
              <p className="text-[11px] max-w-sm mx-auto leading-tight" style={{ color: palette.textBody }}>
                {venue.venueAddress}
              </p>
              {venue.locationDescription && (
                <p className="text-[10px] font-medium pt-0.5" style={{ color: palette.accentGold }}>
                  {venue.locationDescription}
                </p>
              )}
            </div>
          </div>

          {/* Event Itinerary Timeline (Compact vertical list) */}
          <div className="mt-3 pt-3 border-t text-left" style={{ borderColor: palette.borderRule }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: palette.accentGold }}>
                ✦ CEREMONY TIMELINE
              </span>
              <span className="text-[9px] font-mono uppercase" style={{ color: palette.textMuted }}>
                {isCorporate ? 'VIP SUMMIT' : 'WALIMA SCHEDULE'}
              </span>
            </div>
            <div className="space-y-1.5">
              {displaySchedule.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg border"
                  style={{
                    backgroundColor: palette.boxBg,
                    borderColor: palette.boxBorder,
                  }}
                >
                  <div className="flex items-center space-x-1.5 min-w-0 mr-2">
                    <span className="text-[10px] shrink-0" style={{ color: palette.accentGold }}>◆</span>
                    <span className="font-semibold text-[11px] truncate" style={{ color: palette.textBody }}>
                      {item.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold shrink-0" style={{ color: palette.textSecondary }}>
                    {item.startTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Perforation Line with Concave Semicircular Notches */}
        <div className="relative flex items-center justify-between w-full h-0 select-none">
          <div
            className="w-6 h-6 rounded-full -left-3 absolute z-20 border shadow-inner"
            style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
          />
          <div
            className="w-full border-b-2 border-dashed z-10 mx-3"
            style={{ borderColor: palette.borderDashed }}
          />
          <div
            className="w-6 h-6 rounded-full -right-3 absolute z-20 border shadow-inner"
            style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
          />
        </div>

        {/* Bottom Tear-Off Stub (QR / Stamp + Barcode + RSVP) */}
        <div
          className="p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3"
          style={{ backgroundColor: palette.stubBg }}
        >
          {showQr && qrCodeDataUrl ? (
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl shadow-md border" style={{ borderColor: palette.accentGold }}>
                <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-lg" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1.5" style={{ color: palette.accentGold }}>
                SCAN FOR PHOTOS & DIGITAL CHECK-IN
              </span>
            </div>
          ) : (
            <div className="py-1">
              <CircularTicketStamp
                color={palette.stampColor}
                topText={isCorporate ? 'OFFICIAL ENTRANCE PASS' : 'YOU ARE CORDIALLY INVITED'}
                centerText="ADMIT ONE"
              />
            </div>
          )}

          {/* Barcode Graphic */}
          <div className="w-full max-w-[280px]">
            <BarcodeGraphic serial={serialCode} color={palette.barcodeColor} />
          </div>

          {/* RSVP Button */}
          {invitation.rsvpEnabled && onOpenRsvp ? (
            <button
              type="button"
              onClick={onOpenRsvp}
              className="w-full max-w-xs py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md hover:opacity-95 active:scale-95"
              style={{
                backgroundColor: palette.rsvpBtnBg,
                color: palette.rsvpBtnText,
              }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>CONFIRM ATTENDANCE & RSVP</span>
            </button>
          ) : (
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: palette.accentGold }}>
              ★ VALID ADMISSION PASS ★
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVerticalBack = () => (
    <div
      style={{ backgroundColor: palette.outerFrame, borderColor: palette.outerBorder }}
      className="relative rounded-3xl p-3 sm:p-3.5 shadow-2xl border transition-all select-none w-full max-w-md mx-auto"
    >
      <div
        style={{ backgroundColor: palette.cardBg, borderColor: palette.borderRule }}
        className="relative rounded-2xl border flex flex-col justify-between overflow-hidden min-h-[640px]"
      >
        {/* Luxury Tactile White Grain Texture on Dark Cardstock */}
        {palette.isDark && <div className="dark-card-grain" />}

        {/* Framing Inlay (Responds to theme.borderStyle) */}
        {renderFramingInlay()}

        {/* Center Emblem Watermark (Responds to theme.decorativeElement) */}
        {renderCenterEmblem('w-52 h-52')}

        {/* Top Section: Program & Schedule Details */}
        <div className="relative z-10 p-4 sm:p-5 text-left flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: palette.borderRule }}>
              <h2
                className="text-sm sm:text-base font-extrabold uppercase tracking-wide flex items-center space-x-1.5"
                style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}
              >
                <span style={{ color: palette.accentGold }}>✦</span>
                <span>{isCorporate ? 'SUMMIT PROGRAM & CODE' : 'CEREMONY SCHEDULE & DETAILS'}</span>
              </h2>
              <span className="text-[10px] font-mono font-bold" style={{ color: palette.accentGold }}>
                PASS #{invitation.id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Program Timeline */}
            <div className="space-y-3">
              {displaySchedule.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start space-x-2 text-xs">
                  <span className="text-xs font-bold mt-0.5" style={{ color: palette.accentGold }}>◆</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2 flex-wrap">
                      <span className="font-mono font-bold text-[11px]" style={{ color: palette.textSecondary }}>
                        {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                      </span>
                      <span className="font-bold" style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}>{item.title}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] mt-0.5 leading-snug" style={{ color: palette.textBody, fontFamily: bodyFontFamily }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Blessings Note */}
            {specialNote && (
              <div
                className="mt-4 p-3 rounded-xl border text-[11px] italic leading-relaxed"
                style={{
                  backgroundColor: palette.boxBg,
                  borderColor: palette.boxBorder,
                  color: palette.textBody,
                  fontFamily: bodyFontFamily,
                }}
              >
                &ldquo;{specialNote}&rdquo;
              </div>
            )}
          </div>

          {/* Reception Host Info */}
          {receiver.receiverName && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: palette.borderRule }}>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase" style={{ color: palette.accentGold }}>
                  Host / Reception Desk
                </span>
                <span className="font-bold" style={{ color: palette.textPrimary }}>{receiver.receiverName}</span>
                {receiver.receiverRole && (
                  <span className="text-[11px] block" style={{ color: palette.textMuted }}>({receiver.receiverRole})</span>
                )}
              </div>
              {receiver.contactPhone && (
                <div className="text-right">
                  <span className="block text-[10px] font-mono font-bold uppercase" style={{ color: palette.accentGold }}>
                    Contact Phone
                  </span>
                  <span className="font-mono text-xs font-semibold" style={{ color: palette.textPrimary }}>{receiver.contactPhone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Perforation Line with Concave Semicircular Notches */}
        <div className="relative flex items-center justify-between w-full h-0 select-none">
          <div
            className="w-6 h-6 rounded-full -left-3 absolute z-20 border shadow-inner"
            style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
          />
          <div
            className="w-full border-b-2 border-dashed z-10 mx-3"
            style={{ borderColor: palette.borderDashed }}
          />
          <div
            className="w-6 h-6 rounded-full -right-3 absolute z-20 border shadow-inner"
            style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
          />
        </div>

        {/* Bottom Stub: RSVP Response */}
        <div
          className="p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3"
          style={{ backgroundColor: palette.stubBg }}
        >
          <div className="w-full flex items-center justify-around text-xs font-mono" style={{ color: palette.textPrimary }}>
            <label className="flex items-center space-x-1.5 font-bold">
              <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold bg-white text-emerald-700">
                ✓
              </span>
              <span>I&apos;ll be there</span>
            </label>

            <label className="flex items-center space-x-1.5 opacity-75">
              <span className="w-4 h-4 rounded-full border border-stone-300 bg-white/40" />
              <span>I can&apos;t make it</span>
            </label>
          </div>

          <div className="w-full max-w-[280px]">
            <BarcodeGraphic serial={serialCode} color={palette.barcodeColor} />
          </div>

          {invitation.rsvpEnabled && onOpenRsvp && (
            <button
              type="button"
              onClick={onOpenRsvp}
              className="w-full max-w-xs py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md hover:opacity-95 active:scale-95"
              style={{
                backgroundColor: palette.rsvpBtnBg,
                color: palette.rsvpBtnText,
              }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>SUBMIT RSVP DETAILS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 2. HORIZONTAL TICKET LAYOUT (MATCHING EXACT SAME HEIGHT: h-[350px])
  // Both Front and Back have identical dimensions (min-w-[680px], h-[350px])!
  // =========================================================================

  const renderHorizontalFront = () => (
    <div className="overflow-x-auto w-full pb-2">
      <div
        style={{ backgroundColor: palette.outerFrame, borderColor: palette.outerBorder }}
        className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-2xl border transition-all select-none min-w-[680px] w-full"
      >
        <div
          style={{ backgroundColor: palette.cardBg, borderColor: palette.borderRule }}
          className="relative rounded-xl sm:rounded-2xl border flex flex-row items-stretch overflow-hidden h-[345px]"
        >
          {/* Luxury Tactile White Grain Texture on Dark Cardstock */}
          {palette.isDark && <div className="dark-card-grain" />}

          {/* Framing Inlay (Responds to theme.borderStyle) */}
          {renderFramingInlay()}

          {/* Center Emblem Watermark (Responds to theme.decorativeElement) */}
          {renderCenterEmblem('w-64 h-64')}

          {/* Left Perforated Tear Strip */}
          <div
            className="w-11 border-r flex flex-col items-center justify-between py-4 select-none shrink-0 relative z-10"
            style={{ borderColor: palette.borderRule }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.accentGold }} />
            <div
              className="text-[9px] font-mono tracking-widest uppercase rotate-180 whitespace-nowrap font-bold"
              style={{
                writingMode: 'vertical-rl',
                color: palette.accentGold,
              }}
            >
              {isCorporate ? '• OFFICIAL INVITATION PASS •' : '• PLEASE COME JOIN US •'}
            </div>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.accentGold }} />
          </div>

          {/* Main Ticket Section (Equalized height with flex justify-between) */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-left min-w-0 relative z-10">
            {/* Top Line */}
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: palette.borderRule }}>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-serif-elegant italic tracking-widest font-semibold" style={{ color: palette.textSecondary, fontFamily: bodyFontFamily }}>
                  {headerAuspicious}
                </span>
                <span className="opacity-40" style={{ color: palette.textMuted }}>&bull;</span>
                <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: palette.textMuted }}>
                  {headerSubtitle}
                </span>
              </div>

              <div className="text-[10px] font-mono font-bold flex items-center space-x-1" style={{ color: palette.accentGold }}>
                <span>✦</span>
                <span>{headerTag}</span>
                <span>✦</span>
              </div>
            </div>

            {/* Hero: Couple Names */}
            <div className="my-1">
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase truncate drop-shadow-xs"
                style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}
              >
                {isCorporate ? (
                  corporate?.eventHeading || invitation.title
                ) : (
                  <>
                    <span>{couple.brideName}</span>
                    <span className="font-serif-elegant italic font-normal opacity-90 mx-1.5" style={{ color: palette.accentGold }}>&amp;</span>
                    <span>{couple.groomName}</span>
                  </>
                )}
              </h1>
              <p className="text-[11px] mt-0.5 truncate" style={{ color: palette.textBody, fontFamily: bodyFontFamily }}>
                {isCorporate
                  ? (corporate?.eventSubheading || 'Annual Gala, Keynote Discourse & Honors')
                  : 'request the honor of your gracious presence & prayers'}
              </p>
            </div>

            {/* Date Container */}
            <div
              className="py-2 px-3 sm:px-4 rounded-xl border flex items-center justify-between gap-3 shadow-inner"
              style={{ borderColor: palette.boxBorder, backgroundColor: palette.boxBg }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-bold font-mono">
                <span className="tracking-wider" style={{ color: palette.textPrimary }}>
                  {dayName}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded border font-heading text-base sm:text-lg font-black shadow-xs"
                  style={{
                    backgroundColor: palette.badgeBg,
                    color: palette.badgeText,
                    borderColor: palette.badgeBorder,
                  }}
                >
                  {dayNumber}
                </span>
                <span className="tracking-wider" style={{ color: palette.textPrimary }}>
                  {monthName} {yearNumber}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold" style={{ color: palette.textSecondary }}>
                <Clock className="w-3.5 h-3.5" style={{ color: palette.accentGold }} />
                <span>{couple.mainEventTime || '12:00 PM'}</span>
              </div>
            </div>

            {/* Schedule Highlights Bar */}
            <div className="py-1 px-2 rounded-lg border flex items-center justify-between text-[10px] font-mono" style={{ borderColor: palette.borderRule, backgroundColor: palette.boxBg }}>
              <span className="font-bold uppercase tracking-wider" style={{ color: palette.accentGold }}>✦ TIMELINE:</span>
              {displaySchedule.slice(0, 3).map((item, idx) => (
                <span key={idx} className="flex items-center space-x-1 truncate max-w-[140px]" style={{ color: palette.textBody }}>
                  <span style={{ color: palette.accentGold }}>&bull;</span>
                  <span className="font-bold">{item.startTime}</span>
                  <span className="truncate opacity-90">{item.title.split(' ')[0]}</span>
                </span>
              ))}
            </div>

            {/* Venue & Location Footer Line */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t mt-1" style={{ borderColor: palette.borderRule }}>
              <div className="flex items-center space-x-1.5 truncate max-w-[340px] font-medium" style={{ color: palette.textBody }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: palette.accentGold }} />
                <span className="truncate font-semibold" style={{ color: palette.textPrimary }}>{venue.venueName}</span>
                <span className="opacity-40" style={{ color: palette.textMuted }}>&bull;</span>
                <span className="truncate opacity-80">{venue.venueAddress}</span>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 ml-2" style={{ color: palette.accentGold }}>
                {isCorporate ? 'GATE: MAIN FOYER' : 'TABLE: VIP-07'}
              </span>
            </div>
          </div>

          {/* Perforation Line with Concave Semicircular Notches */}
          <div className="relative flex flex-col justify-between items-center w-0 select-none">
            <div
              className="w-6 h-6 rounded-full -top-3 -mr-3 absolute z-20 border shadow-inner"
              style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
            />
            <div
              className="h-full border-r-2 border-dashed z-10"
              style={{ borderColor: palette.borderDashed }}
            />
            <div
              className="w-6 h-6 rounded-full -bottom-3 -mr-3 absolute z-20 border shadow-inner"
              style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
            />
          </div>

          {/* Right Admission Stub */}
          <div
            className="w-56 p-4 sm:p-5 flex flex-col items-center justify-between text-center shrink-0"
            style={{
              borderColor: palette.borderRule,
              backgroundColor: palette.stubBg,
            }}
          >
            {showQr && qrCodeDataUrl ? (
              <div className="flex flex-col items-center my-0.5">
                <div className="p-1.5 bg-white rounded-xl shadow-md border" style={{ borderColor: palette.accentGold }}>
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-lg" />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1" style={{ color: palette.accentGold }}>
                  SCAN FOR ENTRY
                </span>
              </div>
            ) : (
              <div className="my-0.5">
                <CircularTicketStamp
                  color={palette.stampColor}
                  topText={isCorporate ? 'OFFICIAL ENTRANCE PASS' : 'YOU ARE CORDIALLY INVITED'}
                  centerText="ADMIT ONE"
                />
              </div>
            )}

            {/* Barcode Graphic */}
            <div className="my-1 w-full">
              <BarcodeGraphic serial={serialCode} color={palette.barcodeColor} />
            </div>

            {invitation.rsvpEnabled && onOpenRsvp ? (
              <button
                type="button"
                onClick={onOpenRsvp}
                className="w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-md hover:opacity-95 active:scale-95"
                style={{
                  backgroundColor: palette.rsvpBtnBg,
                  color: palette.rsvpBtnText,
                }}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>CONFIRM RSVP</span>
              </button>
            ) : (
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: palette.accentGold }}>
                ★ VALID ADMISSION ★
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHorizontalBack = () => (
    <div className="overflow-x-auto w-full pb-2">
      <div
        style={{ backgroundColor: palette.outerFrame, borderColor: palette.outerBorder }}
        className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-2xl border transition-all select-none min-w-[680px] w-full"
      >
        <div
          style={{ backgroundColor: palette.cardBg, borderColor: palette.borderRule }}
          className="relative rounded-xl sm:rounded-2xl border flex flex-row items-stretch overflow-hidden h-[345px]"
        >
          {/* Luxury Tactile White Grain Texture on Dark Cardstock */}
          {palette.isDark && <div className="dark-card-grain" />}

          {/* Framing Inlay (Responds to theme.borderStyle) */}
          {renderFramingInlay()}

          {/* Center Emblem Watermark (Responds to theme.decorativeElement) */}
          {renderCenterEmblem('w-64 h-64')}

          {/* Left Stub: RSVP */}
          <div
            className="w-56 p-4 sm:p-5 flex flex-col justify-between border-r text-left shrink-0 relative z-10"
            style={{
              borderColor: palette.borderRule,
              backgroundColor: palette.stubBg,
            }}
          >
            <div>
              <h3
                className="text-base uppercase tracking-wider flex items-center space-x-1 font-extrabold"
                style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}
              >
                <span style={{ color: palette.accentGold }}>✦</span>
                <span>RSVP</span>
              </h3>
              <p className="text-[10px] font-mono mb-2" style={{ color: palette.textMuted }}>Please respond</p>

              <div className="space-y-1.5 text-xs font-mono" style={{ color: palette.textPrimary }}>
                <label className="flex items-center space-x-1.5 font-bold">
                  <span className="w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold bg-white text-emerald-700">
                    ✓
                  </span>
                  <span>I&apos;ll be there</span>
                </label>

                <label className="flex items-center space-x-1.5 opacity-75">
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-300 bg-white/40" />
                  <span>I can&apos;t make it</span>
                </label>
              </div>

              {receiver.receiverName && (
                <div className="mt-3 pt-2 border-t text-[10px]" style={{ borderColor: palette.borderRule }}>
                  <span className="block font-mono font-bold uppercase" style={{ color: palette.accentGold }}>Reception Desk:</span>
                  <span className="font-semibold truncate block" style={{ color: palette.textPrimary }}>{receiver.receiverName}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <BarcodeGraphic serial={serialCode} color={palette.barcodeColor} />
            </div>
          </div>

          {/* Perforation Line with Concave Semicircular Notches */}
          <div className="relative flex flex-col justify-between items-center w-0 select-none">
            <div
              className="w-6 h-6 rounded-full -top-3 -mr-3 absolute z-20 border shadow-inner"
              style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
            />
            <div
              className="h-full border-r-2 border-dashed z-10"
              style={{ borderColor: palette.borderDashed }}
            />
            <div
              className="w-6 h-6 rounded-full -bottom-3 -mr-3 absolute z-20 border shadow-inner"
              style={{ backgroundColor: palette.notchBg, borderColor: palette.outerBorder }}
            />
          </div>

          {/* Right Main Section: Event Schedule */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-left min-w-0 relative z-10">
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: palette.borderRule }}>
                <h2
                  className="text-sm sm:text-base font-extrabold uppercase tracking-wide"
                  style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}
                >
                  {isCorporate ? 'SUMMIT AGENDA & PROGRAM' : 'EVENT SCHEDULE & CEREMONY DETAILS'}
                </h2>
                <span className="text-[10px] font-mono font-bold" style={{ color: palette.accentGold }}>
                  PASS #{invitation.id.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Program Timeline */}
              <div className="space-y-1.5">
                {displaySchedule.slice(0, 4).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start space-x-2 text-xs">
                    <span className="text-xs font-bold leading-tight" style={{ color: palette.accentGold }}>◆</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-mono font-bold text-[11px] shrink-0" style={{ color: palette.textSecondary }}>
                          {item.startTime}
                        </span>
                        <span className="font-bold truncate" style={{ color: palette.textPrimary, fontFamily: headingFontFamily }}>{item.title}</span>
                      </div>
                      {item.description && (
                        <p className="text-[10px] truncate leading-tight" style={{ color: palette.textBody, fontFamily: bodyFontFamily }}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {specialNote && (
                <p className="mt-2 pt-1.5 border-t text-[11px] italic line-clamp-2 leading-snug" style={{ borderColor: palette.borderRule, color: palette.textBody, fontFamily: bodyFontFamily }}>
                  &ldquo;{specialNote}&rdquo;
                </p>
              )}
            </div>

            {/* Bottom Contact / Location */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t mt-1 text-[10px] font-mono" style={{ borderColor: palette.borderRule }}>
              {receiver.contactPhone && (
                <div className="flex items-center space-x-1 font-semibold" style={{ color: palette.textBody }}>
                  <Phone className="w-3 h-3" style={{ color: palette.accentGold }} />
                  <span>{receiver.contactPhone}</span>
                </div>
              )}

              <div className="flex items-center space-x-1 font-semibold truncate max-w-[280px]" style={{ color: palette.textBody }}>
                <MapPin className="w-3 h-3 shrink-0" style={{ color: palette.accentGold }} />
                <span className="truncate">{venue.venueName}</span>
              </div>

              <div className="flex items-center space-x-1 font-semibold" style={{ color: palette.accentGold }}>
                <Globe className="w-3 h-3" />
                <span>DAWAT.ME</span>
              </div>
            </div>
          </div>

          {/* Right Perforated Edge */}
          <div
            className="w-11 border-l flex flex-col items-center justify-between py-4 select-none shrink-0"
            style={{ borderColor: palette.borderRule }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.accentGold }} />
            <div
              className="text-[9px] font-mono tracking-widest uppercase rotate-180 whitespace-nowrap font-bold"
              style={{
                writingMode: 'vertical-rl',
                color: palette.accentGold,
              }}
            >
              • EVENT TIMELINE & DETAILS •
            </div>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.accentGold }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Ticket Controls Toolbar: Flip Side / Stacked View / Orientation / QR Toggle */}
      {!isTicketMode && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-1 text-xs">
          {/* Side Switcher Pills */}
          <div className="flex items-center space-x-1 bg-stone-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTicketSide('front')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
                ticketSide === 'front'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Front</span>
            </button>

            <button
              type="button"
              onClick={() => setTicketSide('back')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
                ticketSide === 'back'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setTicketSide('both')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
                ticketSide === 'both'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Both Sides</span>
            </button>
          </div>

          {/* Orientation & QR Toggles */}
          <div className="flex items-center space-x-1.5">
            {/* Orientation Switcher */}
            <button
              type="button"
              onClick={() => setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical')}
              className="px-2.5 py-1 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold flex items-center space-x-1 transition shadow-xs"
              title="Switch between Vertical VIP Pass and Horizontal Ticket"
            >
              {orientation === 'vertical' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-800" />
                  <span>Vertical Pass</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-stone-800" />
                  <span>Horizontal Pass</span>
                </>
              )}
            </button>

            {/* QR Code Toggle */}
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className={`px-2.5 py-1 rounded-xl border font-semibold flex items-center space-x-1 transition shadow-xs ${
                showQr
                  ? 'bg-stone-900 text-[#D4AF37] border-stone-800'
                  : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
              }`}
              title="Toggle QR Code / Admit One Stamp"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR: {showQr ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER TICKET (Screen-Fitted, High-Res Physical Graphic Ticket) */}
      <div id="wedding-invitation-card" className="w-full space-y-4">
        {orientation === 'vertical' ? (
          <>
            {(ticketSide === 'front' || ticketSide === 'both') && renderVerticalFront()}
            {(ticketSide === 'back' || ticketSide === 'both') && renderVerticalBack()}
          </>
        ) : (
          <>
            {(ticketSide === 'front' || ticketSide === 'both') && renderHorizontalFront()}
            {(ticketSide === 'back' || ticketSide === 'both') && renderHorizontalBack()}
          </>
        )}
      </div>

      {/* External Actions (Maps link & Photo folder link) */}
      {!isTicketMode && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          {venue.mapsUrl && (
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-800" />
              <span>Directions</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          )}

          {onNavigateToPhotos && (
            <button
              type="button"
              onClick={onNavigateToPhotos}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-stone-800" />
              <span>Photo Gallery</span>
            </button>
          )}

          <a
            href={createGoogleCalendarUrl(invitation)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-800" />
            <span>Calendar</span>
          </a>
        </div>
      )}
    </div>
  );
};
