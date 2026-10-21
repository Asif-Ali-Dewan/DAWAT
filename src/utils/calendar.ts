import { Invitation } from '../types/invitation';

export function createGoogleCalendarUrl(invitation: Invitation): string {
  const title = encodeURIComponent(`Wedding: ${invitation.couple.brideName} & ${invitation.couple.groomName}`);
  const details = encodeURIComponent(
    `We warmly invite you to the wedding of ${invitation.couple.brideName} and ${invitation.couple.groomName}!\n\n${invitation.specialNote || ''}\n\nVenue: ${invitation.venue.venueName}\nAddress: ${invitation.venue.venueAddress}\n\nInvitation: ${window.location.origin}/#/invite/${invitation.slug}`
  );
  const location = encodeURIComponent(`${invitation.venue.venueName}, ${invitation.venue.venueAddress}`);

  // Format date: YYYYMMDD
  const rawDate = invitation.couple.weddingDate.replace(/-/g, '');
  // Default 11am to 5pm UTC or local
  const start = `${rawDate}T050000Z`;
  const end = `${rawDate}T110000Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(invitation: Invitation) {
  const rawDate = invitation.couple.weddingDate.replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dawat Digital Wedding Invitations//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Wedding Celebration of ${invitation.couple.brideName} & ${invitation.couple.groomName}`,
    `DESCRIPTION:${(invitation.specialNote || 'Wedding Celebration').replace(/\n/g, '\\n')}`,
    `LOCATION:${invitation.venue.venueName}, ${invitation.venue.venueAddress}`,
    `DTSTART:${rawDate}T110000`,
    `DTEND:${rawDate}T170000`,
    `URL:${window.location.origin}/#/invite/${invitation.slug}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${invitation.slug}-wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
