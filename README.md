# Photopedia 📸 — Full-Stack Photography & Social Platform

Photopedia is a modern, high-performance photography platform built for visual storytellers, photography creators, and curators. It features uncompressed photo feeds, real-time universal search, camera EXIF metadata tracking, full-screen lightbox viewports, dynamic category archives, creator portfolios, social follow feeds, author content editing, interactive moderation controls, and administrative management tools.

---

## 🌟 Key Features

### 📷 Visual Storytelling & Lightbox
- **Uncompressed Photo Feeds**: Dynamic feed supporting **"For You"** and **"Following"** segmented feeds.
- **Full-Screen Lightbox Viewer**: Click any photo or the **View Full Photo** button to inspect high-resolution photographs in a dark glassmorphic lightbox with EXIF gear metadata and raw link export.
- **Real-Time Universal Search**: Search bar searching across titles, captions, categories, tags, and creator names/usernames in real time with interactive clear badges.
- **EXIF Camera Metadata**: Automatic camera gear tracking (Camera model, Lens, Aperture, Shutter speed, ISO).
- **Dynamic Category Archives**: Explore photographs filtered by category (Landscape, Urban & Street, Portraits, Architecture, Astro & Night, Seascape).
- **Single Shot Detail View**: Dedicated photo view with author bio, EXIF data card, engagement counters, and comments thread.

### ✍️ User Content Management
- **Author Post Editing**: Authors can update their published titles, captions, categories, tags, and EXIF gear details (`/feed/[id]/edit`).
- **Author Post Deletion**: Authors can delete their own published photos on the spot directly from post cards or detail pages.

### 🎨 Premium UI & Micro-Animations
- **Animated Shimmer Loaders**: Vercel-inspired CSS `@keyframes shimmer` skeleton loading states (`PostCardSkeleton`, `SidebarCreatorsSkeleton`, `SidebarCategoriesSkeleton`) for smooth visual feedback.
- **Vercel Dark Mode Aesthetic**: High-contrast monochrome black/white palette, glassmorphic blurs, hover scaling, and clean typography.

### 👥 Social Architecture & Creator Networks
- **Follow & Unfollow System**: Toggle follow state across feed post cards, creator profiles, and suggested creator widgets.
- **Red Filled Heart Likes**: Atomic like button rendering red filled hearts (`fill-rose-500 text-rose-500`) with optimistic count synchronization.
- **Clickable Portfolio Metrics**: Interactive Followers & Following counts on creator profile pages opening an archive modal list with direct unfollow controls.
- **Suggested Creators Directory**: Live list of active photography creators with one-click follow buttons.

### 🛡️ Content Moderation & Reporting
- **Community Flagging**: Interactive **Flag / Report** button on post cards and detail pages to send inappropriate photos to the Content Moderation Queue.
- **Admin Moderation Queue**: Dedicated queue view (`/admin/posts`) for platform administrators to review flagged submissions, approve photos, or soft-delete content.

### ⚡ Platform Administrator Controls
- **Admin On-The-Spot Feed Deletion**: Admins can instantly delete inappropriate posts directly from feeds or single post views via a dedicated red **Delete** button.
- **Category Manager**: Create and manage platform photography categories with custom icons and descriptions (`/admin/categories`).
- **User Directory Management**: View user accounts, assign `ADMIN` or `USER` roles, block/unblock accounts, or soft-delete creator profiles (`/admin/users`).
- **Automated Block Guard**: Blocked users are immediately prevented from logging in or accessing authenticated endpoints with clear support instructions.
- **Support Contact Desk**: Public contact form (`/support`) for account inquiries and unblock appeals.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router + Turbopack), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS (Vercel/Framer monochrome dark mode palette), Lucide Icons |
| **Backend Framework** | NestJS (Modular Architecture), Passport JWT Authentication |
| **Database & ORM** | SQLite (`dev.db`) managed via Prisma ORM & Prisma Studio |
| **API Client** | Centralized Axios/Fetch API wrapper with JWT interceptors |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Backend API Setup & Database Seed (NestJS + Prisma)
```bash
# Navigate to backend server directory
cd server

# Install dependencies
npm install

# Push database schema & run migrations
npx prisma db push

# Seed 20 photography creators + 29 verified Unsplash photos with EXIF & social data
npx ts-node prisma/seed.ts

# Start NestJS development server (running on http://localhost:4000)
npm run start:dev
```

### 2. Frontend Application Setup (Next.js)
```bash
# In the main project directory
npm install

# Start Next.js development server (running on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser to view Photopedia.

---

## 🔑 Quick-Fill Demo Credentials

The login page (`/login`) includes interactive quick-fill buttons to quickly log in as demo users:

| User Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@photopedia.com` | `AdminPass123!` | Full platform management controls, moderation queue, user directory, on-the-spot post deletion |
| **Creator 1** | `elena@example.com` | `AdminPass123!` | Active landscape photography creator |
| **Creator 2** | `liam@example.com` | `AdminPass123!` | Active minimalist architecture creator |
| **Creator 3** | `maya@example.com` | `AdminPass123!` | Active astrophotography creator |

---

## 📂 Project Architecture

```
photopedia/
├── app/                              # Next.js App Router (Frontend)
│   ├── (auth)/                       # Authentication Route Group (Login, Register)
│   ├── (dashboard)/                  # Dashboard & Public Views
│   │   ├── admin/                    # Admin Panel (Overview, Categories, Users, Moderation)
│   │   ├── category/                 # Category Archives (/category/[slug])
│   │   ├── creators/                 # Public Creator Portfolios (/creators/[username])
│   │   ├── feed/                     # Main Feed, Single View (/feed/[id]), Edit View (/feed/[id]/edit), Publish (/feed/new)
│   │   ├── profile/                  # User Profile & Settings (/profile/edit)
│   │   └── support/                  # Support Desk Contact Form (/support)
│   ├── components/                   # PostCard, PhotoLightboxModal, PostCardSkeleton, SidebarCategories, SidebarCreators
│   ├── hooks/                        # Custom Hooks (useFeed, useLike, useFollow, useFollowList)
│   └── lib/                          # Centralized API Wrapper (api.ts)
├── server/                           # NestJS Backend API Server
│   ├── prisma/                       # Schema, SQLite dev.db, Seed Script (seed.ts)
│   └── src/                          # Admin, Auth, Posts, Users Modules
└── project_documentation.md         # Full Technical & Architecture Guide
```
