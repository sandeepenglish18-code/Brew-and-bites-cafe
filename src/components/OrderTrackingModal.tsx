import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle, ChefHat, Bike, AlertCircle, MessageCircle, RefreshCw, Printer } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { CafeStore } from '../services/store';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  onPrintReceipt: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
  onPrintReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [searchError, setSearchError] = useState('');

  const loadOrder = (query: string) => {
    setSearchError('');
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setSearchError('Please enter your Order ID (e.g. BB-1001) or mobile number.');
      return;
    }

    const orders = CafeStore.getOrders();
    const cleanDigits = clean.replace(/\D/g, '');

    const found = orders.find((o) => {
      const matchOrderId = o.id.toUpperCase() === clean;
      const matchOrderNum = o.orderNumber.toUpperCase() === clean;
      const orderPhoneDigits = o.customerPhone.replace(/\D/g, '').slice(-10);
      const matchPhone = cleanDigits.length >= 10 && (orderPhoneDigits === cleanDigits.slice(-10));
      return matchOrderId || matchOrderNum || matchPhone;
    });

    if (found) {
      setSelectedOrder(found);
      setSearchError('');
    } else {
      setSearchError('No order found matching this Order ID or Phone number. Please check and try again.');
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchQuery(initialOrderId);
      loadOrder(initialOrderId);
    } else {
      // For customer privacy: DO NOT auto-load any order without user entering their own ID
      setSelectedOrder(null);
      setSearchQuery('');
    }
    setSearchError('');
    setShowCancelPrompt(false);
  }, [initialOrderId, isOpen]);

  if (!isOpen) return null;

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !cancelReason.trim()) return;
    CafeStore.cancelOrder(selectedOrder.id, cancelReason.trim());
    setSelectedOrder({
      ...selectedOrder,
      status: 'cancelled',
      cancellationReason: cancelReason.trim(),
    });
    setShowCancelPrompt(false);
    setCancelReason('');
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting-payment':
        return 0;
      case 'confirmed':
        return 1;
      case 'accepted':
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'out-for-delivery':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
      case 'refunded':
        return -1;
      default:
        return 1;
    }
  };

  const stepIndex = selectedOrder ? getStatusStepIndex(selectedOrder.status) : 0;
  const isCancelled = selectedOrder?.status === 'cancelled' || selectedOrder?.status === 'refunded';
  const canCancel = selectedOrder && (selectedOrder.status === 'confirmed' || selectedOrder.status === 'awaiting-payment');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-[#241A15]/15 shadow-2xl flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#241A15]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C07A3A]" />
            <h3 className="text-lg font-serif font-bold text-[#241A15]">Live Order Tracking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#241A15]/60 hover:text-[#241A15] hover:bg-[#241A15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Search box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadOrder(searchQuery);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#241A15]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter your Order ID (e.g. BB-1001) or 10-digit mobile"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-xl border border-[#241A15]/15 focus:outline-none focus:border-[#C07A3A] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#241A15] text-[#FAF7F2] rounded-xl text-xs font-semibold hover:bg-[#382820] transition-colors shadow-xs"
            >
              Track Order
            </button>
          </form>

          {searchError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {selectedOrder ? (
            <div className="space-y-6">
              {/* Back to Search button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(null);
                    setSearchQuery('');
                    setSearchError('');
                  }}
                  className="text-xs text-[#C07A3A] font-semibold hover:underline flex items-center gap-1"
                >
                  ← Track another order
                </button>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● Live tracking active
                </span>
              </div>

              {/* Status Header Card */}
              <div className="p-4 bg-white rounded-xl border border-[#241A15]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#241A15]/50 block">Order Reference</span>
                    <span className="font-mono text-base font-bold text-[#241A15]">
                      {selectedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#241A15]/50 block">Order Placed</span>
                    <span className="text-xs font-mono font-medium text-[#241A15]">
                      {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Progress Status Visualizer */}
                {isCancelled ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Order {selectedOrder.status.toUpperCase()}</span>
                    </div>
                    {selectedOrder.cancellationReason && (
                      <p className="text-[11px] text-red-700">Reason: {selectedOrder.cancellationReason}</p>
                    )}
                    {selectedOrder.refundAmount && (
                      <p className="text-[11px] font-semibold text-emerald-800">
                        Refund of ₹{selectedOrder.refundAmount} initiated to original payment source.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#241A15]/80 mb-2">
                      <span className={stepIndex >= 1 ? 'text-[#C07A3A]' : 'text-stone-400'}>Confirmed</span>
                      <span className={stepIndex >= 2 ? 'text-[#C07A3A]' : 'text-stone-400'}>Preparing</span>
                      <span className={stepIndex >= 3 ? 'text-[#C07A3A]' : 'text-stone-400'}>
                        {selectedOrder.type === 'delivery' ? 'On The Way' : 'Ready'}
                      </span>
                      <span className={stepIndex >= 4 ? 'text-emerald-700' : 'text-stone-400'}>Completed</span>
                    </div>

                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#C07A3A] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, stepIndex * 25 + 10))}%` }}
                      />
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#241A15]/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {stepIndex === 1 && <CheckCircle className="w-4 h-4 text-[#C07A3A]" />}
                        {stepIndex === 2 && <ChefHat className="w-4 h-4 text-[#C07A3A] animate-bounce" />}
                        {stepIndex === 3 && <Bike className="w-4 h-4 text-[#C07A3A]" />}
                        {stepIndex === 4 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        <span className="font-semibold text-[#241A15] capitalize">
                          Current Status: {selectedOrder.status.replace('-', ' ')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#241A15]/60 font-mono">
                        {selectedOrder.type.toUpperCase()}
                        {selectedOrder.tableNumber ? ` • ${selectedOrder.tableNumber}` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

                {/* Items Breakdown */}
              <div className="bg-white p-4 rounded-xl border border-[#241A15]/10 space-y-2 text-xs">
                <h4 className="font-semibold text-[#241A15] border-b border-[#241A15]/10 pb-1.5">
                  Ordered Items
                </h4>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between py-0.5">
                      <div>
                        <span className="font-medium text-[#241A15]">
                          {it.quantity}x {it.name}
                        </span>
                        {it.selectedVariant && (
                          <span className="text-[10px] text-[#241A15]/60 block">
                            Size: {it.selectedVariant.name}
                          </span>
                        )}
                        {it.specialInstructions && (
                          <span className="text-[10px] text-amber-900 block italic">
                            Note: {it.specialInstructions}
                          </span>
                        )}
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-[#241A15]">
                        ₹{it.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#241A15]/10 flex justify-between font-bold text-sm text-[#241A15]">
                  <span>Total Amount Paid / Due</span>
                  <span className="font-mono tabular-nums text-emerald-800">
                    ₹{selectedOrder.grandTotal}
                  </span>
                </div>
                <div className="text-[11px] text-[#241A15]/60 flex justify-between">
                  <span>Payment: {selectedOrder.paymentMethod.toUpperCase()}</span>
                  <span className="font-semibold text-emerald-700 capitalize">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onPrintReceipt(selectedOrder)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#241A15]/15 text-[#241A15] text-xs font-semibold rounded-xl hover:bg-[#241A15]/5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View &amp; Print Receipt</span>
                </button>

                <button
                  onClick={() => loadOrder(selectedOrder.orderNumber)}
                  className="px-3.5 py-2.5 bg-white border border-[#241A15]/15 text-[#241A15] text-xs rounded-xl hover:bg-[#241A15]/5"
                  title="Refresh order status"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {canCancel && !showCancelPrompt && (
                  <button
                    onClick={() => setShowCancelPrompt(true)}
                    className="px-3.5 py-2.5 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              {/* Cancel confirmation form */}
              {showCancelPrompt && (
                <form onSubmit={handleCancel} className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs">
                  <label className="block font-semibold text-red-900">
                    Reason for cancelling order:
                  </label>
                  <input
                    type="text"
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Changed mind, ordered by mistake"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-red-300 text-xs focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-3 py-1 rounded bg-stone-200 text-[#241A15] text-[11px]"
                    >
                      Keep Order
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded bg-red-700 text-white font-semibold text-[11px]"
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#C07A3A]/10 border border-[#C07A3A]/25 flex items-center justify-center text-[#C07A3A]">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="font-serif font-bold text-base text-[#241A15]">
                  Track Your Coffee &amp; Food Order
                </h4>
                <p className="text-xs text-[#241A15]/70 leading-relaxed">
                  Enter the <strong>Order ID</strong> from your order confirmation (e.g. <span className="font-mono font-semibold text-[#C07A3A]">BB-1001</span>) or your registered <strong>10-digit mobile number</strong> above to track real-time kitchen preparation and delivery.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241A15]/5 border border-[#241A15]/10 text-[11px] text-[#241A15]/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Customer Privacy Protected: Orders are only shown to their respective owners</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
