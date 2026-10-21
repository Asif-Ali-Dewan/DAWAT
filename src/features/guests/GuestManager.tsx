import React, { useState } from 'react';
import { Guest } from '../../types/guest';
import { guestService } from '../../services/guestService';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Search,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';

interface GuestManagerProps {
  invitationId: string;
  guests: Guest[];
  targetCount?: number;
  onGuestsUpdated: (updated: Guest[]) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  invitationId,
  guests,
  targetCount = 350,
  onGuestsUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New Guest Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [status, setStatus] = useState<Guest['status']>('attending');
  const [notes, setNotes] = useState('');

  // Calculations
  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const totalAttendingCount = attendingGuests.reduce((sum, g) => sum + (g.numberOfGuests || 1), 0);
  const declinedCount = guests.filter((g) => g.status === 'declined').length;
  const pendingCount = guests.filter((g) => g.status === 'pending').length;

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (g.phone && g.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest = await guestService.addGuest({
      invitationId,
      name,
      email,
      phone,
      numberOfGuests,
      status,
      notes,
    });

    onGuestsUpdated([newGuest, ...guests]);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await guestService.deleteGuest(id);
    onGuestsUpdated(guests.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Attending</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-heading text-stone-900">{totalAttendingCount}</p>
          <span className="text-[11px] text-stone-500">
            Target: {targetCount} guests ({Math.round((totalAttendingCount / (targetCount || 1)) * 100)}%)
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs uppercase tracking-wider font-semibold">RSVP Entries</span>
            <Users className="w-4 h-4 text-[#350010]" />
          </div>
          <p className="text-2xl font-bold font-heading text-stone-900">{guests.length}</p>
          <span className="text-[11px] text-stone-500">Registered parties</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Declined</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-heading text-stone-900">{declinedCount}</p>
          <span className="text-[11px] text-stone-500">Warm wishes sent</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending</span>
            <Clock className="w-4 h-4 text-[#290EA0]" />
          </div>
          <p className="text-2xl font-bold font-heading text-stone-900">{pendingCount}</p>
          <span className="text-[11px] text-stone-500">Awaiting response</span>
        </div>
      </div>

      {/* Guest Table Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-stone-900">
              Guest List & RSVPs
            </h3>
            <p className="text-xs text-stone-500">
              Track responses submitted by your guests via the invitation link.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#350010] hover:bg-[#20000a] text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest Manually</span>
          </button>
        </div>

        {/* Add Guest Form */}
        {isAdding && (
          <form
            onSubmit={handleAddGuest}
            className="p-5 rounded-2xl bg-[#350010]/5 border border-[#350010]/20 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#350010]">
                New Guest Entry
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Family Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salman & Sabrina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="salman@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+880 1..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Guests Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Guest['status'])}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                >
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Wishes / Note
                </label>
                <input
                  type="text"
                  placeholder="Warm message or blessings..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-[#350010]"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#350010] hover:bg-[#20000a] text-white text-xs font-bold shadow"
              >
                Save Guest
              </button>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-xs focus:ring-2 focus:ring-[#350010]"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'attending', 'declined', 'pending'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  statusFilter === filter
                    ? 'bg-[#350010] text-[#D4AF37] font-bold shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Party Size</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Wishes / Note</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                    No matching guests found.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/80 transition">
                    <td className="px-4 py-3 font-semibold text-stone-900">
                      {guest.name}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {guest.email && <div className="truncate max-w-[140px]">{guest.email}</div>}
                      {guest.phone && <div className="text-stone-400 font-mono">{guest.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {guest.numberOfGuests || 1}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          guest.status === 'attending'
                            ? 'bg-emerald-100 text-emerald-800'
                            : guest.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#290EA0]/10 text-[#290EA0]'
                        }`}
                      >
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 italic max-w-xs truncate">
                      {guest.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(guest.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Remove guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
