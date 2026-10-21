import React, { useState, useEffect } from 'react';
import { Invitation } from '../../types/invitation';
import { ScheduleItem } from '../../types/schedule';
import { generateQrCode } from '../../utils/qrcode';
import { InvitationCard } from '../../components/common/InvitationCard';
import {
  Share2,
  Copy,
  Check,
  Send,
  Mail,
  Download,
  ExternalLink,
  MessageCircle,
  QrCode,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ShareManagerProps {
  invitation: Invitation;
  schedule: ScheduleItem[];
}

export const ShareManager: React.FC<ShareManagerProps> = ({ invitation, schedule }) => {
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const publicInviteUrl = `${window.location.origin}/#/invite/${invitation.slug}`;
  const publicPhotoUrl = `${window.location.origin}/#/photos/${invitation.slug}`;

  useEffect(() => {
    generateQrCode(publicInviteUrl, { width: 250, margin: 1 }).then(setQrDataUrl);
  }, [publicInviteUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `With joyful hearts, we warmly invite you to the wedding celebration of ${invitation.couple.brideName} & ${invitation.couple.groomName} on ${invitation.couple.weddingDate}.\n\nView our digital invitation, venue directions, and event schedule here:\n${publicInviteUrl}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleMessengerShare = () => {
    const url = `fb-messenger://share/?link=${encodeURIComponent(publicInviteUrl)}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;
    setEmailSent(true);
    setTimeout(() => {
      setRecipientEmail('');
      setEmailSent(false);
    }, 3500);
  };

  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Share Actions Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Invitation Distribution</span>
          </div>
          <h3 className="text-xl font-heading font-bold text-stone-900">
            Share Your Wedding Invitation
          </h3>
          <p className="text-xs text-stone-500">
            Send unique digital wedding cards to your guests via WhatsApp, Messenger, Email, or copy the direct link.
          </p>
        </div>

        {/* Copy Link Input Bar */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Direct Public Invitation Link
            </span>
            <p className="font-mono text-xs text-stone-800 truncate bg-white px-3 py-1.5 rounded-lg border border-stone-200">
              {publicInviteUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shrink-0 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Multi-Channel Sharing Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="p-5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition group shadow-sm flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Share via WhatsApp</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Pre-formatted gracious wedding greeting with invitation link.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 mt-3 inline-flex items-center space-x-1">
              <span>Open WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </button>

          {/* Messenger */}
          <button
            type="button"
            onClick={handleMessengerShare}
            className="p-5 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-left transition group shadow-sm flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Facebook Messenger</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Send invitation link directly to family and group chats.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 mt-3 inline-flex items-center space-x-1">
              <span>Share in Messenger</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </button>

          {/* Download / Print Ticket */}
          <button
            type="button"
            onClick={handlePrintTicket}
            className="p-5 rounded-2xl border-2 border-amber-500/30 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 text-left transition group shadow-sm flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">Download Digital Card / Ticket</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Print or export high-res keepsake with wedding details & QR code.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 mt-3 inline-flex items-center space-x-1">
              <span>Print / Save PDF</span>
              <Printer className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* Email Invitation Sender (Mocked for future service) */}
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center space-x-2 text-stone-800">
            <Mail className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider">
              Send Invitation by Email
            </h4>
          </div>

          <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="Enter guest's email address..."
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Digital Invitation</span>
            </button>
          </form>

          {emailSent && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                Invitation email successfully queued! (Prepared for transactional email service integration)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Digital Ticket Keepsake Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Keepsake Ticket</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-stone-900">
              Digital Invitation Ticket
            </h3>
            <p className="text-xs text-stone-500">
              The ticket contains the essential information and QR code for scanning at reception.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrintTicket}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>
        </div>

        {/* Render ticket inside frame */}
        <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-stone-100/60 rounded-3xl border border-stone-200">
          <InvitationCard
            invitation={invitation}
            schedule={schedule}
            isTicketMode={true}
          />
        </div>
      </div>
    </div>
  );
};
