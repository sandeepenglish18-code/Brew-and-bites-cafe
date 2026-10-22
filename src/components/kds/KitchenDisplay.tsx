import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { CafeStore, playChime } from '../../services/store';

interface KitchenDisplayProps {
  onExit: () => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ onExit }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync orders with store
  const refreshOrders = () => {
    const all = CafeStore.getOrders();
    // Kitchen is concerned with active orders: confirmed, accepted, preparing, ready
    const active = all.filter(
      (o) =>
        o.status === 'confirmed' ||
        o.status === 'accepted' ||
        o.status === 'preparing' ||
        o.status === 'ready'
    );
    setOrders(active);
  };

  useEffect(() => {
    refreshOrders();

    const handleUpdate = () => {
      refreshOrders();
    };

    window.addEventListener('brew-bites-state-change', handleUpdate);
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // 10s tick

    return () => {
      window.removeEventListener('brew-bites-state-change', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Update order status
  const advanceOrderStatus = (order: Order, nextStatus: OrderStatus) => {
    CafeStore.updateOrderStatus(order.id, nextStatus);
    if (soundEnabled) {
      playChime(nextStatus === 'ready' ? 1040 : 880, 0.25);
    }
    refreshOrders();
  };

  // Group orders into columns
  const newOrders = orders.filter((o) => o.status === 'confirmed');
  const preparingOrders = orders.filter((o) => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  // Elapsed timer helper
  const getElapsedMinutes = (timestamp: number) => {
    return Math.floor((currentTime - timestamp) / 60000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C130D] text-[#FAF7F2] flex flex-col font-sans select-none overflow-hidden">
      {/* KDS Header Bar */}
      <div className="h-16 bg-[#2B1D14] px-6 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit KDS</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C07A3A] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold font-serif text-white tracking-wide">
                Brew &amp; Bites Kitchen Display (KDS)
              </h1>
              <p className="text-[10px] text-white/50">Live Cook Tickets · Real-time Station</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-white/70">
            <span>New: <strong className="text-amber-400 font-bold">{newOrders.length}</strong></span>
            <span>Cooking: <strong className="text-blue-400 font-bold">{preparingOrders.length}</strong></span>
            <span>Ready: <strong className="text-emerald-400 font-bold">{readyOrders.length}</strong></span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80"
            title={soundEnabled ? 'Mute Alert Chimes' : 'Unmute Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C07A3A]" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>

          <button
            onClick={refreshOrders}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80"
            title="Refresh Tickets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Ticket Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden bg-[#180F0A]">
        {/* Column 1: New Tickets */}
        <div className="flex flex-col bg-[#241A15] rounded-2xl border border-amber-900/40 overflow-hidden">
          <div className="p-3 bg-amber-950/40 border-b border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                1. New Incoming Orders ({newOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-amber-300 font-mono">Action: Accept</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {newOrders.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-xs">
                No new incoming tickets.
              </div>
            ) : (
              newOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="bg-[#2D1E16] rounded-xl border border-amber-500/30 p-3.5 space-y-3 shadow-md"
                  >
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="font-mono text-base font-bold text-white tracking-wide">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-[#C07A3A] font-semibold block uppercase">
                          {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-mono text-xs text-amber-300 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{elapsed}m ago</span>
                        </div>
                        <span className="text-[10px] text-white/40 block">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                        </span>
                      </div>
                    </div>

                    {/* Ticket Items */}
                    <div className="space-y-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-baseline justify-between text-white font-medium">
                            <span>
                              <strong className="text-amber-400 text-sm font-bold mr-1">
                                {item.quantity}x
                              </strong>
                              {item.name}
                            </span>
                          </div>
                          {item.selectedVariant && (
                            <span className="text-[11px] text-[#C07A3A] block">
                              • Size: {item.selectedVariant.name}
                            </span>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <span className="text-[11px] text-emerald-400 block">
                              • Add: {item.selectedAddons.map((a) => a.name).join(', ')}
                            </span>
                          )}
                          {item.specialInstructions && (
                            <span className="text-[11px] bg-red-950/60 text-red-300 border border-red-800/50 px-2 py-0.5 rounded block font-medium">
                              ⚠️ Note: {item.specialInstructions}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Advance Action */}
                    <button
                      onClick={() => advanceOrderStatus(order, 'preparing')}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Accept &amp; Start Preparing</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Preparing Orders */}
        <div className="flex flex-col bg-[#241A15] rounded-2xl border border-blue-900/40 overflow-hidden">
          <div className="p-3 bg-blue-950/40 border-b border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                2. In Preparation ({preparingOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-blue-300 font-mono">Action: Mark Ready</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-xs">
                No orders currently in the kitchen.
              </div>
            ) : (
              preparingOrders.map((order) => {
                const elapsed = getElapsedMinutes(order.createdAt);
                const isDelayed = elapsed >= 15;

                return (
                  <div
                    key={order.id}
                    className={`bg-[#2D1E16] rounded-xl border p-3.5 space-y-3 shadow-md ${
                      isDelayed ? 'border-red-500/80 bg-red-950/20' : 'border-blue-500/30'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="font-mono text-base font-bold text-white tracking-wide">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] text-blue-300 font-semibold block uppercase">
                          {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center gap-1 font-mono text-xs font-bold ${
                            isDelayed ? 'text-red-400 animate-pulse' : 'text-blue-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{elapsed}m cooking</span>
                        </div>
                        {isDelayed && (
                          <span className="text-[10px] text-red-400 font-bold block">
                            Delayed (&gt;15m)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex items-baseline justify-between text-white font-medium">
                            <span>
                              <strong className="text-blue-400 text-sm font-bold mr-1">
                                {item.quantity}x
                              </strong>
                              {item.name}
                            </span>
                          </div>
                          {item.selectedVariant && (
                            <span className="text-[11px] text-[#C07A3A] block">
                              • Size: {item.selectedVariant.name}
                            </span>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <span className="text-[11px] text-emerald-400 block">
                              • Add: {item.selectedAddons.map((a) => a.name).join(', ')}
                            </span>
                          )}
                          {item.specialInstructions && (
                            <span className="text-[11px] bg-red-950/60 text-red-300 border border-red-800/50 px-2 py-0.5 rounded block font-medium">
                              ⚠️ Note: {item.specialInstructions}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Ready Action */}
                    <button
                      onClick={() => advanceOrderStatus(order, 'ready')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark All Items Ready</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Ready to Serve / Pickup */}
        <div className="flex flex-col bg-[#241A15] rounded-2xl border border-emerald-900/40 overflow-hidden">
          <div className="p-3 bg-emerald-950/40 border-b border-emerald-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                3. Ready to Serve ({readyOrders.length})
              </h2>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono">Action: Complete</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {readyOrders.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-xs">
                No tickets waiting to be served.
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#2D1E16] rounded-xl border border-emerald-500/40 p-3.5 space-y-3 shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="font-mono text-base font-bold text-white tracking-wide">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold block uppercase">
                        {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono block">
                        READY TO SERVE
                      </span>
                      <span className="text-[10px] text-white/50 block">
                        Customer: {order.customerName}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-white/80 space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Complete / Clear Action */}
                  <button
                    onClick={() => advanceOrderStatus(order, 'completed')}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dispatched / Served (Complete)</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
