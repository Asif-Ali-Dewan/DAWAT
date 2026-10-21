import React, { useState } from 'react';
import { Invitation } from '../types/invitation';
import { ScheduleItem } from '../types/schedule';
import { Guest } from '../types/guest';
import { WeddingPhoto } from '../types/photo';
import { invitationService } from '../services/invitationService';
import { formatWeddingDate } from '../utils/formatting';
import { ThemeCustomizer } from '../features/customization/ThemeCustomizer';
import { ScheduleManager } from '../features/schedule/ScheduleManager';
import { PhotoManager } from '../features/photos/PhotoManager';
import { ShareManager } from '../features/invitation/ShareManager';
import { GuestManager } from '../features/guests/GuestManager';
import { InvitationCard } from '../components/common/InvitationCard';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Palette,
  Clock,
  Users,
  Camera,
  Share2,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Smartphone,
  CheckCircle2,
  X,
  Building2,
} from 'lucide-react';

interface DashboardPageProps {
  invitation: Invitation;
  schedule: ScheduleItem[];
  guests: Guest[];
  photos: WeddingPhoto[];
  onNavigate: (path: string) => void;
  onInvitationUpdated: (invitation: Invitation) => void;
  onScheduleUpdated: (schedule: ScheduleItem[]) => void;
  onGuestsUpdated: (guests: Guest[]) => void;
  onPhotosUpdated: (photos: WeddingPhoto[]) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  invitation,
  schedule,
  guests,
  photos,
  onNavigate,
  onInvitationUpdated,
  onScheduleUpdated,
  onGuestsUpdated,
  onPhotosUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'customize' | 'schedule' | 'guests' | 'photos' | 'share' | 'edit'
  >('overview');

  const [copiedLink, setCopiedLink] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('mobile');

  // Edit Invitation Form State
  const [editCouple, setEditCouple] = useState(invitation.couple);
  const [editCorporate, setEditCorporate] = useState(invitation.corporate || {
    organizationName: '',
    eventHeading: '',
    eventSubheading: '',
    dressCode: 'Executive Formal / Black Tie',
    chiefGuest: '',
  });
  const [editVenue, setEditVenue] = useState(invitation.venue);
  const [editReceiver, setEditReceiver] = useState(invitation.receiver);
  const [editSpecialNote, setEditSpecialNote] = useState(invitation.specialNote || '');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const publicInviteUrl = `${window.location.origin}/#/invite/${invitation.slug}`;
  const isCorporate = invitation.eventType === 'corporate';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    try {
      const updated = await invitationService.updateInvitation(invitation.id, {
        couple: editCouple,
        corporate: editCorporate,
        venue: editVenue,
        receiver: editReceiver,
        specialNote: editSpecialNote,
      });
      onInvitationUpdated(updated);
      setActiveTab('overview');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleThemeChange = async (updatedTheme: Invitation['theme']) => {
    const updated = await invitationService.updateInvitation(invitation.id, {
      theme: updatedTheme,
    });
    onInvitationUpdated(updated);
  };

  const attendingCount = guests
    .filter((g) => g.status === 'attending')
    .reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customize', label: 'Customize Design', icon: Palette },
    { id: 'schedule', label: 'Event Schedule', icon: Clock },
    { id: 'guests', label: 'Guest List & RSVP', icon: Users },
    { id: 'photos', label: 'Photo Folder & QR', icon: Camera },
    { id: 'share', label: 'Share & Tickets', icon: Share2 },
    { id: 'edit', label: 'Edit Details', icon: Edit3 },
  ];

  const displayTitle = isCorporate && invitation.corporate
    ? invitation.corporate.eventHeading
    : (invitation.couple.coupleDisplayName ||
       `${invitation.couple.brideName} & ${invitation.couple.groomName}`);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{invitation.status}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#350010]/10 text-[#350010] border border-[#350010]/20">
                  {invitation.eventType.toUpperCase()} CARD
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  ID: {invitation.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-heading font-bold text-stone-900">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-stone-600">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#350010]" />
                  <span>{formatWeddingDate(invitation.couple.weddingDate)}</span>
                </span>
                <span className="text-stone-300">&bull;</span>
                <span className="flex items-center space-x-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#350010]" />
                  <span>{invitation.venue.venueName}</span>
                </span>
                {isCorporate && invitation.corporate?.organizationName && (
                  <>
                    <span className="text-stone-300">&bull;</span>
                    <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                      <Building2 className="w-4 h-4 text-[#290EA0]" />
                      <span>{invitation.corporate.organizationName}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions & URL Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2 space-x-2">
                <span className="text-xs font-mono text-stone-600 truncate max-w-[180px] sm:max-w-[220px]">
                  {publicInviteUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition"
                  title="Copy Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={publicInviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#350010] hover:bg-[#20000a] text-white transition flex items-center justify-center space-x-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Guest View</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition flex items-center justify-center space-x-1.5"
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile Preview</span>
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#350010] text-[#FAF7F2] font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Confirmed Guests
                </span>
                <p className="text-3xl font-bold font-heading text-stone-900">{attendingCount}</p>
                <span className="text-[11px] text-stone-500">
                  Target: {invitation.guestCountTarget || 350}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Timeline Events
                </span>
                <p className="text-3xl font-bold font-heading text-stone-900">{schedule.length}</p>
                <span className="text-[11px] text-stone-500">Scheduled sessions</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Active Palette
                </span>
                <p className="text-lg font-bold font-heading text-[#350010] truncate">
                  {invitation.theme.cardVariant || invitation.theme.preset}
                </p>
                <span className="text-[11px] text-stone-500 font-mono">
                  {invitation.theme.cardColor || '#350010'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                  Photo Folder
                </span>
                <p
                  className={`text-xl font-bold font-heading capitalize ${
                    invitation.photoStatus === 'available' ? 'text-emerald-700' : 'text-[#350010]'
                  }`}
                >
                  {invitation.photoStatus}
                </p>
                <span className="text-[11px] text-stone-500">
                  {photos.length} photos live
                </span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('customize')}
                className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-[#350010] transition cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#350010]/10 text-[#350010] flex items-center justify-center group-hover:bg-[#350010] group-hover:text-[#D4AF37] transition">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Customize Theme & Canvas</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Switch between Traditional Desi Royal, Corporate Executive, and Sapphire ticket passes with authentic tear stubs.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('schedule')}
                className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-[#350010] transition cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#350010]/10 text-[#350010] flex items-center justify-center group-hover:bg-[#350010] group-hover:text-[#D4AF37] transition">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Manage Event Timeline</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Add, edit, and reorder reception timings, ceremony details, and dining hours.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('share')}
                className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-[#350010] transition cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#350010]/10 text-[#350010] flex items-center justify-center group-hover:bg-[#350010] group-hover:text-[#D4AF37] transition">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Share & Download Ticket</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Send via WhatsApp, export printable tickets, or generate high-res QR codes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMIZE */}
        {activeTab === 'customize' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            <div className="lg:col-span-6">
              <ThemeCustomizer
                currentTheme={invitation.theme}
                onChange={handleThemeChange}
              />
            </div>
            <div className="lg:col-span-6 sticky top-20">
              <div className="bg-white p-4 rounded-3xl border border-stone-200 mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Live Card Canvas Preview</h4>
                  <p className="text-[11px] text-stone-500">Real-time mobile simulation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] transition flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>

              <div className="max-w-[420px] mx-auto">
                <InvitationCard
                  invitation={invitation}
                  schedule={schedule}
                  isMobilePreview={true}
                  onNavigateToPhotos={() => onNavigate(`/photos/${invitation.slug}`)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 animate-fade-in">
            <ScheduleManager
              invitationId={invitation.id}
              schedule={schedule}
              onScheduleUpdated={onScheduleUpdated}
            />
          </div>
        )}

        {/* TAB 4: GUESTS */}
        {activeTab === 'guests' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 animate-fade-in">
            <GuestManager
              invitationId={invitation.id}
              guests={guests}
              onGuestsUpdated={onGuestsUpdated}
            />
          </div>
        )}

        {/* TAB 5: PHOTOS */}
        {activeTab === 'photos' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 animate-fade-in">
            <PhotoManager
              invitation={invitation}
              photos={photos}
              onPhotosUpdated={onPhotosUpdated}
              onInvitationUpdated={onInvitationUpdated}
            />
          </div>
        )}

        {/* TAB 6: SHARE */}
        {activeTab === 'share' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 animate-fade-in">
            <ShareManager invitation={invitation} schedule={schedule} />
          </div>
        )}

        {/* TAB 7: EDIT DETAILS */}
        {activeTab === 'edit' && (
          <form
            onSubmit={handleSaveDetails}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6 max-w-3xl animate-fade-in"
          >
            <div>
              <h3 className="text-lg font-bold text-stone-900">Edit Invitation Content</h3>
              <p className="text-xs text-stone-500">
                Update date, venue, host greetings, and special guest notes.
              </p>
            </div>

            {isCorporate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Organization / Host Company
                  </label>
                  <input
                    type="text"
                    required
                    value={editCorporate.organizationName}
                    onChange={(e) => setEditCorporate({ ...editCorporate, organizationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Summit / Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editCorporate.eventHeading}
                    onChange={(e) => setEditCorporate({ ...editCorporate, eventHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editCouple.weddingDate}
                    onChange={(e) => setEditCouple({ ...editCouple, weddingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Event Time (Keynote Start)
                  </label>
                  <input
                    type="text"
                    value={editCouple.mainEventTime}
                    onChange={(e) => setEditCouple({ ...editCouple, mainEventTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dress Code
                  </label>
                  <input
                    type="text"
                    value={editCorporate.dressCode || ''}
                    onChange={(e) => setEditCorporate({ ...editCorporate, dressCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chief Guest / Keynote Speaker
                  </label>
                  <input
                    type="text"
                    value={editCorporate.chiefGuest || ''}
                    onChange={(e) => setEditCorporate({ ...editCorporate, chiefGuest: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bride&apos;s Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCouple.brideName}
                    onChange={(e) => setEditCouple({ ...editCouple, brideName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Groom&apos;s Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editCouple.groomName}
                    onChange={(e) => setEditCouple({ ...editCouple, groomName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Wedding Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editCouple.weddingDate}
                    onChange={(e) => setEditCouple({ ...editCouple, weddingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Main Ceremony Time
                  </label>
                  <input
                    type="text"
                    value={editCouple.mainEventTime}
                    onChange={(e) => setEditCouple({ ...editCouple, mainEventTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  required
                  value={editVenue.venueName}
                  onChange={(e) => setEditVenue({ ...editVenue, venueName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  required
                  value={editVenue.mapsUrl}
                  onChange={(e) => setEditVenue({ ...editVenue, mapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Venue Address
                </label>
                <input
                  type="text"
                  value={editVenue.venueAddress}
                  onChange={(e) => setEditVenue({ ...editVenue, venueAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Receiver Name
                </label>
                <input
                  type="text"
                  value={editReceiver.receiverName}
                  onChange={(e) => setEditReceiver({ ...editReceiver, receiverName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Receiver Role / Host Title
                </label>
                <input
                  type="text"
                  value={editReceiver.receiverRole || ''}
                  onChange={(e) => setEditReceiver({ ...editReceiver, receiverRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Note for Guests
                </label>
                <textarea
                  rows={3}
                  value={editSpecialNote}
                  onChange={(e) => setEditSpecialNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingEdit}
                className="px-6 py-2.5 rounded-xl bg-[#350010] hover:bg-[#20000a] text-white text-xs font-bold flex items-center space-x-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{isSavingEdit ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-sm text-stone-900">
                  Guest Invitation Preview
                </span>
                <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setPreviewViewport('mobile')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      previewViewport === 'mobile' ? 'bg-[#350010] text-white' : 'text-stone-600'
                    }`}
                  >
                    Mobile Phone View
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport('desktop')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      previewViewport === 'desktop' ? 'bg-[#350010] text-white' : 'text-stone-600'
                    }`}
                  >
                    Desktop View
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FAF7F2]">
              <div
                className={`mx-auto ${
                  previewViewport === 'mobile'
                    ? 'max-w-[420px]'
                    : 'max-w-3xl'
                }`}
              >
                <InvitationCard
                  invitation={invitation}
                  schedule={schedule}
                  isMobilePreview={previewViewport === 'mobile'}
                  onNavigateToPhotos={() => onNavigate(`/photos/${invitation.slug}`)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
