import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Bike, Store, UtensilsCrossed } from 'lucide-react';
import { CafeSettings, OrderItem, OrderType } from '../types';
import { CafeStore } from '../services/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (orderType: OrderType, tableNum?: string, appliedCoupon?: string, discount?: number) => void;
  settings: CafeSettings;
  language: 'en' | 'hi';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  settings,
  language,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Validate coupon
  let discountAmount = 0;
  if (appliedCoupon) {
    const coupons = CafeStore.getCoupons();
    const c = coupons.find((x) => x.code.toUpperCase() === appliedCoupon.toUpperCase() && x.isActive);
    if (c && subtotal >= c.minOrderValue) {
      if (c.type === 'percentage') {
        const rawDisc = (subtotal * c.value) / 100;
        discountAmount = c.maxDiscount ? Math.min(c.maxDiscount, rawDisc) : rawDisc;
      } else {
        discountAmount = c.value;
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((discountedSubtotal * settings.taxRatePercent) / 100);
  const deliveryFee =
    orderType === 'delivery' ? (discountedSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee) : 0;
  const grandTotal = Math.round(discountedSubtotal + taxAmount + deliveryFee);

  const applyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const coupons = CafeStore.getCoupons();
    const c = coupons.find((x) => x.code === code && x.isActive);
    if (!c) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }
    if (subtotal < c.minOrderValue) {
      setCouponError(`Minimum order value of ₹${c.minOrderValue} required for ${code}.`);
      return;
    }
    setAppliedCoupon(code);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#241A15]/10">
          {/* Header */}
          <div className="p-5 border-b border-[#241A15]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-serif font-bold text-[#241A15]">
                {language === 'en' ? 'Your Order' : 'आपका ऑर्डर'}
              </h2>
              <span className="text-xs text-[#241A15]/60 font-mono tabular-nums">
                ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#241A15]/60 hover:text-[#241A15] hover:bg-[#241A15]/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <UtensilsCrossed className="w-12 h-12 text-[#241A15]/20 mx-auto" />
                <p className="text-sm font-medium text-[#241A15]/80">
                  {language === 'en' ? 'Your cart is empty.' : 'आपकी कार्ट खाली है।'}
                </p>
                <p className="text-xs text-[#241A15]/50">
                  {language === 'en'
                    ? 'Explore our menu to add artisanal coffee, gourmet pizza, and bites.'
                    : 'मेन्यू से अपने पसंदीदा व्यंजन चुनें और ऑर्डर करें।'}
                </p>
              </div>
            ) : (
              <>
                {/* Order Type Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#241A15]/60 mb-2">
                    {language === 'en' ? 'Select Dining Option' : 'ऑर्डर प्रकार चुनें'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#241A15]/5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setOrderType('dine-in')}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        orderType === 'dine-in'
                          ? 'bg-white text-[#241A15] shadow-xs'
                          : 'text-[#241A15]/70 hover:text-[#241A15]'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Dine-In</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        orderType === 'takeaway'
                          ? 'bg-white text-[#241A15] shadow-xs'
                          : 'text-[#241A15]/70 hover:text-[#241A15]'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Takeaway</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        orderType === 'delivery'
                          ? 'bg-white text-[#241A15] shadow-xs'
                          : 'text-[#241A15]/70 hover:text-[#241A15]'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                  </div>

                  {/* Context for selected order type */}
                  {orderType === 'dine-in' && (
                    <div className="mt-2.5 flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#241A15]/10">
                      <span className="text-[#241A15]/70 font-medium">Select Café Table:</span>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="bg-transparent font-semibold text-[#241A15] focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                          <option key={num} value={`Table ${num}`}>
                            Table {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <p className="mt-1.5 text-[11px] text-[#C07A3A] font-medium">
                      📍 {settings.deliveryRadiusText}
                    </p>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#241A15]/60 font-semibold uppercase tracking-wider">
                    <span>Items</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-700 hover:text-red-800 text-[11px] normal-case font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-xl border border-[#241A15]/10 flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#241A15]">{item.name}</h4>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-[#241A15]/60 font-medium">
                              Size: {item.selectedVariant.name}
                            </p>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <p className="text-[11px] text-[#241A15]/60 font-medium">
                              Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-[10px] text-amber-900 italic mt-0.5">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                          <div className="mt-1 text-xs font-mono font-bold text-[#241A15] tabular-nums">
                            ₹{item.totalPrice}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 border border-[#241A15]/15 rounded-lg p-0.5 shrink-0">
                          <button
                            onClick={() => onUpdateQty(index, -1)}
                            className="w-5 h-5 flex items-center justify-center text-[#241A15]/80 hover:bg-[#241A15]/5 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-xs font-bold font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(index, 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#241A15]/80 hover:bg-[#241A15]/5 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-[#241A15]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon (e.g. BREW10)"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase font-mono bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                      />
                    </div>
                    <button
                      onClick={applyCoupon}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#241A15] text-[#FAF7F2] rounded-xl hover:bg-[#382820]"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <span>Applied: <strong>{appliedCoupon}</strong> (-₹{discountAmount})</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-[11px] underline text-emerald-900"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs text-[#241A15]/80 pt-3 border-t border-[#241A15]/10">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-mono tabular-nums">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedCoupon})</span>
                      <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST ({settings.taxRatePercent}%)</span>
                    <span className="font-mono tabular-nums">₹{taxAmount}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-mono tabular-nums">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#241A15] pt-2 border-t border-[#241A15]/10">
                    <span>Grand Total</span>
                    <span className="font-mono tabular-nums text-base">₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Proceed Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#241A15]/10 bg-white">
              <button
                onClick={() =>
                  onProceedToCheckout(
                    orderType,
                    orderType === 'dine-in' ? tableNumber : undefined,
                    appliedCoupon || undefined,
                    discountAmount
                  )
                }
                className="w-full flex items-center justify-between px-6 py-3.5 bg-[#C07A3A] hover:bg-[#A86427] text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums">₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
