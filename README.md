# ✦ Omio Studio — Complete Setup Guide

> Premium Digital Agency Platform with full e-commerce order management, auth, admin panel, and email notifications.

---

## 🚀 Quick Start (5 Minutes)

### Option A — Frontend Only (No Setup Required)

Just open `index.html` in your browser! Everything works using localStorage.

- Register/Login ✅
- Submit orders ✅
- Admin panel ✅
- Order tracking ✅

### Option B — Full Stack (With Email Notifications)

```bash
# 1. Go into the project
cd "Omio Studio"

# 2. Install dependencies
npm install

# 3. Create environment file from template
# Windows (PowerShell):
Copy-Item .env.example .env
# macOS/Linux:
# cp .env.example .env

# 4. Edit .env with your values (especially Gmail for emails)
# See setup instructions below

# 5. Start server
npm start
# OR for development with auto-restart:
npm run dev

# 6. Open browser
# → http://localhost:4000
```

If `.env.example` is missing, create `.env` manually using the environment variables listed below.

---

## 🔑 Default Login Credentials

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@omio.studio  | admin123 |
| User  | Register any email | Any 6+ch |

---

## 📧 Email Notifications Setup (FREE)

You'll get email alerts whenever:

- A new user registers
- A new order is submitted
- An order status is updated

### Gmail App Password Setup:

1. Go to [Google Account](https://myaccount.google.com) → Security
2. Turn on **2-Step Verification**
3. Go to **App Passwords** → Select "Mail" → Generate
4. Copy the 16-character password into `.env` as `GMAIL_APP_PASS`
5. Set `GMAIL_USER=your.gmail@gmail.com`

```env
GMAIL_USER=omio.notifications@gmail.com
GMAIL_APP_PASS=abcd efgh ijkl mnop
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB (Development)

```bash
# Install MongoDB locally
# macOS:
brew install mongodb-community
brew services start mongodb-community

# Windows: Download from mongodb.com/try/download/community

# Leave MONGO_URI as:
MONGO_URI=mongodb://localhost:27017/omio_studio
```

### Option 2: MongoDB Atlas (FREE Cloud — Recommended)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free account
2. Create a FREE cluster (M0 - always free)
3. Create a database user
4. Get connection string → Add to `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/omio_studio
```

### Option 3: No Database (localStorage only)

Don't set MONGO_URI — it automatically uses `db.json` as fallback storage.

---

## 🌐 Deployment (FREE Options)

### Recommended: Render + MongoDB Atlas (Full Stack)

This project already includes `render.yaml`, so Render can auto-detect build/start settings.

1. Create a free MongoDB Atlas cluster (M0) and copy your connection string.
2. Push this project to GitHub.
3. Go to [render.com](https://render.com) → **New** → **Blueprint**.
4. Select your repository and deploy (Render reads `render.yaml`).
5. In Render service settings, set secret env values:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_PASS`
- email credentials (Gmail or SMTP)

6. Redeploy and verify:

- `https://<your-service>.onrender.com/api/health`

### Netlify/Vercel (Frontend-only)

Use this only if you want static pages without backend APIs (login/orders/admin APIs will not work).

---

## 🏗️ Project Structure

```
Omio Studio/
├── index.html       ← Complete SPA frontend (open this!)
├── server.js        ← Express backend API
├── package.json     ← Dependencies
├── .env.example     ← Environment template
├── .env             ← Your config (create from .env.example)
├── package-lock.json← Lock file
├── uploads/         ← Client uploaded files (auto-created)
└── db.json          ← JSON fallback database (auto-created)
```

---

## ⚙️ Environment Variables

Create `.env` in the project root:

```env
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/omio_studio

# Auth
JWT_SECRET=replace-with-a-strong-secret

# Admin Seed Account
ADMIN_EMAIL=admin@omio.studio
ADMIN_PASS=admin123

# Email (optional)
GMAIL_USER=
GMAIL_APP_PASS=
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:4000/api`

### Public

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/health`        | Service health + active storage mode |
| POST   | `/auth/register` | Register new user                    |
| POST   | `/auth/login`    | Login user                           |

### Auth Required (Bearer token)

| Method | Endpoint        | Description                        |
| ------ | --------------- | ---------------------------------- |
| GET    | `/auth/me`      | Get current user profile           |
| PUT    | `/auth/profile` | Update profile                     |
| POST   | `/orders`       | Create order (multipart/form-data) |
| GET    | `/orders/my`    | Get current user's orders          |
| GET    | `/orders/:id`   | Get single order                   |

### Admin Only

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/admin/orders`            | Get all orders            |
| PUT    | `/admin/orders/:id`        | Update order status/notes |
| DELETE | `/admin/orders/:id`        | Delete order              |
| GET    | `/admin/users`             | List users                |
| POST   | `/admin/orders/:id/upload` | Upload delivery files     |
| GET    | `/admin/stats`             | Dashboard counters        |

---

## ✅ Run And Verify

### Start app

```bash
npm start
```

### Check health endpoint

```bash
# PowerShell
Invoke-WebRequest http://localhost:4000/api/health | Select-Object -ExpandProperty Content

# macOS/Linux
# curl http://localhost:4000/api/health
```

Expected response contains `"status":"ok"` and database mode (`mongodb` or `json`).

---

## 🛠️ Troubleshooting

- `EADDRINUSE: address already in use :::4000`
  Stop the running server process or change `PORT` in `.env`.
- MongoDB connection fails
  App still runs in JSON fallback mode using `db.json`.
- Email not sending
  Set `GMAIL_USER` and `GMAIL_APP_PASS` correctly, and ensure Gmail App Password is enabled.
- Login fails for seeded admin
  Confirm `ADMIN_EMAIL` and `ADMIN_PASS` in `.env`, then restart server.

---

## 🎨 Features

### Landing Page

- ✦ Animated 3D wireframe geometry (Three.js)
- ✦ Connected particle network
- ✦ Floating glassmorphism chips
- ✦ Staggered hero text reveal
- ✦ Interactive 3D tilt on service cards
- ✦ Portfolio grid with hover overlays
- ✦ Process timeline
- ✦ Testimonials grid
- ✦ Animated ticker

### Auth System

- ✦ Register with email + auto welcome email
- ✦ Login with JWT token (or localStorage)
- ✦ Admin vs Client role separation
- ✦ Profile management

### Order System

- ✦ 11 service types with pricing
- ✦ File upload support (images, PDFs, ZIPs)
- ✦ Automatic email to admin on new order
- ✦ Automatic confirmation email to client
- ✦ Real-time price display
- ✦ Estimated delivery times

### Client Dashboard

- ✦ Order overview with stats
- ✦ Full order history table
- ✦ Order detail view
- ✦ Profile settings
- ✦ Status tracking

### Admin Panel

- ✦ All orders management
- ✦ Status updates (sends email to client)
- ✦ User management
- ✦ Order filtering
- ✦ File uploads for completed work
- ✦ Stats overview

---

## 💰 Pricing Structure (Configurable)

| Service          | Starting Price | Delivery   |
| ---------------- | -------------- | ---------- |
| Website Basic    | ₹3,000         | 7–10 days  |
| Website Business | ₹8,000         | 14–21 days |
| E-Commerce       | ₹20,000        | 21–45 days |
| Mobile App       | ₹25,000        | 30–60 days |
| Web App/SaaS     | ₹35,000        | 45–90 days |
| Logo Basic       | ₹800           | 3–5 days   |
| Logo Premium     | ₹2,500         | 5–7 days   |
| Full Branding    | ₹5,000         | 7–14 days  |
| UI/UX Design     | ₹6,000         | 7–14 days  |
| Graphics Kit     | ₹1,500         | 2–5 days   |

---

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Change admin password after first login
- Use MongoDB Atlas with IP whitelist in production
- Enable HTTPS (Render/Railway do this automatically)

---

## 📞 Support

Built by Omio Studio · omio.studio · hello@omio.studio
