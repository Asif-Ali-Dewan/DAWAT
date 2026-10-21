export interface WeddingPhoto {
  id: string;
  invitationId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  category: 'Ceremony' | 'Reception' | 'Portraits' | 'Family' | 'Candid';
  capturedAt?: string;
  likesCount?: number;
}

export interface PhotoAccessConfig {
  invitationId: string;
  photoStatus: 'available' | 'unavailable';
  folderUrl?: string;
  folderType: 'supabase' | 'google_drive' | 'dropbox' | 'custom';
  unavailableQuote: string;
  estimatedAvailableDate?: string;
  allowGuestUploads?: boolean;
}
