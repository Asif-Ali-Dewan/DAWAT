export type GuestStatus = 'attending' | 'declined' | 'pending';

export interface Guest {
  id: string;
  invitationId: string;
  name: string;
  email?: string;
  phone?: string;
  numberOfGuests: number;
  status: GuestStatus;
  notes?: string;
  invitationSentAt?: string;
  createdAt: string;
}

export type CreateGuestInput = Omit<Guest, 'id' | 'createdAt'>;
export type UpdateGuestInput = Partial<CreateGuestInput>;
