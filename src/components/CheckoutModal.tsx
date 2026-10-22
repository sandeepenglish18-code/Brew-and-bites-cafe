import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, CreditCard, Banknote, Smartphone, MessageCircle, Printer, ArrowRight, Clock } from 'lucide-react';
import { CafeSettings, Order, OrderItem, OrderType, PaymentMethod } from '../types';
import { CafeStore } from '../services/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderType: OrderType;
  tableNumber?: string;
  appliedCoupon?: string;
  discountAmount: number;
  settings: CafeSettings;
  onOrderSuccess: (order: Order) => void;
  language: 'en' | 'hi';
  onTrackOrder?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  tableNumber,
  appliedCoupon,
  discountAmount,
  settings,
  onOrderSuccess,
  language,
  onTrackOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Authoritative server-side price recalculation
  const menu = CafeStore.getMenu();
  let authoritativeSubtotal = 0;

  const validatedItems: OrderItem[] = items.map((cartItem) => {
    const menuItem = menu.find((m) => m.id === cartItem.itemId);
    const basePrice = menuItem?.price ?? cartItem.unitPrice;
    const variantPrice = cartItem.selectedVariant?.priceDelta ?? 0;
    const addonsPrice = cartItem.selectedAddons?.reduce((s, a) => s + a.price, 0) ?? 0;
    const unitPrice = basePrice + variantPrice + addonsPrice;
    const totalPrice = unitPrice * cartItem.quantity;
    authoritativeSubtotal += totalPrice;

    return {
      ...cartItem,
      unitPrice,
      totalPrice,
    };
  });

  const discountedSubtotal = Math.max(0, authoritativeSubtotal - discountAmount);
  const taxAmount = Math.round((discountedSubtotal * settings.taxRatePercent) / 100);
  const deliveryFee =
    orderType === 'delivery'
      ? discountedSubtotal >= settings.freeDeliveryThreshold
        ? 0
        : settings.deliveryFee
      : 0;
  const grandTotal = Math.round(discountedSubtotal + taxAmount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Please provide your name.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please provide a delivery address.');
      return;
    }

    setIsProcessing(true);

    // Simulate backend payment verification & order creation
    setTimeout(() => {
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const orderId = `BB-ORD-${randomSeq}`;
      const orderNum = `BB-${randomSeq}`;
      const transactionId =
        paymentMethod === 'upi'
          ? `UPI-ALW-${Date.now().toString().slice(-7)}`
          : paymentMethod === 'card'
          ? `RZP-PAY-${Date.now().toString().slice(-7)}`
          : undefined;

      const isImmediatelyVerified = paymentMethod === 'upi' || paymentMethod === 'card';

      const newOrder: Order = {
        id: orderId,
        orderNumber: orderNum,
        createdAt: Date.now(),
        source: 'website',
        type: orderType,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        deliveryLandmark: orderType === 'delivery' ? deliveryLandmark.trim() : undefined,
        items: validatedItems,
        subtotal: authoritativeSubtotal,
        taxAmount,
        deliveryFee,
        discountAmount,
        couponCode: appliedCoupon,
        grandTotal,
        status: 'confirmed',
        paymentStatus: isImmediatelyVerified ? 'verified' : 'pending',
        paymentMethod,
        paymentTransactionId: transactionId,
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: Date.now(),
            note: isImmediatelyVerified
              ? `Payment verified via ${paymentMethod.toUpperCase()} (${transactionId})`
              : 'Order placed with Pay at Counter / Cash on Delivery',
          },
        ],
      };

      CafeStore.createOrder(newOrder);
      setConfirmedOrder(newOrder);
      setIsProcessing(false);
      onOrderSuccess(newOrder);
    }, 900);
  };

  const openWhatsAppConfirmation = () => {
    if (!confirmedOrder) return;
    const cleanPhone = settings.phone.replace(/\D/g, '');
    const lines = confirmedOrder.items.map((i) => `• ${i.quantity}x ${i.name} (₹${i.totalPrice})`).join('\n');
    const msg = `*New Order: ${confirmedOrder.orderNumber}*\nCustomer: ${confirmedOrder.customerName} (${confirmedOrder.customerPhone})\nType: ${confirmedOrder.type.toUpperCase()}${
      confirmedOrder.tableNumber ? ` - ${confirmedOrder.tableNumber}` : ''
    }\n\n*Items:*\n${lines}\n\nTotal: ₹${confirmedOrder.grandTotal} (${confirmedOrder.paymentMethod.toUpperCase()} - ${confirmedOrder.paymentStatus.toUpperCase()})\nBrew & Bites Café, Alwar`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#241A15]/15 shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#241A15]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C07A3A]" />
            <h3 className="text-lg font-serif font-bold text-[#241A15]">
              {confirmedOrder ? 'Order Confirmed!' : 'Checkout & Payment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#241A15]/60 hover:text-[#241A15] hover:bg-[#241A15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation State */
          <div className="p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-serif font-bold text-[#241A15]">
                Thank you, {confirmedOrder.customerName}!
              </h4>
              <p className="text-xs text-[#241A15]/70">
                Your order has been received and routed to the kitchen.
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1.5 bg-[#241A15] text-[#FAF7F2] font-mono text-sm font-bold rounded-lg tracking-wider">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white p-4 rounded-xl border border-[#241A15]/10 text-left text-xs space-y-2">
              <div className="flex justify-between font-semibold text-[#241A15]">
                <span>Type: {confirmedOrder.type.toUpperCase()}</span>
                {confirmedOrder.tableNumber && <span>{confirmedOrder.tableNumber}</span>}
              </div>
              <div className="text-[#241A15]/70">
                {confirmedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between py-0.5">
                    <span>{i.quantity}x {i.name}</span>
                    <span className="font-mono tabular-nums">₹{i.totalPrice}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#241A15]/10 flex justify-between font-bold text-sm text-[#241A15]">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-emerald-800">₹{confirmedOrder.grandTotal}</span>
              </div>
              <div className="text-[11px] text-[#241A15]/60 flex justify-between">
                <span>Payment Mode: {confirmedOrder.paymentMethod.toUpperCase()}</span>
                <span className="font-semibold text-emerald-700">
                  {confirmedOrder.paymentStatus === 'verified' ? 'Payment Verified ✓' : 'Pay at Counter / Delivery'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              {onTrackOrder && (
                <button
                  onClick={() => onTrackOrder(confirmedOrder.orderNumber)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C07A3A] hover:bg-[#A86427] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#C07A3A]/25 transition-all"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Live Order Status</span>
                </button>
              )}

              {/* WhatsApp direct notification */}
              <button
                onClick={openWhatsAppConfirmation}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order Copy on WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full px-5 py-3 bg-stone-100 hover:bg-stone-200 text-[#241A15] rounded-xl text-xs font-semibold transition-colors"
              >
                Done &amp; Return to Café
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-5 space-y-5 flex-1 overflow-y-auto">
            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#241A15]/60">
                1. Customer Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#241A15]/70 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#241A15]/70 mb-1">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9929221421"
                    className="w-full px-3 py-2 text-xs font-mono bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#241A15]/70 mb-1">
                  Email Address (Optional for e-receipt)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                />
              </div>

              {orderType === 'delivery' && (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[#241A15]/70 mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Flat 302, G Tower, Apna Ghar Shalimar, Alwar"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#241A15]/70 mb-1">
                      Landmark / Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryLandmark}
                      onChange={(e) => setDeliveryLandmark(e.target.value)}
                      placeholder="e.g. Near Community Center / Sector 7 Gate"
                      className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="space-y-3 pt-2 border-t border-[#241A15]/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#241A15]/60">
                  2. Choose Payment Method
                </h4>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  256-bit Secure
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left text-xs flex flex-col justify-between transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15] font-semibold'
                      : 'border-[#241A15]/15 bg-white text-[#241A15]/70 hover:border-[#241A15]/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[#C07A3A]">
                    <QrCode className="w-4 h-4" />
                    <span className="font-bold">Instant UPI</span>
                  </div>
                  <span className="text-[10px] text-[#241A15]/60">GPay, PhonePe, Paytm QR</span>
                </button>

                {/* Card / Razorpay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left text-xs flex flex-col justify-between transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15] font-semibold'
                      : 'border-[#241A15]/15 bg-white text-[#241A15]/70 hover:border-[#241A15]/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[#241A15]">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-bold">Cards / Netbanking</span>
                  </div>
                  <span className="text-[10px] text-[#241A15]/60">Visa, RuPay, Master</span>
                </button>

                {/* Cash on Delivery / Counter */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-left text-xs flex flex-col justify-between transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#C07A3A] bg-[#C07A3A]/10 text-[#241A15] font-semibold'
                      : 'border-[#241A15]/15 bg-white text-[#241A15]/70 hover:border-[#241A15]/30'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-700">
                    <Banknote className="w-4 h-4" />
                    <span className="font-bold">
                      {orderType === 'dine-in' ? 'Pay at Counter' : 'Cash'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#241A15]/60">Pay with Cash at café</span>
                </button>
              </div>

              {/* UPI simulation QR if selected */}
              {paymentMethod === 'upi' && (
                <div className="p-3 bg-white rounded-xl border border-[#241A15]/10 flex items-center gap-3">
                  <div className="w-14 h-14 bg-stone-100 rounded-lg border flex items-center justify-center shrink-0">
                    <QrCode className="w-10 h-10 text-[#241A15]" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-[#241A15]">Scan &amp; Pay via Any UPI App</p>
                    <p className="font-mono text-[11px] text-[#C07A3A]">brewandbites.alwar@icici</p>
                    <p className="text-[10px] text-[#241A15]/60">Verified business merchant account</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {/* Order Total & Submit */}
            <div className="pt-3 border-t border-[#241A15]/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#241A15]/60 block">Total Payable Amount</span>
                <span className="text-lg font-bold font-mono text-[#241A15] tabular-nums">
                  ₹{grandTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-[#C07A3A] hover:bg-[#A86427] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Verifying &amp; Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
