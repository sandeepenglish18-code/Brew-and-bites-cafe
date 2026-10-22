import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';
import { CafeSettings } from '../types';
import { PolicyType } from './PolicyModals';

interface FooterProps {
  settings: CafeSettings;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenStaffPortal: () => void;
  onOpenAdmin: () => void;
  language: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPolicy,
  onOpenStaffPortal,
  onOpenAdmin,
  language,
}) => {
  return (
    <footer className="bg-[#241A15] text-[#FAF7F2] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C07A3A] text-white flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-[#FAF7F2]">
                {settings.cafeName}
              </span>
            </div>
            <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
              {settings.tagline}. Handcrafted specialty coffee, gourmet woodfired pizzas, and fresh café bites in Alwar, Rajasthan.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[#C07A3A] hover:bg-[#a86427] rounded-lg transition-colors shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={onOpenStaffPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[#FAF7F2]/80 hover:text-white bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
              >
                <span>Staff &amp; POS Hub</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C07A3A]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/75">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Digital Menu & Online Ordering' : 'मेन्यू व ऑनलाइन ऑर्डर'}
                </a>
              </li>
              <li>
                <a href="#reservations" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Table Reservations' : 'टेबल बुकिंग'}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Our Ambience & Gallery' : 'कैफे माहौल व गैलरी'}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Location & Directions' : 'स्थान व दिशा-निर्देश'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C07A3A]">
              Operating Hours
            </h4>
            <div className="space-y-2 text-xs text-[#FAF7F2]/75">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C07A3A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#FAF7F2]">Daily Hours</p>
                  <p>{settings.hours}</p>
                </div>
              </div>
              <p className="text-[11px] text-[#FAF7F2]/50 pt-1">
                Kitchen closes 30 minutes before closing time.
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C07A3A]">
              Contact &amp; Location
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF7F2]/75">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C07A3A] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C07A3A] shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </div>
              {settings.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C07A3A] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar with legal policy triggers */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© {new Date().getFullYear()} {settings.cafeName}, Alwar, Rajasthan. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenPolicy('refund')}
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
