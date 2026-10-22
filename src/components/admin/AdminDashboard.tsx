import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Calendar,
  Receipt,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Printer,
  Download,
  AlertTriangle,
  RotateCcw,
  Store,
  ChefHat,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Percent,
  Clock,
  Sparkles,
  Save,
  MessageCircle,
  Trash2,
  Globe,
  Lock,
} from 'lucide-react';
import {
  CafeSettings,
  CustomerRecord,
  ExpenseRecord,
  MenuItem,
  Order,
  OrderStatus,
  PaymentStatus,
  TableReservation,
} from '../../types';
import { CafeStore, playChime } from '../../services/store';

interface AdminDashboardProps {
  settings: CafeSettings;
  onUpdateSettings: (newSettings: CafeSettings) => void;
  onExit: () => void;
  onLaunchPOS: () => void;
  onLaunchKDS: () => void;
  onPrintReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onUpdateSettings,
  onExit,
  onLaunchPOS,
  onLaunchKDS,
  onPrintReceipt,
}) => {
  // Current active admin tab (8 core operational modules)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'menu' | 'reservations' | 'expenses' | 'analytics' | 'customers' | 'settings'
  >('overview');

  // Reactive state from CafeStore
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);

  // Local settings draft
  const [settingsDraft, setSettingsDraft] = useState<CafeSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');
  const [pushLiveSuccessMsg, setPushLiveSuccessMsg] = useState('');

  // Admin PIN management state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinUpdateMsg, setPinUpdateMsg] = useState('');
  const [pinUpdateError, setPinUpdateError] = useState('');

  // Orders Tab filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSourceFilter, setOrderSourceFilter] = useState<string>('all');
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundError, setRefundError] = useState<string>('');

  // Menu editing state
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [newCatName, setNewCatName] = useState('');

  // Reservations Tab state
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');

  // New Expense form state
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState<ExpenseRecord['category']>('Ingredients');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseMethod, setNewExpenseMethod] = useState<ExpenseRecord['paymentMethod']>('UPI');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');

  // Analytics Date Filter
  const [analyticsDateRange, setAnalyticsDateRange] = useState<'today' | 'yesterday' | '7days' | '30days' | 'all'>('7days');

  // Reset confirmation
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetBookingsAlso, setResetBookingsAlso] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  // Sync state helper
  const syncStore = () => {
    setOrders(CafeStore.getOrders());
    setMenu(CafeStore.getMenu());
    setReservations(CafeStore.getReservations());
    setExpenses(CafeStore.getExpenses());
    setCustomers(CafeStore.getCustomers());
  };

  useEffect(() => {
    syncStore();
    const handleUpdate = () => syncStore();
    window.addEventListener('brew-bites-state-change', handleUpdate);
    return () => window.removeEventListener('brew-bites-state-change', handleUpdate);
  }, []);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSourceFilter !== 'all' && o.source !== orderSourceFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSourceFilter, orderSearch]);

  // Analytics Computations
  const analyticsData = useMemo(() => {
    const now = Date.now();
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfYesterday = startOfToday - 86400000;
    const sevenDaysAgo = now - 7 * 86400000;
    const thirtyDaysAgo = now - 30 * 86400000;

    const filtered = orders.filter((o) => {
      if (analyticsDateRange === 'today') return o.createdAt >= startOfToday;
      if (analyticsDateRange === 'yesterday') return o.createdAt >= startOfYesterday && o.createdAt < startOfToday;
      if (analyticsDateRange === '7days') return o.createdAt >= sevenDaysAgo;
      if (analyticsDateRange === '30days') return o.createdAt >= thirtyDaysAgo;
      return true;
    });

    const activeOrders = filtered.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded');

    const grossSales = activeOrders.reduce((s, o) => s + o.subtotal, 0);
    const totalDiscounts = activeOrders.reduce((s, o) => s + o.discountAmount, 0);
    const totalTax = activeOrders.reduce((s, o) => s + o.taxAmount, 0);
    const netSales = activeOrders.reduce((s, o) => s + o.grandTotal, 0);

    // Payments collected
    let cashCollected = 0;
    let upiCollected = 0;
    let cardCollected = 0;
    let outstandingDue = 0;

    activeOrders.forEach((o) => {
      if (o.paymentStatus === 'verified') {
        if (o.paymentMethod === 'cash') cashCollected += o.grandTotal;
        else if (o.paymentMethod === 'upi') upiCollected += o.grandTotal;
        else cardCollected += o.grandTotal;
      } else {
        outstandingDue += o.grandTotal;
      }
    });

    const actuallyCollected = cashCollected + upiCollected + cardCollected;

    // Filter expenses in same range
    const filteredExp = expenses.filter((e) => {
      const expTime = new Date(e.date).getTime();
      if (analyticsDateRange === 'today') return expTime >= startOfToday;
      if (analyticsDateRange === 'yesterday') return expTime >= startOfYesterday && expTime < startOfToday;
      if (analyticsDateRange === '7days') return expTime >= sevenDaysAgo;
      if (analyticsDateRange === '30days') return expTime >= thirtyDaysAgo;
      return true;
    });

    const totalOperatingExpenses = filteredExp.reduce((s, e) => s + e.amount, 0);
    const estimatedNetProfit = netSales - totalOperatingExpenses;

    // Item popularity ranking
    const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    activeOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!itemMap[it.name]) itemMap[it.name] = { name: it.name, qty: 0, revenue: 0 };
        itemMap[it.name].qty += it.quantity;
        itemMap[it.name].revenue += it.totalPrice;
      });
    });

    const popularItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty);

    return {
      orderCount: activeOrders.length,
      grossSales,
      totalDiscounts,
      totalTax,
      netSales,
      cashCollected,
      upiCollected,
      cardCollected,
      actuallyCollected,
      outstandingDue,
      totalOperatingExpenses,
      estimatedNetProfit,
      popularItems,
      avgOrderValue: activeOrders.length > 0 ? Math.round(netSales / activeOrders.length) : 0,
      onlineOrdersCount: activeOrders.filter((o) => o.source === 'website').length,
      posOrdersCount: activeOrders.filter((o) => o.source === 'pos-walkin').length,
    };
  }, [orders, expenses, analyticsDateRange]);

  // Today specific overview metrics
  const todayOverview = useMemo(() => {
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= startOfToday);
    const active = todayOrders.filter((o) => o.status !== 'cancelled' && o.status !== 'refunded');
    const sales = active.reduce((s, o) => s + o.grandTotal, 0);
    const pendingCount = todayOrders.filter((o) => o.status === 'confirmed' || o.status === 'accepted' || o.status === 'preparing').length;
    const completedCount = todayOrders.filter((o) => o.status === 'completed').length;
    const cancelledCount = todayOrders.filter((o) => o.status === 'cancelled' || o.status === 'refunded').length;

    // Upcoming reservations today
    const todayDateStr = new Date().toISOString().split('T')[0];
    const todayRes = reservations.filter((r) => r.date === todayDateStr && r.status !== 'Declined' && r.status !== 'Cancelled');

    return {
      sales,
      totalOrders: todayOrders.length,
      pendingCount,
      completedCount,
      cancelledCount,
      todayResCount: todayRes.length,
    };
  }, [orders, reservations]);

  // CSV Export Generator
  const downloadAnalyticsCSV = () => {
    const rows = [
      ['Metric', 'Value (INR / Count)'],
      ['Time Range', analyticsDateRange],
      ['Total Orders', analyticsData.orderCount],
      ['Gross Order Value', `₹${analyticsData.grossSales}`],
      ['Discounts Given', `₹${analyticsData.totalDiscounts}`],
      ['Taxes Collected (GST)', `₹${analyticsData.totalTax}`],
      ['Net Sales', `₹${analyticsData.netSales}`],
      ['Actually Collected Cash', `₹${analyticsData.cashCollected}`],
      ['Actually Collected UPI', `₹${analyticsData.upiCollected}`],
      ['Actually Collected Card', `₹${analyticsData.cardCollected}`],
      ['Total Collected Payments', `₹${analyticsData.actuallyCollected}`],
      ['Outstanding Balance', `₹${analyticsData.outstandingDue}`],
      ['Operating Expenses', `₹${analyticsData.totalOperatingExpenses}`],
      ['Estimated Net Operating Profit', `₹${analyticsData.estimatedNetProfit}`],
      ['Average Order Value', `₹${analyticsData.avgOrderValue}`],
      ['Online Website Orders', analyticsData.onlineOrdersCount],
      ['POS Walk-in Orders', analyticsData.posOrdersCount],
      [],
      ['Top Selling Items', 'Quantity Sold', 'Revenue (INR)'],
      ...analyticsData.popularItems.map((item) => [item.name, item.qty, `₹${item.revenue}`]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BrewBites_Financial_Report_${analyticsDateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    CafeStore.saveSettings(settingsDraft);
    onUpdateSettings(settingsDraft);
    setSettingsSavedMsg('Settings saved & published successfully.');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // Push all changes to Live Website immediately
  const handlePushAllChangesToLiveWeb = () => {
    CafeStore.pushAllChangesToWeb(menu, settingsDraft);
    onUpdateSettings(settingsDraft);
    setPushLiveSuccessMsg('✓ Live Website Updated! All changes in menu, pricing, and settings are now active across the entire website.');
    setTimeout(() => setPushLiveSuccessMsg(''), 5000);
  };

  // Change Admin Security PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinUpdateMsg('');
    setPinUpdateError('');
    const currentPin = settingsDraft.adminPin || '123456789';
    if (currentPinInput.trim() !== currentPin) {
      setPinUpdateError('Current PIN is incorrect.');
      return;
    }
    if (!newPinInput.trim() || newPinInput.length < 4) {
      setPinUpdateError('New PIN must be at least 4 digits/characters.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinUpdateError('New PIN and Confirm PIN do not match.');
      return;
    }
    const updated = {
      ...settingsDraft,
      adminPin: newPinInput.trim(),
    };
    setSettingsDraft(updated);
    CafeStore.saveSettings(updated);
    onUpdateSettings(updated);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinUpdateMsg('✓ Admin PIN changed successfully. Please remember your new passkey.');
    setTimeout(() => setPinUpdateMsg(''), 4000);
  };

  // Process Refund submit
  const submitRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRefund) return;
    const amt = parseFloat(refundAmount) || 0;
    if (amt <= 0 || amt > selectedOrderForRefund.grandTotal) {
      setRefundError('Please enter a valid refund amount up to the order total.');
      return;
    }
    CafeStore.processRefund(selectedOrderForRefund.id, amt, refundReason.trim() || 'Customer requested refund');
    setSelectedOrderForRefund(null);
    setRefundAmount('');
    setRefundReason('');
    setRefundError('');
  };

  // Add Expense submit
  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseTitle.trim() || isNaN(amt) || amt <= 0) return;

    const exp: ExpenseRecord = {
      id: 'exp-' + Date.now(),
      title: newExpenseTitle.trim(),
      category: newExpenseCat,
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newExpenseMethod,
      notes: newExpenseNotes.trim() || undefined,
      recordedAt: Date.now(),
    };

    CafeStore.addExpense(exp);
    setNewExpenseTitle('');
    setNewExpenseAmount('');
    setNewExpenseNotes('');
  };

  // Reset Sales Data handler (Direct execution on RESET confirmation text - no broken iframe popups)
  const handleResetData = () => {
    if (resetConfirmText.trim().toUpperCase() !== 'RESET') {
      setResetMsg('Type RESET in capital letters first to confirm.');
      return;
    }
    // Execute store reset immediately
    CafeStore.resetAllSalesAndBookings(resetBookingsAlso);
    // Explicitly synchronize component state for instantaneous UI feedback
    setOrders([]);
    setCustomers([]);
    if (resetBookingsAlso) {
      setReservations([]);
    }
    setResetMsg('✓ All sales and customer CRM records have been reset successfully.');
    setResetConfirmText('');
    playChime(760, 0.25);
    setTimeout(() => {
      setResetMsg('');
    }, 6000);
  };

  // WhatsApp Table Confirmation generator
  const sendWhatsAppConfirmation = (res: TableReservation, approved: boolean) => {
    const cleanPhone = res.phone.replace(/\D/g, '').slice(-10);
    const msg = approved
      ? `Hello ${res.name}, your table reservation at Brew & Bites Café is CONFIRMED!\nCode: ${res.code}\nDate: ${res.date} at ${res.time}\nGuests: ${res.guests} (${res.seatingPreference || 'Indoor'})\nAssigned Table: ${res.tableNumber || 'Table Assigned on Arrival'}\nWe look forward to hosting you in Alwar!`
      : `Hello ${res.name}, we are sorry to inform you that we cannot accommodate booking ${res.code} on ${res.date} at ${res.time} due to full occupancy. Please contact us to choose another slot.`;

    window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0E0A07] text-[#FAF7F2] flex flex-col font-sans select-none overflow-hidden relative">
      {/* Aesthetic Ambient Lighting Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(192,122,58,0.28),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(226,149,71,0.15),transparent_60%)]" />

      {/* Top Admin Header Bar */}
      <header className="h-14 sm:h-16 bg-[#160E0A]/95 text-[#FAF7F2] px-3 sm:px-6 flex items-center justify-between border-b border-[#C07A3A]/20 backdrop-blur-md shrink-0 relative z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            title="Return to Customer Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customer Website</span>
            <span className="sm:hidden">Exit</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-serif font-bold text-sm sm:text-base md:text-lg tracking-tight text-white drop-shadow-sm truncate">
              {settings.cafeName}
            </h1>
            <span className="hidden sm:inline-block text-[11px] text-[#E29547] font-semibold bg-[#C07A3A]/20 border border-[#C07A3A]/30 px-2 py-0.5 rounded-full shadow-xs shrink-0">
              Admin &amp; Operations
            </span>
          </div>
        </div>

        {/* Quick Actions: Push to Live Web, POS, KDS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Push to Live Web Button */}
          <button
            onClick={handlePushAllChangesToLiveWeb}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all shrink-0"
            title="Publish all changes to the live website"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Push Changes to Web</span>
            <span className="md:hidden">Push</span>
          </button>

          {/* Quick Launcher: Staff POS */}
          <button
            onClick={onLaunchPOS}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white text-xs font-semibold shadow-md shadow-[#C07A3A]/20 border border-[#E29547]/30 transition-all active:scale-95 shrink-0"
            title="Launch Staff Billing POS"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Launch POS</span>
            <span className="md:hidden">POS</span>
          </button>

          {/* Quick Launcher: Kitchen Display */}
          <button
            onClick={onLaunchKDS}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold transition-all active:scale-95 shrink-0"
            title="Launch Kitchen Display (KDS)"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Kitchen Screen</span>
            <span className="md:hidden">KDS</span>
          </button>
        </div>
      </header>

      {/* Push to Live Web Success Notification Banner */}
      {pushLiveSuccessMsg && (
        <div className="bg-emerald-700/90 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-lg backdrop-blur-md border-b border-emerald-500/30 animate-fade-in shrink-0 relative z-20">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{pushLiveSuccessMsg}</span>
        </div>
      )}

      {/* Mobile Horizontal Scrollable Tab Navigation (Visible on mobile/tablet < md) */}
      <nav className="md:hidden bg-[#130C08]/98 border-b border-[#C07A3A]/20 px-2.5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Orders</span>
          {todayOverview.pendingCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center tabular-nums">
              {todayOverview.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'menu'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'reservations'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Bookings</span>
          {reservations.filter((r) => r.status === 'Pending').length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center tabular-nums">
              {reservations.filter((r) => r.status === 'Pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'expenses'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#E29547]" />
          <span>P&amp;L Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'customers'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Customers</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-md shadow-[#C07A3A]/25 border border-[#E29547]/30'
              : 'bg-white/5 text-stone-300 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5 text-[#E29547]" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Main Layout: Left Tabs Sidebar (Desktop) / Right Tab Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Navigation Sidebar (Hidden on mobile screens to preserve 100% width) */}
        <aside className="hidden md:flex flex-col w-52 lg:w-56 bg-[#130C08]/95 border-r border-[#C07A3A]/15 backdrop-blur-md justify-between shrink-0 overflow-y-auto">
          <nav className="p-3 space-y-1.5 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#E29547]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#E29547]" />
                <span>Orders</span>
              </div>
              {todayOverview.pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center tabular-nums shadow-sm">
                  {todayOverview.pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-[#E29547]" />
              <span>Menu Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'reservations'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#E29547]" />
                <span>Reservations</span>
              </div>
              {reservations.filter((r) => r.status === 'Pending').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {reservations.filter((r) => r.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'expenses'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Receipt className="w-4 h-4 text-[#E29547]" />
              <span>Expenses</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#E29547]" />
              <span>Analytics &amp; P&amp;L</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-[#E29547]" />
              <span>Customers CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white font-semibold shadow-lg shadow-[#C07A3A]/25 border border-[#E29547]/30'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-[#E29547]" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="p-3 border-t border-[#C07A3A]/15 text-[11px] text-stone-400 text-center font-medium">
            Brew &amp; Bites v2.4 · Alwar
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 space-y-6 w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Executive Overview</h2>
                  <p className="text-xs text-stone-400">Live operational snapshot for today in Alwar</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-[#18110D] px-3 py-1.5 rounded-xl border border-[#C07A3A]/20">
                  <Clock className="w-3.5 h-3.5 text-[#E29547]" />
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1 relative overflow-hidden group hover:border-[#C07A3A]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C07A3A]/10 rounded-full blur-2xl group-hover:bg-[#C07A3A]/20 transition-all pointer-events-none" />
                  <span className="text-[11px] text-stone-400 uppercase font-semibold tracking-wider">Today's Sales</span>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums drop-shadow-sm">
                    ₹{todayOverview.sales}
                  </div>
                  <span className="text-[10px] text-[#E29547] font-medium block">
                    {todayOverview.totalOrders} total orders today
                  </span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1 relative overflow-hidden group hover:border-[#C07A3A]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
                  <span className="text-[11px] text-stone-400 uppercase font-semibold tracking-wider">In Kitchen / Preparing</span>
                  <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                    {todayOverview.pendingCount}
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    Live tickets requiring kitchen attention
                  </span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1 relative overflow-hidden group hover:border-[#C07A3A]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
                  <span className="text-[11px] text-stone-400 uppercase font-semibold tracking-wider">Completed Orders</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                    {todayOverview.completedCount}
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    Dispatched &amp; served today
                  </span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1 relative overflow-hidden group hover:border-[#C07A3A]/40 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C07A3A]/10 rounded-full blur-2xl group-hover:bg-[#C07A3A]/20 transition-all pointer-events-none" />
                  <span className="text-[11px] text-stone-400 uppercase font-semibold tracking-wider">Table Bookings Today</span>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">
                    {todayOverview.todayResCount}
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium block">
                    Reserved tables for tonight
                  </span>
                </div>
              </div>

              {/* Recent Orders Snapshot */}
              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 p-5 space-y-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-white">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#E29547] font-semibold hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase font-semibold text-stone-400 border-b border-[#C07A3A]/20 pb-2">
                      <tr>
                        <th className="py-2.5">Order #</th>
                        <th className="py-2.5">Source</th>
                        <th className="py-2.5">Type</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium text-stone-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 font-mono font-bold text-white">{order.orderNumber}</td>
                          <td className="py-2.5 capitalize text-stone-300">{order.source}</td>
                          <td className="py-2.5 uppercase text-[11px] font-semibold text-[#E29547]">{order.type}</td>
                          <td className="py-2.5 text-stone-200">{order.customerName}</td>
                          <td className="py-2.5 font-mono font-bold tabular-nums text-white">₹{order.grandTotal}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#C07A3A]/20 text-[#E29547] border border-[#C07A3A]/30">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className={`text-[11px] font-semibold ${order.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {order.paymentStatus} ({order.paymentMethod.toUpperCase()})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Orders Management</h2>
                  <p className="text-xs text-stone-400">Manage dine-in, takeaway, online delivery, and POS walk-in tickets</p>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Order # or Phone"
                      className="pl-8 pr-3 py-1.5 text-xs bg-[#120B07] text-stone-100 placeholder:text-stone-500 rounded-xl border border-[#C07A3A]/30 focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-1.5 text-xs bg-[#120B07] text-stone-200 rounded-xl border border-[#C07A3A]/30 font-medium focus:outline-none focus:border-[#C07A3A]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  <select
                    value={orderSourceFilter}
                    onChange={(e) => setOrderSourceFilter(e.target.value)}
                    className="p-1.5 text-xs bg-[#120B07] text-stone-200 rounded-xl border border-[#C07A3A]/30 font-medium focus:outline-none focus:border-[#C07A3A]"
                  >
                    <option value="all">All Sources</option>
                    <option value="website">Website Online</option>
                    <option value="pos-walkin">POS Walk-in</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#120B07] text-[11px] uppercase font-semibold text-[#E29547] border-b border-[#C07A3A]/20">
                      <tr>
                        <th className="p-3">Order Code</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Type &amp; Channel</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium text-stone-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{order.orderNumber}</td>
                          <td className="p-3 font-mono text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold block uppercase text-[11px] text-[#E29547]">
                              {order.type} {order.tableNumber ? `• ${order.tableNumber}` : ''}
                            </span>
                            <span className="text-[10px] text-stone-400 capitalize">{order.source}</span>
                          </td>
                          <td className="p-3">
                            <span className="block font-semibold text-stone-100">{order.customerName}</span>
                            <span className="text-[10px] font-mono text-stone-400">{order.customerPhone}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-stone-200">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                            <span className="block text-[10px] text-stone-400 truncate max-w-[140px]">
                              {order.items.map((i) => i.name).join(', ')}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold tabular-nums text-white">
                            ₹{order.grandTotal}
                          </td>
                          <td className="p-3">
                            <span className={`block font-semibold ${order.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {order.paymentStatus.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-stone-400 uppercase">{order.paymentMethod}</span>
                          </td>
                          <td className="p-3">
                            <select
                              value={order.status}
                              onChange={(e) => CafeStore.updateOrderStatus(order.id, e.target.value as OrderStatus)}
                              className="text-xs p-1.5 rounded-lg border border-[#C07A3A]/30 bg-[#120B07] text-stone-100 font-semibold focus:outline-none focus:border-[#C07A3A]"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="accepted">Accepted</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => onPrintReceipt(order)}
                              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-stone-300 transition-colors"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            {order.status !== 'cancelled' && order.status !== 'refunded' && (
                              <button
                                onClick={() => setSelectedOrderForRefund(order)}
                                className="px-2 py-1 rounded-lg text-[10px] font-semibold text-red-400 hover:bg-red-950/40 border border-red-500/30 transition-colors"
                              >
                                Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Refund Modal */}
              {selectedOrderForRefund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                  <div className="bg-[#160E0A] rounded-2xl max-w-sm w-full p-5 border border-[#C07A3A]/30 shadow-2xl space-y-4 text-stone-100 animate-scale-up">
                    <div className="flex items-center justify-between border-b border-[#C07A3A]/20 pb-2.5">
                      <h3 className="text-sm font-bold font-serif text-white">
                        Process Refund: {selectedOrderForRefund.orderNumber}
                      </h3>
                      <button onClick={() => setSelectedOrderForRefund(null)} className="text-stone-400 hover:text-white">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={submitRefund} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Refund Amount (Max ₹{selectedOrderForRefund.grandTotal})
                        </label>
                        <input
                          type="number"
                          required
                          max={selectedOrderForRefund.grandTotal}
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          placeholder={`₹${selectedOrderForRefund.grandTotal}`}
                          className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono font-bold focus:outline-none focus:border-[#C07A3A]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Reason for Refund (Audit Trail)
                        </label>
                        <input
                          type="text"
                          required
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          placeholder="e.g. Out of stock ingredient, customer requested"
                          className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                        />
                      </div>

                      {refundError && (
                        <p className="text-xs font-semibold text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                          {refundError}
                        </p>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForRefund(null)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold text-xs shadow-md shadow-red-950/40"
                        >
                          Authorize Refund
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MENU MANAGER */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Menu &amp; Dish Manager</h2>
                  <p className="text-xs text-stone-400">Update prices, availability, descriptions, and categories</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newDish: MenuItem = {
                        id: 'dish-' + Date.now(),
                        name: 'New Café Dish',
                        category: 'Starters',
                        description: 'Freshly prepared specialty dish.',
                        price: 150,
                        isAvailable: true,
                        isVeg: true,
                        isBestseller: false,
                        prepTimeMinutes: 12,
                      };
                      setEditingMenuItem(newDish);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white rounded-xl text-xs font-semibold shadow-md shadow-[#C07A3A]/20 transition-all border border-[#E29547]/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Dish</span>
                  </button>
                </div>
              </div>

              {/* Menu Categories and Dishes */}
              <div className="space-y-3">
                {menu.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-[#18110D]/90 p-4 rounded-xl border border-[#C07A3A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl backdrop-blur-md hover:border-[#C07A3A]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${dish.isAvailable ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-red-500 shadow-sm shadow-red-500/50'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-white">{dish.name}</h4>
                          <span className="text-[10px] text-stone-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            {dish.category}
                          </span>
                          {dish.isBestseller && (
                            <span className="text-[10px] text-[#E29547] font-bold">★ Bestseller</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{dish.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Price (INR)</span>
                        <span className="font-mono font-bold text-sm text-white tabular-nums">
                          {dish.price != null ? `₹${dish.price}` : 'Unset (Null)'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const updated = { ...dish, isAvailable: !dish.isAvailable };
                          CafeStore.updateMenuItem(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/25'
                        }`}
                      >
                        {dish.isAvailable ? 'Available' : 'Sold Out'}
                      </button>

                      <button
                        onClick={() => setEditingMenuItem(dish)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${dish.name}" from menu?`)) {
                            CafeStore.deleteMenuItem(dish.id);
                          }
                        }}
                        className="p-1 text-stone-400 hover:text-red-400 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Menu Item Modal */}
              {editingMenuItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
                  <div className="bg-[#160E0A] rounded-2xl max-w-md w-full p-6 border border-[#C07A3A]/30 shadow-2xl space-y-4 my-auto text-stone-100 animate-scale-up">
                    <div className="flex items-center justify-between border-b border-[#C07A3A]/20 pb-2.5">
                      <h3 className="font-serif font-bold text-base text-white">
                        Edit Dish Details
                      </h3>
                      <button onClick={() => setEditingMenuItem(null)} className="text-stone-400 hover:text-white">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        CafeStore.updateMenuItem(editingMenuItem);
                        setEditingMenuItem(null);
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Dish Name *</label>
                        <input
                          type="text"
                          required
                          value={editingMenuItem.name}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                          className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-medium focus:outline-none focus:border-[#C07A3A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Category *</label>
                          <input
                            type="text"
                            required
                            value={editingMenuItem.category}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category: e.target.value })}
                            className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Verified Price (₹) *</label>
                          <input
                            type="number"
                            min="0"
                            value={editingMenuItem.price ?? ''}
                            onChange={(e) =>
                              setEditingMenuItem({
                                ...editingMenuItem,
                                price: e.target.value === '' ? null : Number(e.target.value),
                              })
                            }
                            placeholder="Leave blank for null"
                            className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono font-bold focus:outline-none focus:border-[#C07A3A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Description *</label>
                        <textarea
                          rows={2}
                          value={editingMenuItem.description}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                          className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Prep Time (mins)</label>
                          <input
                            type="number"
                            min="1"
                            value={editingMenuItem.prepTimeMinutes ?? 12}
                            onChange={(e) =>
                              setEditingMenuItem({
                                ...editingMenuItem,
                                prepTimeMinutes: Number(e.target.value),
                              })
                            }
                            className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono focus:outline-none focus:border-[#C07A3A]"
                          />
                        </div>

                        <div className="flex flex-col justify-end space-y-1 text-stone-300">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingMenuItem.isBestseller}
                              onChange={(e) =>
                                setEditingMenuItem({ ...editingMenuItem, isBestseller: e.target.checked })
                              }
                              className="accent-[#C07A3A]"
                            />
                            <span>Bestseller Tag</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingMenuItem.isAvailable}
                              onChange={(e) =>
                                setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.checked })
                              }
                              className="accent-[#C07A3A]"
                            />
                            <span>Available in Store</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-[#C07A3A]/20">
                        <button
                          type="button"
                          onClick={() => setEditingMenuItem(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white font-semibold shadow-md shadow-[#C07A3A]/25 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Table Reservations</h2>
                  <p className="text-xs text-stone-400">Review booking requests, assign tables, and confirm via WhatsApp</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={resStatusFilter}
                    onChange={(e) => setResStatusFilter(e.target.value)}
                    className="p-1.5 text-xs bg-[#120B07] text-stone-200 rounded-xl border border-[#C07A3A]/30 font-medium focus:outline-none focus:border-[#C07A3A]"
                  >
                    <option value="all">All Bookings</option>
                    <option value="Pending">Pending Confirmation</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Declined">Declined</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Reservations List */}
              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#120B07] text-[11px] uppercase font-semibold text-[#E29547] border-b border-[#C07A3A]/20">
                      <tr>
                        <th className="p-3">Booking Code</th>
                        <th className="p-3">Guest Name &amp; Contact</th>
                        <th className="p-3">Date &amp; Time</th>
                        <th className="p-3">Party Size</th>
                        <th className="p-3">Seating / Note</th>
                        <th className="p-3">Assigned Table</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium text-stone-200">
                      {reservations
                        .filter((r) => (resStatusFilter === 'all' ? true : r.status === resStatusFilter))
                        .map((res) => (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono font-bold text-white">{res.code}</td>
                            <td className="p-3">
                              <span className="block font-semibold text-stone-100">{res.name}</span>
                              <span className="text-[10px] font-mono text-stone-400">{res.phone}</span>
                            </td>
                            <td className="p-3">
                              <span className="block font-bold text-stone-200">{res.date}</span>
                              <span className="text-[10px] text-stone-400 font-mono">{res.time}</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-stone-200">{res.guests} Guests</td>
                            <td className="p-3">
                              <span className="block text-stone-300">{res.seatingPreference || 'Standard'}</span>
                              {res.note && <span className="text-[10px] text-amber-400/90 italic block">"{res.note}"</span>}
                            </td>
                            <td className="p-3">
                              <select
                                value={res.tableNumber || ''}
                                onChange={(e) =>
                                  CafeStore.updateReservationStatus(res.id, res.status, e.target.value)
                                }
                                className="p-1 border border-[#C07A3A]/30 rounded-lg bg-[#120B07] text-stone-200 text-xs focus:outline-none focus:border-[#C07A3A]"
                              >
                                <option value="">Assign Table</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((t) => (
                                  <option key={t} value={`Table ${t}`}>Table {t}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  res.status === 'Confirmed'
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : res.status === 'Declined'
                                    ? 'bg-red-500/15 text-red-300 border-red-500/30'
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {res.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              {res.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      CafeStore.updateReservationStatus(res.id, 'Confirmed');
                                      sendWhatsAppConfirmation(res, true);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => {
                                      CafeStore.updateReservationStatus(res.id, 'Declined');
                                      sendWhatsAppConfirmation(res, false);
                                    }}
                                    className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => sendWhatsAppConfirmation(res, res.status === 'Confirmed')}
                                className="p-1 rounded-lg hover:bg-white/10 text-emerald-400"
                                title="Open WhatsApp Composer"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Operating Expenses</h2>
                  <p className="text-xs text-stone-400">Track kitchen ingredients, rent, electricity, packaging, and staff costs</p>
                </div>
              </div>

              {/* Add Expense Form Card */}
              <div className="bg-[#18110D]/90 p-5 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#E29547] mb-3">
                  Record New Expense
                </h3>
                <form onSubmit={submitExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="lg:col-span-2">
                    <label className="block text-[10px] text-stone-400 mb-1">Expense Title *</label>
                    <input
                      type="text"
                      required
                      value={newExpenseTitle}
                      onChange={(e) => setNewExpenseTitle(e.target.value)}
                      placeholder="e.g. Milk & Dairy Batch Purchase"
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Category *</label>
                    <select
                      value={newExpenseCat}
                      onChange={(e) => setNewExpenseCat(e.target.value as ExpenseRecord['category'])}
                      className="w-full p-2.5 bg-[#0E0805] text-stone-200 border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    >
                      <option value="Ingredients">Ingredients</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Rent">Rent</option>
                      <option value="Staff">Staff</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">Amount (₹) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono font-bold focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white rounded-xl font-semibold shadow-md shadow-[#C07A3A]/20 transition-all border border-[#E29547]/30"
                    >
                      + Save Expense
                    </button>
                  </div>
                </form>
              </div>

              {/* Expenses History Table */}
              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#120B07] text-[11px] uppercase font-semibold text-[#E29547] border-b border-[#C07A3A]/20">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Title / Payee</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium text-stone-200">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono text-stone-400">{exp.date}</td>
                        <td className="p-3 font-semibold text-white">{exp.title}</td>
                        <td className="p-3">
                          <span className="bg-white/10 text-stone-200 border border-white/10 px-2 py-0.5 rounded text-[10px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-3 text-stone-300">{exp.paymentMethod}</td>
                        <td className="p-3 font-mono font-bold tabular-nums text-red-400">
                          -₹{exp.amount}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => CafeStore.deleteExpense(exp.id)}
                            className="text-stone-400 hover:text-red-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS & P&L */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Business Analytics &amp; P&amp;L</h2>
                  <p className="text-xs text-stone-400">Accurate ledger calculations from database records</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-[#120B07] border border-[#C07A3A]/20 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setAnalyticsDateRange('today')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsDateRange === 'today'
                          ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('yesterday')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsDateRange === 'yesterday'
                          ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('7days')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsDateRange === '7days'
                          ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('30days')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        analyticsDateRange === '30days'
                          ? 'bg-gradient-to-r from-[#C07A3A] to-[#A86427] text-white shadow-xs'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      30 Days
                    </button>
                  </div>

                  <button
                    onClick={downloadAnalyticsCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Strict Financial Ledger Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Gross Order Value</span>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    ₹{analyticsData.grossSales}
                  </div>
                  <span className="text-[10px] text-stone-400">Total item totals</span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Total Net Sales</span>
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    ₹{analyticsData.netSales}
                  </div>
                  <span className="text-[10px] text-stone-400">After discounts &amp; GST</span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Collected Payments</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    ₹{analyticsData.actuallyCollected}
                  </div>
                  <span className="text-[10px] text-emerald-300/80">Cash: ₹{analyticsData.cashCollected} · UPI: ₹{analyticsData.upiCollected}</span>
                </div>

                <div className="bg-[#18110D]/90 p-4 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Est. Operating Profit</span>
                  <div className={`text-xl font-bold font-mono tabular-nums ${analyticsData.estimatedNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{analyticsData.estimatedNetProfit}
                  </div>
                  <span className="text-[10px] text-stone-400">Net Sales - ₹{analyticsData.totalOperatingExpenses} exp</span>
                </div>
              </div>

              {/* Popular Dishes Ranking Table */}
              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 p-5 space-y-3 shadow-xl backdrop-blur-md">
                <h3 className="font-serif font-bold text-sm text-white">Bestselling Dishes &amp; Volume</h3>
                <div className="space-y-2">
                  {analyticsData.popularItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#120B07] border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 font-mono text-[#E29547] font-bold">{idx + 1}.</span>
                        <span className="font-semibold text-stone-100">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono tabular-nums">
                        <span className="text-stone-400">{item.qty} ordered</span>
                        <span className="font-bold text-white">₹{item.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CUSTOMERS CRM */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-wide">Customer Database (CRM)</h2>
                  <p className="text-xs text-stone-400">Guest records, order histories, repeat customer analytics</p>
                </div>
              </div>

              <div className="bg-[#18110D]/90 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#120B07] text-[11px] uppercase font-semibold text-[#E29547] border-b border-[#C07A3A]/20">
                    <tr>
                      <th className="p-3">Customer Phone</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3">Lifetime Spend</th>
                      <th className="p-3">Last Order Date</th>
                      <th className="p-3">Loyalty Segment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium text-stone-200">
                    {customers.map((c) => (
                      <tr key={c.phone} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-bold text-white">{c.phone}</td>
                        <td className="p-3 font-semibold text-stone-100">{c.name}</td>
                        <td className="p-3 font-mono font-bold text-stone-200">{c.ordersCount}</td>
                        <td className="p-3 font-mono font-bold tabular-nums text-emerald-400">
                          ₹{c.totalSpend}
                        </td>
                        <td className="p-3 font-mono text-stone-400">
                          {new Date(c.lastOrderDate).toLocaleDateString([], { dateStyle: 'medium' })}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.ordersCount > 2 ? 'bg-[#C07A3A]/20 text-[#E29547] border-[#C07A3A]/30' : 'bg-white/10 text-stone-300 border-white/10'}`}>
                            {c.ordersCount > 2 ? 'VIP Regular' : 'Guest Patron'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">Café Business Configuration</h2>
                <p className="text-xs text-stone-400">Manage verified shop details, Google Maps link, and online ordering</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#18110D]/90 p-6 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-4 text-xs text-stone-200">
                {settingsSavedMsg && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{settingsSavedMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Café Name</label>
                    <input
                      type="text"
                      value={settingsDraft.cafeName}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, cafeName: e.target.value })}
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={settingsDraft.phone}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Full Business Address</label>
                  <input
                    type="text"
                    value={settingsDraft.address}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, address: e.target.value })}
                    className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Verified Google Maps URL (must start with https://)</label>
                  <input
                    type="url"
                    value={settingsDraft.mapUrl}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, mapUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Operating Hours Note</label>
                    <input
                      type="text"
                      value={settingsDraft.hours}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, hours: e.target.value })}
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Booking Slot Start</label>
                    <input
                      type="time"
                      value={settingsDraft.slotStart}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, slotStart: e.target.value })}
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Booking Slot End</label>
                    <input
                      type="time"
                      value={settingsDraft.slotEnd}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, slotEnd: e.target.value })}
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">Top Announcement Banner</label>
                  <input
                    type="text"
                    value={settingsDraft.banner}
                    onChange={(e) => setSettingsDraft({ ...settingsDraft, banner: e.target.value })}
                    placeholder="Leave blank to hide"
                    className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl focus:outline-none focus:border-[#C07A3A]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white rounded-xl font-semibold shadow-md shadow-[#C07A3A]/25 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save &amp; Publish Settings</span>
                  </button>
                </div>
              </form>

              {/* Admin Security PIN Management Card */}
              <div className="bg-[#18110D]/90 p-6 rounded-2xl border border-[#C07A3A]/20 shadow-xl backdrop-blur-md space-y-4 text-xs text-stone-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#E29547]" />
                  <h3 className="font-serif font-bold text-sm text-white">Staff &amp; Admin Access Passkey</h3>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Update the master security PIN used to unlock the Staff Portal, Kitchen Display System (KDS), and POS billing register. Keep this passkey confidential.
                </p>

                {pinUpdateMsg && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pinUpdateMsg}</span>
                  </div>
                )}

                {pinUpdateError && (
                  <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 font-semibold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{pinUpdateError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Current PIN *</label>
                    <input
                      type="password"
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono text-sm tracking-wider focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">New PIN *</label>
                    <input
                      type="password"
                      required
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="New PIN (min 4 chars)"
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono text-sm tracking-wider focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">Confirm New PIN *</label>
                    <input
                      type="password"
                      required
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Re-enter New PIN"
                      className="w-full p-2.5 bg-[#0E0805] text-white border border-[#C07A3A]/30 rounded-xl font-mono text-sm tracking-wider focus:outline-none focus:border-[#C07A3A]"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#C07A3A] to-[#A86427] hover:from-[#d18744] hover:to-[#b9712f] text-white rounded-xl font-semibold shadow-md shadow-[#C07A3A]/20 transition-all border border-[#E29547]/30"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Update Security PIN</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone: Reset Sales */}
              <div className="bg-red-950/30 p-6 rounded-2xl border border-red-500/30 space-y-4 text-xs text-red-200">
                <div>
                  <h3 className="font-bold text-red-400 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-red-400" />
                    <span>Danger Zone: Reset Sales Data</span>
                  </h3>
                  <p className="text-red-300/80 leading-relaxed mt-1">
                    Deletes all test orders, clears revenue metrics back to ₹0, and resets customer CRM order counts. Menu items, prices, and café settings will remain untouched.
                  </p>
                </div>

                <div className="space-y-3 max-w-md">
                  <label className="flex items-center gap-2.5 text-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resetBookingsAlso}
                      onChange={(e) => setResetBookingsAlso(e.target.checked)}
                      className="w-4 h-4 accent-red-500 rounded"
                    />
                    <span className="text-xs">Also reset and clear all customer table reservations</span>
                  </label>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] text-stone-300 font-semibold">
                      Type <span className="font-mono text-red-400 font-bold bg-black/40 px-1.5 py-0.5 rounded border border-red-500/30">RESET</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      placeholder="Type RESET"
                      className="w-full p-2.5 bg-[#0E0805] border border-red-500/40 text-white rounded-xl font-mono text-sm tracking-wider focus:outline-none focus:border-red-400 shadow-inner"
                    />
                  </div>

                  <button
                    onClick={handleResetData}
                    disabled={resetConfirmText.trim().toUpperCase() !== 'RESET'}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                      resetConfirmText.trim().toUpperCase() === 'RESET'
                        ? 'bg-red-600 hover:bg-red-500 active:scale-95 text-white shadow-red-950/60 cursor-pointer'
                        : 'bg-red-950/40 text-red-400/40 border border-red-900/40 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm Reset Sales Data</span>
                  </button>

                  {resetMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
                        resetMsg.startsWith('✓')
                          ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/70 border border-red-500/40 text-red-200'
                      }`}
                    >
                      {resetMsg.startsWith('✓') ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{resetMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
