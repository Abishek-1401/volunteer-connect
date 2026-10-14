# VolunteerConnect 🤝

A dedicated social media and impact portfolio platform for volunteers and social service workers to document verified service hours, showcase real community outcomes, socialize, and inspire new volunteers.

---

## 🎨 Color Palette (60-30-10 Rule)
- **60% Neutral Background**: Off-white (`#F8FAFC`) with Card White (`#FFFFFF`) and Dark Slate text (`#0F172A`)
- **30% Primary**: Deep Teal (`#0F766E`) and Primary Hover (`#115E59`) for headers, buttons, and badges
- **10% Accent**: Warm Orange (`#F97316`) for badges, verified service hours, "Like" heart reactions, and the Inspire feed
- **Status Colors**: Success (`#16A34A`), Error (`#DC2626`), Warning (`#F59E0B`)
- **Typography**: Inter (Google Fonts)

---

## 🚀 Key Features

1. **Role-Based Authentication**
   - Step 1: Role choice (**Volunteer** or **Social Service Worker**)
   - Step 2: Full name, unique email, password (min 8 chars, toggle), city location, terms agreement
   - Step 3: Role-specific fields:
     - **Volunteer**: Causes multi-select (*Education, Environment, Health, Animals, Disaster relief, etc.*) & Availability
     - **Social Service Worker**: Organization/NGO name, Designation, Focus areas, Website link
   - Automatic login on signup with "Complete your profile" guidance.

2. **Profile as Living Impact Portfolio**
   - Header banner, avatar, bio, location, causes, skills
   - Total verified volunteer hours counter
   - Documented activities timeline (title, organization, date, hours, description) with full CRUD operations for owners

3. **Community Feed**
   - Create post with text, cause tag, and optional image
   - Warm Orange (`#F97316`) like reactions
   - Expandable comments section

4. **Explore Directory**
   - Search volunteers and social workers by keyword, city, role, and cause pills
   - Portfolio preview cards with direct links to `/profile/:id`

5. **Inspire Section ("Impact Stories")**
   - Stories feed highlighting milestones (*e.g., "500 Trees Planted", "40 Youth Mentored"*)
   - Community "Inspire" reactions
   - "Share Your Impact Story" submission modal

6. **Account Settings**
   - Update bio, avatar, skills, causes, availability, and organization details
   - Secure password update
   - Session logout

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, React Router 7, Axios, Lucide Icons, Plain CSS Design System
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs
- **Database**: MongoDB Atlas (or local MongoDB with automatic in-memory fallback)

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Atlas or local `mongodb://127.0.0.1:27017/volunteer_connect`)

### 2. Backend Setup
```bash
cd server
npm install
```
Create `server/.env` (see `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/volunteer_connect
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start backend:
```bash
npm run start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## ⚡ 1-Click Demo Accounts
- **Volunteer**: `maya@volunteer.org` / `Password123!`
- **Social Service Worker**: `marcus@greenearth.org` / `Password123!`
