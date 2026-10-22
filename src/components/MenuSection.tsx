import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, SlidersHorizontal, Clock, Flame, Sparkles } from 'lucide-react';
import { Addon, MenuItem, Variant } from '../types';
import { ItemCustomizeModal } from './ItemCustomizeModal';

interface MenuSectionProps {
  menu: MenuItem[];
  cart: Record<string, number>;
  onAddToCart: (item: MenuItem, quantity: number, variant?: Variant, addons?: Addon[], instructions?: string) => void;
  onUpdateCartItemQty: (itemId: string, delta: number) => void;
  language: 'en' | 'hi';
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menu,
  cart,
  onAddToCart,
  onUpdateCartItemQty,
  language,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBestsellers, setFilterBestsellers] = useState<boolean>(false);
  const [filterSpicy, setFilterSpicy] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    menu.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [menu]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return menu.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (filterBestsellers && !item.isBestseller) return false;
      if (filterSpicy && !item.isSpicy) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [menu, selectedCategory, filterBestsellers, filterSpicy, searchQuery]);

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FAF7F2] border-t border-[#241A15]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-[#C07A3A] font-semibold mb-2">
            {language === 'en' ? 'Crafted with Passion' : 'स्वाद और सुकून का संगम'}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#241A15] tracking-tight">
            {language === 'en' ? 'Our Handcrafted Menu' : 'हमारा मेन्यू'}
          </h2>
          <p className="text-sm text-[#241A15]/70 mt-2">
            {language === 'en'
              ? 'From freshly ground espresso and hand-stretched pizzas to sizzling momos and wok noodles.'
              : 'ताज़ा पीसी हुई कॉफ़ी, पिज्जा, बर्गर, मोमोज और नूडल्स। सभी व्यंजन ताज़ा सामग्री से तैयार।'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#241A15]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search dishes, drinks, pizzas...' : 'व्यंजन, कॉफ़ी या पिज्जा खोजें...'}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A] shadow-sm transition-colors"
              />
            </div>

            {/* Quick dietary toggles */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterBestsellers(!filterBestsellers)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  filterBestsellers
                    ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15]'
                    : 'border-[#241A15]/15 bg-white text-[#241A15]/70 hover:border-[#241A15]/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C07A3A]" />
                <span>{language === 'en' ? 'Bestsellers' : 'बेस्टसेलर'}</span>
              </button>

              <button
                onClick={() => setFilterSpicy(!filterSpicy)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  filterSpicy
                    ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15]'
                    : 'border-[#241A15]/15 bg-white text-[#241A15]/70 hover:border-[#241A15]/30'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{language === 'en' ? 'Spicy' : 'तीखा'}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs (Segmented Button Controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#241A15]/10">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#241A15] text-[#FAF7F2] shadow-sm'
                      : 'text-[#241A15]/70 hover:text-[#241A15] hover:bg-[#241A15]/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#241A15]/10 p-8">
            <p className="text-sm font-medium text-[#241A15]/80">
              {language === 'en'
                ? 'No menu items match your search or filter.'
                : 'आपकी खोज के अनुसार कोई व्यंजन नहीं मिला।'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFilterBestsellers(false);
                setFilterSpicy(false);
              }}
              className="mt-3 text-xs text-[#C07A3A] font-semibold hover:underline"
            >
              {language === 'en' ? 'Reset filters' : 'फ़िल्टर हटाएं'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const inCartQty = cart[item.id] || 0;
              const hasCustomizations = (item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0);
              const isUnverifiedPrice = item.price == null;
              const canOrder = item.isAvailable && !isUnverifiedPrice;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between bg-white rounded-2xl border border-[#241A15]/10 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    !item.isAvailable ? 'opacity-70 bg-stone-50' : ''
                  }`}
                >
                  {/* Top content - Pure typographic café presentation without photos */}
                  <div className="space-y-2">
                    {/* Category & Veg indicator header */}
                    <div className="flex items-center justify-between text-xs text-[#241A15]/60 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center rounded-[2px] p-[1.5px] shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C07A3A]">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isBestseller && (
                          <span className="text-[11px] text-[#C07A3A] font-semibold">
                            ★ Bestseller
                          </span>
                        )}
                        {item.prepTimeMinutes && (
                          <div className="flex items-center gap-1 font-mono text-[11px] text-[#241A15]/50">
                            <Clock className="w-3 h-3" />
                            <span>{item.prepTimeMinutes}m</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title and description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#241A15] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#241A15]/70 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Price & Add to Cart row */}
                  <div className="pt-4 mt-2 border-t border-[#241A15]/10 flex items-center justify-between gap-3">
                    {/* Price display */}
                    <div>
                      {isUnverifiedPrice ? (
                        <div className="text-xs text-amber-800 font-medium italic">
                          Price coming soon
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold font-mono text-[#241A15] tabular-nums">
                            ₹{item.price}
                          </span>
                          {hasCustomizations && (
                            <span className="text-[10px] text-[#241A15]/60 font-sans">onwards</span>
                          )}
                        </div>
                      )}

                      {!item.isAvailable && (
                        <div className="text-[11px] text-red-600 font-medium">Currently Sold Out</div>
                      )}
                    </div>

                    {/* Action button */}
                    <div>
                      {!canOrder ? (
                        <button
                          disabled
                          className="px-3.5 py-1.5 text-xs text-[#241A15]/40 bg-stone-100 rounded-xl cursor-not-allowed font-medium"
                        >
                          Unavailable
                        </button>
                      ) : hasCustomizations ? (
                        <button
                          onClick={() => setCustomizingItem(item)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#241A15] hover:bg-[#382820] text-[#FAF7F2] rounded-xl text-xs font-semibold shadow-xs transition-colors active:scale-95"
                        >
                          <span>{inCartQty > 0 ? `Customized (${inCartQty})` : 'Customize'}</span>
                          <SlidersHorizontal className="w-3 h-3 text-[#C07A3A]" />
                        </button>
                      ) : inCartQty > 0 ? (
                        <div className="flex items-center gap-1.5 border border-[#241A15]/20 bg-white rounded-xl p-1 shadow-xs">
                          <button
                            onClick={() => onUpdateCartItemQty(item.id, -1)}
                            className="w-6 h-6 rounded-lg hover:bg-[#241A15]/5 flex items-center justify-center text-[#241A15]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono tabular-nums">
                            {inCartQty}
                          </span>
                          <button
                            onClick={() => onUpdateCartItemQty(item.id, 1)}
                            className="w-6 h-6 rounded-lg hover:bg-[#241A15]/5 flex items-center justify-center text-[#241A15]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item, 1)}
                          className="flex items-center gap-1 px-4 py-2 bg-[#241A15] hover:bg-[#382820] text-[#FAF7F2] rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Customization Modal */}
      {customizingItem && (
        <ItemCustomizeModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
};
