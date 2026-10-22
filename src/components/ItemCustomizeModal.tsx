import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Addon, MenuItem, Variant } from '../types';

interface ItemCustomizeModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, variant?: Variant, addons?: Addon[], instructions?: string) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(item.variants?.[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const toggleAddon = (addon: Addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const basePrice = item.price ?? 0;
  const variantDelta = selectedVariant?.priceDelta ?? 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitTotal = basePrice + variantDelta + addonsTotal;
  const grandTotal = unitTotal * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#241A15]/15 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#241A15]/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center rounded-[2px] p-[1.5px]">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              </span>
              <h3 className="text-lg font-serif font-bold text-[#241A15]">{item.name}</h3>
            </div>
            <p className="text-xs text-[#241A15]/70 mt-1">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#241A15]/60 hover:text-[#241A15] hover:bg-[#241A15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Variants / Size selection */}
          {item.variants && item.variants.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-2.5">
                Select Size / Portion
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15] font-semibold'
                          : 'border-[#241A15]/15 bg-white text-[#241A15]/80 hover:border-[#241A15]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#C07A3A] bg-[#C07A3A] text-white' : 'border-[#241A15]/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span>{v.name}</span>
                      </div>
                      <span className="tabular-nums font-mono text-[#241A15]/80">
                        {v.priceDelta > 0 ? `+₹${v.priceDelta}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons selection */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-2.5">
                Choice of Add-ons & Extras
              </label>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                        isChecked
                          ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15] font-semibold'
                          : 'border-[#241A15]/15 bg-white text-[#241A15]/80 hover:border-[#241A15]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'border-[#C07A3A] bg-[#C07A3A] text-white' : 'border-[#241A15]/30'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span>{addon.name}</span>
                      </div>
                      <span className="tabular-nums font-mono text-[#241A15]/80">+₹{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking instructions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, well-toasted, extra napkins..."
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#241A15]/20 focus:outline-none focus:border-[#C07A3A]"
              maxLength={150}
            />
          </div>
        </div>

        {/* Footer with Quantity Stepper and Add to Cart */}
        <div className="p-5 border-t border-[#241A15]/10 bg-[#FAF7F2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 border border-[#241A15]/20 bg-white rounded-xl px-2 py-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-lg hover:bg-[#241A15]/5 text-[#241A15]/80 active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-xs font-bold font-mono tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-lg hover:bg-[#241A15]/5 text-[#241A15]/80 active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onAddToCart(item, quantity, selectedVariant, selectedAddons, instructions.trim() || undefined);
              onClose();
            }}
            className="flex-1 flex items-center justify-between px-5 py-3 bg-[#241A15] hover:bg-[#382820] text-[#FAF7F2] rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-md"
          >
            <span>Add Item</span>
            <span className="tabular-nums font-mono font-bold">₹{grandTotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
