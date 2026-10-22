import React, { useState } from 'react';
import { WeddingPhoto } from '../../types/photo';
import { Invitation } from '../../types/invitation';
import { photoService } from '../../services/photoService';
import { PHOTOGRAPHER_QUOTES } from '../../config/themes';
import {
  Camera,
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Heart,
} from 'lucide-react';

interface PhotoManagerProps {
  invitation: Invitation;
  photos: WeddingPhoto[];
  onPhotosUpdated?: (photos: WeddingPhoto[]) => void;
  onInvitationUpdated: (invitation: Invitation) => void;
}

export const PhotoManager: React.FC<PhotoManagerProps> = ({
  invitation,
  photos,
  onInvitationUpdated,
}) => {
  const [status, setStatus] = useState<'available' | 'unavailable'>(invitation.photoStatus || 'unavailable');
  const [folderUrl, setFolderUrl] = useState(invitation.photoFolderUrl || '');
  const [quote, setQuote] = useState(
    invitation.photoUnavailableQuote || PHOTOGRAPHER_QUOTES[0]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const slug = invitation.slug;

  const handleToggleStatus = async () => {
    const nextStatus = status === 'available' ? 'unavailable' : 'available';
    setStatus(nextStatus);
    await photoService.updatePhotoConfig(invitation.id, {
      photoStatus: nextStatus,
    });
    onInvitationUpdated({
      ...invitation,
      photoStatus: nextStatus,
      photoFolderUrl: folderUrl,
      photoUnavailableQuote: quote,
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await photoService.updatePhotoConfig(invitation.id, {
        photoStatus: status,
        photoFolderUrl: folderUrl,
        photoUnavailableQuote: quote,
      });
      onInvitationUpdated({
        ...invitation,
        photoStatus: status,
        photoFolderUrl: folderUrl,
        photoUnavailableQuote: quote,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Photo Availability & State Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#350010] bg-[#350010]/10 px-3 py-1 rounded-full mb-1">
              <Camera className="w-3.5 h-3.5 text-[#350010]" />
              <span>Event Photo System</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-stone-900">
              Photo Access & Availability Control
            </h3>
            <p className="text-xs text-stone-500">
              Toggle photo readiness and configure what guests see when they scan the QR code.
            </p>
          </div>

          <a
            href={`/#/photos/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#350010]/10 text-[#350010] border border-[#350010]/30 hover:bg-[#350010]/20 transition shadow-sm"
          >
            <Camera className="w-4 h-4 text-[#350010]" />
            <span>View Public Photo Page</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Master Toggle Banner */}
        <div
          className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            status === 'available'
              ? 'bg-emerald-50/70 border-emerald-300'
              : 'bg-[#350010]/5 border-[#350010]/20'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-[#350010]'
                }`}
              />
              <h4 className="font-bold text-sm text-stone-900">
                Current Photo State:{' '}
                <span className={status === 'available' ? 'text-emerald-700' : 'text-[#350010]'}>
                  {status === 'available' ? 'Photos Published & Live' : 'Photos Still In Production'}
                </span>
              </h4>
            </div>
            <p className="text-xs text-stone-600">
              {status === 'available'
                ? 'Guests scanning the QR code can browse, download, and celebrate with the full photo gallery.'
                : 'Guests will be greeted with an elegant message explaining photographs are being polished.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleStatus}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm ${
              status === 'available'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#350010] hover:bg-[#20000a] text-white'
            }`}
          >
            {status === 'available' ? (
              <>
                <ToggleRight className="w-5 h-5" />
                <span>Switch to &quot;In Production&quot;</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5" />
                <span>Publish Photos Now</span>
              </>
            )}
          </button>
        </div>

        {/* Config Form */}
        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Photographer quote selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
              <span>&quot;Photos Not Available&quot; Playful Message</span>
            </label>
            <div className="space-y-2">
              <select
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs text-stone-800 focus:ring-2 focus:ring-[#350010]"
              >
                {PHOTOGRAPHER_QUOTES.map((q, idx) => (
                  <option key={idx} value={q}>
                    {q}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Or type a custom sweet message for your guests..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
              />
            </div>
            <span className="block text-[11px] text-stone-400 mt-1">
              Displayed in a celebratory card when guests scan the QR code before the official gallery is released.
            </span>
          </div>

          {/* External Folder URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>External High-Res Cloud Folder Link (Google Drive / Supabase Storage)</span>
            </label>
            <input
              type="url"
              placeholder="https://photos.app.goo.gl/... or Google Drive folder"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010]"
            />
            <span className="block text-[11px] text-stone-400 mt-1">
              Connect Google Drive, Dropbox, or future Supabase Storage bucket without changing the guest interface.
            </span>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#350010] hover:bg-[#20000a] text-white shadow transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Preview Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-stone-900 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-[#350010]" />
              <span>Uploaded Event Gallery</span>
            </h3>
            <p className="text-xs text-stone-500">
              {photos.length} photographs currently uploaded for this invitation.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Ceremony', 'Portraits', 'Reception', 'Candid'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#350010] text-[#D4AF37] font-bold shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-100 shadow-sm border border-stone-200"
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                  {photo.category}
                </span>
                <p className="text-xs font-semibold truncate">{photo.title}</p>
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/20 text-[10px] text-white/80">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-rose-400 fill-current" />
                    <span>{photo.likesCount || 0}</span>
                  </span>
                  <span>{photo.capturedAt || '2026-12-18'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
