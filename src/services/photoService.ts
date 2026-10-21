import { WeddingPhoto, PhotoAccessConfig } from '../types/photo';
import { INITIAL_MOCK_PHOTOS, INITIAL_MOCK_INVITATION } from '../data/mockData';
import { invitationService } from './invitationService';

const PHOTOS_STORAGE_KEY = 'dawat_photos_v1';

function getStoredPhotos(): WeddingPhoto[] {
  try {
    const raw = localStorage.getItem(PHOTOS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read photos from storage:', err);
  }
  return INITIAL_MOCK_PHOTOS;
}

function saveStoredPhotos(photos: WeddingPhoto[]): void {
  try {
    localStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save photos to storage:', err);
  }
}

export const photoService = {
  async getPhotosByInvitationId(invitationId: string): Promise<WeddingPhoto[]> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredPhotos();
    return all.filter((p) => p.invitationId === invitationId || invitationId.includes('ayesha-arif'));
  },

  async getPhotoAccessConfig(invitationId: string): Promise<PhotoAccessConfig> {
    const inv = await invitationService.getInvitationById(invitationId);
    return {
      invitationId,
      photoStatus: inv?.photoStatus || 'unavailable',
      folderUrl: inv?.photoFolderUrl || INITIAL_MOCK_INVITATION.photoFolderUrl,
      folderType: 'google_drive',
      unavailableQuote: inv?.photoUnavailableQuote || INITIAL_MOCK_INVITATION.photoUnavailableQuote || 'The photographer is still negotiating with the camera. Please check back soon!',
      allowGuestUploads: false,
    };
  },

  async updatePhotoConfig(
    invitationId: string,
    updates: {
      photoStatus?: 'available' | 'unavailable';
      photoFolderUrl?: string;
      photoUnavailableQuote?: string;
    }
  ): Promise<void> {
    await invitationService.updateInvitation(invitationId, updates);
  },

  async addPhoto(photo: Omit<WeddingPhoto, 'id'>): Promise<WeddingPhoto> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredPhotos();
    const newPhoto: WeddingPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
      likesCount: 0,
    };
    all.unshift(newPhoto);
    saveStoredPhotos(all);
    return newPhoto;
  },

  async deletePhoto(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredPhotos().filter((p) => p.id !== id);
    saveStoredPhotos(all);
  },
};
