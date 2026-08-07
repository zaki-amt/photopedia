# Photopedia — Complete System Documentation & Codebase Guide

---

## 1. System Overview & Architecture

**Photopedia** is a high-performance, full-stack photography platform built for visual storytellers, creators, and curators. It features uncompressed photo feeds, camera EXIF metadata tracking, dynamic category archives, public creator portfolios, follower/following archives, and admin moderation controls.

### Technical Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS (Modular Architecture), Express, Passport JWT Authentication, Prisma ORM.
- **Database**: SQLite (`dev.db`) managed with Prisma ORM migrations and studio GUI.
- **Styling**: Vercel/Framer-inspired dark mode aesthetic (monochrome black/white palette, `bg-black`, `bg-zinc-950`, `border-zinc-800`).

---

## 2. Comprehensive Directory & File Structure

```
photopedia/
├── app/                              # Next.js App Router (Frontend)
│   ├── (auth)/                       # Authentication Route Group
│   │   ├── login/
│   │   │   └── page.tsx              # Sign In Page with interactive Quick-Fill demo credentials
│   │   └── register/
│   │       └── page.tsx              # Sign Up Page with automatic session redirection
│   ├── (dashboard)/                  # Dashboard & Public Content Layout Group
│   │   ├── admin/                    # Admin Moderation System
│   │   │   ├── layout.tsx            # Admin Tab Navigation Guard
│   │   │   ├── page.tsx              # Admin Overview Dashboard
│   │   │   ├── posts/
      │   │   │   └── page.tsx          # Post Moderation & Delete Control
│   │   │   └── users/
│   │   │       └── page.tsx          # User Role & Status Moderation
│   │   ├── category/                 # Category Archive Directory
│   │   │   ├── page.tsx              # All Categories Overview Page
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Dynamic Category Archive (e.g. /category/landscape)
│   │   ├── creators/                 # Public Creator Network
│   │   │   ├── page.tsx              # Public Creators Directory Page
│   │   │   └── [username]/
│   │   │       └── page.tsx          # Public Creator Profile Archive Page (Clickable Metrics Modal)
│   │   ├── feed/                     # Feed & Photograph Single Views
│   │   │   ├── page.tsx              # Main Photograph Feed Page (For You & Following Tabs)
│   │   │   ├── components/
│   │   │   │   ├── FeedTabs.tsx      # All / Following Tab Switcher Component
│   │   │   │   └── FollowingEmptyState.tsx # Empty State View when 0 follows
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Single Post Detail Page (EXIF, Comments, Red LikeButton)
│   │   │   └── new/
│   │   │       └── page.tsx          # Publish Photograph Form (Database persistence + EXIF)
│   │   ├── profile/                  # User Profile Management
│   │   │   ├── page.tsx              # User Personal Profile Page
│   │   │   └── edit/
│   │   │       └── page.tsx          # Edit Profile Form (Avatar, Bio, Camera Gear)
│   │   └── layout.tsx                # Framer/Vercel Styled Sidebar & Top Bar Breadcrumbs
│   ├── components/                   # Atomic Shared Components
│   │   ├── PostCard.tsx              # Feed Photograph Card Component
│   │   ├── SidebarCategories.tsx     # Categories Listing Widget Component
│   │   ├── SidebarCreators.tsx       # Suggested Creators Widget Component (Self-Syncing Follow State)
│   │   ├── UserAvatar.tsx            # Reusable Avatar Component with Universal Fallback
│   │   ├── UserNameLink.tsx          # Reusable Author Permalink Component (/creators/[username])
│   │   ├── LikeButton.tsx            # Red Filled Heart Like Button Component
│   │   ├── FollowButton.tsx          # Isolated Follow/Following Toggle Button Component
│   │   ├── UserListItem.tsx          # User List Item Row Component
│   │   └── FollowersFollowingModal.tsx # Interactive Followers/Following Archive Modal
│   ├── hooks/                        # Custom Business Logic Hooks
│   │   ├── useLike.ts                # Like/Unlike State, Count, and API Integration Hook
│   │   ├── useFollow.ts              # Follow/Unfollow State, Async Sync, and API Hook
│   │   ├── useFollowList.ts          # Fetch Followers & Following Lists Hook
│   │   └── useFeed.ts                # Feed Tab Switcher & Data Fetching Hook
│   └── lib/
│       └── api.ts                    # Centralized Axios API Client
├── server/                           # NestJS Backend API Server
│   ├── prisma/
│   │   ├── schema.prisma             # Optimized Prisma Database Schema
│   │   └── dev.db                    # SQLite Database File
│   └── src/
│       ├── admin/                    # Admin Moderation Module
│       ├── auth/                     # JWT Authentication & Passport Strategy Module
│       ├── posts/                    # Posts Module (Feed filtering, Likes, Comments, EXIF)
│       ├── users/                    # Users Module (Follow/Unfollow, Followers, Following)
│       └── prisma/                   # Prisma ORM Global Module
└── project_documentation.md         # Master System Guide
```

---

## 3. Core Modules & Endpoints

### Auth Module (`/auth`)
- `POST /auth/register` — Registers a new user.
- `POST /auth/login` — Returns JWT access token.

### Users Module (`/users`)
- `GET /users/:username` — Returns public user profile, camera gear, and posts.
- `PUT /users/profile` — Updates authenticated user profile details.
- `POST /users/:id/follow` — Follows/toggles follow status for creator.
- `DELETE /users/:id/follow` — Unfollows target creator.
- `GET /users/me/following-ids` — Returns array of followed user IDs.
- `GET /users/:username/followers` — Returns list of followers.
- `GET /users/:username/following` — Returns list of following users.
- `GET /users/suggested` — Returns suggested creators directory.

### Posts Module (`/posts`)
- `GET /posts?category=...&feed=...` — Returns photograph feed (supports `feed=following`).
- `GET /posts/:id` — Returns single post with author, EXIF, and comments.
- `POST /posts` — Creates a new post with EXIF camera details.
- `POST /posts/:id/like` — Toggles post like status.
- `POST /posts/:id/comment` — Adds a comment to a post.

---

## 4. UI Architecture & Design Guidelines

1. **Framer/Vercel Aesthetic**: High-contrast monochrome palette, subtle borders (`border-zinc-800`), glassmorphic backdrop blurs, and clean typography (Inter / Outfit font family).
2. **Atomic Single-Responsibility Components**: UI logic separated into dedicated components (`UserAvatar`, `UserNameLink`, `LikeButton`, `FollowButton`, `UserListItem`, `FollowersFollowingModal`).
3. **Custom Hooks for Business Logic**: State and network interactions managed cleanly inside `useLike`, `useFollow`, `useFollowList`, and `useFeed`.
