import React, { useState, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import {
  Invitation,
  CreateInvitationInput,
  EventType,
  ThemeConfiguration,
  CardVariant,
} from '../types/invitation';
import { THEME_PRESETS } from '../config/themes';
import { INITIAL_MOCK_SCHEDULE } from '../data/mockData';
import { InvitationCard } from '../components/common/InvitationCard';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  FolderOpen,
  Download,
  Share2,
  Mail,
  MessageCircle,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Palette,
  Eye,
  Sliders,
  Smartphone,
  Monitor,
  Cake,
  Building2,
  FileCheck,
} from 'lucide-react';

interface HomelyCardGeneratorPageProps {
  onNavigate: (path: string) => void;
  initialInvitation?: Invitation;
}

export const HomelyCardGeneratorPage: React.FC<HomelyCardGeneratorPageProps> = ({
  onNavigate,
  initialInvitation,
}) => {
  // Preset category templates
  const [selectedCategory, setSelectedCategory] = useState<'wedding' | 'birthday' | 'dawat' | 'corporate' | 'custom'>('wedding');
  const [ticketSide, setTicketSide] = useState<'front' | 'back'>('front');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'styling'>('details');

  // Form State
  const [formData, setFormData] = useState<CreateInvitationInput>(() => {
    if (initialInvitation) {
      return {
        userId: initialInvitation.userId,
        slug: initialInvitation.slug,
        eventType: initialInvitation.eventType,
        title: initialInvitation.title,
        status: 'published',
        couple: initialInvitation.couple,
        corporate: initialInvitation.corporate,
        venue: initialInvitation.venue,
        receiver: initialInvitation.receiver,
        specialNote: initialInvitation.specialNote,
        theme: initialInvitation.theme,
        driveFolderUrl: initialInvitation.driveFolderUrl || 'https://drive.google.com/drive/folders/sample-celebration-photos',
        photoFolderUrl: initialInvitation.photoFolderUrl,
        rsvpEnabled: false,
        showQrCode: true,
      };
    }

    return {
      userId: 'user-001',
      slug: 'ayesha-arif-wedding',
      eventType: 'wedding',
      title: 'Ayesha & Arif Wedding Celebration (শুভ বিবাহ)',
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
        locationDescription: 'Main Ballroom, 2nd Floor. Valet parking at North Gate.',
      },
      receiver: {
        receiverName: 'Mr. Mahbub Rahman & Family',
        receiverRole: 'Father of the Bride',
        contactPhone: '+880 1711-234567',
      },
      specialNote:
        'With the gracious blessings of the Almighty and our respected parents, we invite you to celebrate our union. Your warm du’a and presence will make our celebration complete.',
      theme: THEME_PRESETS['traditional-burgundy'].config,
      driveFolderUrl: 'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ',
      rsvpEnabled: false,
      showQrCode: true,
    };
  });

  // Switch category presets smoothly
  const handleCategorySwitch = (category: 'wedding' | 'birthday' | 'dawat' | 'corporate' | 'custom') => {
    setSelectedCategory(category);
    if (category === 'wedding') {
      setFormData((prev) => ({
        ...prev,
        eventType: 'wedding',
        title: 'Ayesha & Arif Wedding Celebration (শুভ বিবাহ)',
        couple: {
          brideName: 'Ayesha Rahman',
          groomName: 'Arif Hasan',
          coupleDisplayName: 'Ayesha & Arif',
          weddingDate: prev.couple.weddingDate || '2026-12-18',
          mainEventTime: '12:00 PM',
          functionStartTime: '11:00 AM',
          functionEndTime: '05:00 PM',
        },
        specialNote: 'With the gracious blessings of the Almighty and our respected parents, we invite you to celebrate our union.',
        theme: THEME_PRESETS['traditional-burgundy'].config,
      }));
    } else if (category === 'birthday') {
      setFormData((prev) => ({
        ...prev,
        eventType: 'celebration',
        title: 'Aryan’s 5th Birthday Celebration (শুভ জন্মদিন)',
        couple: {
          brideName: 'Aryan',
          groomName: 'Ahsan',
          coupleDisplayName: 'Aryan’s 5th Birthday',
          weddingDate: prev.couple.weddingDate || '2026-11-20',
          mainEventTime: '05:00 PM',
          functionStartTime: '04:30 PM',
          functionEndTime: '08:30 PM',
        },
        specialNote: 'Join us for fun, cake, games and laughter as our little star Aryan turns five!',
        theme: THEME_PRESETS['royal-sapphire'].config,
      }));
    } else if (category === 'dawat') {
      setFormData((prev) => ({
        ...prev,
        eventType: 'celebration',
        title: 'Eid Reunion & Family Feast (পারিবারিক দাওয়াত)',
        couple: {
          brideName: 'Chowdhury',
          groomName: 'Family',
          coupleDisplayName: 'Chowdhury Family Dawat',
          weddingDate: prev.couple.weddingDate || '2026-06-15',
          mainEventTime: '01:30 PM',
          functionStartTime: '01:00 PM',
          functionEndTime: '06:00 PM',
        },
        specialNote: 'Let us celebrate the blessed festivities together with heartfelt conversations and home-cooked delicacies.',
        theme: {
          ...THEME_PRESETS['traditional-burgundy'].config,
          cardColor: '#064E3B', // Emerald Jamdani
          accentColor: '#F5D061',
        },
      }));
    } else if (category === 'corporate') {
      setFormData((prev) => ({
        ...prev,
        eventType: 'corporate',
        title: 'Annual Executive Summit & Gala 2026',
        couple: {
          brideName: 'Apex',
          groomName: 'Global',
          coupleDisplayName: 'Apex Global Leadership Gala',
          weddingDate: prev.couple.weddingDate || '2026-11-28',
          mainEventTime: '06:30 PM',
          functionStartTime: '06:00 PM',
          functionEndTime: '10:00 PM',
        },
        corporate: {
          organizationName: 'Apex Global Holdings',
          eventHeading: 'Annual Executive Summit & Gala 2026',
          eventSubheading: 'Honoring Innovation, Sustainable Leadership & Strategic Partnerships',
          dressCode: 'Formal Executive',
        },
        specialNote: 'We cordially invite your esteemed executive presence for an evening of visionary keynote discourses.',
        theme: THEME_PRESETS['corporate-noir'].config,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        eventType: 'custom',
        title: 'Special Celebration & Greeting',
        couple: {
          brideName: 'Special',
          groomName: 'Occasion',
          coupleDisplayName: 'Special Celebration',
          weddingDate: prev.couple.weddingDate || '2026-10-30',
          mainEventTime: '04:00 PM',
          functionStartTime: '03:30 PM',
          functionEndTime: '08:00 PM',
        },
        theme: THEME_PRESETS['minimal-ivory'].config,
      }));
    }
  };

  // Live invitation object for InvitationCard rendering
  const liveInvitation: Invitation = {
    ...formData,
    id: 'dawat-card-2026',
    slug: formData.slug || 'ayesha-arif-wedding',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Helper to get active card DOM element ID
  const getActiveCardElement = (): HTMLElement | null => {
    // Check vertical passes
    const verticalFront = document.getElementById('ticket-card-front');
    const verticalBack = document.getElementById('ticket-card-back');
    const horizFront = document.getElementById('ticket-card-front-horizontal');
    const horizBack = document.getElementById('ticket-card-back-horizontal');

    if (ticketSide === 'front') {
      return verticalFront || horizFront;
    }
    return verticalBack || horizBack || verticalFront || horizFront;
  };

  // Download Exact Card as PNG (Zero extra paper / blank space)
  const handleDownloadPng = async () => {
    const element = getActiveCardElement();
    if (!element) {
      alert('Could not find card element to download. Please verify card is visible.');
      return;
    }

    try {
      setIsExporting('png');
      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        cacheBust: true,
        style: {
          margin: '0',
          transform: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `${formData.slug || 'invitation'}-${ticketSide}-pass.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating PNG card:', err);
      alert('Failed to generate PNG image. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  // Download Exact Card as JPG (Zero extra margins)
  const handleDownloadJpg = async () => {
    const element = getActiveCardElement();
    if (!element) {
      alert('Could not find card element to download. Please verify card is visible.');
      return;
    }

    try {
      setIsExporting('jpg');
      const dataUrl = await toJpeg(element, {
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: formData.theme.cardColor || '#350010',
        cacheBust: true,
        style: {
          margin: '0',
          transform: 'none',
        },
      });

      const link = document.createElement('a');
      link.download = `${formData.slug || 'invitation'}-${ticketSide}-pass.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating JPG card:', err);
      alert('Failed to generate JPG image. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const inviteUrl = `${window.location.origin}/#/invite/${formData.slug || 'ayesha-arif'}`;
    const text = `💌 *${formData.title}*\n\nআপনি ও আপনার পরিবার আন্তরিকভাবে আমন্ত্রিত!\n\n📅 *তারিখ:* ${formData.couple.weddingDate} (${formData.couple.mainEventTime})\n📍 *স্থান:* ${formData.venue.venueName}, ${formData.venue.venueAddress}\n\n👉 *ডিজিটাল নিমন্ত্রণপত্র দেখতে লিংকে ক্লিক করুন:*\n${inviteUrl}${formData.driveFolderUrl ? `\n\n📸 *অনুষ্ঠানের ছবি ও অ্যালবাম (Google Drive):*\n${formData.driveFolderUrl}` : ''}\n\n- ${formData.receiver.receiverName || 'আমন্ত্রণকারী পরিবার'}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Share via Email
  const handleShareEmail = () => {
    const inviteUrl = `${window.location.origin}/#/invite/${formData.slug || 'ayesha-arif'}`;
    const subject = `Invitation: ${formData.title}`;
    const body = `Dear Respected Guest,\n\nYou and your family are cordially invited to celebrate with us!\n\nEvent: ${formData.title}\nDate: ${formData.couple.weddingDate} at ${formData.couple.mainEventTime}\nVenue: ${formData.venue.venueName}\nAddress: ${formData.venue.venueAddress}\n\nView Your Full Digital Invitation Card Here:\n${inviteUrl}\n\n${formData.driveFolderUrl ? `Google Drive Photo Folder:\n${formData.driveFolderUrl}\n\n` : ''}Warm regards,\n${formData.receiver.receiverName || 'The Host'}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Copy Direct Link
  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/#/invite/${formData.slug || 'ayesha-arif'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col">
      {/* Warm Homely Header (NO NAV BAR, NO HAMBURGER MENU) */}
      <header className="bg-[#350010] text-[#FAF7F2] py-6 px-4 sm:px-6 shadow-md border-b-2 border-[#D4AF37]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-[#D4AF37] text-lg">✦</span>
              <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-wider text-[#FAF7F2]">
                দাওয়াত <span className="text-[#D4AF37] font-light">| DAWAT</span>
              </h1>
              <span className="text-[#D4AF37] text-lg">✦</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 font-sans mt-1">
              সহজ ও আন্তরিক নিমন্ত্রণপত্র ও শুভেচ্ছা কার্ড জেনারেটর &bull; Simple & Homely Invitation Studio
            </p>
          </div>

          {/* Quick Category Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#20000a]/80 p-1.5 rounded-2xl border border-[#D4AF37]/30">
            {[
              { id: 'wedding', label: 'Wedding / শুভ বিবাহ', icon: Heart },
              { id: 'birthday', label: 'Birthday / জন্মদিন', icon: Cake },
              { id: 'dawat', label: 'Family Dawat / দাওয়াত', icon: Sparkles },
              { id: 'corporate', label: 'Office Function', icon: Building2 },
              { id: 'custom', label: 'Custom', icon: Sliders },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySwitch(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#1A0006] shadow-sm font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Two-Column Studio Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: SIMPLE & HOMELY FORM CONTROLS (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            {/* Tab Switcher: Details vs Styling */}
            <div className="flex items-center space-x-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'details'
                    ? 'bg-white text-[#350010] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>১. নিমন্ত্রণ তথ্য (Card Details)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('styling')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  activeTab === 'styling'
                    ? 'bg-white text-[#350010] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>২. কার্ডের রঙ ও ডিজাইন (Styling)</span>
              </button>
            </div>

            {/* TAB 1: CARD DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs animate-fade-in">
                {/* Event Title */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    অনুষ্ঠানের নাম ও শিরোনাম (Event Title) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Ayesha & Arif Wedding Celebration"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {selectedCategory === 'wedding'
                        ? 'কনের নাম (Bride Name) *'
                        : selectedCategory === 'birthday'
                        ? 'যার জন্মদিন (Name) *'
                        : 'মূল নাম / হোস্ট (Name 1)'}
                    </label>
                    <input
                      type="text"
                      value={formData.couple.brideName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: { ...formData.couple, brideName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {selectedCategory === 'wedding'
                        ? 'বরের নাম (Groom Name) *'
                        : selectedCategory === 'birthday'
                        ? 'পদবী / বয়স (e.g. 5 Years)'
                        : 'অন্যান্য / পরিবার (Name 2)'}
                    </label>
                    <input
                      type="text"
                      value={formData.couple.groomName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: { ...formData.couple, groomName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-[#350010]" />
                      <span>অনুষ্ঠানের তারিখ (Date) *</span>
                    </label>
                    <input
                      type="date"
                      value={formData.couple.weddingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: { ...formData.couple, weddingDate: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#350010]" />
                      <span>মূল সময় (Time) *</span>
                    </label>
                    <input
                      type="text"
                      value={formData.couple.mainEventTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: { ...formData.couple, mainEventTime: e.target.value },
                        })
                      }
                      placeholder="e.g. 12:00 PM"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#350010]" />
                    <span>স্থান / ভেন্যু (Venue Name) *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.venue.venueName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, venueName: e.target.value },
                      })
                    }
                    placeholder="e.g. The Grand Regal Palace Convention Center"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    সম্পূর্ণ ঠিকানা (Full Address) *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.venue.venueAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, venueAddress: e.target.value },
                      })
                    }
                    placeholder="e.g. Plot 14, Sector 7, Diplomatic Avenue, Gulshan, Dhaka"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>

                {/* Google Maps Link */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1 flex items-center space-x-1">
                    <ExternalLink className="w-3.5 h-3.5 text-[#350010]" />
                    <span>গুগল ম্যাপ লিংক (Google Maps Link)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.venue.mapsUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: { ...formData.venue, mapsUrl: e.target.value },
                      })
                    }
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    অতিথিরা ম্যাপ লিংকে ট্যাপ করে সরাসরি রাস্তা দেখতে পারবেন।
                  </p>
                </div>

                {/* Google Drive Folder Link (THE REQUESTED QR FEATURE) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 space-y-2">
                  <div className="flex items-center space-x-2 text-[#350010] font-bold">
                    <FolderOpen className="w-4 h-4 text-amber-700" />
                    <span>Google Drive ফটো ফোল্ডার লিংক (QR Code Generator)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    এখানে আপনার গুগল ড্রাইভ ফোল্ডারের লিংক দিন। কার্ডের টিকিটের কিউআর কোড (QR) স্বয়ংক্রিয়ভাবে এই লিংক ধারণ করবে। অতিথিরা ফোনে কিউআর স্ক্যান করলেই সরাসরি এই ড্রাইভে গিয়ে সব ছবি দেখতে পারবেন!
                  </p>
                  <input
                    type="url"
                    value={formData.driveFolderUrl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driveFolderUrl: e.target.value,
                        photoFolderUrl: e.target.value,
                      })
                    }
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-mono font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                  {formData.driveFolderUrl && (
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <span>✓</span>
                        <span>QR কোড সফলভাবে যুক্ত হয়েছে!</span>
                      </span>
                      <a
                        href={formData.driveFolderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#350010] font-bold underline hover:opacity-80"
                      >
                        ড্রাইভ লিংক চেক করুন &rarr;
                      </a>
                    </div>
                  )}
                </div>

                {/* Host Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      দাওয়াতদাতা বা পরিবার (Host Name)
                    </label>
                    <input
                      type="text"
                      value={formData.receiver.receiverName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receiver: { ...formData.receiver, receiverName: e.target.value },
                        })
                      }
                      placeholder="e.g. Mr. Mahbub Rahman & Family"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      যোগাযোগের ফোন নম্বর (Phone)
                    </label>
                    <input
                      type="tel"
                      value={formData.receiver.contactPhone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          receiver: { ...formData.receiver, contactPhone: e.target.value },
                        })
                      }
                      placeholder="+880 1711-234567"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Special Blessing Note */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    আন্তরিক আশীর্বাদ বা প্রার্থনা বার্তা (Heartfelt Note)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.specialNote || ''}
                    onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                    placeholder="e.g. With the gracious blessings of the Almighty and our respected parents..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium focus:ring-2 focus:ring-[#350010] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: STYLING & SOLID COLORS */}
            {activeTab === 'styling' && (
              <div className="space-y-5 text-xs animate-fade-in">
                {/* 1. Solid Card Canvas Colors */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                    <span>সলিড কার্ড ক্যানভাস রঙ (Solid Colors - No Gradients)</span>
                    <span className="font-mono text-[#350010] font-bold">
                      {formData.theme.cardColor || '#350010'}
                    </span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Traditional Burgundy', hex: '#350010', desc: 'মহারাজা বারগেন্ডি' },
                      { name: 'Royal Sapphire', hex: '#290EA0', desc: 'রাজকীয় নীল' },
                      { name: 'Emerald Jamdani', hex: '#064E3B', desc: 'পান্না সবুজ' },
                      { name: 'Midnight Noir', hex: '#0F172A', desc: 'অভিজাত গাঢ় স্লেট' },
                      { name: 'Warm Silk Alabaster', hex: '#FAF7F2', desc: 'আইভরি শুভ্র সিল্ক' },
                    ].map((col) => {
                      const isSelected = formData.theme.cardColor?.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              theme: { ...formData.theme, cardColor: col.hex },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                            isSelected
                              ? 'border-[#350010] ring-2 ring-[#350010]/30 bg-stone-50 font-bold'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-lg border border-black/20 shrink-0 shadow-xs"
                            style={{ backgroundColor: col.hex }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block font-bold text-stone-900 truncate">
                              {col.name}
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              {col.desc}
                            </span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#350010] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-stone-500 font-semibold">কাস্টম কালার কোড:</span>
                  <input
                    type="color"
                    value={formData.theme.cardColor || '#350010'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme: { ...formData.theme, cardColor: e.target.value },
                      })
                    }
                    className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={formData.theme.cardColor || '#350010'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme: { ...formData.theme, cardColor: e.target.value },
                      })
                    }
                    placeholder="#350010"
                    className="w-24 px-2 py-1 rounded-lg border border-stone-300 text-xs font-mono"
                  />
                </div>

                {/* 2. Foil Stamping & Accent Highlights */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5">
                    স্বর্ণালী ফয়েল ও লেখার হাইলাইট রঙ (Foil Accent)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Imperial Gold', hex: '#D4AF37' },
                      { name: 'Champagne Gold', hex: '#F5D061' },
                      { name: 'Platinum Silver', hex: '#E2E8F0' },
                      { name: 'Rose Gold', hex: '#E0A899' },
                    ].map((accent) => {
                      const isSelected = formData.theme.accentColor?.toLowerCase() === accent.hex.toLowerCase();
                      return (
                        <button
                          key={accent.hex}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              theme: { ...formData.theme, accentColor: accent.hex },
                            })
                          }
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${
                            isSelected
                              ? 'border-[#350010] bg-[#350010]/10 text-[#350010] font-bold ring-1 ring-[#350010]'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: accent.hex }}
                          />
                          <span>{accent.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Typography Styles */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5">
                    ফন্ট ও ক্যালিগ্রাফি স্টাইল (Typography Pairing)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Royal Classic', heading: 'Cinzel', body: 'Cormorant Garamond' },
                      { label: 'Literary Elegance', heading: 'Playfair Display', body: 'Cormorant Garamond' },
                      { label: 'Modern Luxury', heading: 'Cinzel Decorative', body: 'Montserrat' },
                      { label: 'Clean Executive', heading: 'Montserrat', body: 'Inter' },
                    ].map((f) => {
                      const isSelected = formData.theme.fontHeading === f.heading;
                      return (
                        <button
                          key={f.label}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              theme: {
                                ...formData.theme,
                                fontHeading: f.heading,
                                fontBody: f.body,
                              },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'border-[#350010] bg-[#350010]/5 text-[#350010] font-bold ring-1 ring-[#350010]'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <span className="block font-bold">{f.label}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {f.heading} + {f.body}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Border Framing Inlay */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5">
                    কার্ডের বর্ডার ও নকশা (Border Inlay)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'traditional-arch', label: 'Traditional Arch (ঐতিহ্যবাহী আর্চ)' },
                      { value: 'ornate-gold', label: 'Ornate Gold (স্বর্ণালী নকশা)' },
                      { value: 'corporate-geometric', label: 'Geometric (আধুনিক জ্যামিতিক)' },
                      { value: 'clean-borderless', label: 'Clean Borderless' },
                    ].map((b) => {
                      const isSelected = formData.theme.borderStyle === b.value;
                      return (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              theme: { ...formData.theme, borderStyle: b.value as any },
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl border transition ${
                            isSelected
                              ? 'border-[#350010] bg-[#350010] text-[#D4AF37] font-bold'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Center Watermark Emblem */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1.5">
                    কেন্দ্রীয় প্রতীক / ক্রেস্ট (Center Watermark Emblem)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'paisley-arch', label: 'Royal Mandala (মান্ডালা)' },
                      { value: 'monogram', label: 'Initials Monogram (আদ্যাক্ষর)' },
                      { value: 'corporate-seal', label: 'Official Seal (সিলমোহর)' },
                      { value: 'none', label: 'None (সিম্পল)' },
                    ].map((e) => {
                      const isSelected = formData.theme.decorativeElement === e.value;
                      return (
                        <button
                          key={e.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              theme: { ...formData.theme, decorativeElement: e.value as any },
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl border transition ${
                            isSelected
                              ? 'border-[#350010] bg-[#350010] text-[#D4AF37] font-bold'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {e.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: REAL-TIME TICKET PREVIEW & ACTION CENTER (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Preview Bar with Instant Share & Download Toolbar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              {/* Front / Back Flip Button */}
              <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setTicketSide('front')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
                    ticketSide === 'front'
                      ? 'bg-[#350010] text-[#D4AF37] shadow-xs'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>সামনের পাশ (Front)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketSide('back')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition ${
                    ticketSide === 'back'
                      ? 'bg-[#350010] text-[#D4AF37] shadow-xs'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span>পেছনের পাশ (Back / Details)</span>
                </button>
              </div>

              {/* Guest View Demo Link */}
              <button
                type="button"
                onClick={() => onNavigate(`/invite/${formData.slug || 'ayesha-arif'}`)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Preview what guests see when receiving the invite"
              >
                <Eye className="w-3.5 h-3.5 text-[#350010]" />
                <span>অতিথির চোখে দেখুন (Guest View)</span>
              </button>
            </div>

            {/* ACTION CENTER: DOWNLOAD & SEND (WhatsApp, Mail, PNG, JPG) */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-[#350010] to-[#20000a] text-white shadow-lg border border-[#D4AF37]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-heading font-bold text-sm tracking-wide text-[#FAF7F2]">
                    ডাউনলোড ও সেন্ড করুন (Download & Share)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                  Zero Extra Margins • Exact Card Only
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* 1. Download PNG */}
                <button
                  type="button"
                  disabled={isExporting !== null}
                  onClick={handleDownloadPng}
                  className="py-2.5 px-3 rounded-2xl bg-white text-[#1A0006] hover:bg-stone-100 font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
                  title="Download transparent high-resolution PNG card"
                >
                  <Download className="w-3.5 h-3.5 text-[#350010]" />
                  <span>{isExporting === 'png' ? 'তৈরি হচ্ছে...' : 'PNG ডাউনলোড'}</span>
                </button>

                {/* 2. Download JPG */}
                <button
                  type="button"
                  disabled={isExporting !== null}
                  onClick={handleDownloadJpg}
                  className="py-2.5 px-3 rounded-2xl bg-[#D4AF37] text-[#1A0006] hover:bg-[#ebd485] font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
                  title="Download high-resolution JPG card"
                >
                  <Download className="w-3.5 h-3.5 text-[#1A0006]" />
                  <span>{isExporting === 'jpg' ? 'তৈরি হচ্ছে...' : 'JPG ডাউনলোড'}</span>
                </button>

                {/* 3. Send WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition"
                  title="Send via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp সেন্ড</span>
                </button>

                {/* 4. Send Email */}
                <button
                  type="button"
                  onClick={handleShareEmail}
                  className="py-2.5 px-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition"
                  title="Send via Email"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>ইমেইলে সেন্ড</span>
                </button>
              </div>

              {/* Copy Invite Link Bar */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-300 font-mono truncate mr-2">
                  Link: {`${window.location.origin}/#/invite/${formData.slug || 'ayesha-arif'}`}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-[#D4AF37] font-bold shrink-0 flex items-center space-x-1 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
                </button>
              </div>
            </div>

            {/* LIVE TICKET CANVAS CONTAINER (Exact bounds, screen fitted) */}
            <div className="bg-stone-200/50 p-3 sm:p-6 rounded-3xl border border-stone-300/80 shadow-inner flex justify-center overflow-x-auto">
              <div className="w-full max-w-md">
                <InvitationCard
                  invitation={liveInvitation}
                  schedule={INITIAL_MOCK_SCHEDULE}
                  isTicketMode={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Homely Warm Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 px-4 text-center text-xs border-t border-stone-800">
        <p className="font-heading tracking-wider text-stone-300 font-semibold">
          দাওয়াত &bull; DAWAT &bull; সহজ ও আন্তরিক ডিজিটাল নিমন্ত্রণপত্র
        </p>
        <p className="text-[11px] text-stone-500 mt-1">
          Made for heartfelt celebrations. Download your invitation card & send with love.
        </p>
      </footer>
    </div>
  );
};
