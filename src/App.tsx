import React, { useState, useEffect } from 'react';
import { Invitation } from './types/invitation';
import { invitationService } from './services/invitationService';
import { HomelyCardGeneratorPage } from './pages/HomelyCardGeneratorPage';
import { GuestInvitePage } from './pages/GuestInvitePage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Read from window.location.hash or pathname
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    const pathname = window.location.pathname;
    return pathname === '/' ? '/' : pathname;
  });

  const [activeInvitation, setActiveInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize primary invitation data
  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      try {
        const invitations = await invitationService.getAllInvitations();
        const primary = invitations[0];
        if (!isMounted) return;
        setActiveInvitation(primary);
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
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-3 border-[#350010] border-t-transparent animate-spin mx-auto" />
          <p className="font-heading font-semibold text-stone-700 text-sm tracking-wider">
            দাওয়াত কার্ড স্টুডিও লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Pure focused routing: NO NAVBAR, NO HAMBURGER MENU, NO DASHBOARD, NO BOOTH
  // 1. Guest Invitation Public Route: /invite/:slug
  if (currentPath.startsWith('/invite/')) {
    const slug = currentPath.replace('/invite/', '') || activeInvitation.slug;
    return <GuestInvitePage slug={slug} onNavigate={navigate} />;
  }

  // 2. Default Home Route: Homely Greeting & Invitation Card Generator
  return (
    <HomelyCardGeneratorPage
      onNavigate={navigate}
      initialInvitation={activeInvitation}
    />
  );
}

export default App;
