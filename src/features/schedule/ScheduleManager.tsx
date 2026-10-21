import React, { useState } from 'react';
import { ScheduleItem } from '../../types/schedule';
import { scheduleService } from '../../services/scheduleService';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Heart,
  Utensils,
  Camera,
  Sparkles,
  PartyPopper,
  Music,
  Check,
  X,
} from 'lucide-react';

interface ScheduleManagerProps {
  invitationId: string;
  schedule: ScheduleItem[];
  onScheduleUpdated: (updated: ScheduleItem[]) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  invitationId,
  schedule,
  onScheduleUpdated,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Heart');

  const availableIcons = [
    { name: 'Heart', icon: Heart, label: 'Ceremony' },
    { name: 'Sparkles', icon: Sparkles, label: 'Welcome / Spark' },
    { name: 'Utensils', icon: Utensils, label: 'Feast / Dining' },
    { name: 'Camera', icon: Camera, label: 'Photo Session' },
    { name: 'Music', icon: Music, label: 'Sangeet / Music' },
    { name: 'PartyPopper', icon: PartyPopper, label: 'Send-off' },
  ];

  const resetForm = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setIconName('Heart');
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setStartTime(item.startTime);
    setEndTime(item.endTime || '');
    setDescription(item.description || '');
    setIconName(item.iconName || 'Heart');
    setIsAdding(false);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime.trim()) return;

    if (editingId) {
      // Update
      const updated = await scheduleService.updateScheduleItem(editingId, {
        title,
        startTime,
        endTime,
        description,
        iconName,
      });
      const newItems = schedule.map((s) => (s.id === editingId ? updated : s));
      onScheduleUpdated(newItems);
    } else {
      // Add
      const added = await scheduleService.addScheduleItem({
        invitationId,
        title,
        startTime,
        endTime,
        description,
        iconName,
        sortOrder: schedule.length + 1,
      });
      onScheduleUpdated([...schedule, added]);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    await scheduleService.deleteScheduleItem(id);
    const filtered = schedule.filter((s) => s.id !== id);
    onScheduleUpdated(filtered);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= schedule.length) return;

    const cloned = [...schedule];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(targetIndex, 0, moved);

    const reordered = await scheduleService.reorderSchedule(invitationId, cloned);
    onScheduleUpdated(reordered);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-xl font-heading font-bold text-stone-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Event Schedule & Timeline</span>
          </h3>
          <p className="text-xs text-stone-500">
            Define ceremonies, reception timings, and banquet hours for your guests.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule Event</span>
          </button>
        )}
      </div>

      {/* Inline Form (Add or Edit) */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSaveItem}
          className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              {editingId ? 'Edit Event Item' : 'New Schedule Event'}
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Solemn Ceremony & Vows"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Icon Category
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              >
                {availableIcons.map((ic) => (
                  <option key={ic.name} value={ic.name}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Start Time *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 11:30 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                End Time (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 01:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Auspicious exchange of garlands followed by family blessings."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Update Event' : 'Add To Timeline'}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of items */}
      {schedule.length === 0 ? (
        <div className="py-12 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl">
          <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No schedule events added yet.</p>
          <p className="text-xs text-stone-400">Click &quot;Add Schedule Event&quot; above to create your wedding timeline.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* Reorder up/down buttons */}
                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move earlier"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === schedule.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                    title="Move later"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 font-semibold">
                      {item.startTime} {item.endTime ? `— ${item.endTime}` : ''}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition"
                  title="Edit Event"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
