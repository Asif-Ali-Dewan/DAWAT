# DAWAT (দাওয়াত) — Bespoke Digital Wedding Invitation Platform

A modern, luxury **Digital Wedding Invitation Platform** where couples and families can create personalized wedding invitations, generate unique guest links & keepsake tickets, coordinate event schedules, navigate directly with Google Maps, and manage digital wedding photo galleries via unique QR codes.

Built with a decoupled, modular service architecture prepared for seamless **Supabase** backend integration.

---

## 🌟 Key Features

### 1. Inviter Experience
- **Multi-Step Invitation Creation Wizard**:
  - Step 1: Couple information & ceremony timings
  - Step 2: Venue details with direct Google Maps integration
  - Step 3: Reception information ("Who welcomes the guest?")
  - Step 4: Personalized message & RSVP settings
  - Real-time side-by-side Live Preview with **Mobile vs. Desktop** viewport switcher
- **Inviter Dashboard**:
  - Overview statistics: Confirmed guests, registered parties, target headcount, and invitation status
  - **Designer Theme Customizer**: 6 curated presets (*Classic Royale, Modern Minimal, Champagne Grace, Royal Heritage, Midnight Glamour, Velvet Noir*) with custom font pairings, gold foil accents, and crests
  - **Event Schedule Manager**: Full timeline CRUD with reordering and category icons (*Ceremony, Feast, Photography, Sangeet, Send-off*)
  - **Guest List & RSVP Tracker**: Filterable and searchable table with headcount tracking and personal messages
  - **Photo Folder & QR Manager**: Toggle between *In Production* (with playful quotes) and *Published Gallery* states
  - **Multi-Channel Sharing**: One-click sharing for WhatsApp, Messenger, Email, Direct Link, and downloadable printable Keepsake Tickets

### 2. Guest Experience (Public `/invite/:slug`)
- **Zero Login Required**: Fast, mobile-first web app accessible immediately via link or QR code.
- **Royal Wax-Seal Opening Reveal**: Interactive envelope opening animation accompanied by celebration confetti and a harmonic celebration chime (synthesized with Web Audio API).
- **Interactive Event Timeline**: Clear chronological breakdown of wedding rituals and feasts.
- **Instant Google Maps Venue Directions**: One-tap direct navigation to the wedding hall and parking gate.
- **Interactive RSVP**: Guests can confirm attendance, specify party size, and leave warm wishes.
- **Calendar Integration**: One-click "Add to Google Calendar" and downloadable `.ics` files for Apple Calendar and Outlook.

### 3. Wedding Photo QR System (Public `/photos/:slug`)
- **State A — Photos Available**:
  - Curated wedding photo gallery with category filters (*Ceremony, Portraits, Reception, Candid*)
  - High-resolution Lightbox viewer
  - Direct connection to cloud storage (Google Drive / Supabase Storage)
- **State B — Photos Not Available (In Production)**:
  - Whimsical, lighthearted wedding-themed messaging (e.g. *"The photographer is still negotiating with the camera. Please check back soon!"*)
  - "Notify Me" email signup form for instant guest notifications upon release

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Typography**: Google Fonts (*Cinzel, Cormorant Garamond, Alex Brush, Playfair Display, Plus Jakarta Sans, Outfit*)
- **Animations & Effects**: Canvas Confetti, Web Audio API harmonic chime synthesis
- **Utilities**: QRCode generator, Google Calendar URL generator, iCal (`.ics`) generator
- **Architecture**: Decoupled asynchronous Service Layer (`services/` and `types/`) designed for plug-and-play **Supabase** database integration

---

## 📁 Project Architecture

```text
src/
├── types/
│   ├── invitation.ts        # TypeScript interfaces for invitations and themes
│   ├── schedule.ts          # Timeline event interfaces
│   ├── guest.ts             # Guest & RSVP status models
│   └── photo.ts             # Wedding gallery & photo access configuration
├── services/
│   ├── invitationService.ts # Asynchronous CRUD operations (prepared for Supabase)
│   ├── scheduleService.ts   # Event timeline service
│   ├── guestService.ts      # RSVP tracking & guest management service
│   └── photoService.ts      # Photo gallery & status availability service
├── config/
│   └── themes.ts            # Theme presets, design variables & quotes
├── utils/
│   ├── calendar.ts          # Google Calendar link & .ics export
│   ├── formatting.ts        # Date formatting & live wedding countdown
│   ├── qrcode.ts            # Dynamic high-res QR code PNG generator
│   └── themeStyles.ts       # Design token to CSS utility mapper
├── features/
│   ├── customization/       # ThemeCustomizer
│   ├── schedule/            # ScheduleManager
│   ├── guests/              # GuestManager
│   ├── photos/              # PhotoManager
│   └── invitation/          # ShareManager
├── pages/
│   ├── LandingPage.tsx
│   ├── CreateInvitationPage.tsx
│   ├── DashboardPage.tsx
│   ├── GuestInvitePage.tsx
│   ├── PublicPhotosPage.tsx
│   └── PreviewPage.tsx
└── components/
    ├── common/Navbar.tsx
    ├── common/InvitationCard.tsx
    ├── common/RsvpModal.tsx
    └── common/DecorativeOrnaments.tsx
```

---

## 🚀 Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Asif-Ali-Dewan/DAWAT.git
   cd DAWAT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Landing Page: `http://localhost:5173/`
   - Inviter Dashboard: `http://localhost:5173/#/dashboard`
   - Live Guest Invitation Demo: `http://localhost:5173/#/invite/ayesha-arif`
   - Public Wedding Photos: `http://localhost:5173/#/photos/ayesha-arif`

---

## 📄 License

MIT &copy; 2026 [Asif-Ali-Dewan](https://github.com/Asif-Ali-Dewan)
