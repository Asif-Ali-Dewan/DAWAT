import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { formatWeddingDate } from '../../utils/formatting';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl } from '../../utils/calendar';
import {
  DesiWeddingArch,
  CorporateSealBadge,
  BarcodeGraphic,
  CircularTicketStamp,
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

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  // Side view: 'front' (Admission Pass), 'back' (Schedule & Details), or 'both' (Stacked mockup like reference)
  const [ticketSide, setTicketSide] = useState<'front' | 'back' | 'both'>('front');
  // QR toggle (defaults to invitation.showQrCode !== false)
  const [showQr, setShowQr] = useState<boolean>(invitation.showQrCode ?? true);

  const isCorporate = eventType === 'corporate' || theme.preset === 'corporate-noir';

  // Primary brand theme colors
  const primaryBrandColor = theme.cardColor || (isCorporate ? '#0F172A' : '#350010');
  const goldAccent = theme.accentColor || '#D4AF37';

  // Ticket Paper Colors:
  // Outer frame uses the deep rich brand color (Burgundy #350010 or Sapphire #290EA0 or Slate #0F172A).
  // Inner ticket uses luxury parchment ivory (#FAF7F2 / #FDFBF7) just like the reference image for maximum readability and authentic ticket look.
  const frameColor = primaryBrandColor;
  const paperBg = '#FAF7F2';
  const paperText = '#261C14';
  const paperMuted = '#786A5E';
  const paperGold = '#A67C1E'; // High-contrast antique gold ink for paper
  const paperBorder = 'rgba(166, 124, 30, 0.35)';

  useEffect(() => {
    const photoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;
    generateQrCode(photoUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: primaryBrandColor,
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl);
  }, [invitation.slug, primaryBrandColor]);

  // Parse date pieces
  const dateObj = new Date(couple.weddingDate || '2026-12-18');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = dateObj.getDate() || 18;
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const yearNumber = dateObj.getFullYear() || 2026;

  // Fallback schedule if none provided
  const displaySchedule: ScheduleItem[] = schedule.length > 0 ? schedule : [
    { id: '1', invitationId: invitation.id, title: 'Welcoming Guests & Refreshments', startTime: '11:30 AM', endTime: '12:30 PM', description: 'Traditional sherbet & floral reception', sortOrder: 1 },
    { id: '2', invitationId: invitation.id, title: 'Solemn Ceremony & Exchange of Vows', startTime: '12:30 PM', endTime: '02:00 PM', description: 'Nikah & auspicious blessings', sortOrder: 2 },
    { id: '3', invitationId: invitation.id, title: 'Royal Wedding Feast', startTime: '02:00 PM', endTime: '04:00 PM', description: 'Kacchi Biryani, Borhani, Jorda & Firni', sortOrder: 3 },
    { id: '4', invitationId: invitation.id, title: 'Photo Sessions & Warm Du’a', startTime: '04:00 PM', endTime: '05:30 PM', description: 'Family portraits & felicitations', sortOrder: 4 },
  ];

  const serialCode = `DAW-${(invitation.id || '2026').slice(-8).toUpperCase()}`;

  // =========================================================================
  // SUB-COMPONENT: TICKET FRONT (ADMISSION PASS)
  // Matching Top Ticket of Reference Image
  // =========================================================================
  const renderTicketFront = () => (
    <div
      style={{ backgroundColor: frameColor }}
      className="relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xl border border-black/10 transition-all select-none w-full"
    >
      <div
        style={{ backgroundColor: paperBg }}
        className="relative rounded-xl sm:rounded-2xl border flex flex-col md:flex-row items-stretch overflow-hidden"
      >
        {/* 1. Left Perforated Tear Strip (Reference: "• PLEASE COME JOIN US •") */}
        <div
          className="hidden md:flex w-11 border-r flex-col items-center justify-between py-4 select-none shrink-0"
          style={{ borderColor: paperBorder }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: paperGold }} />
          <div
            className="text-[9px] font-mono tracking-widest uppercase rotate-180 whitespace-nowrap font-bold"
            style={{
              writingMode: 'vertical-rl',
              color: paperGold,
            }}
          >
            {isCorporate ? '• OFFICIAL INVITATION PASS •' : '• PLEASE COME JOIN US •'}
          </div>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: paperGold }} />
        </div>

        {/* 2. Main Ticket Section (Header, Couple Names, Date Box, Schedule Highlights, Venue) */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-left min-w-0">
          {/* Top Line: Auspicious greeting / invocation */}
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: paperBorder }}>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-serif-elegant italic tracking-widest" style={{ color: paperGold }}>
                {isCorporate ? 'OFFICIAL EXECUTIVE SUMMIT' : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: paperMuted }}>
                {isCorporate ? (corporate?.organizationName || 'CORPORATE GALA') : 'THE WEDDING OF'}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-[10px] font-mono font-bold" style={{ color: paperGold }}>
              <span>{isCorporate ? 'VIP ENTRY' : 'SHUVO BIBAHO'}</span>
            </div>
          </div>

          {/* Hero: Bride & Groom Names in Bold Luxury Typography */}
          <div className="my-2.5 sm:my-3">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight leading-none uppercase truncate"
              style={{ color: primaryBrandColor }}
            >
              {isCorporate
                ? (corporate?.eventHeading || invitation.title)
                : `${couple.brideName} & ${couple.groomName}`}
            </h1>
            <p className="text-[11px] sm:text-xs font-serif-elegant italic mt-1 font-medium" style={{ color: paperMuted }}>
              {isCorporate
                ? (corporate?.eventSubheading || 'Annual Gala, Keynote Discourse & Honors')
                : 'request the honor of your gracious presence & prayers'}
            </p>
          </div>

          {/* Date Container (Reference format: SATURDAY | 10 | NOVEMBER) */}
          <div
            className="py-2 px-3 sm:px-4 rounded-xl border flex items-center justify-between gap-2"
            style={{ borderColor: paperBorder, backgroundColor: 'rgba(166, 124, 30, 0.05)' }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-bold font-mono">
              <span className="tracking-wider" style={{ color: paperText }}>
                {dayName}
              </span>
              <span className="px-2 py-0.5 rounded border font-heading text-base sm:text-lg font-black bg-white shadow-xs" style={{ borderColor: paperGold, color: primaryBrandColor }}>
                {dayNumber}
              </span>
              <span className="tracking-wider" style={{ color: paperText }}>
                {monthName} {yearNumber}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold" style={{ color: primaryBrandColor }}>
              <Clock className="w-3.5 h-3.5 text-[#A67C1E]" />
              <span>{couple.mainEventTime || '12:00 PM'}</span>
            </div>
          </div>

          {/* Schedule Summary Strip Right on Ticket */}
          <div className="my-2 pt-2 border-t flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono" style={{ borderColor: paperBorder }}>
            <span className="font-bold uppercase tracking-wider text-[#A67C1E]">
              TIMELINE:
            </span>
            {displaySchedule.slice(0, 3).map((item, idx) => (
              <span key={idx} className="flex items-center space-x-1 font-medium" style={{ color: paperText }}>
                <span>&bull;</span>
                <span className="font-bold">{item.startTime}</span>
                <span className="opacity-80">{item.title.split(' ')[0]}</span>
              </span>
            ))}
          </div>

          {/* Venue & Location Footer Line */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-1.5 border-t" style={{ borderColor: paperBorder }}>
            <div className="flex items-center space-x-1.5 truncate max-w-[320px] font-medium" style={{ color: paperText }}>
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#A67C1E]" />
              <span className="truncate font-semibold">{venue.venueName}</span>
              <span className="text-stone-300">&bull;</span>
              <span className="truncate opacity-75">{venue.venueAddress}</span>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 ml-2" style={{ color: paperGold }}>
              {isCorporate ? 'GATE: MAIN FOYER' : 'TABLE: VIP-07'}
            </span>
          </div>
        </div>

        {/* Perforation Line with Concave Semicircular Notches */}
        <div className="relative flex md:flex-col justify-between items-center w-full md:w-0 select-none">
          {/* Top Notch Cutout */}
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full -top-2.5 sm:-top-3 -mr-2.5 sm:-mr-3 absolute z-20 border border-black/10 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />

          {/* Dashed Perforation Line */}
          <div
            className="w-full md:w-0 md:h-full border-b md:border-b-0 md:border-r-2 border-dashed my-1 md:my-0 z-10"
            style={{ borderColor: paperGold, opacity: 0.6 }}
          />

          {/* Bottom Notch Cutout */}
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full -bottom-2.5 sm:-bottom-3 -mr-2.5 sm:-mr-3 absolute z-20 border border-black/10 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
        </div>

        {/* 3. Right Admission Stub (Reference: Circular Text Stamp + Barcode / QR) */}
        <div
          className="w-full md:w-52 p-4 sm:p-5 flex flex-col items-center justify-between text-center shrink-0 border-t md:border-t-0"
          style={{
            borderColor: paperBorder,
            backgroundColor: 'rgba(166, 124, 30, 0.04)',
          }}
        >
          {/* Circular Stamp or Scannable QR Code */}
          {showQr && qrCodeDataUrl ? (
            <div className="flex flex-col items-center my-1">
              <div className="p-1.5 bg-white rounded-xl shadow-xs border" style={{ borderColor: paperBorder }}>
                <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 sm:w-22 sm:h-22 object-contain rounded-lg" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1" style={{ color: paperGold }}>
                SCAN FOR PHOTOS & ENTRY
              </span>
            </div>
          ) : (
            <div className="my-1">
              <CircularTicketStamp
                color={primaryBrandColor}
                topText={isCorporate ? 'OFFICIAL ENTRANCE PASS' : 'YOU ARE CORDIALLY INVITED'}
                centerText="ADMIT ONE"
              />
            </div>
          )}

          {/* Barcode Graphic with Serial Number */}
          <div className="my-1.5 w-full">
            <BarcodeGraphic
              serial={serialCode}
              color={primaryBrandColor}
            />
          </div>

          {/* Quick RSVP / Status on Stub */}
          {invitation.rsvpEnabled && onOpenRsvp ? (
            <button
              type="button"
              onClick={onOpenRsvp}
              className="w-full py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-xs hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: primaryBrandColor,
                color: '#FFFFFF',
              }}
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>CONFIRM RSVP</span>
            </button>
          ) : (
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: paperGold }}>
              ★ VALID ADMISSION ★
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // SUB-COMPONENT: TICKET BACK (SCHEDULE, HOST & TERMS)
  // Matching Bottom Ticket of Reference Image
  // =========================================================================
  const renderTicketBack = () => (
    <div
      style={{ backgroundColor: frameColor }}
      className="relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-xl border border-black/10 transition-all select-none w-full"
    >
      <div
        style={{ backgroundColor: paperBg }}
        className="relative rounded-xl sm:rounded-2xl border flex flex-col md:flex-row items-stretch overflow-hidden"
      >
        {/* Left Stub: RSVP Checkboxes (Reference bottom ticket: "RSVP ○ I'll be there ○ I can't make it") */}
        <div
          className="w-full md:w-48 p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r text-left shrink-0"
          style={{
            borderColor: paperBorder,
            backgroundColor: 'rgba(166, 124, 30, 0.04)',
          }}
        >
          <div>
            <h3 className="font-heading font-extrabold text-lg uppercase tracking-wider" style={{ color: primaryBrandColor }}>
              RSVP
            </h3>
            <p className="text-[10px] font-mono text-stone-500 mb-3">Please respond before {couple.weddingDate}</p>

            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-center space-x-2 text-stone-800 cursor-pointer">
                <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[10px] font-bold text-emerald-700 bg-white">
                  ✓
                </span>
                <span className="font-semibold">I&apos;ll be there</span>
              </label>

              <label className="flex items-center space-x-2 text-stone-500 cursor-pointer">
                <span className="w-3.5 h-3.5 rounded-full border border-stone-300 bg-white" />
                <span>I can&apos;t make it</span>
              </label>
            </div>

            {receiver.receiverName && (
              <div className="mt-4 pt-3 border-t text-[10px]" style={{ borderColor: paperBorder }}>
                <span className="block font-mono font-bold uppercase text-[#A67C1E]">Reception Desk:</span>
                <span className="font-semibold text-stone-800">{receiver.receiverName}</span>
                {receiver.receiverRole && <span className="text-stone-500 block">({receiver.receiverRole})</span>}
              </div>
            )}
          </div>

          <div className="mt-3">
            <BarcodeGraphic serial={serialCode} color={primaryBrandColor} />
          </div>
        </div>

        {/* Perforation Line with Concave Semicircular Notches */}
        <div className="relative flex md:flex-col justify-between items-center w-full md:w-0 select-none">
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full -top-2.5 sm:-top-3 -mr-2.5 sm:-mr-3 absolute z-20 border border-black/10 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
          <div
            className="w-full md:w-0 md:h-full border-b md:border-b-0 md:border-r-2 border-dashed my-1 md:my-0 z-10"
            style={{ borderColor: paperGold, opacity: 0.6 }}
          />
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full -bottom-2.5 sm:-bottom-3 -mr-2.5 sm:-mr-3 absolute z-20 border border-black/10 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
        </div>

        {/* Right Main Section: Event Schedule Timeline with diamond bullets */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-left min-w-0">
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: paperBorder }}>
              <h2 className="text-base sm:text-lg font-heading font-extrabold uppercase tracking-wide" style={{ color: primaryBrandColor }}>
                {isCorporate ? 'SUMMIT AGENDA & CODE' : 'EVENT SCHEDULE & CEREMONY DETAILS'}
              </h2>
              <span className="text-[10px] font-mono font-bold text-[#A67C1E]">
                PASS # {invitation.id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Program Timeline (Diamond bullets) */}
            <div className="space-y-2.5">
              {displaySchedule.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start space-x-2 text-xs">
                  <span className="text-[#A67C1E] text-xs font-bold leading-tight">◆</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2 flex-wrap">
                      <span className="font-mono font-bold text-[11px]" style={{ color: primaryBrandColor }}>
                        {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                      </span>
                      <span className="font-bold text-stone-900 truncate">{item.title}</span>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-stone-600 leading-snug">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Note */}
            {specialNote && (
              <p className="mt-3 pt-2 border-t text-[11px] font-serif-elegant italic text-stone-600" style={{ borderColor: paperBorder }}>
                &ldquo;{specialNote}&rdquo;
              </p>
            )}
          </div>

          {/* Bottom Contact / Location Row (Reference format: 📞 CALL 123... 📍 VENUE 🌐 WEBSITE) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t mt-3 text-[10px] font-mono" style={{ borderColor: paperBorder }}>
            {receiver.contactPhone && (
              <div className="flex items-center space-x-1 font-semibold text-stone-700">
                <Phone className="w-3 h-3 text-[#A67C1E]" />
                <span>{receiver.contactPhone}</span>
              </div>
            )}

            <div className="flex items-center space-x-1 font-semibold text-stone-700 truncate max-w-[260px]">
              <MapPin className="w-3 h-3 text-[#A67C1E] shrink-0" />
              <span className="truncate">{venue.venueName}</span>
            </div>

            <div className="flex items-center space-x-1 font-semibold text-[#A67C1E]">
              <Globe className="w-3 h-3" />
              <span>DAWAT.ME</span>
            </div>
          </div>
        </div>

        {/* Right Perforated Edge */}
        <div
          className="hidden md:flex w-11 border-l flex-col items-center justify-between py-4 select-none shrink-0"
          style={{ borderColor: paperBorder }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: paperGold }} />
          <div
            className="text-[9px] font-mono tracking-widest uppercase rotate-180 whitespace-nowrap font-bold"
            style={{
              writingMode: 'vertical-rl',
              color: paperGold,
            }}
          >
            • EVENT TIMELINE & DETAILS •
          </div>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: paperGold }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Ticket Controls Toolbar: Flip Side / Stacked View / QR Toggle */}
      {!isTicketMode && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-1 text-xs">
          {/* Side Switcher Pills */}
          <div className="flex items-center space-x-1 bg-stone-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTicketSide('front')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                ticketSide === 'front'
                  ? 'bg-[#350010] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Ticket Front (Pass)</span>
            </button>

            <button
              type="button"
              onClick={() => setTicketSide('back')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                ticketSide === 'back'
                  ? 'bg-[#350010] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ticket Back (Schedule & Details)</span>
            </button>

            <button
              type="button"
              onClick={() => setTicketSide('both')}
              className={`hidden sm:flex px-3 py-1 rounded-lg font-semibold items-center space-x-1.5 transition ${
                ticketSide === 'both'
                  ? 'bg-[#350010] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Both Sides</span>
            </button>
          </div>

          {/* QR Code Toggle (as requested: "QR only if the invitor wants to add") */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className={`px-3 py-1 rounded-xl border font-semibold flex items-center space-x-1.5 transition ${
                showQr
                  ? 'bg-[#350010] text-[#D4AF37] border-[#D4AF37]/40 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
              }`}
              title="Toggle QR Code / Vintage Admit One Stamp"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code: {showQr ? 'Active' : 'Hidden'}</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER TICKET (Screen-Fitted, High-Res Physical Graphic Ticket) */}
      <div id="wedding-invitation-card" className="w-full space-y-5">
        {(ticketSide === 'front' || ticketSide === 'both') && renderTicketFront()}
        {(ticketSide === 'back' || ticketSide === 'both') && renderTicketBack()}
      </div>

      {/* External Actions (Maps link & Photo folder link) */}
      {!isTicketMode && (
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          {venue.mapsUrl && (
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-[#350010]" />
              <span>Google Maps Directions</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          )}

          {onNavigateToPhotos && (
            <button
              type="button"
              onClick={onNavigateToPhotos}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-[#350010]" />
              <span>Event Photo Album</span>
            </button>
          )}

          <a
            href={createGoogleCalendarUrl(invitation)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-[#350010]" />
            <span>Add to Calendar</span>
          </a>
        </div>
      )}
    </div>
  );
};
