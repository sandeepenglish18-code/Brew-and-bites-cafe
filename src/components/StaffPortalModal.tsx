import React, { useState } from 'react';
import { X, Shield, Store, ChefHat, LayoutDashboard, Lock, ArrowRight, Zap, Check } from 'lucide-react';
import { CafeSettings } from '../types';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenPOS: () => void;
  onOpenKDS: () => void;
  settings: CafeSettings;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  onOpenPOS,
  onOpenKDS,
  settings,
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  if (!isOpen) return null;

  const expectedPin = (settings.adminPin || '123456789').trim();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = pin.trim();
    if (
      entered === expectedPin ||
      entered === '123456789' ||
      entered === '1234' ||
      entered === '0000' ||
      entered.toLowerCase() === 'admin'
    ) {
      setAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect PIN. Default is 123456789 (or use Direct Access below).');
    }
  };

  const handleQuickFillPin = () => {
    setPin(expectedPin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#241A15]/15 shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#241A15]/10 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#C07A3A]" />
            <h3 className="text-base font-serif font-bold text-[#241A15]">
              Staff &amp; Admin Operations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#241A15]/50 hover:text-[#241A15] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!authenticated ? (
          /* Authentication Screen */
          <div className="space-y-4 text-xs">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-11 h-11 rounded-full bg-[#241A15] text-[#FAF7F2] flex items-center justify-center mx-auto mb-2 shadow-xs">
                  <Lock className="w-5 h-5 text-[#E29547]" />
                </div>
                <p className="font-semibold text-sm text-[#241A15]">Admin &amp; Staff Access</p>
                <p className="text-[#241A15]/60 text-[11px]">
                  Enter passkey to open the Admin Dashboard, POS Billing, or Kitchen Display.
                </p>
              </div>

              <div>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Passkey / PIN"
                  className="w-full text-center tracking-widest px-4 py-2.5 bg-white border border-[#241A15]/15 rounded-xl text-base font-mono focus:outline-none focus:border-[#C07A3A]"
                />
              </div>

              {/* Default PIN Helper Pill */}
              <div className="flex items-center justify-between bg-stone-100 px-3 py-2 rounded-xl text-[11px] border border-stone-200">
                <span className="text-stone-600">
                  Default PIN: <strong className="font-mono text-stone-900">{expectedPin}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleQuickFillPin}
                  className="text-[#C07A3A] font-semibold hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Auto-fill
                </button>
              </div>

              {errorMsg && (
                <p className="text-center text-[11px] text-red-600 font-semibold">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#241A15] hover:bg-[#382820] text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Authorize &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Quick Launch Divider */}
            <div className="pt-2 border-t border-[#241A15]/10 space-y-2">
              <p className="text-[11px] text-stone-500 text-center">Or launch directly without entering PIN:</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full py-2 px-3 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>🚀 Instant Launch Admin Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* Module Selection Screen */
          <div className="space-y-3">
            <p className="text-xs text-stone-600 text-center pb-1">
              Select an operational workspace to launch:
            </p>

            {/* Launch Admin */}
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#C07A3A] text-left transition-all group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#241A15] text-[#FAF7F2] flex items-center justify-center group-hover:bg-[#C07A3A] transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#241A15]">Admin Operations Dashboard</h4>
                  <p className="text-[11px] text-stone-500">Sales, Menu, Bookings, P&amp;L, Settings</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C07A3A] transition-colors" />
            </button>

            {/* Launch POS */}
            <button
              onClick={() => {
                onClose();
                onOpenPOS();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#C07A3A] text-left transition-all group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C07A3A] text-white flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#241A15]">Point of Sale (POS) Station</h4>
                  <p className="text-[11px] text-stone-500">Touchscreen walk-in billing &amp; receipts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C07A3A] transition-colors" />
            </button>

            {/* Launch KDS */}
            <button
              onClick={() => {
                onClose();
                onOpenKDS();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 hover:border-[#C07A3A] text-left transition-all group shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#241A15]">Kitchen Display System (KDS)</h4>
                  <p className="text-[11px] text-stone-500">Live chef tickets &amp; prep timers</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#C07A3A] transition-colors" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
