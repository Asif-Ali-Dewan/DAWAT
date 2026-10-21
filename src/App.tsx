import React, { useState, useEffect } from 'react';
import { Invitation } from './types/invitation';
import { ScheduleItem } from './types/schedule';
import { Guest } from './types/guest';
import { WeddingPhoto } from './types/photo';
import { invitationService } from './services/invitationService';
import { scheduleService } from './services/scheduleService';
import { guestService } from './services/guestService';
import { photoService } from './services/photoService';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CreateInvitationPage } from './pages/CreateInvitationPage';
import { DashboardPage } from './pages/DashboardPage';
import { GuestInvitePage } from './pages/GuestInvitePage';
import { PublicPhotosPage } from './pages/PublicPhotosPage';
import { PreviewPage } from './pages/PreviewPage';
import { Sparkles, Heart } from 'lucide-react';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Read from window.location.hash or pathname
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    const pathname = window.location.pathname;
    return pathname === '/' ? '/' : pathname;
  });

  const [activeInvitation, setActiveInvitation] = useState<Invitation | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [photos, setPhotos] = useState<WeddingPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data from services
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      try {
        const invitations = await invitationService.getAllInvitations();
        const primary = invitations[0];
        if (!isMounted) return;

        setActiveInvitation(primary);

        if (primary) {
          const [sch, gst, pht] = await Promise.all([
            scheduleService.getScheduleByInvitationId(primary.id),
            guestService.getGuestsByInvitationId(primary.id),
            photoService.getPhotosByInvitationId(primary.id),
          ]);
          if (!isMounted) return;
          setSchedule(sch);
          setGuests(gst);
          setPhotos(pht);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync route on popstate or hashchange
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !activeInvitation) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <p className="font-heading font-semibold text-stone-700 text-sm tracking-wider">
            Loading Dawat Wedding Suite...
          </p>
        </div>
      </div>
    );
  }

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Guest Invitation Public Route: /invite/:slug
    if (currentPath.startsWith('/invite/')) {
      const slug = currentPath.replace('/invite/', '') || activeInvitation.slug;
      return <GuestInvitePage slug={slug} onNavigate={navigate} />;
    }

    // 2. Public Photos Route: /photos/:slug
    if (currentPath.startsWith('/photos/')) {
      const slug = currentPath.replace('/photos/', '') || activeInvitation.slug;
      return <PublicPhotosPage slug={slug} onNavigate={navigate} />;
    }

    // 3. Fullscreen Device Preview Route: /preview/:slug
    if (currentPath.startsWith('/preview/')) {
      const slug = currentPath.replace('/preview/', '') || activeInvitation.slug;
      return <PreviewPage slug={slug} onNavigate={navigate} />;
    }

    // 4. Create Invitation Wizard: /create
    if (currentPath === '/create') {
      return (
        <CreateInvitationPage
          onNavigate={navigate}
          onInvitationCreated={(newInv) => {
            setActiveInvitation(newInv);
            navigate('/dashboard');
          }}
        />
      );
    }

    // 5. Inviter Dashboard: /dashboard and subroutes
    if (currentPath.startsWith('/dashboard')) {
      return (
        <DashboardPage
          invitation={activeInvitation}
          schedule={schedule}
          guests={guests}
          photos={photos}
          onNavigate={navigate}
          onInvitationUpdated={setActiveInvitation}
          onScheduleUpdated={setSchedule}
          onGuestsUpdated={setGuests}
          onPhotosUpdated={setPhotos}
        />
      );
    }

    // 6. Default Landing Page: /
    return <LandingPage onNavigate={navigate} activeSlug={activeInvitation.slug} />;
  };

  // Determine if Navbar & Footer should be displayed (Hide on public guest invitation or preview for clean immersive presentation)
  const isImmersiveGuestView =
    currentPath.startsWith('/invite/') ||
    currentPath.startsWith('/photos/') ||
    currentPath.startsWith('/preview/');

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      {!isImmersiveGuestView && (
        <Navbar
          currentPath={currentPath}
          onNavigate={navigate}
          activeSlug={activeInvitation.slug}
        />
      )}

      <main className="flex-1">{renderCurrentView()}</main>

      {!isImmersiveGuestView && (
        <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-white tracking-wider text-base">
                  DAWAT
                </span>
                <span className="block text-[10px] text-stone-500 uppercase tracking-widest">
                  Modern Wedding Invitation Platform
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-stone-400">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="hover:text-white transition"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="hover:text-white transition"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="hover:text-white transition"
              >
                Create Invitation
              </button>
              <button
                type="button"
                onClick={() => navigate(`/invite/${activeInvitation.slug}`)}
                className="text-amber-400 hover:text-amber-300 transition font-semibold"
              >
                Guest View Demo
              </button>
            </div>

            <p className="text-xs text-stone-500">
              &copy; 2026 Dawat. Crafted for timeless celebrations.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
