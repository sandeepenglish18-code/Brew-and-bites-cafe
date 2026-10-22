import {
  CafeSettings,
  Coupon,
  CustomerRecord,
  ExpenseRecord,
  InventoryItem,
  MenuItem,
  Order,
  OrderStatus,
  StockMovement,
  TableReservation,
} from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'bb_cafe_settings_v3',
  MENU: 'bb_menu_items_v3',
  ORDERS: 'bb_orders_v3',
  RESERVATIONS: 'bb_reservations_v3',
  INVENTORY: 'bb_inventory_v3',
  MOVEMENTS: 'bb_stock_movements_v3',
  EXPENSES: 'bb_expenses_v3',
  CUSTOMERS: 'bb_customers_v3',
  COUPONS: 'bb_coupons_v3',
  LAST_PUSHED: 'bb_last_pushed_at_v3',
};

// Initial verified café settings
export const INITIAL_SETTINGS: CafeSettings = {
  cafeName: 'Brew & Bites Café',
  tagline: 'Artisanal Coffee, Gourmet Comfort & Fresh Bites in Alwar',
  phone: '+91 99292 21421',
  alternatePhone: '+91 96944 09598',
  email: 'hello@brewandbitesalwar.com',
  address: 'G Tower, Apna Ghar Shalimar, Alwar, Rajasthan 301001 (Near Wonder Mall & Company Garden Rd)',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=G+Tower%2C+Apna+Ghar+Shalimar%2C+Alwar%2C+Rajasthan+301001',
  hours: 'Daily 10:00 AM – 11:00 PM',
  slotStart: '10:00',
  slotEnd: '23:00',
  banner: '✨ Welcome to Brew & Bites! Flat 10% off on online orders with code BREW10',
  currency: 'INR',
  taxRatePercent: 5,
  deliveryFee: 30,
  freeDeliveryThreshold: 499,
  deliveryRadiusText: 'Serving Apna Ghar Shalimar, Sector 7, Company Garden Road & nearby Alwar areas within 5 km',
  isDeliveryEnabled: true,
  razorpayKeyId: 'rzp_test_BrewBitesAlwar2026',
  razorpaySecret: 'test_secret_sandbox_cafe9929',
  isRazorpayTestMode: true,
  enableSoundAlerts: true,
  adminPin: '123456789',
  lastPushedAt: Date.now(),
};

// Initial menu: Strictly text-based with NO dish photos
export const INITIAL_MENU: MenuItem[] = [
  // Starters
  {
    id: 'starter-1',
    name: 'Veg Manchurian Dry',
    category: 'Starters',
    description: 'Crisp vegetable dumplings tossed with ginger, scallions, garlic and dark soy glaze.',
    price: 180,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 12,
    variants: [
      { id: 'v-reg', name: 'Regular Portion', priceDelta: 0 },
      { id: 'v-lrg', name: 'Large Sharing Portion', priceDelta: 70 },
    ],
    addons: [
      { id: 'ad-spicy', name: 'Extra Sichuan Spice', price: 20 },
      { id: 'ad-dip', name: 'Chili Garlic Dip', price: 25 },
    ],
  },
  {
    id: 'starter-2',
    name: 'Chilli Paneer Dry',
    category: 'Starters',
    description: 'Golden fried fresh cottage cheese cubes wok-seared with bell peppers, green chilies, and tangy soy sauce.',
    price: 210,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: true,
    prepTimeMinutes: 14,
    variants: [
      { id: 'v-reg', name: 'Regular Portion', priceDelta: 0 },
      { id: 'v-lrg', name: 'Large Sharing Portion', priceDelta: 80 },
    ],
  },

  // Main Course
  {
    id: 'main-1',
    name: 'Chilli Paneer Gravy',
    category: 'Main Course',
    description: 'Tender paneer cubes simmered in a luscious oriental chili-garlic gravy, best paired with fried rice or noodles.',
    price: 230,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    prepTimeMinutes: 15,
  },
  {
    id: 'main-2',
    name: 'Veg Manchurian Gravy',
    category: 'Main Course',
    description: 'Crispy minced vegetable balls immersed in rich, savoury garlic-infused soy Manchurian sauce.',
    price: 190,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 15,
  },

  // Noodles and Fried Rice
  {
    id: 'noodle-1',
    name: 'Paneer Chowmein',
    category: 'Noodles & Fried Rice',
    description: 'Handcrafted wheat noodles wok-tossed with marinated paneer slivers, crunchy cabbage, carrots and spring onions.',
    price: 150,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 12,
  },
  {
    id: 'noodle-2',
    name: 'Chilli Garlic Noodles',
    category: 'Noodles & Fried Rice',
    description: 'Fiery street-style wok noodles tossed in roasted chili paste, minced garlic, and crunchy bell peppers.',
    price: 140,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    prepTimeMinutes: 12,
  },
  {
    id: 'noodle-3',
    name: 'Hakka Noodles',
    category: 'Noodles & Fried Rice',
    description: 'Classic mild seasoned noodles tossed with julienned vegetables, white pepper, and light aromatic soy.',
    price: 130,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 10,
  },
  {
    id: 'noodle-4',
    name: 'Veg Chowmein',
    category: 'Noodles & Fried Rice',
    description: 'Traditional Indo-Chinese chowmein loaded with fresh farm cabbage, onions, capsicum, and house seasoning.',
    price: 120,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 10,
  },
  {
    id: 'noodle-5',
    name: 'Chinese Fried Rice',
    category: 'Noodles & Fried Rice',
    description: 'Fragrant basmati rice wok-tossed with finely chopped garden vegetables, toasted garlic, and dark soy.',
    price: 150,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 12,
  },

  // Pizza
  {
    id: 'pizza-1',
    name: 'Paneer Pizza',
    category: 'Pizza',
    description: 'Crisp hand-stretched crust topped with spicy tikka paneer cubes, roasted capsicum, red onions, and melted mozzarella.',
    price: 220,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 16,
    variants: [
      { id: 'v-med', name: 'Medium 8"', priceDelta: 0 },
      { id: 'v-lrg', name: 'Large 10"', priceDelta: 100 },
    ],
    addons: [
      { id: 'ad-cheese', name: 'Extra Mozzarella Cheese', price: 40 },
      { id: 'ad-jalapeno', name: 'Spicy Pickled Jalapeños', price: 25 },
    ],
  },
  {
    id: 'pizza-2',
    name: 'Classic Margherita',
    category: 'Pizza',
    description: 'San Marzano style herb tomato sauce, double mozzarella, extra virgin olive oil drizzle, and fresh basil leaves.',
    price: 190,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 14,
    variants: [
      { id: 'v-med', name: 'Medium 8"', priceDelta: 0 },
      { id: 'v-lrg', name: 'Large 10"', priceDelta: 90 },
    ],
  },
  {
    id: 'pizza-3',
    name: 'House Farm Special',
    category: 'Pizza',
    description: 'Loaded with farm-fresh button mushrooms, sweet corn, black olives, crisp bell peppers, and herbs.',
    price: 260,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 16,
  },
  {
    id: 'pizza-4',
    name: 'Tandoori Indian Special',
    category: 'Pizza',
    description: 'Rich tandoori spiced sauce base with tandoori paneer, red onions, coriander sprinkle, and cheese burst crust.',
    price: 270,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: true,
    prepTimeMinutes: 16,
  },
  {
    id: 'pizza-5',
    name: 'Fresh Garden Pizza',
    category: 'Pizza',
    description: 'A light, crisp pie with diced juicy tomatoes, crisp bell peppers, sweet red onions, and Italian herbs.',
    price: 210,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 14,
  },
  {
    id: 'pizza-6',
    name: 'Tangy Spicy Pizza',
    category: 'Pizza',
    description: 'Zesty chili-tomato marinara topped with jalapeños, red paprika, spiced corn kernels, and melted mozzarella.',
    price: 230,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    prepTimeMinutes: 15,
  },
  {
    id: 'pizza-7',
    name: 'Veggie Delight',
    category: 'Pizza',
    description: 'Our all-time crowd favourite with green capsicum, crunchy onions, and golden American sweet corn.',
    price: 240,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 14,
  },
  {
    id: 'pizza-8',
    name: 'OTC Pizza (Onion, Tomato, Capsicum)',
    category: 'Pizza',
    description: 'Classic trio of onion, ripe tomato, and fresh green capsicum on herb marinara and melted cheese.',
    price: 210,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 14,
  },

  // Burgers
  {
    id: 'burger-1',
    name: 'Cheese Burger',
    category: 'Burgers',
    description: 'Crisp vegetable patty layered with cheddar cheese slice, fresh lettuce, tomato, and creamy herb mayonnaise.',
    price: 110,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 10,
    variants: [
      { id: 'b-single', name: 'Single Cheese', priceDelta: 0 },
      { id: 'b-double', name: 'Double Cheese Slice', priceDelta: 25 },
    ],
    addons: [
      { id: 'ad-fries', name: 'Side of Salted French Fries', price: 50 },
      { id: 'ad-peri', name: 'Peri Peri Dip', price: 20 },
    ],
  },
  {
    id: 'burger-2',
    name: 'Aloo Tikki Burger',
    category: 'Burgers',
    description: 'Golden spiced potato patty nestled in a soft toasted sesame bun with shredded cabbage, mint mayo, and tangy sauce.',
    price: 80,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 8,
  },
  {
    id: 'burger-3',
    name: 'Veg Burger',
    category: 'Burgers',
    description: 'Wholesome mixed vegetable cutlet with crisp lettuce, sliced cucumber, tomato, and house burger dressing.',
    price: 90,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 9,
  },
  {
    id: 'burger-4',
    name: 'Paneer Burger',
    category: 'Burgers',
    description: 'Crispy batter-crusted whole spiced cottage cheese steak with chipotle dressing, onions, and melted cheese.',
    price: 130,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 12,
  },
  {
    id: 'burger-5',
    name: 'Double Tikki Burger',
    category: 'Burgers',
    description: 'Twin stacked spiced vegetable patties with double cheese, caramelised onions, pickles, and creamy mayonnaise.',
    price: 140,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 12,
  },

  // Momos
  {
    id: 'momo-1',
    name: 'Tandoori Momos (8 pcs)',
    category: 'Momos',
    description: 'Dumplings stuffed with spiced cabbage, carrots and paneer, marinated in tandoori yogurt marinade and flame-charred.',
    price: 160,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: true,
    prepTimeMinutes: 14,
    addons: [
      { id: 'ad-mayo', name: 'Extra Mint Mayo Dip', price: 20 },
      { id: 'ad-chutney', name: 'Fiery Red Chili Chutney', price: 20 },
    ],
  },
  {
    id: 'momo-2',
    name: 'Veg Steamed Momos',
    category: 'Momos',
    description: 'Hand-pleated delicate translucent dumplings filled with finely grated fresh garden vegetables and mild herbs.',
    price: 120,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 10,
  },
  {
    id: 'momo-3',
    name: 'Fried Momos (8 pcs)',
    category: 'Momos',
    description: 'Golden crunchy deep-fried dumplings served piping hot with fiery garlic chutney and seasoned mayonnaise.',
    price: 140,
    isAvailable: true,
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    prepTimeMinutes: 12,
  },

  // Coffee & Artisanal Beverages
  {
    id: 'coffee-1',
    name: 'Artisanal Cappuccino',
    category: 'Coffee & Beverages',
    description: 'Freshly extracted double espresso shot topped with silky, micro-foamed hot milk and dusted cocoa.',
    price: 140,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 6,
    variants: [
      { id: 'c-reg', name: 'Single Shot (240ml)', priceDelta: 0 },
      { id: 'c-dbl', name: 'Double Shot Large (350ml)', priceDelta: 30 },
    ],
    addons: [
      { id: 'c-hazelnut', name: 'Hazelnut Syrup Shot', price: 30 },
      { id: 'c-vanilla', name: 'French Vanilla Syrup Shot', price: 30 },
    ],
  },
  {
    id: 'coffee-2',
    name: 'Specialty Cafe Latte',
    category: 'Coffee & Beverages',
    description: 'Rich dark espresso poured over steamed whole milk with a velvety crema layer and artisanal tulip latte art.',
    price: 150,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 6,
  },
  {
    id: 'coffee-3',
    name: 'Cold Coffee with Vanilla Ice Cream',
    category: 'Coffee & Beverages',
    description: 'Chilled blended espresso with rich creamy milk, sugar syrup, and crowned with a scoop of Madagascar vanilla ice cream.',
    price: 160,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 7,
  },
  {
    id: 'coffee-4',
    name: 'Authentic Masala Chai Kulhad',
    category: 'Coffee & Beverages',
    description: 'Slow-brewed Assam tea leaves infused with crushed ginger, green cardamom, cloves, and boiled fresh milk in clay kulhad.',
    price: 60,
    isAvailable: true,
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    prepTimeMinutes: 5,
  },
];

// Initial inventory records
export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Specialty Espresso Beans', category: 'Coffee', currentStock: 8.5, unit: 'kg', minThreshold: 3.0, costPerUnit: 1100, supplierName: 'Blue Tokai Estate' },
  { id: 'inv-2', name: 'Full Cream Milk', category: 'Dairy', currentStock: 24, unit: 'L', minThreshold: 10, costPerUnit: 68, supplierName: 'Saras Dairy Alwar' },
  { id: 'inv-3', name: 'Fresh Paneer (Malai)', category: 'Dairy', currentStock: 6.2, unit: 'kg', minThreshold: 2.5, costPerUnit: 340, supplierName: 'Local Dairy Sector 7' },
  { id: 'inv-4', name: 'Mozzarella Cheese Blend', category: 'Dairy', currentStock: 7.0, unit: 'kg', minThreshold: 3.0, costPerUnit: 480, supplierName: 'Amul Wholesale' },
  { id: 'inv-5', name: 'Artisanal Burger Buns', category: 'Bakery', currentStock: 45, unit: 'pcs', minThreshold: 20, costPerUnit: 14, supplierName: 'Alwar Artisan Bakers' },
  { id: 'inv-6', name: 'Takeaway Meal Boxes & Cups', category: 'Packaging', currentStock: 180, unit: 'pcs', minThreshold: 50, costPerUnit: 6.5, supplierName: 'EcoPack India' },
  { id: 'inv-7', name: 'Fresh Garden Veggies', category: 'Produce', currentStock: 14, unit: 'kg', minThreshold: 5, costPerUnit: 60, supplierName: 'Company Garden Mandi' },
  { id: 'inv-8', name: 'Momos Wrappers (Thin)', category: 'Bakery', currentStock: 120, unit: 'pcs', minThreshold: 40, costPerUnit: 2.5, supplierName: 'Orient Kitchen' },
];

// Initial orders: ZERO SELF-ORDERS! Starts completely clean.
export const INITIAL_ORDERS: Order[] = [];

// Initial bookings: Starts clean
export const INITIAL_RESERVATIONS: TableReservation[] = [];

// Initial expenses
export const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 'exp-1', title: 'Dairy & Fresh Paneer Purchase', category: 'Ingredients', amount: 3200, date: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', recordedAt: Date.now() - 1000 * 3600 * 6 },
  { id: 'exp-2', title: 'Coffee Beans 5kg Batch', category: 'Ingredients', amount: 5500, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], paymentMethod: 'Bank Transfer', recordedAt: Date.now() - 86400000 },
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'BREW10', type: 'percentage', value: 10, minOrderValue: 200, maxDiscount: 100, isActive: true, description: '10% off on all online orders above ₹200' },
  { code: 'WELCOME50', type: 'fixed', value: 50, minOrderValue: 300, isActive: true, description: 'Flat ₹50 off on orders above ₹300' },
  { code: 'CAFECOMBO', type: 'percentage', value: 15, minOrderValue: 500, maxDiscount: 150, isActive: true, description: '15% off for groups & combo orders above ₹500' },
];

// Audio chime using Web Audio API
export function playChime(frequency = 880, duration = 0.25) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

const memoryStore = new Map<string, string>();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback to memoryStore
    }
    return memoryStore.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback to memoryStore
    }
    memoryStore.set(key, value);
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Fallback to memoryStore
    }
    memoryStore.delete(key);
  },
};

// Notification event dispatcher for reactivity across components
export function notifyStoreChange() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('brew-bites-state-change', { detail: { timestamp: Date.now() } }));
    }
  } catch {
    // Ignore in restricted environments
  }
}

// Store Helper Methods
export const CafeStore = {
  getSettings(): CafeSettings {
    const raw = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: CafeSettings) {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifyStoreChange();
  },

  getMenu(): MenuItem[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.MENU);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    try {
      const items: MenuItem[] = JSON.parse(raw);
      // Strip any photos from dish objects to satisfy the zero-photo rule on dishes
      return items.map(({ image, ...rest }) => rest);
    } catch {
      return INITIAL_MENU;
    }
  },

  saveMenu(items: MenuItem[]) {
    // Save stripped dishes with no images
    const cleanItems = items.map(({ image, ...rest }) => rest);
    safeStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(cleanItems));
    notifyStoreChange();
  },

  updateMenuItem(updated: MenuItem) {
    const { image, ...cleanUpdated } = updated;
    const menu = this.getMenu();
    const idx = menu.findIndex((m) => m.id === cleanUpdated.id);
    if (idx >= 0) {
      menu[idx] = cleanUpdated;
    } else {
      menu.push(cleanUpdated);
    }
    this.saveMenu(menu);
  },

  deleteMenuItem(id: string) {
    const menu = this.getMenu().filter((m) => m.id !== id);
    this.saveMenu(menu);
  },

  getOrders(): Order[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      return [];
    }
    try {
      const parsed: Order[] = JSON.parse(raw);
      // Ensure no mock / self orders from older test sessions
      const clean = parsed.filter(
        (o) => o.id !== 'BB-ORD-1011' && o.id !== 'BB-ORD-1012' && o.id !== 'BB-ORD-1010'
      );
      if (clean.length !== parsed.length) {
        safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  },

  saveOrders(orders: Order[]) {
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyStoreChange();
  },

  createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // Update customer CRM record
    this.recordCustomerOrder(order);

    // Deduct stock for ingredients if recipe configured
    this.autoDeductStockForOrder(order);

    playChime(920, 0.3);
    return order;
  },

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'completed' && order.paymentStatus === 'pending' && order.paymentMethod === 'cash') {
        order.paymentStatus = 'verified';
      }
      order.statusHistory.push({
        status,
        timestamp: Date.now(),
        note,
      });
      this.saveOrders(orders);
      playChime(status === 'ready' ? 1040 : 880, 0.2);
    }
  },

  processRefund(orderId: string, amount: number, reason: string) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'refunded';
      order.paymentStatus = 'refunded';
      order.refundAmount = amount;
      order.refundTimestamp = Date.now();
      order.cancellationReason = reason;
      order.statusHistory.push({
        status: 'refunded',
        timestamp: Date.now(),
        note: `Refund of ₹${amount} issued: ${reason}`,
      });
      this.saveOrders(orders);
    }
  },

  cancelOrder(orderId: string, reason: string) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      order.cancellationReason = reason;
      order.statusHistory.push({
        status: 'cancelled',
        timestamp: Date.now(),
        note: `Order cancelled: ${reason}`,
      });
      this.saveOrders(orders);
    }
  },

  getReservations(): TableReservation[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
      return [];
    }
    try {
      const parsed: TableReservation[] = JSON.parse(raw);
      // Clean up legacy test reservations
      const clean = parsed.filter((r) => r.id !== 'res-1' && r.id !== 'res-2');
      if (clean.length !== parsed.length) {
        safeStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  },

  saveReservations(reservations: TableReservation[]) {
    safeStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    notifyStoreChange();
  },

  createReservation(reservation: TableReservation): TableReservation {
    const list = this.getReservations();
    list.unshift(reservation);
    this.saveReservations(list);
    playChime(880, 0.25);
    return reservation;
  },

  updateReservationStatus(id: string, status: TableReservation['status'], tableNumber?: string, adminNote?: string) {
    const list = this.getReservations();
    const r = list.find((item) => item.id === id);
    if (r) {
      r.status = status;
      if (tableNumber) r.tableNumber = tableNumber;
      if (adminNote) r.adminNote = adminNote;
      this.saveReservations(list);
      playChime(status === 'Confirmed' ? 1020 : 660, 0.2);
    }
  },

  getInventory(): InventoryItem[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  saveInventory(items: InventoryItem[]) {
    safeStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
    notifyStoreChange();
  },

  updateStock(itemId: string, change: number, type: StockMovement['type'], reason: string, staffName = 'Admin') {
    const inventory = this.getInventory();
    const item = inventory.find((i) => i.id === itemId);
    if (item) {
      item.currentStock = Math.max(0, Math.round((item.currentStock + change) * 100) / 100);
      if (type === 'purchase') {
        item.lastRestockedAt = Date.now();
      }
      this.saveInventory(inventory);

      // Record movement
      const movements = this.getStockMovements();
      movements.unshift({
        id: 'mov-' + Date.now(),
        inventoryItemId: itemId,
        itemName: item.name,
        type,
        quantityChange: change,
        reason,
        timestamp: Date.now(),
        recordedBy: staffName,
      });
      safeStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
    }
  },

  getStockMovements(): StockMovement[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  autoDeductStockForOrder(order: Order) {
    const inventory = this.getInventory();
    order.items.forEach((item) => {
      const lower = item.name.toLowerCase();
      if (lower.includes('coffee') || lower.includes('cappuccino') || lower.includes('latte')) {
        const coffee = inventory.find((i) => i.name.includes('Espresso Beans'));
        const milk = inventory.find((i) => i.name.includes('Milk'));
        if (coffee) coffee.currentStock = Math.max(0, coffee.currentStock - 0.018 * item.quantity);
        if (milk) milk.currentStock = Math.max(0, milk.currentStock - 0.22 * item.quantity);
      }
      if (lower.includes('paneer')) {
        const paneer = inventory.find((i) => i.name.includes('Paneer'));
        if (paneer) paneer.currentStock = Math.max(0, paneer.currentStock - 0.12 * item.quantity);
      }
      if (lower.includes('pizza')) {
        const cheese = inventory.find((i) => i.name.includes('Mozzarella'));
        if (cheese) cheese.currentStock = Math.max(0, cheese.currentStock - 0.1 * item.quantity);
      }
      if (lower.includes('burger')) {
        const buns = inventory.find((i) => i.name.includes('Burger Buns'));
        if (buns) buns.currentStock = Math.max(0, buns.currentStock - 1 * item.quantity);
      }
      if (lower.includes('momo')) {
        const wrappers = inventory.find((i) => i.name.includes('Momos Wrappers'));
        if (wrappers) wrappers.currentStock = Math.max(0, wrappers.currentStock - 8 * item.quantity);
      }
      if (order.type === 'takeaway' || order.type === 'delivery') {
        const boxes = inventory.find((i) => i.name.includes('Packaging'));
        if (boxes) boxes.currentStock = Math.max(0, boxes.currentStock - 1 * item.quantity);
      }
    });
    this.saveInventory(inventory);
  },

  getExpenses(): ExpenseRecord[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EXPENSES;
    }
  },

  addExpense(expense: ExpenseRecord) {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    notifyStoreChange();
  },

  deleteExpense(id: string) {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    safeStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    notifyStoreChange();
  },

  getCustomers(): CustomerRecord[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordCustomerOrder(order: Order) {
    if (!order.customerPhone) return;
    const cleanPhone = order.customerPhone.replace(/\D/g, '').slice(-10);
    const customers = this.getCustomers();
    const existing = customers.find((c) => c.phone === cleanPhone);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpend += order.grandTotal;
      existing.lastOrderDate = Date.now();
      if (order.customerName && !existing.name) existing.name = order.customerName;
    } else {
      customers.push({
        phone: cleanPhone,
        name: order.customerName || 'Guest Customer',
        email: order.customerEmail,
        ordersCount: 1,
        totalSpend: order.grandTotal,
        firstOrderDate: Date.now(),
        lastOrderDate: Date.now(),
        marketingOptIn: false,
      });
    }
    safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  getCoupons(): Coupon[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!raw) {
      safeStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  // Push all changes live to the entire website
  pushAllChangesToWeb(menuItems?: MenuItem[], updatedSettings?: CafeSettings) {
    if (menuItems) {
      this.saveMenu(menuItems);
    }
    if (updatedSettings) {
      const stampedSettings = {
        ...updatedSettings,
        lastPushedAt: Date.now(),
      };
      this.saveSettings(stampedSettings);
    }
    safeStorage.setItem(STORAGE_KEYS.LAST_PUSHED, String(Date.now()));
    notifyStoreChange();
    playChime(1040, 0.25);
  },

  resetAllSalesAndBookings(resetBookings = false) {
    safeStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    if (resetBookings) {
      safeStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    }
    notifyStoreChange();
    playChime(760, 0.2);
  },
};
