import React, { useState } from 'react';
import { Invitation, CreateInvitationInput } from '../types/invitation';
import { invitationService } from '../services/invitationService';
import { THEME_PRESETS } from '../config/themes';
import { InvitationCard } from '../components/common/InvitationCard';
import { INITIAL_MOCK_SCHEDULE } from '../data/mockData';
import {
  Heart,
  MapPin,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface CreateInvitationPageProps {
  onNavigate: (path: string) => void;
  onInvitationCreated?: (invitation: Invitation) => void;
}

export const CreateInvitationPage: React.FC<CreateInvitationPageProps> = ({
  onNavigate,
  onInvitationCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateInvitationInput>({
    userId: 'user-001',
    slug: '',
    title: '',
    status: 'published',
    couple: {
      brideName: 'Ayesha Rahman',
      groomName: 'Arif Hasan',
      coupleDisplayName: 'Ayesha & Arif',
      weddingDate: '2026-12-18',
      mainEventTime: '12:00 PM',
      functionStartTime: '11:00 AM',
      functionEndTime: '05:00 PM',
    },
    venue: {
      venueName: 'The Grand Regal Palace Convention Center',
      venueAddress: 'Plot 14, Sector 7, Diplomatic Avenue, Gulshan, Dhaka',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Regal+Palace+Gulshan+Dhaka',
      locationDescription: 'Main Ballroom, 2nd Floor. Valet parking available at North Gate.',
    },
    receiver: {
      receiverName: 'Mr. Mahbub Rahman',
      receiverRole: 'Father of the Bride',
      additionalInfo: 'Welcoming all esteemed guests at the Grand Arch Foyer',
      contactPhone: '+880 1711-234567',
    },
    specialNote:
      'With grateful hearts and boundless joy, we invite you to share in our special day as we unite in love. Your warm blessings will make our beginning truly unforgettable.',
    theme: THEME_PRESETS.classic.config,
    photoStatus: 'unavailable',
    photoUnavailableQuote: 'The photographer is still negotiating with the camera. Please check back soon!',
    rsvpEnabled: true,
    guestCountTarget: 350,
  });

  // Mock invitation object for the live preview
  const livePreviewInvitation: Invitation = {
    ...formData,
    id: 'preview-temp-id',
    slug: formData.slug || 'ayesha-arif',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleCoupleChange = (field: string, value: string) => {
    setFormData((prev: CreateInvitationInput) => ({
      ...prev,
      couple: { ...prev.couple, [field]: value },
      coupleDisplayName:
        field === 'brideName' || field === 'groomName'
          ? `${field === 'brideName' ? value : prev.couple.brideName} & ${
              field === 'groomName' ? value : prev.couple.groomName
            }`
          : prev.couple.coupleDisplayName,
    }));
  };

  const handleVenueChange = (field: string, value: string) => {
    setFormData((prev: CreateInvitationInput) => ({
      ...prev,
      venue: { ...prev.venue, [field]: value },
    }));
  };

  const handleReceiverChange = (field: string, value: string) => {
    setFormData((prev: CreateInvitationInput) => ({
      ...prev,
      receiver: { ...prev.receiver, [field]: value },
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveAndPublish = async () => {
    setSaving(true);
    try {
      const generatedSlug = `${formData.couple.brideName.toLowerCase().trim().replace(/\s+/g, '-')}-${formData.couple.groomName.toLowerCase().trim().replace(/\s+/g, '-')}`;
      const toSave: CreateInvitationInput = {
        ...formData,
        slug: generatedSlug,
        title: `${formData.couple.brideName} & ${formData.couple.groomName} Wedding`,
      };

      const created = await invitationService.createInvitation(toSave);
      if (onInvitationCreated) {
        onInvitationCreated(created);
      }
      onNavigate('/dashboard');
    } catch (err) {
      console.error('Error creating invitation:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Invitation Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
              Create Your Wedding Invitation
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Follow our intuitive 4-step wizard to personalize details and view live changes.
            </p>
          </div>

          {/* Step indicator pills */}
          <div className="flex items-center space-x-2">
            {[
              { num: 1, label: 'Couple' },
              { num: 2, label: 'Venue' },
              { num: 3, label: 'Receiver' },
              { num: 4, label: 'Note & Style' },
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  currentStep === step.num
                    ? 'bg-amber-600 text-white shadow-md'
                    : currentStep > step.num
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'bg-stone-200/80 text-stone-600 hover:bg-stone-300'
                }`}
              >
                <span>{step.num}.</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Form Left, Real-Time Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            {/* STEP 1: COUPLE INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                    <span>Step 1 &bull; Couple Details</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Who Is Celebrating?
                  </h2>
                  <p className="text-xs text-stone-500">
                    Enter the names and auspicious timings for the wedding ceremony.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bride&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Rahman"
                    value={formData.couple.brideName}
                    onChange={(e) => handleCoupleChange('brideName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Groom&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arif Hasan"
                    value={formData.couple.groomName}
                    onChange={(e) => handleCoupleChange('groomName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Couple Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ayesha & Arif"
                    value={formData.couple.coupleDisplayName || ''}
                    onChange={(e) => handleCoupleChange('coupleDisplayName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Wedding Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="date"
                      required
                      value={formData.couple.weddingDate}
                      onChange={(e) => handleCoupleChange('weddingDate', e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Main Ceremony
                    </label>
                    <input
                      type="text"
                      placeholder="12:00 PM"
                      value={formData.couple.mainEventTime}
                      onChange={(e) => handleCoupleChange('mainEventTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Function Start
                    </label>
                    <input
                      type="text"
                      placeholder="11:00 AM"
                      value={formData.couple.functionStartTime}
                      onChange={(e) => handleCoupleChange('functionStartTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Function End
                    </label>
                    <input
                      type="text"
                      placeholder="05:00 PM"
                      value={formData.couple.functionEndTime}
                      onChange={(e) => handleCoupleChange('functionEndTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VENUE INFORMATION */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Step 2 &bull; Venue & Location</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Where Will It Take Place?
                  </h2>
                  <p className="text-xs text-stone-500">
                    Provide the venue details and a direct Google Maps link for guest navigation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Grand Regal Palace"
                    value={formData.venue.venueName}
                    onChange={(e) => handleVenueChange('venueName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venue Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Plot 14, Sector 7, Diplomatic Avenue, Gulshan, Dhaka"
                    value={formData.venue.venueAddress}
                    onChange={(e) => handleVenueChange('venueAddress', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Google Maps Link *
                  </label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="url"
                      required
                      placeholder="https://maps.google.com/?q=..."
                      value={formData.venue.mapsUrl}
                      onChange={(e) => handleVenueChange('mapsUrl', e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <span className="block text-[11px] text-stone-500 mt-1">
                    Guests will tap this button to navigate directly on Google Maps.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location / Parking Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Ballroom, 2nd Floor. Valet parking at North Gate."
                    value={formData.venue.locationDescription || ''}
                    onChange={(e) => handleVenueChange('locationDescription', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: RECEPTION / WELCOME INFO */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Step 3 &bull; Guest Reception Information</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Who Will Receive The Guests?
                  </h2>
                  <p className="text-xs text-stone-500">
                    Clarify who will welcome your esteemed attendees at the reception gate.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Receiver&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Mahbub Rahman"
                    value={formData.receiver.receiverName}
                    onChange={(e) => handleReceiverChange('receiverName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Receiver&apos;s Role / Relation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Father of the Bride / Uncle & Family"
                    value={formData.receiver.receiverRole || ''}
                    onChange={(e) => handleReceiverChange('receiverRole', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Greeting Location / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Welcoming guests at the Grand Arch Foyer"
                    value={formData.receiver.additionalInfo || ''}
                    onChange={(e) => handleReceiverChange('additionalInfo', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Reception Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1711-234567"
                    value={formData.receiver.contactPhone || ''}
                    onChange={(e) => handleReceiverChange('contactPhone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: SPECIAL NOTE & INVITATION SETTINGS */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Step 4 &bull; Special Note & Settings</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Personal Touches
                  </h2>
                  <p className="text-xs text-stone-500">
                    Add a personal note for guests. If omitted, this section will hide cleanly.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Personalized Message for Guests (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. With grateful hearts, we warmly invite you to celebrate our union..."
                    value={formData.specialNote || ''}
                    onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="block text-[11px] text-stone-400 mt-1">
                    Leave blank to omit the note section from the public guest card.
                  </span>
                </div>

                {/* RSVP Toggle */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-amber-950">
                      Enable Guest RSVP Form
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Allow guests to submit their attendance and greetings online.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.rsvpEnabled}
                    onChange={(e) => setFormData({ ...formData, rsvpEnabled: e.target.checked })}
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </div>

                {/* Expected Guest Target */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Guest Count (Optional)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={formData.guestCountTarget || 350}
                    onChange={(e) =>
                      setFormData({ ...formData, guestCountTarget: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Card / Ticket Canvas Color */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Card & Ticket Luxury Canvas Color
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Imperial Wine (#350010)', hex: '#350010', preset: 'luxury' as const },
                      { name: 'Royal Sapphire (#290EA0)', hex: '#290EA0', preset: 'sapphire' as const },
                      { name: 'Classic Royale (#FAF7F0)', hex: '#FAF7F0', preset: 'classic' as const },
                      { name: 'Emerald Heritage (#064E3B)', hex: '#064E3B', preset: 'traditional' as const },
                    ].map((opt) => (
                      <button
                        key={opt.hex}
                        type="button"
                        onClick={() => {
                          const p = THEME_PRESETS[opt.preset];
                          setFormData({
                            ...formData,
                            theme: {
                              ...p.config,
                              cardColor: opt.hex,
                            },
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition ${
                          formData.theme.cardColor?.toLowerCase() === opt.hex.toLowerCase() ||
                          (!formData.theme.cardColor && formData.theme.preset === opt.preset)
                            ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-500'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: opt.hex }}
                        />
                        <span className="truncate">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center space-x-1.5 transition hover:scale-105 active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAndPublish}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Creating...' : 'Save & View In Dashboard'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-Time Live Preview Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Preview Controls Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">
                  Live Real-Time Preview
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  (Updates instantly as you type)
                </span>
              </div>

              {/* Viewport switcher: Mobile vs Desktop */}
              <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                    previewMode === 'mobile'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                    previewMode === 'desktop'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
              </div>
            </div>

            {/* Preview Container Frame */}
            <div
              className={`transition-all duration-300 mx-auto ${
                previewMode === 'mobile'
                  ? 'max-w-[420px] p-4 bg-stone-900 rounded-[40px] shadow-2xl border-4 border-stone-700'
                  : 'w-full'
              }`}
            >
              {previewMode === 'mobile' && (
                <div className="w-32 h-4 bg-stone-800 rounded-full mx-auto mb-3" />
              )}

              <div
                className={`overflow-y-auto max-h-[750px] rounded-2xl ${
                  previewMode === 'mobile' ? 'bg-stone-50' : ''
                }`}
              >
                <InvitationCard
                  invitation={livePreviewInvitation}
                  schedule={INITIAL_MOCK_SCHEDULE}
                  isMobilePreview={previewMode === 'mobile'}
                  onNavigateToPhotos={() => onNavigate(`/photos/${livePreviewInvitation.slug}`)}
                />
              </div>

              {previewMode === 'mobile' && (
                <div className="w-24 h-1 bg-stone-600 rounded-full mx-auto mt-3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
