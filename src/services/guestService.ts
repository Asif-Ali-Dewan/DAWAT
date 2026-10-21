import { Guest, CreateGuestInput, UpdateGuestInput } from '../types/guest';
import { INITIAL_MOCK_GUESTS } from '../data/mockData';

const GUESTS_STORAGE_KEY = 'dawat_guests_v1';

function getStoredGuests(): Guest[] {
  try {
    const raw = localStorage.getItem(GUESTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read guests from storage:', err);
  }
  return INITIAL_MOCK_GUESTS;
}

function saveStoredGuests(guests: Guest[]): void {
  try {
    localStorage.setItem(GUESTS_STORAGE_KEY, JSON.stringify(guests));
  } catch (err) {
    console.error('Failed to save guests to storage:', err);
  }
}

export const guestService = {
  async getGuestsByInvitationId(invitationId: string): Promise<Guest[]> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredGuests();
    return all.filter((g) => g.invitationId === invitationId || invitationId.includes('ayesha-arif'));
  },

  async addGuest(input: CreateGuestInput): Promise<Guest> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredGuests();
    const newGuest: Guest = {
      ...input,
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newGuest);
    saveStoredGuests(all);
    return newGuest;
  },

  async updateGuest(id: string, updates: UpdateGuestInput): Promise<Guest> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredGuests();
    const index = all.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Guest with id ${id} not found`);
    }
    const updated = {
      ...all[index],
      ...updates,
    };
    all[index] = updated;
    saveStoredGuests(all);
    return updated;
  },

  async deleteGuest(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredGuests().filter((g) => g.id !== id);
    saveStoredGuests(all);
  },

  async submitRsvp(
    invitationId: string,
    name: string,
    email: string,
    phone: string,
    numberOfGuests: number,
    status: 'attending' | 'declined',
    notes?: string
  ): Promise<Guest> {
    await new Promise((r) => setTimeout(r, 120));
    return this.addGuest({
      invitationId,
      name,
      email,
      phone,
      numberOfGuests,
      status,
      notes,
    });
  },
};
