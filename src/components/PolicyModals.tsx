import React from 'react';
import { X, Shield } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'refund' | null;

interface PolicyModalsProps {
  policy: PolicyType;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalsProps> = ({ policy, onClose }) => {
  if (!policy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto border border-[#241A15]/15 shadow-2xl flex flex-col my-auto">
        <div className="p-5 border-b border-[#241A15]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#C07A3A]" />
            <h3 className="text-lg font-serif font-bold text-[#241A15]">
              {policy === 'privacy' && 'Privacy Policy'}
              {policy === 'terms' && 'Terms & Conditions'}
              {policy === 'refund' && 'Refund & Cancellation Policy'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#241A15]/60 hover:text-[#241A15] hover:bg-[#241A15]/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-xs md:text-sm text-[#241A15]/80 space-y-4 leading-relaxed overflow-y-auto">
          {policy === 'privacy' && (
            <>
              <p>
                <strong>Brew &amp; Bites Café</strong> respects your personal privacy. We collect only essential contact information—specifically your name, mobile phone number, delivery address (for home deliveries), and optional email—to fulfill food orders and table reservations.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">Data Protection</h4>
              <p>
                We do not sell, rent, or lease customer data to third-party marketing entities. Your payment credentials (UPI PINs, card numbers, passwords) are processed through secure, encrypted gateways and are never stored on our servers.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">Marketing Communications</h4>
              <p>
                You will only receive promotional communications if you have explicitly opted in. You may withdraw marketing consent at any time by contacting us directly.
              </p>
            </>
          )}

          {policy === 'terms' && (
            <>
              <p>
                By placing an order or reserving a table at Brew &amp; Bites Café (Alwar, Rajasthan), you agree to these operational terms:
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">1. Menu &amp; Pricing</h4>
              <p>
                All prices are stated in Indian Rupees (₹ INR) and include applicable taxes (GST) unless indicated otherwise. Dishes are freshly prepared; items remain subject to seasonal availability.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">2. Table Reservations</h4>
              <p>
                Table bookings are held for a maximum grace period of 15 minutes past the reserved arrival time before being released to walk-in patrons.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">3. Delivery Coverage</h4>
              <p>
                Home deliveries are executed within a verified 5 km radius of Apna Ghar Shalimar, Alwar. Delivery times may vary during peak rush hours or severe weather conditions.
              </p>
            </>
          )}

          {policy === 'refund' && (
            <>
              <p>
                Brew &amp; Bites Café is dedicated to total guest satisfaction. Our refund and cancellation guidelines are structured as follows:
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">Order Cancellations</h4>
              <p>
                Online orders may be cancelled with a 100% full refund before food preparation commences in the kitchen. Once the kitchen accepts and begins cooking your order, cancellations cannot be processed.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">Quality &amp; Missing Items</h4>
              <p>
                In the rare event that an order arrives damaged, incorrect, or with missing items, please notify our team within 30 minutes of delivery with your order code. An immediate replacement or full refund will be issued.
              </p>
              <h4 className="font-semibold text-[#241A15] text-sm pt-2">Refund Processing</h4>
              <p>
                Approved digital refunds (UPI or card) are credited back to the original funding account within 2 to 5 business days, in compliance with banking standards.
              </p>
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#241A15]/10 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#241A15] text-[#FAF7F2] rounded-xl text-xs font-semibold hover:bg-[#382820]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
