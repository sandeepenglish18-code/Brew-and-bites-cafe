import React from 'react';
import { MapPin, Phone, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { CafeSettings } from '../types';
import heroImg from '../assets/images/hero_cafe_ambience_1792622741979.jpg';

interface HeroProps {
  settings: CafeSettings;
  language: 'en' | 'hi';
}

export const Hero: React.FC<HeroProps> = ({ settings, language }) => {
  return (
    <div className="relative bg-[#241A15] text-[#FAF7F2] overflow-hidden">
      {/* Optional Top Announcement Banner */}
      {settings.banner && (
        <div className="bg-[#C07A3A] text-white px-4 py-2 text-center text-xs md:text-sm font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{settings.banner}</span>
          </div>
        </div>
      )}

      {/* Hero Visual Container */}
      <div className="relative min-h-[580px] lg:min-h-[660px] flex items-center">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Brew & Bites Café interior in Alwar with warm wood, ambient lighting, and artisanal coffee"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241A15] via-[#241A15]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#241A15]/90 via-[#241A15]/40 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl space-y-6">
            {/* Location context line */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#FAF7F2]/80">
              <MapPin className="w-4 h-4 text-[#C07A3A] shrink-0" />
              <span>{settings.address}</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#FAF7F2] leading-[1.12] [text-wrap:balance]">
              {language === 'en'
                ? 'Artisanal Coffee, Gourmet Comfort & Fresh Bites'
                : 'ताज़ी कॉफ़ी, लज़ीज़ बाइट्स और सुकून भरा माहौल'}
            </h1>

            {/* Sub-headline / Brand narrative */}
            <p className="text-base sm:text-lg text-[#FAF7F2]/80 font-normal leading-relaxed max-w-xl">
              {language === 'en'
                ? 'Welcome to Brew & Bites Alwar. Handcrafted woodfired pizzas, gourmet burgers, sizzling momos, wok noodles, and specialty single-origin espresso in a warm, welcoming ambience.'
                : 'अलवर के दिल में ब्रू एंड बाइट्स कैफे में आपका स्वागत है। बेहतरीन हैंडक्राफ्टेड पिज्जा, बर्गर, मोमोज, नूडल्स और खास एस्प्रेसो कॉफी का आनंद लें।'}
            </p>

            {/* Prominent Action Buttons Grid */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Primary 1: Order Online */}
              <a
                href="#menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C07A3A] hover:bg-[#A86427] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#C07A3A]/25 transition-all transform active:scale-95 whitespace-nowrap"
              >
                <span>{language === 'en' ? 'Order Online' : 'ऑनलाइन ऑर्डर करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Primary 2: Reserve a Table */}
              <a
                href="#reservations"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#FAF7F2] border border-white/20 text-sm font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Reserve a Table' : 'टेबल बुक करें'}</span>
              </a>

              {/* Action 3: Get Directions */}
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-[#FAF7F2]/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Get Directions' : 'दिशा-निर्देश देखें'}</span>
              </a>

              {/* Action 4: Call the Café */}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-medium text-[#FAF7F2]/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#C07A3A]" />
                <span>{settings.phone}</span>
              </a>
            </div>

            {/* Operating Hours & Verified Notice */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#FAF7F2]/60 border-t border-white/10">
              <span>{language === 'en' ? 'Hours' : 'समय'}: <strong className="text-[#FAF7F2]/90 font-medium">{settings.hours}</strong></span>
              <span>•</span>
              <span>Dine-In • Takeaway • Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
