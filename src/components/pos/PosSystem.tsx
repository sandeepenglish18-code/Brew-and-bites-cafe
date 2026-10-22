import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, Printer, ArrowLeft, Banknote, CreditCard, QrCode, CheckCircle2, User, Clock, Shield } from 'lucide-react';
import { CafeSettings, MenuItem, Order, OrderItem, PaymentMethod } from '../../types';
import { CafeStore, playChime } from '../../services/store';

interface PosSystemProps {
  settings: CafeSettings;
  onExit: () => void;
  onPrintReceipt: (order: Order) => void;
  cashierName?: string;
}

export const PosSystem: React.FC<PosSystemProps> = ({
  settings,
  onExit,
  onPrintReceipt,
  cashierName = 'Counter Staff',
}) => {
  const menu = CafeStore.getMenu();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POS Order Draft State
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [orderSuccessNotice, setOrderSuccessNotice] = useState<string | null>(null);

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    menu.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ['All', ...Array.from(set)];
  }, [menu]);

  // Filtered menu for POS
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (!item.isAvailable) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Add item to POS ticket
  const addItemToTicket = (item: MenuItem) => {
    const price = item.price ?? 0;
    const existingIdx = cartItems.findIndex((ci) => ci.itemId === item.id);
    if (existingIdx >= 0) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += 1;
      updated[existingIdx].totalPrice = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          itemId: item.id,
          name: item.name,
          quantity: 1,
          unitPrice: price,
          totalPrice: price,
        },
      ]);
    }
  };

  const updateItemQty = (index: number, delta: number) => {
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

  // Calculations
  const subtotal = cartItems.reduce((s, i) => s + i.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((discountedSubtotal * settings.taxRatePercent) / 100);
  const grandTotal = discountedSubtotal + taxAmount;

  const numericTendered = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, numericTendered - grandTotal);

  // Submit and create POS order
  const handleCheckoutPOS = () => {
    if (cartItems.length === 0) return;

    const seq = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BB-ORD-${seq}`;
    const orderNum = `BB-${seq}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      createdAt: Date.now(),
      source: 'pos-walkin',
      type: orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: customerName.trim() || 'Walk-in Guest',
      customerPhone: customerPhone.trim() || 'Counter Sale',
      items: cartItems,
      subtotal,
      taxAmount,
      deliveryFee: 0,
      discountAmount,
      grandTotal,
      status: 'accepted',
      paymentStatus: 'verified',
      paymentMethod,
      paymentTransactionId:
        paymentMethod === 'cash' ? `CASH-REC-${Date.now().toString().slice(-6)}` : `POS-DIG-${Date.now().toString().slice(-6)}`,
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: Date.now(),
          note: `POS Counter Order by ${cashierName}`,
        },
        {
          status: 'accepted',
          timestamp: Date.now(),
          note: 'Sent directly to kitchen display',
        },
      ],
    };

    CafeStore.createOrder(newOrder);
    playChime(980, 0.2);

    // Reset ticket state
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountPercent(0);
    setCashTendered('');
    setOrderSuccessNotice(`Order ${orderNum} Created & Sent to Kitchen!`);

    setTimeout(() => {
      setOrderSuccessNotice(null);
    }, 4000);

    // Auto-prompt receipt
    onPrintReceipt(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col font-sans select-none overflow-hidden">
      {/* Top POS Header */}
      <div className="h-14 bg-[#241A15] text-[#FAF7F2] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit POS</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base tracking-tight text-white">
              {settings.cafeName} · POS
            </span>
            <span className="hidden sm:inline text-xs text-[#FAF7F2]/60">|</span>
            <span className="hidden sm:inline text-xs text-[#C07A3A] font-medium">
              Cashier: {cashierName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {orderSuccessNotice && (
            <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-lg font-semibold animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{orderSuccessNotice}</span>
            </div>
          )}
          <span className="text-[#FAF7F2]/70 font-mono hidden md:inline">
            {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Main Two-Pane Grid: Left Menu / Right Ticket */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane: Search & Menu Tiles (65%) */}
        <div className="flex-1 flex flex-col border-r border-[#241A15]/10 overflow-hidden bg-stone-50">
          {/* Search & Category Tabs */}
          <div className="p-3 bg-white border-b border-[#241A15]/10 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items for quick bill..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 rounded-xl border border-stone-200 focus:outline-none focus:border-[#C07A3A]"
              />
            </div>

            {/* Category horizontal pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#241A15] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Tile Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItemToTicket(item)}
                  className="bg-white p-3 rounded-xl border border-stone-200 hover:border-[#C07A3A] active:scale-95 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-sm h-28"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="font-semibold text-xs text-stone-900 line-clamp-2 leading-tight">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-1">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                    <span className="text-xs font-bold font-mono text-[#C07A3A] tabular-nums">
                      ₹{item.price ?? '—'}
                    </span>
                    <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                      + Add
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Active Ticket & Tender (35%) */}
        <div className="w-full md:w-96 lg:w-[420px] bg-white flex flex-col border-t md:border-t-0 border-[#241A15]/10 shadow-lg shrink-0">
          {/* Ticket Header & Type */}
          <div className="p-3 bg-[#FAF7F2] border-b border-[#241A15]/10 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-700">Active Bill</span>
              <button
                onClick={() => setCartItems([])}
                className="text-red-700 hover:text-red-800 text-[11px] font-medium"
              >
                Clear Ticket
              </button>
            </div>

            {/* Dine-in vs Takeaway toggle */}
            <div className="grid grid-cols-2 gap-1 bg-stone-200/60 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`py-1 rounded-md transition-all ${
                  orderType === 'dine-in' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Dine-In
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`py-1 rounded-md transition-all ${
                  orderType === 'takeaway' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Takeaway
              </button>
            </div>

            {/* Table & Customer Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {orderType === 'dine-in' ? (
                <div>
                  <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">Table</label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full p-1.5 bg-white rounded-lg border border-stone-300 font-semibold text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={`Table ${n}`}>Table {n}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Guest"
                    className="w-full p-1.5 bg-white rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] text-stone-500 font-semibold mb-0.5">Phone (Optional)</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-1.5 bg-white rounded-lg border border-stone-300 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-10 text-stone-400 text-xs space-y-1">
                <p>Ticket is empty.</p>
                <p className="text-[11px]">Tap dishes on the left to add items.</p>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                >
                  <div className="flex-1 pr-2">
                    <span className="font-semibold text-stone-900 block leading-tight">{item.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">₹{item.unitPrice} each</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 border border-stone-300 bg-white rounded-md p-0.5">
                    <button
                      onClick={() => updateItemQty(idx, -1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-700 hover:bg-stone-100 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold font-mono text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQty(idx, 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-700 hover:bg-stone-100 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="w-16 text-right font-mono font-bold text-stone-900 tabular-nums">
                    ₹{item.totalPrice}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Calculations & Discounts */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 space-y-2 text-xs shrink-0">
            {/* Quick Discount Selector */}
            <div className="flex items-center justify-between">
              <span className="text-stone-600 font-medium text-[11px]">Apply Discount:</span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      discountPercent === pct
                        ? 'bg-[#C07A3A] text-white'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-stone-600 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST ({settings.taxRatePercent}%)</span>
                <span className="font-mono tabular-nums">₹{taxAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                <span>Payable Bill</span>
                <span className="font-mono tabular-nums text-base text-[#C07A3A]">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-stone-200">
              <div className="grid grid-cols-3 gap-1 text-[11px] font-bold mb-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                    paymentMethod === 'cash' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white border text-stone-700'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                    paymentMethod === 'upi' ? 'bg-[#C07A3A] text-white shadow-xs' : 'bg-white border text-stone-700'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 ${
                    paymentMethod === 'card' ? 'bg-[#241A15] text-white shadow-xs' : 'bg-white border text-stone-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
              </div>

              {/* Cash tender calculator */}
              {paymentMethod === 'cash' && (
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-stone-200 text-xs">
                  <span className="text-[10px] text-stone-500 font-semibold shrink-0">Tendered ₹:</span>
                  <input
                    type="number"
                    min="0"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="Cash received"
                    className="flex-1 text-xs font-mono font-bold focus:outline-none"
                  />
                  {numericTendered >= grandTotal && (
                    <span className="text-[11px] text-emerald-700 font-bold font-mono">
                      Change: ₹{changeDue}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Checkout button */}
            <button
              onClick={handleCheckoutPOS}
              disabled={cartItems.length === 0}
              className="w-full py-3 bg-[#241A15] hover:bg-[#382820] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-40 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4 text-[#C07A3A]" />
              <span>Charge ₹{grandTotal} &amp; Print Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
