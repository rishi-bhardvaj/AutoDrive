# AutoDrive Rentals & Services - Production-Style Automotive Platform

A full-stack web application designed for local automotive businesses in India offering:
1. **Car Rentals** (Daily & weekly self-drive / chauffeur rentals)
2. **Car Workshop & Service** (Multi-brand periodic maintenance & repairs)
3. **Certified Used Cars for Sale** (120-point inspected pre-owned cars)
4. **Sell Your Car** (Doorstep evaluation & instant valuation requests)
5. **Staff / Admin Portal** (Fleet CRUD, booking conflict prevention, workshop jobs, push notifications)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, Web Push API, Zod Validation, JWT Authentication
- **Database**: PostgreSQL (`carzz_db`)

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running on `localhost:5432`

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/carzz_db?schema=public"
JWT_SECRET="carzz-super-secret-jwt-key-2026-production"
VAPID_PUBLIC_KEY="BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
VAPID_PRIVATE_KEY="UUxI2qFj_Nf9vX-J_gZz3pQvY0MvE5XvB-Z7fX9z8sM"
VAPID_EMAIL="admin@autodrivecars.in"
```

Push database schema and seed realistic everyday Indian fleet:
```bash
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Backend runs at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🔑 Admin Credentials (Staff Portal)

- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@carzz.com`
- **Password**: `admin123`

---

## 🚗 Fleet & Rates (Everyday Practical Cars)

- **Maruti Suzuki WagonR VXi (CNG / Petrol)**: ₹1,200 / day
- **Hyundai Grand i10 Nios**: ₹1,400 / day
- **Maruti Suzuki Swift VXi**: ₹1,500 / day
- **Maruti Suzuki Dzire VXi Sedan**: ₹1,800 / day
- **Honda City 1.5 V Petrol**: ₹2,200 / day
- **Maruti Suzuki Ertiga 7-Seater CNG**: ₹2,400 / day
- **Hyundai Creta 1.5 S**: ₹2,600 / day
- **Toyota Innova Crysta 2.4 GX (7 Seater)**: ₹3,500 / day

---

## ⚙️ Central Business Configuration

All business information (Name, WhatsApp number, phone, email, address, working hours) is centralized in:
`frontend/src/config/business.ts`
`backend/src/config/index.ts`
