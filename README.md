# ☕ Brew & Bites Café — Web Application & Operations Platform

A complete, responsive web application and café operations platform for **Brew & Bites Café** (Alwar, Rajasthan). Built with modern **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 🛒 Customer Facing
- **Digital Menu**: Interactive catalog with categories (Starters, Main Course, Artisanal Coffee, Pizzas, Shakes, Desserts, Combos), portion sizes, addons, spicy indicators, and vegetarian tags.
- **Shopping Cart**: Real-time slide-over cart drawer with quantity steppers, instant subtotal calculation, coupon discounts, and tax calculation.
- **Mobile Responsive & Sticky Cart**: Mobile-first design with persistent floating bottom cart indicator and responsive navigation.
- **Online Checkout**: Dine-in, Takeaway, and Home Delivery with order placement and verification.
- **Order Tracking**: Live visual status tracking using unique Order IDs.
- **Table Reservations**: Real-time table booking with date/time pickers, guest counters, and instant WhatsApp confirmation generation.
- **Bilingual Interface**: Seamless switching between English and Hindi.

### 🛡️ Admin & Operations Hub
- **Executive Overview**: Real-time revenue, gross sales, active orders, today's bookings, and quick action bars.
- **Orders Management**: Live order queue, filter by dine-in/takeaway/delivery, status updates, and refund processing.
- **Menu Engineering**: Add/edit items, pricing, availability toggles, categories, and push live changes.
- **Table Booking Manager**: Accept/decline reservations with automated WhatsApp messaging.
- **Expense & P&L Tracker**: Daily business expense logging with net profit calculation.
- **Sales Analytics**: 7-day, 30-day, and custom period sales breakdown and top-selling items ranking.
- **Café Settings**: Update café hours, address, phone numbers, delivery radius, and admin PIN.
- **Staff POS & Kitchen Display (KDS)**: Walk-in counter billing POS and live kitchen order display.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Persistence**: Browser local/session storage with store event pub/sub.

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed.

### 1. Clone or Download Repository
```bash
git clone https://github.com/YOUR_USERNAME/brew-and-bites-cafe.git
cd brew-and-bites-cafe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port Vite provides) to see the app running live.

### 4. Build for Production
```bash
npm run build
```
This produces an optimized production build in the `dist/` directory ready for deployment.

---

## 🔑 Default Credentials & Access

- **Admin & Staff Access Passkey**: `123456789`
  *(Can also be changed in Admin Dashboard → Café Settings)*
- **Direct Admin Button**: Located in the top header bar, mobile drawer, and footer.

---

## 🚢 Deploying to GitHub & Hosting

### Option A: Free Vercel Deployment (Recommended)
1. Push this repository to GitHub (see instructions in guide).
2. Go to [vercel.com](https://vercel.com/) and connect your GitHub account.
3. Import the repository — Vercel will automatically detect Vite.
4. Click **Deploy**.

### Option B: Free Netlify Deployment
1. Go to [netlify.com](https://netlify.com/).
2. Click **Add new site** → **Import an existing project** from GitHub.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Click **Deploy site**.

---

## 📄 License
This project is licensed under the Apache 2.0 License.
