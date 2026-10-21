import { Invitation, CreateInvitationInput, UpdateInvitationInput } from '../types/invitation';
import { INITIAL_MOCK_INVITATION } from '../data/mockData';

const STORAGE_KEY = 'dawat_invitations_v1';

function getStoredInvitations(): Invitation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read invitations from storage:', err);
  }
  return [INITIAL_MOCK_INVITATION];
}

function saveStoredInvitations(invitations: Invitation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
  } catch (err) {
    console.error('Failed to save invitations to storage:', err);
  }
}

export const invitationService = {
  async getAllInvitations(): Promise<Invitation[]> {
    await new Promise((r) => setTimeout(r, 60)); // Simulate async network
    return getStoredInvitations();
  },

  async getInvitationById(id: string): Promise<Invitation | null> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredInvitations();
    return all.find((inv) => inv.id === id) || null;
  },

  async getInvitationBySlug(slug: string): Promise<Invitation | null> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredInvitations();
    const cleanSlug = slug.toLowerCase().trim();
    return all.find((inv) => inv.slug.toLowerCase() === cleanSlug) || null;
  },

  async createInvitation(input: CreateInvitationInput): Promise<Invitation> {
    await new Promise((r) => setTimeout(r, 120));
    const all = getStoredInvitations();
    const newId = `inv-${Date.now()}`;
    const newSlug = input.slug || `${input.couple.brideName.toLowerCase().split(' ')[0]}-${input.couple.groomName.toLowerCase().split(' ')[0]}-${Date.now().toString().slice(-4)}`;

    const newInvitation: Invitation = {
      ...input,
      id: newId,
      slug: newSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newInvitation);
    saveStoredInvitations(all);
    return newInvitation;
  },

  async updateInvitation(id: string, updates: UpdateInvitationInput): Promise<Invitation> {
    await new Promise((r) => setTimeout(r, 100));
    const all = getStoredInvitations();
    const index = all.findIndex((inv) => inv.id === id);
    if (index === -1) {
      throw new Error(`Invitation with id ${id} not found`);
    }

    const current = all[index];
    const updated: Invitation = {
      ...current,
      ...updates,
      couple: updates.couple ? { ...current.couple, ...updates.couple } : current.couple,
      venue: updates.venue ? { ...current.venue, ...updates.venue } : current.venue,
      receiver: updates.receiver ? { ...current.receiver, ...updates.receiver } : current.receiver,
      theme: updates.theme ? { ...current.theme, ...updates.theme } : current.theme,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    saveStoredInvitations(all);
    return updated;
  },

  async deleteInvitation(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredInvitations().filter((inv) => inv.id !== id);
    saveStoredInvitations(all);
  },

  async resetToDefault(): Promise<Invitation> {
    saveStoredInvitations([INITIAL_MOCK_INVITATION]);
    return INITIAL_MOCK_INVITATION;
  },
};
