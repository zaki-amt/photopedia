# Photopedia — Complete System Documentation & Codebase Guide

---

## 1. System Overview & Architecture

**Photopedia** is a high-performance, full-stack photography platform built for visual storytellers, photography creators, and curators. It features uncompressed photo feeds, real-time universal search, full-screen photo lightbox viewports, camera EXIF metadata tracking, dynamic category archives, public creator portfolios, follower/following archives, author content editing controls, support contact desk, and platform administrator moderation controls.

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
│   │   ├── admin/                    # Platform Administrator Controls
│   │   │   ├── layout.tsx            # Admin Tab Navigation Guard
│   │   │   ├── page.tsx              # Dynamic Admin System Overview Dashboard
│   │   │   ├── categories/
│   │   │   │   └── page.tsx          # Category Manager (Add & View Categories)
│   │   │   ├── posts/
│   │   │   │   └── page.tsx          # Content Moderation Queue & Flag Review
│   │   │   └── users/
│   │   │       └── page.tsx          # User Directory (Block/Unblock, Role Assign, Soft-Delete)
│   │   ├── category/                 # Category Archive Directory
│   │   │   ├── page.tsx              # All Categories Overview Page
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Dynamic Category Archive (e.g. /category/landscape)
│   │   ├── creators/                 # Public Creator Network
│   │   │   ├── page.tsx              # Public Creators Directory Page
│   │   │   └── [username]/
│   │   │       └── page.tsx          # Public Creator Profile Archive Page (Clickable Metrics Modal)
│   │   ├── feed/                     # Feed & Photograph Views
│   │   │   ├── page.tsx              # Main Photograph Feed Page (For You & Following Tabs, Search Filter)
│   │   │   ├── components/
│   │   │   │   ├── FeedTabs.tsx      # All / Following Tab Switcher Component
│   │   │   │   └── FollowingEmptyState.tsx # Empty State View when 0 follows
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Single Post Detail Page (EXIF, Comments, Red LikeButton, Lightbox Modal, Flag/Delete)
│   │   │   │   └── edit/
│   │   │       └── page.tsx      # Author Edit Photograph Form (Title, Caption, Category, EXIF)
│   │   │   └── new/
│   │   │       └── page.tsx          # Publish Photograph Form (Database persistence + EXIF)
│   │   ├── profile/                  # User Profile Management
│   │   │   ├── page.tsx              # User Personal Profile Page
│   │   │   └── edit/
│   │   │       └── page.tsx          # Edit Profile Form (Avatar, Bio, Camera Gear)
│   │   ├── support/                  # Support Desk & Appeal Form
│   │   │   └── page.tsx              # Public Support & Contact Desk Page
│   │   └── layout.tsx                # Vercel/Framer Styled Sidebar with Real-Time Search Bar
│   ├── components/                   # Atomic Shared Components
│   │   ├── PostCard.tsx              # Feed Photograph Card (Author Edit/Delete, Flag, Like)
│   │   ├── PhotoLightboxModal.tsx    # Full-Screen Photo Lightbox Modal Viewport
│   │   ├── PostCardSkeleton.tsx      # Animated Shimmer Skeleton Loading Component
│   │   ├── SidebarCategories.tsx     # Top Categories Widget with Shimmer Loaders & VIEW ALL Link
│   │   ├── SidebarCreators.tsx       # Suggested Creators Widget Component (Self-Syncing Follow State & Shimmer)
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
│   │   └── useFeed.ts                # Feed Tab Switcher, Search Query & Data Fetching Hook
│   └── lib/
│       └── api.ts                    # Centralized Axios API Client
├── server/                           # NestJS Backend API Server
│   ├── prisma/
│   │   ├── schema.prisma             # Optimized Prisma Database Schema
│   │   ├── dev.db                    # SQLite Database File
│   │   └── seed.ts                   # Full Seeding Script (20 Creators + 29 Verified Photos)
│   └── src/
│       ├── admin/                    # Admin Moderation Module (Overview, Users, Categories, Flagged)
│       ├── auth/                     # JWT Authentication & Passport Strategy Module (Blocked User Guard)
│       ├── posts/                    # Posts Module (Feed filtering, Real-Time Search, Likes, Comments, EXIF, Edit, Delete, Flag)
│       ├── users/                    # Users Module (Follow/Unfollow, Followers, Following, Suggested)
│       └── prisma/                   # Prisma ORM Global Module
└── project_documentation.md         # Master System Guide
```

---

## 3. Core Modules & Endpoints

### Auth Module (`/auth`)
- `POST /auth/register` — Registers a new user.
- `POST /auth/login` — Returns JWT access token (Validates user status is NOT `BLOCKED`).

### Users Module (`/users`)
- `GET /users/:username` — Returns public user profile, camera gear, and posts.
- `PUT /users/profile` — Updates authenticated user profile details.
- `POST /users/:id/follow` — Follows/toggles follow status for creator.
- `DELETE /users/:id/follow` — Unfollows target creator.
- `GET /users/me/following-ids` — Returns array of followed user IDs.
- `GET /users/:username/followers` — Returns list of followers.
- `GET /users/:username/following` — Returns list of following users.
- `GET /users/suggested` — Returns suggested creators directory (Excludes `ADMIN` role users).

### Posts Module (`/posts`)
- `GET /posts?category=...&feed=...&search=...` — Returns photograph feed (supports `feed=following` and real-time substring search across title, caption, tags, category, and author name/username).
- `GET /posts/:id` — Returns single post with author, EXIF, and comments.
- `POST /posts` — Creates a new post with EXIF camera details.
- `PUT /posts/:id` — Updates post details & EXIF metadata (Author or Admin only).
- `DELETE /posts/:id` — Soft-deletes post from platform (Author or Admin only).
- `POST /posts/:id/like` — Toggles post like status.
- `POST /posts/:id/comment` — Adds a comment to a post.
- `POST /posts/:id/flag` — Flags post for Content Moderation Queue.

### Admin Module (`/admin`)
- `GET /admin/metrics` — Returns live platform overview metrics & activity logs.
- `GET /admin/users` — Returns user directory with roles and block status.
- `POST /admin/users/:id/role` — Toggles user role (`ADMIN` ↔ `USER`).
- `POST /admin/users/:id/status` — Toggles user block status (`ACTIVE` ↔ `BLOCKED`).
- `DELETE /admin/users/:id` — Soft-deletes user account.
- `GET /admin/moderation` — Returns flagged posts queue.
- `POST /admin/moderation/:id` — Approves or removes flagged post.

---

## 4. UI Architecture & Design Guidelines

1. **Framer/Vercel Aesthetic**: High-contrast monochrome palette, subtle borders (`border-zinc-800`), glassmorphic backdrop blurs, and clean typography.
2. **Full-Screen Photo Lightbox**: Interactive viewport modal (`PhotoLightboxModal`) with uncompressed aspect fit, EXIF camera readout, keyboard shortcuts, and original URL export.
3. **Animated Shimmer Loaders**: Vercel-style CSS `@keyframes shimmer` skeleton loading states (`PostCardSkeleton`, `SidebarCreatorsSkeleton`, `SidebarCategoriesSkeleton`) for smooth visual feedback.
4. **Real-Time Search Bar**: Top sidebar search bar input routing queries to `/feed?search=query` with active filter badges and one-click reset controls.
5. **Atomic Single-Responsibility Components**: UI logic separated into dedicated components (`UserAvatar`, `UserNameLink`, `LikeButton`, `FollowButton`, `UserListItem`, `FollowersFollowingModal`).
6. **Custom Hooks for Business Logic**: State and network interactions managed cleanly inside `useLike`, `useFollow`, `useFollowList`, and `useFeed`.
