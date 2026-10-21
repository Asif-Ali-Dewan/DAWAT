export interface ScheduleItem {
  id: string;
  invitationId: string;
  title: string;
  startTime: string; // e.g. "10:00 AM"
  endTime?: string; // e.g. "11:30 AM"
  description?: string;
  iconName?: string; // Lucide icon name, e.g. "Heart", "Utensils", "Camera", "Sparkles", "Music", "PartyPopper"
  sortOrder: number;
}

export type CreateScheduleItemInput = Omit<ScheduleItem, 'id'>;
export type UpdateScheduleItemInput = Partial<CreateScheduleItemInput>;
