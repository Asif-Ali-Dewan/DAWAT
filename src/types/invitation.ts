export type InvitationStatus = 'draft' | 'published' | 'archived';

export type EventType = 'wedding' | 'corporate' | 'celebration' | 'custom';

export type CardVariant = 'traditional-desi' | 'corporate-executive' | 'royal-sapphire' | 'minimal-ivory';

export interface CoupleInfo {
  brideName: string;
  groomName: string;
  coupleDisplayName?: string;
  weddingDate: string; // ISO date string YYYY-MM-DD
  mainEventTime: string; // e.g. "11:00 AM"
  functionStartTime: string; // e.g. "10:30 AM"
  functionEndTime: string; // e.g. "04:30 PM"
}

export interface CorporateInfo {
  organizationName: string;
  eventHeading: string;
  eventSubheading?: string;
  dressCode?: string;
  chiefGuest?: string;
}

export interface VenueInfo {
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  locationDescription?: string;
}

export interface ReceiverInfo {
  receiverName: string;
  receiverRole?: string; // e.g. "Father of the Bride", "Head of Corporate Relations"
  additionalInfo?: string;
  contactPhone?: string;
}

export type ThemePreset = 'traditional-burgundy' | 'royal-sapphire' | 'corporate-noir' | 'minimal-ivory';

export interface ThemeConfiguration {
  preset: ThemePreset;
  cardVariant: CardVariant;
  cardColor: string; // Solid primary, e.g. #350010 (Burgundy) or #290EA0 (Royal Sapphire)
  accentColor: string; // Luminous Foil, e.g. #D4AF37 (Antique Gold) or #E2E8F0 (Platinum)
  fontHeading: string;
  fontBody: string;
  borderStyle: 'traditional-arch' | 'ornate-gold' | 'corporate-geometric' | 'clean-borderless';
  decorativeElement: 'paisley-arch' | 'monogram' | 'corporate-seal' | 'none';
  hasStarTexture?: boolean;
}

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  eventType: EventType;
  title: string;
  status: InvitationStatus;
  couple: CoupleInfo;
  corporate?: CorporateInfo;
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
