# Photopedia — Complete System Documentation & Codebase Guide

---

## 1. System Overview & Architecture

**Photopedia** is a high-performance, full-stack photography platform built for visual storytellers, photography creators, and curators. It features uncompressed photo feeds, real-time universal search, a multi-provider media uploader architecture (Local Storage, Cloudflare R2, AWS S3, DigitalOcean Spaces), full-screen photo lightbox viewports, camera EXIF metadata tracking, dynamic category archives, public creator portfolios, follower/following archives, author content editing controls, support contact desk, platform administrator moderation controls, and a dedicated LAMP-to-Modern-Stack learning guide (`PROJECT_GUIDE.md`).

### Technical Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS (Modular Architecture), Express, Passport JWT Authentication, Prisma ORM.
- **Media Storage Engine**: Standardized `IStorageProvider` interface with dynamic `STORAGE_PROVIDER` token supporting Local Storage, Cloudflare R2, AWS S3, and DigitalOcean Spaces.
- **Database**: SQLite (`dev.db`) managed with Prisma ORM migrations and studio GUI.
- **Styling**: Vercel/Framer-inspired dark mode aesthetic (monochrome black/white palette, `bg-black`, `bg-zinc-950`, `border-zinc-800`).
- **Learning Guide**: Complete 21-section step-by-step developer course guide (`PROJECT_GUIDE.md`).

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
│   │   │   ├── page.tsx              # Public Creators Directory Page (Loads all 21 creators)
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
│   │   │       └── page.tsx          # Publish Form with Drag & Drop Local Media Uploader
│   │   ├── profile/                  # User Profile Management
│   │   │   ├── page.tsx              # User Personal Profile Page
│   │   │   └── edit/
│   │   │       └── page.tsx          # Edit Profile Form with Local Avatar Photo Uploader
│   │   ├── support/                  # Support Desk & Appeal Form
│   │   │   └── page.tsx              # Public Support & Contact Desk Page
│   │   └── layout.tsx                # Vercel/Framer Styled Sidebar with Real-Time Search Bar
│   ├── components/                   # Atomic Shared Components
│   │   ├── PostCard.tsx              # Feed Photograph Card (Author Edit/Delete, Flag, Like)
│   │   ├── PhotoLightboxModal.tsx    # Full-Screen Photo Lightbox Modal Viewport
│   │   ├── PostCardSkeleton.tsx      # Animated Shimmer Skeleton Loading Component
│   │   ├── SidebarCategories.tsx     # Top Categories Widget with Shimmer Loaders & VIEW ALL Link
│   │   ├── SidebarCreators.tsx       # Suggested Creators Widget Component (Strict limit=5 & Shimmer)
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
│       └── api.ts                    # Centralized Axios API Client with uploadMedia method
├── server/                           # NestJS Backend API Server
│   ├── prisma/
│   │   ├── schema.prisma             # Optimized Prisma Database Schema
│   │   ├── dev.db                    # SQLite Database File
│   │   └── seed.ts                   # Full Seeding Script (20 Creators + 29 Verified Photos)
│   ├── uploads/                      # Local Media Asset Storage Directory
│   └── src/
│       ├── admin/                    # Admin Moderation Module (Overview, Users, Categories, Flagged)
│       ├── auth/                     # JWT Authentication & Passport Strategy Module (Blocked User Guard)
│       ├── media/                    # Media Module & Storage Interface Contracts
│       │   ├── media.controller.ts   # POST /media/upload, GET /media/url/*, DELETE /media/:key
│       │   ├── media.service.ts      # Media validation (MIME, 15MB limit) & storage delegation
│       │   ├── media.module.ts       # NestJS Media Module
│       │   ├── dto/
│       │   │   ├── upload-media.dto.ts
│       │   │   └── complete-upload.dto.ts
│       │   └── storage/
│       │       ├── storage.interface.ts # IStorageProvider interface contract
│       │       ├── storage.module.ts    # Dynamic STORAGE_PROVIDER token binding
│       │       ├── local.storage.ts     # Local Storage Provider (saves to /uploads)
│       │       ├── r2.storage.ts        # Cloudflare R2 Provider contract
│       │       ├── s3.storage.ts        # AWS S3 Provider contract
│       │       └── spaces.storage.ts    # DigitalOcean Spaces Provider contract
│       ├── posts/                    # Posts Module (Feed filtering, Real-Time Search, Likes, Comments, EXIF, Edit, Delete, Flag)
│       ├── users/                    # Users Module (Follow/Unfollow, Followers, Following, Suggested)
│       └── prisma/                   # Prisma ORM Global Module
├── PROJECT_GUIDE.md                  # Comprehensive LAMP/WordPress to Modern Stack Learning Guide
├── project_user_stories_audit.md     # Audit Checklist (30 User Stories Passed)
└── project_documentation.md         # Master System Guide
```

---

## 3. Core Modules & Endpoints

### Media Module (`/media`)
- `POST /media/upload` — Uploads image file (`file`) to storage provider (Local Storage `/uploads/`, R2, S3, or Spaces).
- `GET /media/url/*` — Resolves public URL for specified media key.
- `DELETE /media/:key` — Deletes media file from storage provider.

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
- `GET /users/suggested?limit=5` — Returns suggested creators directory (supports optional `limit` parameter).

### Posts Module (`/posts`)
- `GET /posts?category=...&feed=...&search=...` — Returns photograph feed (supports substring search across title, caption, tags, category, author name/username).
- `GET /posts/:id` — Returns single post with author, EXIF, and comments.
- `POST /posts` — Creates a new post with EXIF camera details.
- `PUT /posts/:id` — Updates post details & EXIF metadata (Author or Admin only).
- `DELETE /posts/:id` — Soft-deletes post from platform (Author or Admin only).
- `POST /posts/:id/like` — Toggles post like status.
- `POST /posts/:id/comment` — Adds a comment to a post.
- `POST /posts/:id/flag` — Flags post for Content Moderation Queue.

---

## 4. Storage Engine Architecture

- **Single Interface Contract**: All storage implementations adhere strictly to `IStorageProvider`:
  - `uploadFile(file: StorageFile, destinationFolder?: string): Promise<StorageUploadResult>`
  - `deleteFile(key: string): Promise<boolean>`
  - `getPublicUrl(key: string): Promise<string>`
- **Switching Storage Providers**: Configured dynamically via `STORAGE_DRIVER` environment variable (`local` | `r2` | `s3` | `spaces`).
