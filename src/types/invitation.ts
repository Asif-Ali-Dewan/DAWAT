export type InvitationStatus = 'draft' | 'published' | 'archived';

export interface CoupleInfo {
  brideName: string;
  groomName: string;
  coupleDisplayName?: string;
  weddingDate: string; // ISO date string YYYY-MM-DD
  mainEventTime: string; // e.g. "11:00 AM"
  functionStartTime: string; // e.g. "10:30 AM"
  functionEndTime: string; // e.g. "04:30 PM"
}

export interface VenueInfo {
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  locationDescription?: string;
}

export interface ReceiverInfo {
  receiverName: string;
  receiverRole?: string; // e.g. "Father of the Bride", "Uncle & Family"
  additionalInfo?: string;
  contactPhone?: string;
}

export type ThemePreset = 'classic' | 'minimal' | 'elegant' | 'traditional' | 'modern' | 'luxury' | 'sapphire';

export interface ThemeConfiguration {
  preset: ThemePreset;
  accentColor: string; // Hex color
  cardColor?: string; // Optional custom card/ticket hex color (e.g. #350010, #290EA0)
  fontHeading: string; // 'Cinzel' | 'Playfair Display' | 'Cormorant' | 'Alex Brush'
  fontBody: string;
  borderStyle: 'double-gold' | 'minimal-thin' | 'floral-corners' | 'ornate' | 'clean';
  cardLayout: 'story' | 'split' | 'compact' | 'royal-scroll';
  decorativeElement: 'botanical' | 'monogram' | 'floral' | 'rings' | 'none';
  textAlignment: 'center' | 'left' | 'balanced';
  backgroundStyle: 'ivory-silk' | 'midnight-gold' | 'emerald-luxe' | 'rose-champagne' | 'sand-stone' | 'burgundy-velvet' | 'sapphire-royal';
}

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  title: string;
  status: InvitationStatus;
  couple: CoupleInfo;
  venue: VenueInfo;
  receiver: ReceiverInfo;
  specialNote?: string;
  theme: ThemeConfiguration;
  photoFolderUrl?: string;
  photoStatus: 'available' | 'unavailable';
  photoUnavailableQuote?: string;
  rsvpEnabled: boolean;
  guestCountTarget?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateInvitationInput = Omit<Invitation, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvitationInput = Partial<CreateInvitationInput>;
