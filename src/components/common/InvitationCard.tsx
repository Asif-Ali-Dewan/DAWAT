import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl } from '../../utils/calendar';
import {
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

  // Fallback schedule if none provided
  const displaySchedule: ScheduleItem[] = schedule.length > 0 ? schedule : [
    { id: '1', invitationId: invitation.id, title: 'Welcoming Guests & Refreshments', startTime: '11:30 AM', endTime: '12:30 PM', description: 'Traditional sherbet & floral reception', sortOrder: 1 },
    { id: '2', invitationId: invitation.id, title: 'Solemn Ceremony & Exchange of Vows', startTime: '12:30 PM', endTime: '02:00 PM', description: 'Nikah & auspicious blessings', sortOrder: 2 },
    { id: '3', invitationId: invitation.id, title: 'Royal Wedding Feast', startTime: '02:00 PM', endTime: '04:00 PM', description: 'Kacchi Biryani, Borhani, Jorda & Firni', sortOrder: 3 },
    { id: '4', invitationId: invitation.id, title: 'Photo Sessions & Warm Du’a', startTime: '04:00 PM', endTime: '05:30 PM', description: 'Family portraits & felicitations', sortOrder: 4 },
  ];

  // User requirement: "keep the ticket vertical if inviter add too many things, otherwise keep it simple horizontal or vertical as it looks good"
  const hasLotsOfContent = displaySchedule.length > 2 || Boolean(specialNote && specialNote.length > 60);

  // Orientation state: defaults to vertical on mobile preview or when rich content is present
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(() => {
    if (isMobilePreview || hasLotsOfContent) return 'vertical';
    return 'vertical';
  });

  // Primary brand theme colors
  const primaryBrandColor = theme.cardColor || (isCorporate ? '#0F172A' : '#350010');

  // Ticket Paper Colors:
  const frameColor = primaryBrandColor;
  const paperBg = '#FAF7F2';
  const paperText = '#261C14';
  const paperMuted = '#786A5E';
  const paperGold = '#A67C1E';
  const paperBorder = 'rgba(166, 124, 30, 0.3)';

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

  const serialCode = `DAW-${(invitation.id || '2026').slice(-8).toUpperCase()}`;

  // =========================================================================
  // 1. VERTICAL TICKET LAYOUT (PORTRAIT VIP PASS)
  // Perfectly fitted for mobile and rich content. Zero overlapping guaranteed.
  // =========================================================================

  const renderVerticalFront = () => (
    <div
      style={{ backgroundColor: frameColor }}
      className="relative rounded-3xl p-3 sm:p-4 shadow-xl border border-black/15 transition-all select-none w-full max-w-md mx-auto"
    >
      <div
        style={{ backgroundColor: paperBg }}
        className="relative rounded-2xl border flex flex-col items-stretch overflow-hidden"
      >
        {/* Top Header / Auspicious Invocation */}
        <div className="p-4 sm:p-5 text-center border-b" style={{ borderColor: paperBorder }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono uppercase tracking-widest font-bold" style={{ color: paperGold }}>
              {isCorporate ? 'OFFICIAL PASS' : 'SHUVO BIBAHO'}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: paperMuted }}>
              PASS #{invitation.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="text-[11px] font-serif-elegant italic tracking-wider font-semibold mb-1" style={{ color: paperGold }}>
            {isCorporate ? 'OFFICIAL EXECUTIVE SUMMIT 2026' : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
          </div>

          <div className="text-[9px] font-mono uppercase tracking-widest font-semibold opacity-75" style={{ color: paperMuted }}>
            {isCorporate ? (corporate?.organizationName || 'CORPORATE GALA') : 'THE WEDDING OF'}
          </div>

          {/* Couple Names */}
          <h1
            className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight uppercase leading-tight my-2"
            style={{ color: primaryBrandColor }}
          >
            {isCorporate
              ? (corporate?.eventHeading || invitation.title)
              : `${couple.brideName} & ${couple.groomName}`}
          </h1>

          <p className="text-[11px] font-serif-elegant italic text-stone-600 max-w-xs mx-auto">
            {isCorporate
              ? (corporate?.eventSubheading || 'Honoring Innovation, Sustainable Leadership & Strategic Partnerships')
              : 'request the honor of your gracious presence and heartfelt prayers'}
          </p>

          {/* Date & Time Box */}
          <div
            className="mt-3.5 p-2.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
            style={{ borderColor: paperBorder, backgroundColor: 'rgba(166, 124, 30, 0.05)' }}
          >
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold font-mono">
              <span className="tracking-wider" style={{ color: paperText }}>
                {dayName}
              </span>
              <span
                className="px-2.5 py-0.5 rounded border font-heading text-base sm:text-lg font-black bg-white shadow-xs"
                style={{ borderColor: paperGold, color: primaryBrandColor }}
              >
                {dayNumber}
              </span>
              <span className="tracking-wider" style={{ color: paperText }}>
                {monthName} {yearNumber}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-xs font-mono font-bold" style={{ color: primaryBrandColor }}>
              <Clock className="w-3.5 h-3.5 text-[#A67C1E]" />
              <span>{couple.mainEventTime || '12:00 PM'}</span>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="mt-3 pt-3 border-t text-center space-y-0.5" style={{ borderColor: paperBorder }}>
            <div className="flex items-center justify-center space-x-1.5 font-bold text-xs" style={{ color: paperText }}>
              <MapPin className="w-3.5 h-3.5 text-[#A67C1E] shrink-0" />
              <span>{venue.venueName}</span>
            </div>
            <p className="text-[11px] text-stone-600 max-w-sm mx-auto leading-tight">
              {venue.venueAddress}
            </p>
            {venue.locationDescription && (
              <p className="text-[10px] text-[#A67C1E] font-medium pt-0.5">
                {venue.locationDescription}
              </p>
            )}
          </div>

          {/* Event Itinerary Timeline (Compact vertical list) */}
          {displaySchedule.length > 0 && (
            <div className="mt-3 pt-3 border-t text-left" style={{ borderColor: paperBorder }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A67C1E]">
                  ✦ EVENT TIMELINE
                </span>
                <span className="text-[9px] font-mono uppercase text-stone-400">
                  {isCorporate ? 'SUMMIT AGENDA' : 'CEREMONY SCHEDULE'}
                </span>
              </div>
              <div className="space-y-1.5">
                {displaySchedule.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-stone-100/60 border border-stone-200/50"
                  >
                    <div className="flex items-center space-x-1.5 min-w-0 mr-2">
                      <span className="text-[#A67C1E] text-[10px] shrink-0">◆</span>
                      <span className="font-semibold text-stone-800 text-[11px] truncate">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-bold shrink-0" style={{ color: primaryBrandColor }}>
                      {item.startTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Perforation Line with Concave Semicircular Notches (Horizontal Perforation) */}
        <div className="relative flex items-center justify-between w-full h-0 select-none">
          {/* Left Notch Cutout */}
          <div
            className="w-6 h-6 rounded-full -left-3 absolute z-20 border border-black/15 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />

          {/* Dashed Perforation Line */}
          <div
            className="w-full border-b-2 border-dashed z-10 mx-3"
            style={{ borderColor: paperGold, opacity: 0.6 }}
          />

          {/* Right Notch Cutout */}
          <div
            className="w-6 h-6 rounded-full -right-3 absolute z-20 border border-black/15 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
        </div>

        {/* Bottom Tear-Off Stub (QR / Stamp + Barcode + RSVP) */}
        <div
          className="p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3"
          style={{ backgroundColor: 'rgba(166, 124, 30, 0.04)' }}
        >
          {showQr && qrCodeDataUrl ? (
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl shadow-xs border" style={{ borderColor: paperBorder }}>
                <img src={qrCodeDataUrl} alt="QR Code" className="w-24 h-24 object-contain rounded-lg" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1.5" style={{ color: paperGold }}>
                SCAN FOR PHOTOS & DIGITAL CHECK-IN
              </span>
            </div>
          ) : (
            <div className="py-1">
              <CircularTicketStamp
                color={primaryBrandColor}
                topText={isCorporate ? 'OFFICIAL ENTRANCE PASS' : 'YOU ARE CORDIALLY INVITED'}
                centerText="ADMIT ONE"
              />
            </div>
          )}

          {/* Barcode Graphic */}
          <div className="w-full max-w-[280px]">
            <BarcodeGraphic serial={serialCode} color={primaryBrandColor} />
          </div>

          {/* RSVP Button */}
          {invitation.rsvpEnabled && onOpenRsvp ? (
            <button
              type="button"
              onClick={onOpenRsvp}
              className="w-full max-w-xs py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: primaryBrandColor,
                color: '#FFFFFF',
              }}
            >
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>CONFIRM ATTENDANCE & RSVP</span>
            </button>
          ) : (
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: paperGold }}>
              ★ VALID ADMISSION PASS ★
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVerticalBack = () => (
    <div
      style={{ backgroundColor: frameColor }}
      className="relative rounded-3xl p-3 sm:p-4 shadow-xl border border-black/15 transition-all select-none w-full max-w-md mx-auto"
    >
      <div
        style={{ backgroundColor: paperBg }}
        className="relative rounded-2xl border flex flex-col items-stretch overflow-hidden"
      >
        {/* Top Section: Program & Schedule Details */}
        <div className="p-4 sm:p-5 text-left border-b" style={{ borderColor: paperBorder }}>
          <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: paperBorder }}>
            <h2 className="text-sm sm:text-base font-heading font-extrabold uppercase tracking-wide" style={{ color: primaryBrandColor }}>
              {isCorporate ? 'SUMMIT PROGRAM & CODE' : 'CEREMONY SCHEDULE & DETAILS'}
            </h2>
            <span className="text-[10px] font-mono font-bold text-[#A67C1E]">
              PASS #{invitation.id.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Program Timeline */}
          <div className="space-y-3">
            {displaySchedule.map((item, idx) => (
              <div key={item.id || idx} className="flex items-start space-x-2 text-xs">
                <span className="text-[#A67C1E] text-xs font-bold mt-0.5">◆</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2 flex-wrap">
                    <span className="font-mono font-bold text-[11px]" style={{ color: primaryBrandColor }}>
                      {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                    </span>
                    <span className="font-bold text-stone-900">{item.title}</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Special Blessings Note */}
          {specialNote && (
            <div className="mt-4 p-3 rounded-xl bg-stone-100/70 border border-stone-200/60 text-stone-700 text-[11px] font-serif-elegant italic">
              &ldquo;{specialNote}&rdquo;
            </div>
          )}

          {/* Reception Host Info */}
          {receiver.receiverName && (
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: paperBorder }}>
              <div>
                <span className="block text-[10px] font-mono font-bold uppercase text-[#A67C1E]">
                  Host / Reception Desk
                </span>
                <span className="font-bold text-stone-900">{receiver.receiverName}</span>
                {receiver.receiverRole && (
                  <span className="text-[11px] text-stone-500 block">({receiver.receiverRole})</span>
                )}
              </div>
              {receiver.contactPhone && (
                <div className="text-right">
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#A67C1E]">
                    Contact
                  </span>
                  <span className="font-mono text-xs font-semibold text-stone-800">{receiver.contactPhone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Perforation Line with Concave Semicircular Notches */}
        <div className="relative flex items-center justify-between w-full h-0 select-none">
          <div
            className="w-6 h-6 rounded-full -left-3 absolute z-20 border border-black/15 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
          <div
            className="w-full border-b-2 border-dashed z-10 mx-3"
            style={{ borderColor: paperGold, opacity: 0.6 }}
          />
          <div
            className="w-6 h-6 rounded-full -right-3 absolute z-20 border border-black/15 shadow-inner"
            style={{ backgroundColor: frameColor }}
          />
        </div>

        {/* Bottom Stub: RSVP Response */}
        <div
          className="p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3"
          style={{ backgroundColor: 'rgba(166, 124, 30, 0.04)' }}
        >
          <div className="w-full flex items-center justify-around text-xs font-mono">
            <label className="flex items-center space-x-1.5 text-stone-800">
              <span className="w-4 h-4 rounded-full border border-stone-400 flex items-center justify-center text-[10px] font-bold text-emerald-700 bg-white">
                ✓
              </span>
              <span className="font-bold">I&apos;ll be there</span>
            </label>

            <label className="flex items-center space-x-1.5 text-stone-500">
              <span className="w-4 h-4 rounded-full border border-stone-300 bg-white" />
              <span>I can&apos;t make it</span>
            </label>
          </div>

          <div className="w-full max-w-[280px]">
            <BarcodeGraphic serial={serialCode} color={primaryBrandColor} />
          </div>

          {invitation.rsvpEnabled && onOpenRsvp && (
            <button
              type="button"
              onClick={onOpenRsvp}
              className="w-full max-w-xs py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: primaryBrandColor,
                color: '#FFFFFF',
              }}
            >
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>SUBMIT RSVP DETAILS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 2. HORIZONTAL TICKET LAYOUT (LANDSCAPE TICKET SLIP)
  // Matching user's reference ticket ("The Wedding of Mary & Artful").
  // Wrapped with safe min-width so text elements never collide.
  // =========================================================================

  const renderHorizontalFront = () => (
    <div className="overflow-x-auto w-full pb-2">
      <div
        style={{ backgroundColor: frameColor }}
        className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-xl border border-black/15 transition-all select-none min-w-[680px] w-full"
      >
        <div
          style={{ backgroundColor: paperBg }}
          className="relative rounded-xl sm:rounded-2xl border flex flex-row items-stretch overflow-hidden"
        >
          {/* Left Perforated Tear Strip */}
          <div
            className="w-11 border-r flex flex-col items-center justify-between py-4 select-none shrink-0"
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

          {/* Main Ticket Section */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-left min-w-0">
            {/* Top Line */}
            <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: paperBorder }}>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-serif-elegant italic tracking-widest font-semibold" style={{ color: paperGold }}>
                  {isCorporate ? 'OFFICIAL EXECUTIVE SUMMIT' : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </span>
                <span className="text-stone-300">&bull;</span>
                <span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: paperMuted }}>
                  {isCorporate ? (corporate?.organizationName || 'CORPORATE GALA') : 'THE WEDDING OF'}
                </span>
              </div>

              <div className="text-[10px] font-mono font-bold" style={{ color: paperGold }}>
                {isCorporate ? 'VIP ENTRY' : 'SHUVO BIBAHO'}
              </div>
            </div>

            {/* Hero: Couple Names */}
            <div className="my-2.5">
              <h1
                className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight uppercase truncate"
                style={{ color: primaryBrandColor }}
              >
                {isCorporate
                  ? (corporate?.eventHeading || invitation.title)
                  : `${couple.brideName} & ${couple.groomName}`}
              </h1>
              <p className="text-[11px] font-serif-elegant italic mt-0.5 text-stone-600 truncate">
                {isCorporate
                  ? (corporate?.eventSubheading || 'Annual Gala, Keynote Discourse & Honors')
                  : 'request the honor of your gracious presence & prayers'}
              </p>
            </div>

            {/* Date Container */}
            <div
              className="py-2 px-3 sm:px-4 rounded-xl border flex items-center justify-between gap-3"
              style={{ borderColor: paperBorder, backgroundColor: 'rgba(166, 124, 30, 0.05)' }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm font-bold font-mono">
                <span className="tracking-wider" style={{ color: paperText }}>
                  {dayName}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded border font-heading text-base sm:text-lg font-black bg-white shadow-xs"
                  style={{ borderColor: paperGold, color: primaryBrandColor }}
                >
                  {dayNumber}
                </span>
                <span className="tracking-wider" style={{ color: paperText }}>
                  {monthName} {yearNumber}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold" style={{ color: primaryBrandColor }}>
                <Clock className="w-3.5 h-3.5 text-[#A67C1E]" />
                <span>{couple.mainEventTime || '12:00 PM'}</span>
              </div>
            </div>

            {/* Venue & Location Footer Line */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t mt-2" style={{ borderColor: paperBorder }}>
              <div className="flex items-center space-x-1.5 truncate max-w-[340px] font-medium" style={{ color: paperText }}>
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
          <div className="relative flex flex-col justify-between items-center w-0 select-none">
            {/* Top Notch Cutout */}
            <div
              className="w-6 h-6 rounded-full -top-3 -mr-3 absolute z-20 border border-black/15 shadow-inner"
              style={{ backgroundColor: frameColor }}
            />

            {/* Dashed Perforation Line */}
            <div
              className="h-full border-r-2 border-dashed z-10"
              style={{ borderColor: paperGold, opacity: 0.6 }}
            />

            {/* Bottom Notch Cutout */}
            <div
              className="w-6 h-6 rounded-full -bottom-3 -mr-3 absolute z-20 border border-black/15 shadow-inner"
              style={{ backgroundColor: frameColor }}
            />
          </div>

          {/* Right Admission Stub */}
          <div
            className="w-56 p-4 sm:p-5 flex flex-col items-center justify-between text-center shrink-0"
            style={{
              borderColor: paperBorder,
              backgroundColor: 'rgba(166, 124, 30, 0.04)',
            }}
          >
            {showQr && qrCodeDataUrl ? (
              <div className="flex flex-col items-center my-0.5">
                <div className="p-1.5 bg-white rounded-xl shadow-xs border" style={{ borderColor: paperBorder }}>
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-20 h-20 object-contain rounded-lg" />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase mt-1" style={{ color: paperGold }}>
                  SCAN FOR ENTRY
                </span>
              </div>
            ) : (
              <div className="my-0.5">
                <CircularTicketStamp
                  color={primaryBrandColor}
                  topText={isCorporate ? 'OFFICIAL ENTRANCE PASS' : 'YOU ARE CORDIALLY INVITED'}
                  centerText="ADMIT ONE"
                />
              </div>
            )}

            {/* Barcode Graphic */}
            <div className="my-1 w-full">
              <BarcodeGraphic serial={serialCode} color={primaryBrandColor} />
            </div>

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
    </div>
  );

  const renderHorizontalBack = () => (
    <div className="overflow-x-auto w-full pb-2">
      <div
        style={{ backgroundColor: frameColor }}
        className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-xl border border-black/15 transition-all select-none min-w-[680px] w-full"
      >
        <div
          style={{ backgroundColor: paperBg }}
          className="relative rounded-xl sm:rounded-2xl border flex flex-row items-stretch overflow-hidden"
        >
          {/* Left Stub: RSVP */}
          <div
            className="w-52 p-4 sm:p-5 flex flex-col justify-between border-r text-left shrink-0"
            style={{
              borderColor: paperBorder,
              backgroundColor: 'rgba(166, 124, 30, 0.04)',
            }}
          >
            <div>
              <h3 className="font-heading font-extrabold text-base uppercase tracking-wider" style={{ color: primaryBrandColor }}>
                RSVP
              </h3>
              <p className="text-[10px] font-mono text-stone-500 mb-2">Please respond</p>

              <div className="space-y-1.5 text-xs font-mono">
                <label className="flex items-center space-x-1.5 text-stone-800">
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[9px] font-bold text-emerald-700 bg-white">
                    ✓
                  </span>
                  <span className="font-semibold">I&apos;ll be there</span>
                </label>

                <label className="flex items-center space-x-1.5 text-stone-500">
                  <span className="w-3.5 h-3.5 rounded-full border border-stone-300 bg-white" />
                  <span>I can&apos;t make it</span>
                </label>
              </div>

              {receiver.receiverName && (
                <div className="mt-3 pt-2 border-t text-[10px]" style={{ borderColor: paperBorder }}>
                  <span className="block font-mono font-bold uppercase text-[#A67C1E]">Reception Desk:</span>
                  <span className="font-semibold text-stone-800 truncate block">{receiver.receiverName}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <BarcodeGraphic serial={serialCode} color={primaryBrandColor} />
            </div>
          </div>

          {/* Perforation Line with Concave Semicircular Notches */}
          <div className="relative flex flex-col justify-between items-center w-0 select-none">
            <div
              className="w-6 h-6 rounded-full -top-3 -mr-3 absolute z-20 border border-black/15 shadow-inner"
              style={{ backgroundColor: frameColor }}
            />
            <div
              className="h-full border-r-2 border-dashed z-10"
              style={{ borderColor: paperGold, opacity: 0.6 }}
            />
            <div
              className="w-6 h-6 rounded-full -bottom-3 -mr-3 absolute z-20 border border-black/15 shadow-inner"
              style={{ backgroundColor: frameColor }}
            />
          </div>

          {/* Right Main Section: Event Schedule */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between text-left min-w-0">
            <div>
              <div className="flex items-center justify-between border-b pb-2 mb-2.5" style={{ borderColor: paperBorder }}>
                <h2 className="text-sm sm:text-base font-heading font-extrabold uppercase tracking-wide" style={{ color: primaryBrandColor }}>
                  {isCorporate ? 'SUMMIT AGENDA & PROGRAM' : 'EVENT SCHEDULE & CEREMONY DETAILS'}
                </h2>
                <span className="text-[10px] font-mono font-bold text-[#A67C1E]">
                  PASS #{invitation.id.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Program Timeline */}
              <div className="space-y-2">
                {displaySchedule.slice(0, 4).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-start space-x-2 text-xs">
                    <span className="text-[#A67C1E] text-xs font-bold leading-tight">◆</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-mono font-bold text-[11px] shrink-0" style={{ color: primaryBrandColor }}>
                          {item.startTime}
                        </span>
                        <span className="font-bold text-stone-900 truncate">{item.title}</span>
                      </div>
                      {item.description && (
                        <p className="text-[10px] text-stone-600 truncate">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {specialNote && (
                <p className="mt-2.5 pt-2 border-t text-[11px] font-serif-elegant italic text-stone-600 line-clamp-2" style={{ borderColor: paperBorder }}>
                  &ldquo;{specialNote}&rdquo;
                </p>
              )}
            </div>

            {/* Bottom Contact / Location */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t mt-2 text-[10px] font-mono" style={{ borderColor: paperBorder }}>
              {receiver.contactPhone && (
                <div className="flex items-center space-x-1 font-semibold text-stone-700">
                  <Phone className="w-3 h-3 text-[#A67C1E]" />
                  <span>{receiver.contactPhone}</span>
                </div>
              )}

              <div className="flex items-center space-x-1 font-semibold text-stone-700 truncate max-w-[280px]">
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
            className="w-11 border-l flex flex-col items-center justify-between py-4 select-none shrink-0"
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
                  ? 'bg-[#350010] text-white shadow-xs'
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
                  ? 'bg-[#350010] text-white shadow-xs'
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
                  ? 'bg-[#350010] text-white shadow-xs'
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
                  <Maximize2 className="w-3.5 h-3.5 text-[#350010]" />
                  <span>Vertical Pass</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#350010]" />
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
                  ? 'bg-[#350010] text-[#D4AF37] border-[#D4AF37]/40'
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

      {/* RENDER TICKET */}
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
              <MapPin className="w-3.5 h-3.5 text-[#350010]" />
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
              <Camera className="w-3.5 h-3.5 text-[#350010]" />
              <span>Photo Gallery</span>
            </button>
          )}

          <a
            href={createGoogleCalendarUrl(invitation)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-semibold shadow-xs flex items-center space-x-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-[#350010]" />
            <span>Calendar</span>
          </a>
        </div>
      )}
    </div>
  );
};
