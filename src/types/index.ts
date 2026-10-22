export type OrderType = 'dine-in' | 'takeaway' | 'delivery' | 'pos-walkin';

export type OrderStatus =
  | 'awaiting-payment'
  | 'confirmed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'netbanking';

export interface Variant {
  id: string;
  name: string;
  priceDelta: number; // e.g. +30 for Large
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  price: number | null; // null if unverified as required by policy
  image?: string;
  isAvailable: boolean;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  prepTimeMinutes?: number;
  variants?: Variant[];
  addons?: Addon[];
  taxRatePercent?: number; // default 5%
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selectedVariant?: Variant;
  selectedAddons?: Addon[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Order {
  id: string; // e.g. BB-ORD-8492
  orderNumber: string;
  createdAt: number;
  source: 'website' | 'pos-walkin';
  type: OrderType;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  deliveryLandmark?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: number;
    note?: string;
  }[];
  cancellationReason?: string;
  refundAmount?: number;
  refundTimestamp?: number;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Declined' | 'Completed' | 'Cancelled';

export interface TableReservation {
  id: string;
  code: string; // e.g. BB-R74K
  name: string;
  phone: string;
  email?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  seatingPreference?: string;
  note?: string;
  tableNumber?: string;
  status: ReservationStatus;
  createdAt: number;
  adminNote?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string; // kg, L, pcs, packets
  minThreshold: number;
  costPerUnit: number; // in INR
  supplierName?: string;
  lastRestockedAt?: number;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  itemName: string;
  type: 'purchase' | 'usage' | 'wastage' | 'adjustment';
  quantityChange: number;
  reason: string;
  timestamp: number;
  recordedBy: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  category: 'Ingredients' | 'Packaging' | 'Utilities' | 'Rent' | 'Staff' | 'Marketing' | 'Maintenance' | 'Other';
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI';
  notes?: string;
  recordedAt: number;
}

export interface CustomerRecord {
  phone: string;
  name: string;
  email?: string;
  ordersCount: number;
  totalSpend: number;
  firstOrderDate: number;
  lastOrderDate: number;
  marketingOptIn: boolean;
  notes?: string;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  address: string;
  mapUrl: string;
  hours: string;
  slotStart: string;
  slotEnd: string;
  banner: string;
  currency: string;
  taxRatePercent: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryRadiusText: string;
  isDeliveryEnabled: boolean;
  razorpayKeyId: string;
  razorpaySecret: string;
  isRazorpayTestMode: boolean;
  enableSoundAlerts: boolean;
  adminPin?: string;
  lastPushedAt?: number;
}

export type StaffRole = 'owner' | 'manager' | 'cashier' | 'kitchen' | 'reservation';

export interface StaffUser {
  id: string;
  name: string;
  role: StaffRole;
  pin: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  description: string;
}
