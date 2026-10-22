import React, { useState } from 'react';
import { ShoppingBag, Search, Coffee, Utensils, Shield, Languages, LayoutDashboard } from 'lucide-react';
import { CafeSettings } from '../types';

interface NavbarProps {
  settings: CafeSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenStaffPortal: () => void;
  onOpenAdmin: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenStaffPortal,
  onOpenAdmin,
  language,
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#241A15]/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark Brand Title (Protected against pushing controls off screen) */}
        <a href="#" className="flex items-center gap-2 group min-w-0 shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#241A15] text-[#FAF7F2] flex items-center justify-center shadow-sm group-hover:bg-[#C07A3A] transition-colors shrink-0">
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF7F2]" />
          </div>
          <span className="text-base sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-[#241A15] truncate">
            {settings.cafeName}
          </span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#241A15]/80">
          <a href="#menu" className="hover:text-[#C07A3A] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Our Menu' : 'हमारा मेन्यू'}
          </a>
          <a href="#reservations" className="hover:text-[#C07A3A] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Book a Table' : 'टेबल बुक करें'}
          </a>
          <a href="#about" className="hover:text-[#C07A3A] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Our Story' : 'हमारी कहानी'}
          </a>
          <a href="#location" className="hover:text-[#C07A3A] transition-colors whitespace-nowrap">
            {language === 'en' ? 'Directions' : 'स्थान व संपर्क'}
          </a>
        </nav>

        {/* Zone 3: Actions Group (Engineered to NEVER overflow or hide the Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language toggle (Visible on tablet & desktop) */}
          <button
            onClick={onToggleLanguage}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#241A15]/70 hover:text-[#241A15] rounded-lg hover:bg-[#241A15]/5 transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-[#C07A3A]" />
            <span className="uppercase font-semibold">{language}</span>
          </button>

          {/* Track Order button (Visible on sm+) */}
          <button
            onClick={onOpenTracking}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#241A15] rounded-lg hover:bg-[#241A15]/5 transition-colors whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-[#C07A3A]" />
            <span>{language === 'en' ? 'Track' : 'ट्रैक'}</span>
          </button>

          {/* Direct Admin Portal Button (Desktop & Tablet) */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-[#241A15]/15 rounded-lg transition-colors whitespace-nowrap"
            title="Open Admin Operations Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#C07A3A]" />
            <span>{language === 'en' ? 'Admin' : 'एडमिन'}</span>
          </button>

          {/* Staff Portal (POS / KDS) Launcher (Large desktop) */}
          <button
            onClick={onOpenStaffPortal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#241A15] border border-[#241A15]/20 rounded-lg hover:bg-[#241A15]/5 transition-colors whitespace-nowrap"
            title="Staff Login, POS Station & Kitchen Display"
          >
            <Shield className="w-3.5 h-3.5 text-[#C07A3A]" />
            <span>{language === 'en' ? 'Staff POS' : 'स्टाफ़'}</span>
          </button>

          {/* CRITICAL: Primary Shopping Cart Button - Always guaranteed visible on all viewports */}
          <button
            onClick={onOpenCart}
            id="mobile-nav-cart-btn"
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all whitespace-nowrap active:scale-95 shrink-0"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="font-bold">{language === 'en' ? 'Cart' : 'कार्ट'}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#241A15] text-[#FAF7F2] text-[11px] font-mono font-bold flex items-center justify-center tabular-nums shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#241A15]/80 hover:text-[#241A15] rounded-xl hover:bg-[#241A15]/5 border border-stone-200/60"
            aria-label="Toggle Navigation Menu"
          >
            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A15]" />
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-t border-[#241A15]/10 px-4 pt-3 pb-5 space-y-3 animate-fade-in shadow-xl">
          {/* Quick Access Mobile Buttons */}
          <div className="space-y-2">
            {/* 1. Mobile Cart Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>{language === 'en' ? 'Open Shopping Cart' : 'शॉपिंग कार्ट खोलें'}</span>
              </div>
              <span className="bg-[#241A15] text-[#FAF7F2] px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </button>

            {/* 2. Mobile Admin Dashboard Button (Direct 1-tap open!) */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between p-3 bg-[#160E0A] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all border border-[#C07A3A]/40"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-[#E29547]" />
                <div className="text-left">
                  <span className="block font-bold leading-tight">
                    {language === 'en' ? 'Admin Dashboard' : 'एडमिन डैशबोर्ड'}
                  </span>
                  <span className="block text-[10px] text-stone-400">
                    {language === 'en' ? 'Sales, Menu, Bookings & Settings' : 'बिक्री, मेन्यू व सेटिंग्स'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#E29547] bg-[#C07A3A]/20 px-2 py-0.5 rounded-md border border-[#C07A3A]/30">
                Open →
              </span>
            </button>

            {/* 3. Staff Hub & POS Station */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStaffPortal();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Staff Hub (POS Billing & KDS)' : 'स्टाफ़ हब (POS व किचिन)'}</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                Staff PIN
              </span>
            </button>

            {/* 4. Track Order */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Track Order Status' : 'ऑर्डर स्थिति जांचें'}</span>
              </div>
            </button>

            {/* 5. Language Switcher */}
            <button
              onClick={() => {
                onToggleLanguage();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Switch Language (हिंदी / English)' : 'भाषा बदलें (English / हिंदी)'}</span>
              </div>
              <span className="text-[11px] font-bold uppercase bg-white px-2 py-0.5 rounded border border-stone-200">
                {language}
              </span>
            </button>
          </div>

          {/* Standard Navigation Links */}
          <div className="pt-2 border-t border-[#241A15]/10 space-y-1">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#C07A3A]"
            >
              {language === 'en' ? '• Browse Digital Menu' : '• डिजिटल मेन्यू देखें'}
            </a>
            <a
              href="#reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#C07A3A]"
            >
              {language === 'en' ? '• Table Reservations' : '• टेबल बुकिंग'}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#C07A3A]"
            >
              {language === 'en' ? '• Our Story & Ambience' : '• हमारी कहानी'}
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-xs font-medium text-[#241A15]/80 hover:text-[#C07A3A]"
            >
              {language === 'en' ? '• Location & Contact' : '• स्थान व संपर्क'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
