import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Bike } from 'lucide-react';
import { CafeSettings } from '../types';

import heroAmbienceImg from '../assets/images/hero_cafe_ambience_1792622741979.jpg';
import latteArtImg from '../assets/images/coffee_latte_art_1792622741926.jpg';
import pizzaBurgerImg from '../assets/images/artisan_pizza_burger_1792622742953.jpg';
import momosNoodlesImg from '../assets/images/steamed_momos_noodles_1792622742556.jpg';

interface AboutAndVisitSectionProps {
  settings: CafeSettings;
  language: 'en' | 'hi';
}

export const AboutAndVisitSection: React.FC<AboutAndVisitSectionProps> = ({ settings, language }) => {
  return (
    <div id="about" className="bg-[#FAF7F2] border-t border-[#241A15]/10">
      {/* 1. Craftsmanship & Ambience Gallery Showcase */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story prose */}
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-widest text-[#C07A3A] font-semibold">
              {language === 'en' ? 'The Brew & Bites Story' : 'हमारी कहानी'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#241A15] tracking-tight leading-tight">
              {language === 'en'
                ? 'A Haven for Coffee Aficionados & Food Enthusiasts in Alwar'
                : 'अलवर में बेहतरीन कॉफ़ी और स्वादिष्ट व्यंजनों का नया ठिकाना'}
            </h2>
            <p className="text-sm md:text-base text-[#241A15]/80 leading-relaxed">
              {language === 'en'
                ? 'Born out of a deep reverence for authentic roast profiles and honest culinary craftsmanship, Brew & Bites Café bridges the gap between sophisticated metropolitan coffee culture and the soulful warmth of Rajasthan. Every cup is brewed using precision specialty espresso beans, paired with slow-fermented pizzas, handcrafted gourmet burgers, and aromatic Indo-Chinese wok specialities.'
                : 'ब्रू एंड बाइट्स कैफे अलवर में उन सभी के लिए एक सुकून भरी जगह है जो अच्छी कॉफी, ताज़े बने पिज्जा, क्रिस्पी बर्गर और लज़ीज़ स्नैक्स के शौकीन हैं। यहां का शांत वातावरण दोस्तों और परिवार के साथ समय बिताने के लिए बेहतरीन है।'}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#241A15]/10">
              <div>
                <span className="block font-serif text-2xl font-bold text-[#241A15]">100%</span>
                <span className="text-xs text-[#241A15]/60">Pure Arabica &amp; Robusta Specialty Blend</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-[#241A15]">Fresh</span>
                <span className="text-xs text-[#241A15]/60">Daily Hand-Tossed Dough &amp; Farm Dairy</span>
              </div>
            </div>
          </div>

          {/* 4-Image Bento Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={latteArtImg}
                  alt="Specialty latte with tulip latte art"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={steamedMomosImgFallback}
                  alt="Steamed momos in bamboo steamer and wok noodles"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-6">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={pizzaBurgerImg}
                  alt="Artisanal woodfired pizza and gourmet burger"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={heroAmbienceImg}
                  alt="Brew and Bites cafe warm interior seating"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Location, Directions & Contact Section */}
      <section id="location" className="py-16 md:py-24 bg-white border-t border-[#241A15]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-[#C07A3A] font-semibold mb-2">
              {language === 'en' ? 'Find Us in Alwar' : 'हमारा पता'}
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#241A15] tracking-tight">
              {language === 'en' ? 'Visit Brew & Bites Café' : 'कैफे का पता व दिशा-निर्देश'}
            </h2>
            <p className="text-sm text-[#241A15]/70 mt-2">
              {language === 'en'
                ? 'Conveniently situated at Apna Ghar Shalimar with ample parking and easy access from Company Garden Road.'
                : 'अपना घर शालीमार, कंपनी गार्डन रोड के पास, शांत और खूबसूरत माहौल।'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Information Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl border border-[#241A15]/10 p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#241A15] mb-1">
                  {settings.cafeName}
                </h3>
                <p className="text-xs text-[#241A15]/60">Alwar, Rajasthan, India</p>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-[#241A15]/80">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C07A3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#241A15] font-semibold">Address</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C07A3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#241A15] font-semibold">Phone</strong>
                    <div className="space-y-0.5">
                      <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-[#C07A3A] block">
                        {settings.phone}
                      </a>
                      {settings.alternatePhone && (
                        <a href={`tel:${settings.alternatePhone.replace(/\s+/g, '')}`} className="hover:text-[#C07A3A] block text-xs text-[#241A15]/60">
                          {settings.alternatePhone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                {settings.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#C07A3A] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[#241A15] font-semibold">Email</strong>
                      <a href={`mailto:${settings.email}`} className="hover:text-[#C07A3A]">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C07A3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#241A15] font-semibold">Opening Hours</strong>
                    <span>{settings.hours}</span>
                  </div>
                </div>

                {/* Delivery note */}
                <div className="flex items-start gap-3">
                  <Bike className="w-4 h-4 text-[#C07A3A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#241A15] font-semibold">Delivery Coverage</strong>
                    <span className="text-xs text-[#241A15]/70">{settings.deliveryRadiusText}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C07A3A] hover:bg-[#A86427] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#241A15]/15 text-[#241A15] hover:bg-[#241A15]/5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C07A3A]" />
                  <span>Call the Café</span>
                </a>
              </div>
            </div>

            {/* Google Maps Visual Interactive Container (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl border border-[#241A15]/10 overflow-hidden shadow-sm h-[380px] md:h-[450px] relative">
              <iframe
                title="Brew & Bites Café Google Maps Location"
                src="https://maps.google.com/maps?q=G+Tower+Apna+Ghar+Shalimar+Alwar+Rajasthan+301001&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#241A15]/10 text-[11px] font-medium text-[#241A15] shadow-xs">
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C07A3A] flex items-center gap-1"
                >
                  <span>Open in Google Maps App</span>
                  <Navigation className="w-3 h-3 text-[#C07A3A]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const steamedMomosImgFallback = momosNoodlesImg;
