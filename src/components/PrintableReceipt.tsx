import React from 'react';
import { X, Printer } from 'lucide-react';
import { CafeSettings, Order } from '../types';

interface PrintableReceiptProps {
  order: Order | null;
  settings: CafeSettings;
  onClose: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ order, settings, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-stone-200 shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Modal Controls Bar */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-700">Thermal Bill Preview (80mm)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#241A15] text-white rounded-lg text-xs font-semibold hover:bg-[#382820]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Container (Targeted by @media print) */}
        <div id="printable-receipt" className="p-6 font-mono text-xs text-stone-900 bg-white space-y-4">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-stone-300 pb-3">
            <h2 className="text-base font-bold font-serif uppercase tracking-wider text-stone-900">
              {settings.cafeName}
            </h2>
            <p className="text-[10px] text-stone-600 leading-tight">
              {settings.address}
            </p>
            <p className="text-[10px] text-stone-600">
              Ph: {settings.phone}
            </p>
            <p className="text-[10px] text-stone-500 pt-1">
              *** TAX INVOICE ***
            </p>
          </div>

          {/* Order Metadata */}
          <div className="text-[11px] space-y-0.5 border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between">
              <span>Order No:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date &amp; Time:</span>
              <span>{new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-bold uppercase">
                {order.type} {order.tableNumber ? `(${order.tableNumber})` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{order.customerName}</span>
            </div>
            {order.customerPhone && (
              <div className="flex justify-between text-[10px] text-stone-600">
                <span>Phone:</span>
                <span>{order.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Line items */}
          <div className="space-y-1.5 border-b border-dashed border-stone-300 pb-3 text-[11px]">
            <div className="flex justify-between font-bold text-[10px] border-b border-stone-200 pb-1">
              <span>ITEM</span>
              <span>QTY x PRICE</span>
              <span>AMOUNT</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className="tabular-nums font-bold">₹{item.totalPrice}</span>
                </div>
                <div className="text-[10px] text-stone-500 flex justify-between">
                  <span>
                    {item.selectedVariant ? `${item.selectedVariant.name}` : ''}
                    {item.selectedAddons && item.selectedAddons.length > 0
                      ? ` + ${item.selectedAddons.map((a) => a.name).join(', ')}`
                      : ''}
                  </span>
                  <span>{item.quantity} x ₹{item.unitPrice}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Calculation */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="tabular-nums">₹{order.subtotal}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Discount ({order.couponCode || 'PROMO'}):</span>
                <span className="tabular-nums">-₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST ({settings.taxRatePercent}%):</span>
              <span className="tabular-nums">₹{order.taxAmount}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="tabular-nums">₹{order.deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
              <span>TOTAL PAYABLE:</span>
              <span className="tabular-nums">₹{order.grandTotal}</span>
            </div>
          </div>

          {/* Payment & Footer */}
          <div className="text-center text-[10px] text-stone-600 space-y-1">
            <p>
              Payment: <strong className="uppercase">{order.paymentMethod}</strong> (Status: <strong className="uppercase">{order.paymentStatus}</strong>)
            </p>
            {order.paymentTransactionId && (
              <p className="text-[9px] text-stone-500">Ref: {order.paymentTransactionId}</p>
            )}
            <p className="pt-2 font-serif text-xs font-bold text-stone-900">
              Thank you for visiting Brew &amp; Bites!
            </p>
            <p className="text-[9px] text-stone-400">
              Please visit us again · Free Wi-Fi at Café
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
