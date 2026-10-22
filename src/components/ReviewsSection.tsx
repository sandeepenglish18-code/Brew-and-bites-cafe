import React from 'react';
import { Star } from 'lucide-react';

interface ReviewsSectionProps {
  language: 'en' | 'hi';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ language }) => {
  const reviews = [
    {
      name: 'Amit Sharma',
      role: 'Alwar Resident',
      comment:
        'The artisanal cappuccino and tandoori momos are truly unmatched in Alwar. Peaceful, aesthetically pleasing ambience to relax with friends or get work done.',
      dish: 'Artisanal Cappuccino & Tandoori Momos',
      rating: 5,
    },
    {
      name: 'Neha Khandelwal',
      role: 'Regular Guest',
      comment:
        'Finally a proper modern café in Apna Ghar Shalimar. The thin-crust Paneer Pizza and Chilli Garlic Noodles were bursting with fresh flavor. Prompt and polite staff.',
      dish: 'Paneer Pizza & Chilli Garlic Noodles',
      rating: 5,
    },
    {
      name: 'Rajesh Rathore',
      role: 'Coffee Enthusiast',
      comment:
        'The cold coffee with vanilla ice cream and Double Tikki Burger are top-tier. Booking a table through the website was completely seamless.',
      dish: 'Cold Coffee with Ice Cream',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-t border-[#241A15]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-[#C07A3A] font-semibold mb-2">
            {language === 'en' ? 'Verified Guests' : 'अतिथि समीक्षाएं'}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#241A15] tracking-tight">
            {language === 'en' ? 'Loved by Alwar' : 'अलवर वासियों का पसंदीदा'}
          </h2>
          <p className="text-sm text-[#241A15]/70 mt-2">
            {language === 'en'
              ? 'Real words from guests who share our passion for good coffee and fresh comfort food.'
              : 'हमारे मेहमानों के वास्तविक अनुभव और विचार।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#241A15]/10 p-6 flex flex-col justify-between shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C07A3A]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-[#241A15]/80 leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#241A15]/10 flex items-center justify-between text-xs">
                <div>
                  <strong className="block font-semibold text-[#241A15]">{rev.name}</strong>
                  <span className="text-[11px] text-[#241A15]/50">{rev.role}</span>
                </div>
                <span className="text-[11px] text-[#C07A3A] font-medium">{rev.dish}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
