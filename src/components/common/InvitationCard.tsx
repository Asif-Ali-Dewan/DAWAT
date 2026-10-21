import React, { useEffect, useState } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { formatWeddingDate } from '../../utils/formatting';
import { generateQrCode } from '../../utils/qrcode';
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  DesiWeddingArch,
  CorporateSealBadge,
  MonogramBadge,
  BarcodeGraphic,
  AdmitOneStamp,
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
  CheckCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Ticket,
  Smartphone,
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
  const [activeTab, setActiveTab] = useState<'none' | 'venue' | 'schedule' | 'host'>('none');
  // Format mode: 'mobile' (vertical pass like ref 2) or 'horizontal' (boarding pass like ref 1, 3, 4)
  const [ticketLayout, setTicketLayout] = useState<'auto' | 'horizontal' | 'vertical'>('auto');

  const isCorporate = eventType === 'corporate' || theme.preset === 'corporate-noir';

  const cardColor = theme.cardColor || (isCorporate ? '#0F172A' : '#350010');
  const accentColor = theme.accentColor || '#D4AF37';
  const isLightCard = cardColor === '#FAF7F2' || cardColor === '#FFFFFF';

  // Effective colors
  const primaryTextColor = isLightCard ? '#1C1917' : '#FFFFFF';
  const secondaryTextColor = isLightCard ? '#44403C' : '#F3DF93';
  const borderTone = isLightCard ? 'rgba(53, 0, 16, 0.25)' : 'rgba(212, 175, 55, 0.4)';
  const stubBgTone = isLightCard ? 'rgba(53, 0, 16, 0.04)' : 'rgba(0, 0, 0, 0.25)';

  useEffect(() => {
    const photoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;
    generateQrCode(photoUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: isLightCard ? '#350010' : '#1C1917',
        light: '#FFFFFF',
      },
    }).then(setQrCodeDataUrl);
  }, [invitation.slug, isLightCard]);

  const brideInitial = couple.brideName.charAt(0).toUpperCase() || 'B';
  const groomInitial = couple.groomName.charAt(0).toUpperCase() || 'G';

  // Parse date pieces
  const dateObj = new Date(couple.weddingDate || '2026-12-18');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = dateObj.getDate() || 18;
  const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  const toggleTab = (tab: 'venue' | 'schedule' | 'host') => {
    setActiveTab((prev) => (prev === tab ? 'none' : tab));
  };

  // Determine layout mode
  const effectiveLayout =
    ticketLayout === 'auto'
      ? (isMobilePreview ? 'vertical' : 'responsive')
      : ticketLayout;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Top Format Selector Switcher (Allows user to preview horizontal pass vs vertical mobile pass) */}
      {!isTicketMode && (
        <div className="flex items-center space-x-1.5 mb-3 bg-stone-200/70 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setTicketLayout('vertical')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
              effectiveLayout === 'vertical' ? 'bg-[#350010] text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Pass</span>
          </button>
          <button
            type="button"
            onClick={() => setTicketLayout('horizontal')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center space-x-1 transition ${
              effectiveLayout === 'horizontal' ? 'bg-[#350010] text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Classic Boarding Ticket</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAT A: CLASSIC HORIZONTAL TICKET (Reference 1, 3, 4) - Desktop/Wide */}
      {/* ========================================================================= */}
      {(effectiveLayout === 'horizontal' || effectiveLayout === 'responsive') && (
        <div
          className={`w-full ${
            effectiveLayout === 'responsive' ? 'hidden md:block' : 'block'
          }`}
        >
          <div
            id="wedding-invitation-card"
            style={{ backgroundColor: cardColor }}
            className="relative rounded-3xl border-2 border-[#D4AF37]/50 shadow-xl overflow-hidden flex flex-row items-stretch select-none"
          >
            {/* 1. Left Security Strip / Spine (Reference 1 & 4) */}
            <div
              className="w-12 border-r flex flex-col items-center justify-between py-4 select-none shrink-0"
              style={{
                borderColor: borderTone,
                backgroundColor: stubBgTone,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <div
                className="text-[9px] font-mono tracking-widest uppercase rotate-180 whitespace-nowrap opacity-85"
                style={{
                  writingMode: 'vertical-rl',
                  color: secondaryTextColor,
                }}
              >
                {isCorporate ? 'OFFICIAL INVITATION PASS &bull; ADMIT VIP' : 'PLEASE JOIN OUR CELEBRATION &bull; DAWAT PASS'}
              </div>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>

            {/* 2. Main Ticket Body */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between text-left relative min-w-0">
              {/* Top Invocation & Event Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-serif-elegant italic tracking-widest opacity-85" style={{ color: secondaryTextColor }}>
                    {isCorporate ? 'OFFICIAL ADMISSION' : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5 opacity-90" style={{ color: accentColor }}>
                    {isCorporate ? (corporate?.organizationName || 'CORPORATE SUMMIT') : 'THE WEDDING CELEBRATION OF'}
                  </p>
                </div>

                {isCorporate ? (
                  <CorporateSealBadge color={accentColor} className="scale-90 origin-top-right" />
                ) : (
                  <DesiWeddingArch color={accentColor} className="scale-90 origin-top-right" />
                )}
              </div>

              {/* Center Hero: Couple Names or Event Heading */}
              <div className="my-3">
                <h1
                  className="text-2xl lg:text-3xl font-heading font-bold tracking-tight leading-snug truncate"
                  style={{ color: primaryTextColor }}
                >
                  {isCorporate
                    ? (corporate?.eventHeading || invitation.title)
                    : `${couple.brideName} & ${couple.groomName}`}
                </h1>
                <p className="text-xs font-serif-elegant italic mt-0.5" style={{ color: secondaryTextColor }}>
                  {isCorporate
                    ? (corporate?.eventSubheading || 'Executive Gala & Keynote Sessions')
                    : 'request the honour of your gracious presence'}
                </p>
              </div>

              {/* Date & Time Highlight Bar (Reference 1 & 4) */}
              <div
                className="py-2.5 px-4 rounded-xl border flex items-center justify-between gap-3 text-xs"
                style={{
                  borderColor: borderTone,
                  backgroundColor: stubBgTone,
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold tracking-wider text-[11px]" style={{ color: secondaryTextColor }}>
                    {dayName}
                  </span>
                  <span className="opacity-40">|</span>
                  <span className="font-heading text-base font-bold" style={{ color: accentColor }}>
                    {dayNumber}
                  </span>
                  <span className="opacity-40">|</span>
                  <span className="font-mono font-bold tracking-wider text-[11px]" style={{ color: secondaryTextColor }}>
                    {monthYear}
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-mono text-[11px]" style={{ color: primaryTextColor }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span>{couple.mainEventTime || '12:00 PM'}</span>
                </div>
              </div>

              {/* Venue & Coordinates Footer */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t mt-3" style={{ borderColor: borderTone }}>
                <div className="flex items-center space-x-1.5 truncate max-w-[280px]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  <span className="truncate font-medium" style={{ color: secondaryTextColor }}>
                    {venue.venueName} &bull; {venue.venueAddress}
                  </span>
                </div>

                <span className="font-mono text-[10px] tracking-widest opacity-80" style={{ color: accentColor }}>
                  {isCorporate ? 'KEYNOTE PASS' : 'TABLE: VIP-07'}
                </span>
              </div>
            </div>

            {/* Perforation Line & Notches (Top & Bottom semicircles) */}
            <div className="relative flex flex-col justify-between items-center w-0 select-none">
              {/* Top Notch Cutout */}
              <div className="w-6 h-6 rounded-full bg-[#fbf9f6] -top-3 -mr-3 z-20 border border-black/10 shadow-inner" />

              {/* Dashed Perforation Line */}
              <div
                className="h-full border-r-2 border-dashed my-2 z-10"
                style={{ borderColor: accentColor, opacity: 0.7 }}
              />

              {/* Bottom Notch Cutout */}
              <div className="w-6 h-6 rounded-full bg-[#fbf9f6] -bottom-3 -mr-3 z-20 border border-black/10 shadow-inner" />
            </div>

            {/* 3. Tear-Off Admission Stub (Right side - Reference 1 & 3) */}
            <div
              className="w-56 p-5 flex flex-col items-center justify-between text-center shrink-0 relative"
              style={{
                backgroundColor: stubBgTone,
              }}
            >
              {/* Admit One Pill */}
              <AdmitOneStamp
                color={accentColor}
                text={isCorporate ? 'EXECUTIVE PASS' : 'ADMIT ONE'}
              />

              {/* Scannable QR Code */}
              <div className="my-2 p-1.5 bg-white rounded-xl shadow-md border border-black/10">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Admission QR"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-stone-100 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-stone-400" />
                  </div>
                )}
              </div>

              {/* Barcode Graphic & Serial */}
              <BarcodeGraphic
                serial={`DAW-${invitation.id.slice(0, 8).toUpperCase()}`}
                color={accentColor}
              />

              {/* Fast RSVP / Actions on Stub */}
              {invitation.rsvpEnabled && onOpenRsvp && (
                <button
                  type="button"
                  onClick={onOpenRsvp}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                  style={{
                    backgroundColor: accentColor,
                    color: '#1C1917',
                  }}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>RSVP NOW</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORMAT B: VERTICAL SMARTPHONE PASS (Reference 2 - Hindia Tour) - Mobile */}
      {/* ========================================================================= */}
      {(effectiveLayout === 'vertical' || effectiveLayout === 'responsive') && (
        <div
          className={`w-full max-w-[370px] ${
            effectiveLayout === 'responsive' ? 'block md:hidden' : 'block'
          }`}
        >
          <div
            id="wedding-invitation-card-mobile"
            style={{ backgroundColor: cardColor }}
            className="relative rounded-[28px] border-2 border-[#D4AF37]/50 shadow-xl overflow-hidden text-left select-none"
          >
            {/* Top Pass Header Banner */}
            <div className="p-5 pb-4 border-b text-center relative" style={{ borderColor: borderTone }}>
              <div className="text-[10px] font-serif-elegant italic tracking-widest opacity-85" style={{ color: secondaryTextColor }}>
                {isCorporate ? 'OFFICIAL DIGITAL PASS' : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              </div>

              <div className="my-1.5 flex justify-center">
                {isCorporate ? (
                  <CorporateSealBadge color={accentColor} className="scale-75" />
                ) : (
                  <DesiWeddingArch color={accentColor} className="scale-75" />
                )}
              </div>

              <h2
                className="text-xl font-heading font-bold tracking-tight leading-tight"
                style={{ color: primaryTextColor }}
              >
                {isCorporate
                  ? (corporate?.eventHeading || invitation.title)
                  : `${couple.brideName} & ${couple.groomName}`}
              </h2>

              <p className="text-[11px] font-serif-elegant italic mt-0.5" style={{ color: secondaryTextColor }}>
                {isCorporate
                  ? (corporate?.organizationName || 'Apex Corporate Summit')
                  : 'Walima & Marriage Reception'}
              </p>
            </div>

            {/* 2x2 Ticket Metadata Grid (Reference 2 style) */}
            <div className="p-5 grid grid-cols-2 gap-3.5 text-left text-xs">
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider opacity-70" style={{ color: secondaryTextColor }}>
                  Date
                </span>
                <span className="block font-bold text-sm mt-0.5" style={{ color: primaryTextColor }}>
                  {formatWeddingDate(couple.weddingDate)}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider opacity-70" style={{ color: secondaryTextColor }}>
                  Time
                </span>
                <span className="block font-bold text-sm mt-0.5" style={{ color: primaryTextColor }}>
                  {couple.mainEventTime || '12:00 PM'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="block text-[10px] uppercase font-mono tracking-wider opacity-70" style={{ color: secondaryTextColor }}>
                  Venue
                </span>
                <span className="block font-semibold text-xs mt-0.5 truncate" style={{ color: primaryTextColor }}>
                  {venue.venueName} &bull; {venue.venueAddress}
                </span>
              </div>
            </div>

            {/* Horizontal Perforation Line with Left & Right Notch Cutouts (Reference 2) */}
            <div className="relative flex items-center justify-between w-full my-1">
              {/* Left Notch */}
              <div className="w-6 h-6 rounded-full bg-[#fbf9f6] -left-3 absolute z-20 border border-black/10 shadow-inner" />

              {/* Dashed Perforation Line */}
              <div
                className="w-full border-b-2 border-dashed mx-4"
                style={{ borderColor: accentColor, opacity: 0.7 }}
              />

              {/* Right Notch */}
              <div className="w-6 h-6 rounded-full bg-[#fbf9f6] -right-3 absolute z-20 border border-black/10 shadow-inner" />
            </div>

            {/* Bottom Pass Stub with Scannable QR & Barcode (Reference 2) */}
            <div
              className="p-5 flex flex-col items-center justify-center text-center space-y-2.5"
              style={{ backgroundColor: stubBgTone }}
            >
              {/* Centered QR Code */}
              <div className="p-2 bg-white rounded-2xl shadow-md border border-black/10">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Admission QR"
                    className="w-28 h-28 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-28 h-28 bg-stone-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-stone-400" />
                  </div>
                )}
              </div>

              {/* Barcode */}
              <BarcodeGraphic
                serial={`DAW-${invitation.id.slice(0, 8).toUpperCase()}`}
                color={accentColor}
              />

              {/* Admit One Stamp */}
              <AdmitOneStamp
                color={accentColor}
                text={isCorporate ? 'EXECUTIVE PASS' : 'ADMIT ONE'}
              />

              {/* RSVP Action */}
              {invitation.rsvpEnabled && onOpenRsvp && (
                <button
                  type="button"
                  onClick={onOpenRsvp}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 mt-1"
                  style={{
                    backgroundColor: accentColor,
                    color: '#1C1917',
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>RSVP ATTENDANCE</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK ACTIONS & EXPANDABLE DRAWER (Fitted below the ticket) */}
      {/* Keeps ticket on the screen while allowing full access to details & map */}
      {/* ========================================================================= */}
      {!isTicketMode && (
        <div className="w-full mt-4 space-y-3">
          {/* Action Tabs Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => toggleTab('venue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
                activeTab === 'venue'
                  ? 'bg-[#350010] text-[#D4AF37] border-[#D4AF37]/40 font-bold'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#350010]" />
              <span>Venue & Map</span>
              {activeTab === 'venue' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {schedule.length > 0 && (
              <button
                type="button"
                onClick={() => toggleTab('schedule')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
                  activeTab === 'schedule'
                    ? 'bg-[#350010] text-[#D4AF37] border-[#D4AF37]/40 font-bold'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#350010]" />
                <span>Event Schedule ({schedule.length})</span>
                {activeTab === 'schedule' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            {receiver.receiverName && (
              <button
                type="button"
                onClick={() => toggleTab('host')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
                  activeTab === 'host'
                    ? 'bg-[#350010] text-[#D4AF37] border-[#D4AF37]/40 font-bold'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#350010]" />
                <span>Host Details</span>
                {activeTab === 'host' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}

            {onNavigateToPhotos && (
              <button
                type="button"
                onClick={onNavigateToPhotos}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition flex items-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#350010]" />
                <span>Event Photos</span>
              </button>
            )}

            {/* Calendar addition */}
            <a
              href={createGoogleCalendarUrl(invitation)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition flex items-center space-x-1"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#350010]" />
              <span>Add to Google Cal</span>
            </a>
          </div>

          {/* Drawer Content 1: Venue & Directions */}
          {activeTab === 'venue' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 text-left space-y-3 animate-fade-in max-w-xl mx-auto shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{venue.venueName}</h4>
                  <p className="text-xs text-stone-600">{venue.venueAddress}</p>
                  {venue.locationDescription && (
                    <p className="text-[11px] text-stone-400 mt-1 italic">{venue.locationDescription}</p>
                  )}
                </div>
                {venue.mapsUrl && (
                  <a
                    href={venue.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] transition flex items-center space-x-1.5 shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Drawer Content 2: Schedule Timeline */}
          {activeTab === 'schedule' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 text-left space-y-2.5 animate-fade-in max-w-xl mx-auto shadow-sm">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-2">Order of Events</h4>
              <div className="divide-y divide-stone-100">
                {schedule.map((item, idx) => (
                  <div key={item.id || idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{item.title}</span>
                      {item.description && <p className="text-[11px] text-stone-500">{item.description}</p>}
                    </div>
                    <span className="font-mono text-stone-600 font-semibold px-2 py-0.5 rounded bg-stone-100 shrink-0">
                      {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drawer Content 3: Host Details */}
          {activeTab === 'host' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 text-left space-y-2 animate-fade-in max-w-xl mx-auto shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Reception & Host Desk</span>
              <h4 className="font-bold text-sm text-stone-900">
                {receiver.receiverName}{' '}
                {receiver.receiverRole && <span className="font-normal text-xs text-stone-500">({receiver.receiverRole})</span>}
              </h4>
              {receiver.additionalInfo && <p className="text-xs text-stone-600">{receiver.additionalInfo}</p>}
              {specialNote && (
                <div className="mt-2 pt-2 border-t border-stone-100 italic text-xs text-stone-500 font-serif-elegant">
                  &ldquo;{specialNote}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
