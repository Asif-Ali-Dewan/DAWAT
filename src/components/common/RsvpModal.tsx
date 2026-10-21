import React, { useState } from 'react';
import { guestService } from '../../services/guestService';
import {
  X,
  Heart,
  CheckCircle2,
  Users,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

interface RsvpModalProps {
  isOpen: boolean;
  invitationId: string;
  coupleName: string;
  onClose: () => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({
  isOpen,
  invitationId,
  coupleName,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await guestService.addGuest({
        invitationId,
        name,
        email: email || undefined,
        phone: phone || undefined,
        status,
        numberOfGuests: status === 'attending' ? guestsCount : 0,
        notes: notes || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit RSVP', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#D4AF37]/40 p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-stone-900">
              {status === 'attending' ? 'See You There!' : 'Thank You for Your Wishes'}
            </h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              {status === 'attending'
                ? `Your RSVP has been graciously received for ${coupleName}. We eagerly look forward to welcoming you!`
                : `Thank you for letting us know. Your warm thoughts and blessings mean the world to ${coupleName}.`}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#350010] uppercase tracking-widest bg-[#350010]/10 px-3 py-1 rounded-full mb-2">
                <Heart className="w-3.5 h-3.5 fill-[#350010] text-[#350010]" />
                <span>Attendance Response</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-stone-900">
                Will You Attend?
              </h3>
              <p className="text-xs text-stone-500">
                Please let us know so we can prepare your gracious welcome
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance Choice */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('attending')}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    status === 'attending'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/30'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold">Joyfully Attending</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('declined')}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                    status === 'declined'
                      ? 'border-[#350010] bg-[#350010]/10 text-[#350010] ring-2 ring-[#350010]/30'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <X className="w-5 h-5 text-[#350010]" />
                  <span className="text-xs font-bold">Regretfully Declining</span>
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / Family Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Tariqul Islam & Family"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#350010]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+880 1711-..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#350010]"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Guests (if attending) */}
              {status === 'attending' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Number of Guests Attending
                  </label>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-stone-400" />
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestsCount(num)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                            guestsCount === num
                              ? 'bg-[#350010] text-[#D4AF37]'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Warm Message / Wishes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Warm Wishes / Message for the Host
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a heartfelt blessing or dietary note..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#350010]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-sm bg-[#350010] text-[#D4AF37] hover:bg-[#20000a] border border-[#D4AF37]/30 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Confirm RSVP'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
