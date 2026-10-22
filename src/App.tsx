/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CafeSettings, MenuItem, Order, OrderItem, OrderType, Variant, Addon } from './types';
import { CafeStore, playChime, safeStorage } from './services/store';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ReservationSection } from './components/ReservationSection';
import { AboutAndVisitSection } from './components/AboutAndVisitSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { StaffPortalModal } from './components/StaffPortalModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PosSystem } from './components/pos/PosSystem';
import { KitchenDisplay } from './components/kds/KitchenDisplay';
import { PolicyModals, PolicyType } from './components/PolicyModals';
import { PrintableReceipt } from './components/PrintableReceipt';

export default function App() {
  const [settings, setSettings] = useState<CafeSettings>(() => CafeStore.getSettings());
  const [menu, setMenu] = useState<MenuItem[]>(() => CafeStore.getMenu());
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Cart state persisted to safeStorage
  const [cartItems, setCartItems] = useState<OrderItem[]>(() => {
    try {
      const saved = safeStorage.getItem('bb_cart_items_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal / Surface management
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutParams, setCheckoutParams] = useState<{
    orderType: OrderType;
    tableNumber?: string;
    appliedCoupon?: string;
    discountAmount: number;
  }>({
    orderType: 'dine-in',
    discountAmount: 0,
  });

  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  const [isStaffPortalOpen, setIsStaffPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isKDSOpen, setIsKDSOpen] = useState(false);

  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Sync cart to safeStorage whenever it changes
  useEffect(() => {
    safeStorage.setItem('bb_cart_items_v2', JSON.stringify(cartItems));
  }, [cartItems]);

  // Reactive listener for store modifications
  useEffect(() => {
    const handleStoreChange = () => {
      setSettings(CafeStore.getSettings());
      setMenu(CafeStore.getMenu());
    };

    window.addEventListener('brew-bites-state-change', handleStoreChange);
    return () => window.removeEventListener('brew-bites-state-change', handleStoreChange);
  }, []);

  // Simple item-ID to quantity map for menu card steppers
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((ci) => {
      map[ci.itemId] = (map[ci.itemId] || 0) + ci.quantity;
    });
    return map;
  }, [cartItems]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Add Item to Cart
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    variant?: Variant,
    addons?: Addon[],
    instructions?: string
  ) => {
    const basePrice = item.price ?? 0;
    const variantDelta = variant?.priceDelta ?? 0;
    const addonsTotal = addons?.reduce((s, a) => s + a.price, 0) ?? 0;
    const unitPrice = basePrice + variantDelta + addonsTotal;
    const totalPrice = unitPrice * quantity;

    // Check if an identical customized item already exists in cart
    const existingIndex = cartItems.findIndex(
      (ci) =>
        ci.itemId === item.id &&
        ci.selectedVariant?.id === variant?.id &&
        JSON.stringify(ci.selectedAddons?.map((a) => a.id).sort()) ===
          JSON.stringify(addons?.map((a) => a.id).sort()) &&
        (ci.specialInstructions || '') === (instructions || '')
    );

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          itemId: item.id,
          name: item.name,
          quantity,
          unitPrice,
          selectedVariant: variant,
          selectedAddons: addons,
          specialInstructions: instructions,
          totalPrice,
        },
      ]);
    }

    playChime(880, 0.15);
  };

  // Update item quantity from menu card stepper
  const handleUpdateCartItemQty = (itemId: string, delta: number) => {
    const index = cartItems.findIndex((ci) => ci.itemId === itemId);
    if (index >= 0) {
      const updated = [...cartItems];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
        updated[index].totalPrice = newQty * updated[index].unitPrice;
      }
      setCartItems(updated);
    }
  };

  // Update quantity directly in cart drawer
  const handleDrawerUpdateQty = (index: number, delta: number) => {
    const updated = [...cartItems];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
      updated[index].totalPrice = newQty * updated[index].unitPrice;
    }
    setCartItems(updated);
  };

  const handleDrawerRemoveItem = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const handleProceedToCheckout = (
    orderType: OrderType,
    tableNumber?: string,
    appliedCoupon?: string,
    discountAmount = 0
  ) => {
    setCheckoutParams({
      orderType,
      tableNumber,
      appliedCoupon,
      discountAmount,
    });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    // Clear shopping cart on successful placement
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#241A15] flex flex-col font-sans">
      {/* 1. Header Navigation Bar */}
      <Navbar
        settings={settings}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingOrderId(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
        onOpenAdmin={() => {
          setIsStaffPortalOpen(false);
          setIsAdminOpen(true);
        }}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      />

      {/* 2. Cinematic Hero Section */}
      <main className="flex-1">
        <Hero settings={settings} language={language} />

        {/* 3. Handcrafted Menu Section */}
        <MenuSection
          menu={menu}
          cart={cartQuantities}
          onAddToCart={handleAddToCart}
          onUpdateCartItemQty={handleUpdateCartItemQty}
          language={language}
        />

        {/* 4. Table Reservation Section */}
        <ReservationSection settings={settings} language={language} />

        {/* 5. Craftsmanship Story, Gallery & Verified Location */}
        <AboutAndVisitSection settings={settings} language={language} />

        {/* 6. Real Customer Reviews */}
        <ReviewsSection language={language} />
      </main>

      {/* 7. Comprehensive Footer */}
      <Footer
        settings={settings}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenStaffPortal={() => setIsStaffPortalOpen(true)}
        onOpenAdmin={() => {
          setIsStaffPortalOpen(false);
          setIsAdminOpen(true);
        }}
        language={language}
      />

      {/* Floating Bottom Cart Bar for Mobile Convenience */}
      {totalCartCount > 0 && !isCartOpen && !isCheckoutOpen && !isAdminOpen && !isPOSOpen && !isKDSOpen && (
        <div className="fixed bottom-4 left-3 right-3 sm:hidden z-40 max-w-md mx-auto animate-fade-in pointer-events-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#241A15] text-[#FAF7F2] rounded-2xl shadow-2xl hover:bg-[#382820] active:scale-98 transition-all border border-[#C07A3A]/40"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#C07A3A] text-white text-xs font-bold flex items-center justify-center font-mono shadow-xs">
                {totalCartCount}
              </span>
              <span className="text-xs font-semibold text-white">
                {language === 'en' ? 'View Cart' : 'कार्ट देखें'} ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-[#FAF7F2] tabular-nums">
                ₹{cartItems.reduce((s, i) => s + i.totalPrice, 0)}
              </span>
              <span className="bg-[#C07A3A] text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs">
                {language === 'en' ? 'Proceed →' : 'आगे बढ़ें →'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleDrawerUpdateQty}
        onRemoveItem={handleDrawerRemoveItem}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={handleProceedToCheckout}
        settings={settings}
        language={language}
      />

      {/* Checkout and Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderType={checkoutParams.orderType}
        tableNumber={checkoutParams.tableNumber}
        appliedCoupon={checkoutParams.appliedCoupon}
        discountAmount={checkoutParams.discountAmount}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
        onTrackOrder={(orderId) => {
          setIsCheckoutOpen(false);
          setTrackingOrderId(orderId);
          setIsTrackingOpen(true);
        }}
        language={language}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingOrderId}
        onPrintReceipt={(order) => setReceiptOrder(order)}
      />

      {/* Staff and Operations Portal Launcher */}
      <StaffPortalModal
        isOpen={isStaffPortalOpen}
        onClose={() => setIsStaffPortalOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPOS={() => setIsPOSOpen(true)}
        onOpenKDS={() => setIsKDSOpen(true)}
        settings={settings}
      />

      {/* Admin Operations Full Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          onExit={() => setIsAdminOpen(false)}
          onLaunchPOS={() => {
            setIsAdminOpen(false);
            setIsPOSOpen(true);
          }}
          onLaunchKDS={() => {
            setIsAdminOpen(false);
            setIsKDSOpen(true);
          }}
          onPrintReceipt={(order) => setReceiptOrder(order)}
        />
      )}

      {/* POS Point of Sale System */}
      {isPOSOpen && (
        <PosSystem
          settings={settings}
          onExit={() => setIsPOSOpen(false)}
          onPrintReceipt={(order) => setReceiptOrder(order)}
        />
      )}

      {/* Kitchen Display System (KDS) */}
      {isKDSOpen && <KitchenDisplay onExit={() => setIsKDSOpen(false)} />}

      {/* Legal & Policy Modals */}
      <PolicyModals policy={activePolicy} onClose={() => setActivePolicy(null)} />

      {/* Printable Receipt Viewer */}
      <PrintableReceipt
        order={receiptOrder}
        settings={settings}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
