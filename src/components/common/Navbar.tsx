import React, { useState } from 'react';
import { Sparkles, Heart, Menu, X, LayoutDashboard, PlusCircle, ExternalLink, Camera } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeSlug?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, activeSlug = 'ayesha-arif' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create Invitation', path: '/create', icon: PlusCircle },
    { label: 'Guest Invite Demo', path: `/invite/${activeSlug}`, isExternalGuest: true },
    { label: 'Photo Portal', path: `/photos/${activeSlug}`, icon: Camera },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick('/')}
          className="flex items-center space-x-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-600/30 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="text-left">
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-widest text-stone-900 dark:text-stone-100 flex items-center space-x-1">
              <span>DAWAT</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-stone-400 font-medium -mt-1">
              Digital Wedding Suite
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/dashboard' && currentPath.startsWith('/dashboard'));
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                type="button"
                onClick={() => handleLinkClick(link.path)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800'
                } ${link.isExternalGuest ? 'border border-amber-400/40 bg-amber-50/50 text-amber-900' : ''}`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{link.label}</span>
                {link.isExternalGuest && <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />}
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleLinkClick('/create')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 shadow-sm transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Invitation</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => handleLinkClick(link.path)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.isExternalGuest && <ExternalLink className="w-4 h-4 text-amber-600" />}
            </button>
          ))}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleLinkClick('/create')}
              className="w-full py-2.5 text-center rounded-xl text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow"
            >
              + Create New Invitation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
