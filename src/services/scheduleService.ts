import { ScheduleItem, CreateScheduleItemInput, UpdateScheduleItemInput } from '../types/schedule';
import { INITIAL_MOCK_SCHEDULE } from '../data/mockData';

const SCHEDULE_STORAGE_KEY = 'dawat_schedules_v1';

function getStoredSchedules(): ScheduleItem[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read schedule from storage:', err);
  }
  return INITIAL_MOCK_SCHEDULE;
}

function saveStoredSchedules(items: ScheduleItem[]): void {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save schedules to storage:', err);
  }
}

export const scheduleService = {
  async getScheduleByInvitationId(invitationId: string): Promise<ScheduleItem[]> {
    await new Promise((r) => setTimeout(r, 50));
    const all = getStoredSchedules();
    const items = all.filter((s) => s.invitationId === invitationId || invitationId.includes('ayesha-arif'));
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async addScheduleItem(input: CreateScheduleItemInput): Promise<ScheduleItem> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredSchedules();
    const newItem: ScheduleItem = {
      ...input,
      id: `sch-${Date.now()}`,
    };
    all.push(newItem);
    saveStoredSchedules(all);
    return newItem;
  },

  async updateScheduleItem(id: string, updates: UpdateScheduleItemInput): Promise<ScheduleItem> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredSchedules();
    const index = all.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Schedule item ${id} not found`);
    }
    const updated: ScheduleItem = {
      ...all[index],
      ...updates,
    };
    all[index] = updated;
    saveStoredSchedules(all);
    return updated;
  },

  async deleteScheduleItem(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    const all = getStoredSchedules().filter((s) => s.id !== id);
    saveStoredSchedules(all);
  },

  async reorderSchedule(invitationId: string, orderedItems: ScheduleItem[]): Promise<ScheduleItem[]> {
    await new Promise((r) => setTimeout(r, 60));
    const all = getStoredSchedules();
    const otherItems = all.filter((s) => s.invitationId !== invitationId && !invitationId.includes('ayesha-arif'));
    
    // Update sortOrder on the orderedItems
    const updatedOrdered = orderedItems.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    saveStoredSchedules([...otherItems, ...updatedOrdered]);
    return updatedOrdered;
  },
};
