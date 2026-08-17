# Photopedia — Complete System Documentation & Codebase Guide

---

## 1. System Overview & Architecture

**Photopedia** is a high-performance, SaaS-ready full-stack photography platform built for visual storytellers, photography creators, and curators. It features uncompressed photo feeds, real-time universal search, a multi-provider media uploader architecture (Local Storage, Cloudflare R2, AWS S3, DigitalOcean Spaces), full-screen photo lightbox viewports, camera EXIF metadata tracking, dynamic category archives, public creator portfolios, follower/following archives, author content editing controls, support contact desk, platform administrator moderation controls, modular SaaS layouts (`HeaderNav`, `SidebarNav`, `AdminSidebarNav`, `Footer`, `useAuth`), and a dedicated LAMP-to-Modern-Stack learning guide (`PROJECT_GUIDE.md`).

### Technical Stack

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: NestJS (Modular DTO Architecture with `class-validator`), Express, Passport JWT Authentication, Prisma ORM.
- **API Formatting & Filters**: Global `TransformInterceptor` (pretty `{ statusCode, success, message, data, path, timestamp }` envelope), `HttpExceptionFilter` (standardized error JSON), and step-by-step inline server comments.
- **Media Storage Engine**: Standardized `IStorageProvider` interface with dynamic `STORAGE_PROVIDER` token supporting Local Storage, Cloudflare R2, AWS S3, and DigitalOcean Spaces.
- **Database**: SQLite (`dev.db`) managed with Prisma ORM migrations, studio GUI, and standardized lowercase `"user"`/`"admin"` roles and `"active"` status.
- **Styling**: Vercel/Framer-inspired dark mode aesthetic (monochrome black/white palette, `bg-black`, `bg-zinc-950`, `border-zinc-800`).
- **Learning Guide**: Complete 21-section step-by-step developer course guide (`PROJECT_GUIDE.md`) & technical notes (`PROJECT_NOTES.txt`).

---

## 2. Comprehensive Directory & File Structure

```
photopedia/
├── apps/
│   ├── web/                          # Next.js App Router App (Frontend)
│   │   ├── app/                      # Next.js App Views
│   │   │   ├── (auth)/               # Authentication Route Group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx      # Sign In Page with interactive Quick-Fill demo credentials
│   │   │   │   └── register/
│   │   │   │       └── page.tsx      # Sign Up Page with automatic session redirection
│   │   │   ├── (dashboard)/          # Dashboard & Public Content Layout Group
│   │   │   │   ├── admin/            # Platform Administrator Controls
│   │   │   │   │   ├── layout.tsx    # Admin Panel Layout (AdminSidebarNav Guard)
│   │   │   │   │   ├── page.tsx      # Dynamic Admin System Overview Dashboard
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   └── page.tsx  # Category Manager (Add & View Categories)
│   │   │   │   │   ├── posts/
│   │   │   │   │   │   └── page.tsx  # Content Moderation Queue & Flag Review
│   │   │   │   │   └── users/
│   │   │   │   │       └── page.tsx  # User Directory (Block/Unblock, Role Assign, Soft-Delete)
│   │   │   │   ├── category/         # Category Archive Directory
│   │   │   │   │   ├── page.tsx      # All Categories Overview Page
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Dynamic Category Archive (e.g. /category/landscape)
│   │   │   │   ├── creators/         # Public Creator Network
│   │   │   │   │   ├── page.tsx      # Public Creators Directory Page (Loads all 21 creators)
│   │   │   │   │   └── [username]/
│   │   │   │   │       └── page.tsx  # Public Creator Profile Archive Page (Clickable Metrics Modal)
│   │   │   │   ├── feed/             # Feed & Photograph Views
│   │   │   │   │   ├── page.tsx      # Main Photograph Feed Page (For You & Following Tabs, Search Filter)
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── FeedTabs.tsx # All / Following Tab Switcher Component
│   │   │   │   │   │   └── FollowingEmptyState.tsx # Empty State View when 0 follows
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.tsx  # Single Post Detail View (EXIF, Comments, Red LikeButton, Lightbox Modal)
│   │   │   │   │   │   └── edit/
│   │   │   │   │   │       └── page.tsx # Author Edit Photograph Form
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx  # Publish Form with Drag & Drop Local Media Uploader
│   │   │   │   ├── profile/          # User Profile Management
│   │   │   │   │   ├── page.tsx      # User Personal Profile Page
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx  # Edit Profile Form with Local Avatar Photo Uploader
│   │   │   │   ├── support/          # Support Desk & Appeal Form
│   │   │   │   │   └── page.tsx      # Public Support & Contact Desk Page
│   │   │   │   └── layout.tsx        # SaaS Root Dashboard Layout (AuthProvider Wrapper)
│   │   │   ├── components/           # Atomic Shared Components
│   │   │   │   ├── layout/           # Modular Layout Components (HeaderNav, SidebarNav, AdminSidebarNav, Footer)
│   │   │   │   ├── PostCard.tsx      # Feed Photograph Card
│   │   │   │   ├── PhotoLightboxModal.tsx # Full-Screen Photo Lightbox Modal Viewport
│   │   │   │   ├── PostCardSkeleton.tsx # Animated Shimmer Skeleton Loading Component
│   │   │   │   ├── SidebarCategories.tsx # Top Categories Widget with Shimmer Loaders
│   │   │   │   ├── SidebarCreators.tsx # Suggested Creators Widget Component (Strict limit=5)
│   │   │   │   ├── UserAvatar.tsx    # Reusable Avatar Component with Universal Fallback
│   │   │   │   ├── UserNameLink.tsx  # Reusable Author Permalink Component (/creators/[username])
│   │   │   │   ├── LikeButton.tsx    # Red Filled Heart Like Button Component
│   │   │   │   ├── FollowButton.tsx  # Isolated Follow/Following Toggle Button Component
│   │   │   │   ├── UserListItem.tsx  # User List Item Row Component
│   │   │   │   └── FollowersFollowingModal.tsx # Interactive Followers/Following Archive Modal
│   │   │   ├── hooks/                # Custom Business Logic Hooks (useAuth, useLike, useFollow, useFollowList, useFeed)
│   │   │   └── lib/
│   │   │       └── api.ts            # Centralized API Client with uploadMedia method
│   │   ├── postcss.config.mjs        # PostCSS Config
│   │   ├── tsconfig.json             # TS Config
│   │   ├── next.config.ts            # Next.js Config
│   │   ├── middleware.ts             # Edge Route Protection Middleware
│   │   └── package.json              # Web App Dependencies
│   │
│   └── api/                          # NestJS Backend API App
│       ├── prisma/
│       │   ├── schema.prisma         # Optimized Prisma Database Schema
│       │   ├── dev.db                # SQLite Database File
│       │   └── seed.ts               # Full Seeding Script (20 Creators + 29 Verified Photos)
│       ├── uploads/                  # Local Media Asset Storage Directory
│       ├── src/
│       │   ├── admin/                # Admin Moderation Module (Overview, Users, Categories, Flagged)
│       │   ├── auth/                 # JWT Authentication & Passport Strategy Module
│       │   ├── media/                # Media Module & Storage Interface Contracts
│       │   │   ├── media.controller.ts # POST /media/upload, GET /media/url/*, DELETE /media/:key
│       │   │   ├── media.service.ts  # Media validation (MIME, 15MB limit) & storage delegation
│       │   │   ├── media.module.ts   # NestJS Media Module
│       │   │   ├── dto/
│       │   │   └── storage/
│       │   │       ├── storage.interface.ts # IStorageProvider interface contract
│       │   │       ├── storage.module.ts # Dynamic STORAGE_PROVIDER token binding
│       │   │       ├── local.storage.ts # Local Storage Provider (saves to /uploads)
│       │   │       ├── r2.storage.ts    # Cloudflare R2 Provider contract
│       │   │       ├── s3.storage.ts    # AWS S3 Provider contract
│       │   │       └── spaces.storage.ts # DigitalOcean Spaces Provider contract
│       │   ├── posts/                # Posts Module
│       │   ├── users/                # Users Module
│       │   └── prisma/               # Prisma ORM Global Module
│       │   └── main.ts               # API Bootstrap & Global Interceptors
│       │   └── tsconfig.json         # API TS Config
│       │   └── package.json          # API Dependencies
├── packages/                         # Shared Packages (Later, if needed)
├── pnpm-workspace.yaml               # Monorepo Workspace Configuration
├── package.json                      # Workspace Scripts Runner
├── PROJECT_GUIDE.md                  # Comprehensive LAMP/WordPress to Modern Stack Learning Guide
├── PROJECT_NOTES.txt                 # Detailed 1,000+ Line Technical Architecture Reference Notes
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

---

## 5. Security & Verification Policy

- **Token & Cookie Synchronization**: Client sessions are persisted in `localStorage`, and token authentication is synchronized into the `photopedia_token` document cookie upon login/registration. This allows Next.js edge `middleware.ts` to perform immediate redirects to `/login` for strictly protected routes (`/feed/new`, `/profile/edit`, `/admin/*`).
- **Data Integrity Safeguards**: The backend contains zero silent user fallbacks. If an invalid or missing user session ID is passed to posts or comments queries, it immediately aborts with `UnauthorizedException`.
- **Media Upload Authentication**: Files can only be uploaded by authenticated accounts via `@UseGuards(AuthGuard('jwt'))` on `/media/upload`.
- **CORS Protection**: The system rejects wildcard CORS origins with credentials. A dynamic origin checker whitelists allowed Next.js addresses (`http://localhost:3000`, etc.).
- **PII Exposure Prevention**: Public creator profile endpoints do not return confidential contact details (`email`, `phone`).
- **Admin Moderation & Flag Security**: Modifying moderation queue logs uses strict `UpdateModerationDto` validation, and community post flagging requires active JWT authentication.
- **Deactivated Accounts Block**: Deleted users (`deletedAt !== null`) and blocked users are blocked at JWT token validation.
