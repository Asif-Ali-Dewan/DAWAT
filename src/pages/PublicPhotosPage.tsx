import React, { useState, useEffect } from 'react';
import { WeddingPhoto } from '../types/photo';
import { Invitation } from '../types/invitation';
import { invitationService } from '../services/invitationService';
import { photoService } from '../services/photoService';
import {
  Camera,
  Heart,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  X,
  Maximize2,
} from 'lucide-react';

interface PublicPhotosPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PublicPhotosPage: React.FC<PublicPhotosPageProps> = ({ slug, onNavigate }) => {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<WeddingPhoto | null>(null);

  // Email notification form for "Photos Not Available"
  const [notifyEmail, setNotifyEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const inv = await invitationService.getInvitationBySlug(slug);
        if (!isMounted) return;

        if (inv) {
          setInvitation(inv);
          const p = await photoService.getPhotosByInvitationId(inv.id);
          if (isMounted) setPhotos(p);
        }
      } catch (err) {
        console.error('Failed to load photos:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;
    setSubscribed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-stone-600 font-medium">Loading Wedding Photographs...</p>
        </div>
      </div>
    );
  }

  const coupleTitle = invitation
    ? invitation.couple.coupleDisplayName ||
      `${invitation.couple.brideName} & ${invitation.couple.groomName}`
    : 'Ayesha & Arif';

  const isAvailable = invitation?.photoStatus === 'available';

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <button
            type="button"
            onClick={() => onNavigate(`/invite/${slug}`)}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Wedding Invitation</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white transition"
            >
              Inviter Dashboard
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/20">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Photo Album</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-stone-900">
            {coupleTitle}&apos;s Memories
          </h1>

          <p className="text-xs sm:text-sm text-stone-600">
            Celebrated on {invitation ? invitation.couple.weddingDate : '18 December 2026'} &bull; {invitation?.venue.venueName}
          </p>
        </div>

        {/* STATE A: PHOTOS AVAILABLE */}
        {isAvailable ? (
          <div className="space-y-8 animate-fade-in">
            {/* Category Filter Pills & External Album Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Ceremony', 'Portraits', 'Reception', 'Candid'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {invitation?.photoFolderUrl && (
                <a
                  href={invitation.photoFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition shrink-0"
                >
                  <span>Open Full Cloud Album (Original RAW)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}
            </div>

            {/* Photos Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-100 shadow-sm border border-stone-200 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      {photo.category}
                    </span>
                    <h4 className="font-bold text-sm truncate">{photo.title}</h4>
                    <div className="flex items-center justify-between text-xs text-white/80 mt-1 pt-1 border-t border-white/20">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                        <span>{photo.likesCount || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-[11px]">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STATE B: PHOTOS NOT AVAILABLE (Warm, lighthearted & wedding-themed) */
          <div className="max-w-xl mx-auto my-12 p-8 sm:p-12 rounded-3xl bg-white border-2 border-amber-300/70 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Memories In The Making
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 leading-snug">
                {invitation?.photoUnavailableQuote ||
                  'The photographer is still negotiating with the camera. Please check back soon!'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                The magical moments from {coupleTitle}&apos;s wedding are currently being curated, color-graded, and polished to perfection.
              </p>
            </div>

            {/* Notification Subscription Box */}
            <div className="pt-2 border-t border-stone-100">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    You will receive an instant notification as soon as the wedding photos are unveiled!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <p className="text-xs font-semibold text-stone-700">
                    Want an email the minute the photo gallery goes live?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow transition shrink-0"
                    >
                      Notify Me
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate(`/invite/${slug}`)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4"
              >
                <span>Return to Wedding Schedule & Venue</span>
              </button>
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in">
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-amber-400 transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <div className="mt-3 text-center text-white">
                <p className="font-bold text-sm">{lightboxPhoto.title}</p>
                <span className="text-xs text-amber-300 uppercase tracking-wider">
                  {lightboxPhoto.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
