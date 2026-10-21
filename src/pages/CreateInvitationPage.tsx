import React, { useState } from 'react';
import { Invitation, CreateInvitationInput, EventType } from '../types/invitation';
import { invitationService } from '../services/invitationService';
import { THEME_PRESETS } from '../config/themes';
import { InvitationCard } from '../components/common/InvitationCard';
import { INITIAL_MOCK_SCHEDULE } from '../data/mockData';
import {
  Heart,
  Briefcase,
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
  Layers,
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
    eventType: 'wedding',
    title: 'Ayesha & Arif Wedding Celebration',
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
    corporate: {
      organizationName: 'Apex Global Holdings',
      eventHeading: 'Annual Executive Summit & Gala 2026',
      eventSubheading: 'Honoring Innovation, Sustainable Leadership & Strategic Partnerships',
      dressCode: 'Black Tie / Formal Executive',
      chiefGuest: 'Managing Director & Board of Directors',
    },
    venue: {
      venueName: 'The Grand Regal Palace Convention Center',
      venueAddress: 'Plot 14, Sector 7, Diplomatic Avenue, Gulshan, Dhaka',
      mapsUrl: 'https://maps.google.com/?q=The+Grand+Regal+Palace+Gulshan+Dhaka',
      locationDescription: 'Main Ballroom, 2nd Floor. Valet parking available at North Gate.',
    },
    receiver: {
      receiverName: 'Mr. Mahbub Rahman & Family',
      receiverRole: 'Father of the Bride',
      additionalInfo: 'Welcoming all esteemed guests at the Grand Arch Foyer',
      contactPhone: '+880 1711-234567',
    },
    specialNote:
      'With the gracious blessings of the Almighty and our respected parents, we invite you to celebrate our union. Your warm du’a and presence will make our celebration complete.',
    theme: THEME_PRESETS['traditional-burgundy'].config,
    photoStatus: 'unavailable',
    photoUnavailableQuote: 'The photographer is still polishing the memories with love. Please check back shortly!',
    rsvpEnabled: true,
    guestCountTarget: 350,
  });

  const isCorporate = formData.eventType === 'corporate';

  // Live preview invitation object
  const livePreviewInvitation: Invitation = {
    ...formData,
    id: 'preview-temp-id',
    slug: formData.slug || (isCorporate ? 'apex-summit-2026' : 'ayesha-arif'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleEventTypeChange = (type: EventType) => {
    let newTheme = THEME_PRESETS['traditional-burgundy'].config;
    let newReceiverRole = 'Father of the Bride';
    let newTitle = `${formData.couple.brideName} & ${formData.couple.groomName} Wedding`;

    if (type === 'corporate') {
      newTheme = THEME_PRESETS['corporate-noir'].config;
      newReceiverRole = 'Executive Reception Desk';
      newTitle = formData.corporate?.eventHeading || 'Annual Leadership Gala';
    } else if (type === 'celebration') {
      newTheme = THEME_PRESETS['royal-sapphire'].config;
      newReceiverRole = 'Host & Family';
    }

    setFormData((prev: CreateInvitationInput) => ({
      ...prev,
      eventType: type,
      title: newTitle,
      theme: newTheme,
      receiver: {
        ...prev.receiver,
        receiverRole: newReceiverRole,
      },
    }));
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

  const handleCorporateChange = (field: string, value: string) => {
    setFormData((prev: CreateInvitationInput) => ({
      ...prev,
      corporate: {
        organizationName: prev.corporate?.organizationName || '',
        eventHeading: prev.corporate?.eventHeading || '',
        eventSubheading: prev.corporate?.eventSubheading || '',
        dressCode: prev.corporate?.dressCode || '',
        chiefGuest: prev.corporate?.chiefGuest || '',
        [field]: value,
      },
      title: field === 'eventHeading' ? value : prev.title,
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
      const generatedSlug = isCorporate
        ? (formData.corporate?.eventHeading || 'event')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .slice(0, 30)
        : `${formData.couple.brideName.toLowerCase().trim().replace(/\s+/g, '-')}-${formData.couple.groomName.toLowerCase().trim().replace(/\s+/g, '-')}`;

      const toSave: CreateInvitationInput = {
        ...formData,
        slug: generatedSlug || `inv-${Date.now().toString().slice(-4)}`,
        title: isCorporate
          ? formData.corporate?.eventHeading || 'Corporate Event'
          : `${formData.couple.brideName} & ${formData.couple.groomName} Wedding`,
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
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#350010] bg-[#350010]/10 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#350010]" />
              <span>Invitation Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
              Create Your Digital Invitation
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Personalize event details and watch your mobile invitation update in real time.
            </p>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center space-x-2">
            {[
              { num: 1, label: 'Event & Hosts' },
              { num: 2, label: 'Venue' },
              { num: 3, label: 'Reception' },
              { num: 4, label: 'Card Theme' },
            ].map((step) => (
              <button
                key={step.num}
                type="button"
                onClick={() => setCurrentStep(step.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  currentStep === step.num
                    ? 'bg-[#350010] text-white shadow-sm'
                    : currentStep > step.num
                    ? 'bg-[#350010]/15 text-[#350010]'
                    : 'bg-stone-200 text-stone-600'
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
            {/* STEP 1: EVENT TYPE & HOSTS */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Event Type Switcher */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                    Select Event Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'wedding' as const, label: 'Traditional Wedding', icon: Heart },
                      { type: 'corporate' as const, label: 'Office Function', icon: Briefcase },
                      { type: 'celebration' as const, label: 'Holud / Party', icon: Sparkles },
                      { type: 'custom' as const, label: 'Custom Event', icon: Layers },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.eventType === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleEventTypeChange(item.type)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition ${
                            isSelected
                              ? 'border-[#350010] bg-[#350010]/5 text-[#350010] ring-1 ring-[#350010]'
                              : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#350010]' : 'text-stone-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <h3 className="text-lg font-heading font-bold text-stone-900">
                    {isCorporate ? 'Company & Event Information' : 'Couple Information'}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    {isCorporate
                      ? 'Specify your organization name, conference title, and keynote details.'
                      : 'Enter names for the bride, groom, and solemn event timings.'}
                  </p>
                </div>

                {isCorporate ? (
                  /* Corporate Event Fields */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Organization / Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Global Holdings"
                        value={formData.corporate?.organizationName || ''}
                        onChange={(e) => handleCorporateChange('organizationName', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Event Title / Heading *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annual Executive Summit & Awards Gala"
                        value={formData.corporate?.eventHeading || ''}
                        onChange={(e) => handleCorporateChange('eventHeading', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Theme / Event Subheading (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Honoring Innovation & Sustainable Partnerships"
                        value={formData.corporate?.eventSubheading || ''}
                        onChange={(e) => handleCorporateChange('eventSubheading', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Dress Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Formal Black Tie"
                          value={formData.corporate?.dressCode || ''}
                          onChange={(e) => handleCorporateChange('dressCode', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Chief Guest / Keynote
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Board of Directors"
                          value={formData.corporate?.chiefGuest || ''}
                          onChange={(e) => handleCorporateChange('chiefGuest', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Wedding & Celebration Fields */
                  <div className="space-y-4">
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Display Heading (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ayesha & Arif"
                        value={formData.couple.coupleDisplayName || ''}
                        onChange={(e) => handleCoupleChange('coupleDisplayName', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Common Date & Timings */}
                <div className="pt-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Event Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                      <input
                        type="date"
                        required
                        value={formData.couple.weddingDate}
                        onChange={(e) => handleCoupleChange('weddingDate', e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        {isCorporate ? 'Keynote Time' : 'Main Event'}
                      </label>
                      <input
                        type="text"
                        placeholder="12:00 PM"
                        value={formData.couple.mainEventTime}
                        onChange={(e) => handleCoupleChange('mainEventTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Reception Start
                      </label>
                      <input
                        type="text"
                        placeholder="11:00 AM"
                        value={formData.couple.functionStartTime}
                        onChange={(e) => handleCoupleChange('functionStartTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Concluding Time
                      </label>
                      <input
                        type="text"
                        placeholder="05:00 PM"
                        value={formData.couple.functionEndTime}
                        onChange={(e) => handleCoupleChange('functionEndTime', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VENUE */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-[#350010] font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>Step 2 &bull; Venue & Location</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Where Will The Guests Gather?
                  </h2>
                  <p className="text-xs text-stone-500">
                    Provide the hall name and direct Google Maps link for mobile navigation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Grand Regal Palace Convention Center"
                    value={formData.venue.venueName}
                    onChange={(e) => handleVenueChange('venueName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Plot 14, Sector 7, Diplomatic Avenue, Gulshan, Dhaka"
                    value={formData.venue.venueAddress}
                    onChange={(e) => handleVenueChange('venueAddress', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
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
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                  <span className="block text-[11px] text-stone-400 mt-1">
                    Guests tap once on their phones to get immediate turn-by-turn driving directions.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Parking / Gate Directions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Crystal Ballroom, Level 2. Valet parking at North Entrance."
                    value={formData.venue.locationDescription || ''}
                    onChange={(e) => handleVenueChange('locationDescription', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: RECEPTION */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-[#350010] font-bold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Step 3 &bull; Reception & Welcome Information</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Who Will Receive The Guests?
                  </h2>
                  <p className="text-xs text-stone-500">
                    Clarify who will welcome your attendees at the main reception arch or desk.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Receiver / Welcoming Host Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Mahbub Rahman & Family"
                    value={formData.receiver.receiverName}
                    onChange={(e) => handleReceiverChange('receiverName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Host Role / Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder={isCorporate ? 'e.g. Head of Corporate Relations' : 'e.g. Father of the Bride / Uncle & Family'}
                    value={formData.receiver.receiverRole || ''}
                    onChange={(e) => handleReceiverChange('receiverRole', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Foyer / Welcome Desk Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Welcoming all guests at the Grand Arch Foyer"
                    value={formData.receiver.additionalInfo || ''}
                    onChange={(e) => handleReceiverChange('additionalInfo', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1711-234567"
                    value={formData.receiver.contactPhone || ''}
                    onChange={(e) => handleReceiverChange('contactPhone', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: CARD THEME & SETTINGS */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-2 text-[#350010] font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Step 4 &bull; Card Theme & Final Details</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-stone-900 mt-1">
                    Choose Your Luxury Card Aesthetic
                  </h2>
                  <p className="text-xs text-stone-500">
                    Select one of our 4 dedicated card aesthetics with solid tones and stardust grain.
                  </p>
                </div>

                {/* Card Variant Options */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Card & Ticket Aesthetic Variant
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        key: 'traditional-burgundy' as const,
                        name: 'Traditional Burgundy',
                        color: '#350010',
                        accent: '#D4AF37',
                        tag: 'Desi Wedding & Walima',
                      },
                      {
                        key: 'royal-sapphire' as const,
                        name: 'Royal Sapphire',
                        color: '#290EA0',
                        accent: '#D4AF37',
                        tag: 'Holud, Sangeet & Reception',
                      },
                      {
                        key: 'corporate-noir' as const,
                        name: 'Executive Corporate',
                        color: '#0F172A',
                        accent: '#C5A059',
                        tag: 'Official Summit & Awards',
                      },
                      {
                        key: 'minimal-ivory' as const,
                        name: 'Warm Alabaster Silk',
                        color: '#FAF7F2',
                        accent: '#350010',
                        tag: 'Daytime Nikah & Minimal',
                      },
                    ].map((opt) => {
                      const isSelected = formData.theme.preset === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            const p = THEME_PRESETS[opt.key];
                            setFormData((prev: CreateInvitationInput) => ({
                              ...prev,
                              theme: p.config,
                            }));
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition ${
                            isSelected
                              ? 'border-[#350010] ring-2 ring-[#350010]/30 bg-[#350010]/5'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <span
                            className="w-7 h-7 rounded-lg border border-black/20 shrink-0 shadow-sm"
                            style={{ backgroundColor: opt.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block font-bold text-xs text-stone-900 truncate">
                              {opt.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {opt.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Note */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Personalized Blessing / Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. With the gracious blessings of the Almighty and our respected parents..."
                    value={formData.specialNote || ''}
                    onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-sm focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                  <span className="block text-[11px] text-stone-400 mt-1">
                    Leave blank to omit the note cleanly from the invitation.
                  </span>
                </div>

                {/* RSVP Toggle */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-stone-900">
                      Enable Digital RSVP & Guest Count
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Allow guests to confirm attendance and party size online.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.rsvpEnabled}
                    onChange={(e) => setFormData({ ...formData, rsvpEnabled: e.target.checked })}
                    className="w-5 h-5 accent-[#350010] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
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
                  className="px-6 py-2.5 rounded-xl bg-[#350010] hover:bg-[#52081d] text-white text-xs font-bold shadow flex items-center space-x-1.5 transition hover:scale-105 active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAndPublish}
                  className="px-6 py-2.5 rounded-xl bg-[#350010] hover:bg-[#52081d] text-white text-xs font-bold shadow flex items-center space-x-1.5 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{saving ? 'Creating...' : 'Save & Publish Card'}</span>
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
                  Live Mobile & Desktop Preview
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
                  ? 'max-w-[410px] p-4 bg-stone-900 rounded-[42px] border-4 border-stone-800 shadow-2xl'
                  : 'w-full'
              }`}
            >
              {previewMode === 'mobile' && (
                <div className="w-24 h-3.5 bg-stone-800 rounded-full mx-auto mb-3" />
              )}

              <div className="overflow-y-auto max-h-[750px] rounded-2xl">
                <InvitationCard
                  invitation={livePreviewInvitation}
                  schedule={INITIAL_MOCK_SCHEDULE}
                  isMobilePreview={previewMode === 'mobile'}
                  onNavigateToPhotos={() => onNavigate(`/photos/${livePreviewInvitation.slug}`)}
                />
              </div>

              {previewMode === 'mobile' && (
                <div className="w-20 h-1 bg-stone-700 rounded-full mx-auto mt-3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
