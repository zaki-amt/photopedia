# Photopedia — Complete Project Learning & Architecture Guide

---

## Welcome to Modern Web Development (LAMP → Next.js + NestJS + Prisma)

Welcome to **Photopedia**! This guide is written specifically for developers coming from a **LAMP stack (Linux, Apache, MySQL, PHP / WordPress)** background who are transitioning to modern JavaScript/TypeScript full-stack architecture (**Next.js + NestJS + Prisma + SQLite/PostgreSQL**).

---

## 1. Executive Summary & Architecture Overview

**Photopedia** is a monorepo application structured into two core projects:
1. **Frontend (`/`)**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
2. **Backend (`/server`)**: NestJS, Express, Passport JWT Authentication, Prisma ORM, SQLite (`dev.db`).

### High-Level Request Flow
```
User Action (Browser)
       │
       ▼
Next.js App Router (Client / Server Component)
       │ (HTTP Fetch via app/lib/api.ts)
       ▼
NestJS REST API Controller (server/src/*/*.controller.ts)
       │ (Pipes / DTO Validation / JwtAuthGuard)
       ▼
NestJS Service (server/src/*/*.service.ts)
       │ (Business Logic & Transactions)
       ▼
Prisma ORM Client (server/src/prisma/prisma.service.ts)
       │ (SQL Generation & Type-Safe Querying)
       ▼
SQLite / PostgreSQL Database (server/prisma/dev.db)
```

---

## 2. LAMP / WordPress Developer Translation Matrix

| LAMP / WordPress Concept | Photopedia / Modern Stack Equivalent | Technical Comparison & Key Differences |
| :--- | :--- | :--- |
| **PHP** | **TypeScript (Node.js)** | Strongly typed JavaScript compiled via `tsc` or `turbopack`. Runs asynchronously on V8 Node engine rather than single-threaded per-request PHP CLI/FPM. |
| **MySQL / phpMyAdmin** | **SQLite / PostgreSQL + Prisma Studio** | Relational DB accessed via Prisma ORM instead of `$wpdb` or raw `mysqli_query()`. Studio GUI launched via `npx prisma studio`. |
| **Apache / `.htaccess`** | **NestJS Express Engine + Next.js Router** | Routing handled in application code (`@Get('/posts')` & `app/feed/page.tsx`) rather than `.htaccess` rewrite rules. |
| **WordPress Themes & Templates** | **Next.js React Components & Layouts** | UI composed with React JSX (`.tsx` components) instead of `index.php`, `header.php`, `footer.php`, or `get_header()`. |
| **WordPress Plugins** | **NestJS Modules (`@Module()`)** | Encapsulated feature bundles (`PostsModule`, `MediaModule`, `AuthModule`) with dependency injection rather than action/filter hooks. |
| **WordPress REST API (`/wp-json`)** | **NestJS Controllers (`@Controller()`)** | REST endpoints declared via class decorators (`@Get()`, `@Post()`, `@UseGuards()`) returning automatic JSON objects. |
| **WP Hooks (`add_action`, `add_filter`)** | **NestJS Middleware, Guards, Interceptors** | Request pipeline interceptors and guards (`JwtAuthGuard`, `RolesGuard`) handle request interception & authentication. |
| **`wp_upload_dir()` / Media Library** | **StorageModule (`IStorageProvider`)** | Uploads processed via Multer (`FileInterceptor`) to local disk (`server/uploads/`) or S3/R2/Spaces cloud providers. |
| **WP Options Table / `wp-config.php`** | `.env` + NestJS `@nestjs/config` | Environment variables loaded dynamically via `ConfigModule` and accessed via `process.env`. |

---

## 3. Monorepo Architecture

### What is a Monorepo?
A **monorepo** (monolithic repository) houses both the frontend client and backend server within a single Git repository.

### Photopedia Monorepo Layout
```text
photopedia/                           # Monorepo Root
├── app/                              # Next.js 16 Frontend App Router
│   ├── (auth)/                       # Authentication views (/login, /register)
│   ├── (dashboard)/                  # Dashboard views (/feed, /profile, /admin, /creators)
│   ├── components/                   # React UI components (PostCard, Lightbox, Skeletons)
│   ├── hooks/                        # Business logic hooks (useFeed, useLike, useFollow)
│   └── lib/                          # API client (api.ts)
├── server/                           # NestJS Backend Application
│   ├── prisma/                       # Prisma Schema (schema.prisma), seed script, dev.db
│   ├── uploads/                      # Local uploaded media storage
│   └── src/                          # NestJS TypeScript Source Code
│       ├── admin/                    # Admin overview, user block, category manager
│       ├── auth/                     # JWT login, registration, passport strategy
│       ├── media/                    # Local & Multi-cloud storage engine
│       ├── posts/                    # Feed, EXIF, likes, comments, edit, delete, flag
│       ├── users/                    # Profiles, follow network, suggested creators
│       └── prisma/                   # Prisma ORM database service
├── README.md                         # Project overview
├── project_documentation.md         # Architecture documentation
├── project_user_stories_audit.md     # Audit checklist (29 User Stories)
└── PROJECT_GUIDE.md                  # This learning guide
```

---

## 4. Next.js 16 Frontend Architecture

### 1. App Router Directory Structure
Next.js 16 uses the file-system based **App Router** inside the `app/` directory:
- `page.tsx`: Defines a publicly accessible UI route.
- `layout.tsx`: Wraps child pages with shared UI (Sidebar, Top Navigation Bar, User Context).
- `(folder)`: Route groups used to organize files without affecting URL paths (e.g. `app/(auth)/login/page.tsx` renders at `/login`).

### 2. Client Components (`"use client"`)
React components that run in the browser to handle interactive DOM events (clicks, form inputs, state):
```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```
*In Photopedia*: Interactive pages (`app/(dashboard)/feed/page.tsx`, `app/components/PostCard.tsx`) use `"use client"` for likes, comments, file uploads, and lightbox modals.

---

## 5. NestJS Backend Architecture

NestJS is a modular, structured Node.js backend framework using TypeScript and Object-Oriented Programming (OOP) concepts.

### Request Pipeline Flow
```text
Incoming HTTP Request
       │
       ▼
NestJS Middleware (cors, express.json, static assets)
       │
       ▼
Guards (JwtAuthGuard, RolesGuard) ───► [Reject 401/403 if unauthorized]
       │
       ▼
Validation Pipes (ValidationPipe / DTO validation) ───► [Reject 400 if invalid body]
       │
       ▼
Controller (@Controller('posts')) ───► Maps route & extracts @Body(), @Param()
       │
       ▼
Service (@Injectable() PostsService) ───► Executes business logic & SQL transactions
       │
       ▼
Prisma Service (PrismaService) ───► Executes DB query against SQLite / PostgreSQL
       │
       ▼
HTTP Response (JSON payload returned to client)
```

---

## 6. Prisma ORM & Database Layer

### Prisma Models (`server/prisma/schema.prisma`)
Prisma defines database tables, columns, and relationships in `schema.prisma`:

```prisma
model User {
  id          String      @id @default(uuid())
  email       String      @unique
  username    String      @unique
  name        String
  password    String
  role        String      @default("USER") // USER | ADMIN
  status      String      @default("ACTIVE") // ACTIVE | BLOCKED
  avatar      String?
  bio         String?
  location    String?
  website     String?
  cameraBody  String?
  lenses      String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  posts       Post[]
  likes       Like[]
  comments    Comment[]
  followers   Follow[]    @relation("FollowingUser")
  following   Follow[]    @relation("FollowerUser")
}

model Post {
  id          String      @id @default(uuid())
  title       String
  image       String
  caption     String?
  category    String      @default("Landscape")
  tags        String?
  authorId    String
  author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  deletedAt   DateTime?

  exif        ExifData?
  likes       Like[]
  comments    Comment[]
  moderation  ModerationLog[]
}

model ExifData {
  id        String   @id @default(uuid())
  postId    String   @unique
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  camera    String?
  lens      String?
  aperture  String?
  shutter   String?
  iso       String?
}

model Follow {
  id          String   @id @default(uuid())
  followerId  String
  followingId String
  follower    User     @relation("FollowerUser", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("FollowingUser", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
}

model Like {
  id        String   @id @default(uuid())
  userId    String
  postId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, postId])
}

model Comment {
  id        String    @id @default(uuid())
  content   String
  userId    String
  postId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
  deletedAt DateTime?
}

model ModerationLog {
  id        String   @id @default(uuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  reason    String
  status    String   @default("PENDING") // PENDING | APPROVED | REMOVED
  action    String?  // FLAGGED | REMOVED
  createdAt DateTime @default(now())
}
```

---

## 7. Authentication Flow & Guard System

### Authentication Sequence
```text
1. User enters email & password on /login
       │
       ▼
2. Client calls api.login({ email, password }) ───► POST /auth/login
       │
       ▼
3. AuthService.validateUser() hashes input & compares bcrypt hash
       │
       ▼
4. AuthService returns { accessToken: "jwt_string...", user: { ... } }
       │
       ▼
5. Client saves accessToken in localStorage ('photopedia_token')
       │
       ▼
6. Future protected API requests attach Header: "Authorization: Bearer jwt_string..."
       │
       ▼
7. JwtStrategy decodes JWT, verifies signature, and checks user status != "BLOCKED"
```

---

## 8. Multi-Cloud & Local Media Storage Architecture

Photopedia uses a **Provider Pattern** (`IStorageProvider`) to manage file uploads:

```
server/src/media/
├── media.controller.ts        # POST /media/upload, GET /media/url/*, DELETE /media/:key
├── media.service.ts           # Media validation (MIME types, 15MB limit) & delegation
├── media.module.ts            # NestJS Media Module
├── dto/
│   ├── upload-media.dto.ts
│   └── complete-upload.dto.ts
└── storage/
    ├── storage.interface.ts   # Standardized IStorageProvider interface & STORAGE_PROVIDER token
    ├── storage.module.ts      # Dynamic module mapping STORAGE_DRIVER env variable
    ├── local.storage.ts       # Local Storage Provider (saves to server/uploads/)
    ├── r2.storage.ts          # Cloudflare R2 Provider contract
    ├── s3.storage.ts          # AWS S3 Provider contract
    └── spaces.storage.ts      # DigitalOcean Spaces Provider contract
```

---

## 9. Line-by-Line Code Walkthrough

### 1. `server/src/media/storage/storage.interface.ts`
```ts
export interface StorageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageUploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IStorageProvider {
  uploadFile(file: StorageFile, destinationFolder?: string): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<boolean>;
  getPublicUrl(key: string): Promise<string>;
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';
```
- **Line 1–6**: Defines `StorageFile` containing raw binary buffer, original filename, MIME type, and size in bytes.
- **Line 8–14**: Defines `StorageUploadResult` returned after successful storage write.
- **Line 16–20**: Contract interface `IStorageProvider` that ALL storage implementations (Local, R2, S3, Spaces) MUST implement.
- **Line 22**: Token constant `STORAGE_PROVIDER` used by NestJS Dependency Injection container.

---

### 2. `server/src/posts/posts.service.ts` (Feed Query Method)
```ts
  async findAllFeed(category?: string, feedType?: string, currentUserId?: string, search?: string) {
    let authorIdFilter: any = undefined;

    if (feedType === "following") {
      if (!currentUserId) {
        throw new BadRequestException("Must be logged in to view the following feed");
      }
      const follows = await this.prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      authorIdFilter = { in: followingIds };
    }

    const searchFilter = search && search.trim() ? {
      OR: [
        { title: { contains: search.trim() } },
        { caption: { contains: search.trim() } },
        { category: { contains: search.trim() } },
        { tags: { contains: search.trim() } },
        { author: { name: { contains: search.trim() } } },
        { author: { username: { contains: search.trim() } } },
      ],
    } : {};

    const where: any = {
      deletedAt: null,
      ...(category && category !== "All" ? { category } : {}),
      ...(authorIdFilter ? { authorId: authorIdFilter } : {}),
      ...searchFilter,
    };

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc font" },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        exif: true,
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.image,
      caption: post.caption,
      category: post.category,
      tags: post.tags ? post.tags.split(",").map((t) => t.trim()) : [],
      author: post.author,
      exif: post.exif,
      likes: post._count.likes,
      likesCount: post._count.likes,
      comments: post._count.comments,
      commentsCount: post._count.comments,
      isLiked: post.likes && Array.isArray(post.likes) && post.likes.length > 0,
      createdAt: post.createdAt,
    }));
  }
```

---

## 10. Common Mistakes & Troubleshooting

1. **Forgetting `"use client"` in Next.js**:
   - *Mistake*: Calling `useState()`, `useEffect()`, or DOM click handlers in a Server Component.
   - *Fix*: Add `"use client";` at the very top line of the file.
2. **Missing Dependency Injection Imports in NestJS**:
   - *Mistake*: Using `@Inject(STORAGE_PROVIDER)` without importing `StorageModule` in `MediaModule`.
   - *Fix*: Ensure `StorageModule` is exported and imported in parent modules.
3. **Unbound Database Queries**:
   - *Mistake*: Querying database without `{ deletedAt: null }` filter.
   - *Fix*: Include `deletedAt: null` in Prisma `where` clauses for soft-deleted entities.

---

## 11. Practical Learning Exercises

### Level 1: Beginner
1. Locate the route handler for `GET /posts/top-categories` in `server/src/posts/posts.controller.ts`.
2. Trace the service method `getTopCategories()` in `server/src/posts/posts.service.ts`.
3. Locate where `api.getTopCategories()` is called in `app/components/SidebarCategories.tsx`.

### Level 2: Intermediate
1. Add a new field `cameraLocation` to the `ExifData` model in `server/prisma/schema.prisma`.
2. Run `npx prisma db push` in `server/` to update SQLite schema.
3. Update `CreatePostDto` in `server/src/posts/dto/create-post.dto.ts` to validate `cameraLocation`.

---

## 12. Conclusion & Summary

You now possess a complete blueprint of **Photopedia**! You understand how Next.js App Router, NestJS Modular Controllers/Services, Prisma ORM database models, and the `StorageModule` work together to deliver a visual photography platform.

---

## 13. Security Best Practices & Remediation Checklist

When building production-ready applications, always adhere to the following security protocols implemented in Photopedia:
1. **Next.js Edge Middleware Cookie Synchronization**: Since Next.js Edge Middleware cannot directly read `localStorage` in the browser, always synchronize the JWT bearer token into an HTTP-only or document-level cookie (e.g. `photopedia_token`) on login/registration to secure route redirection.
2. **Eliminate Silent User Fallbacks**: Never assign records to a fallback account if the user identifier is missing. Always check user existence and throw `UnauthorizedException` to prevent data corruption.
3. **Guard File Uploads**: Always restrict resource upload endpoints (`POST /media/upload`) with passport guards to prevent unauthenticated server disk exhaustion.
4. **Protect PII (Personally Identifiable Information)**: Omit fields like `email` and `phone` from public profile database selections (`select` parameters) to prevent leaking private user details to anonymous callers.
5. **Secure CORS Origins**: Avoid wildcard CORS configurations (`origin: '*'`) when `credentials: true` is enabled, as browsers block it. Set explicit whitelist origins in the backend server config.
