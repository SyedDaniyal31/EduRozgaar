# EduRozgaar – Architecture Overview

## Monorepo Layout

- **client**: React (Vite) SPA, TailwindCSS, React Router, Axios.
- **server**: Node.js + Express, MongoDB (Mongoose).
- **docs**: Project documentation.

## Auth (Phase-2)

- JWT access token (e.g. 1h) + refresh token (e.g. 7d); refresh via `POST /api/auth/refresh-token`.
- Login/register return `user`, `accessToken`, `refreshToken`; Axios interceptor adds Bearer token and retries on 401 using refresh.
- Roles: `Admin`, `User`. Middleware: `requireAuth`, `requireAdmin` in `server/src/middleware/auth.js`.
- Profile: `GET/PATCH /api/auth/profile` (province, interests, notifications). Google OAuth prepared via env (GOOGLE_CLIENT_ID).

## API Conventions

- Base path: `/api`. List responses: `{ data, pagination: { page, limit, total, totalPages }, filters? }`.
- Health: `GET /api/health`.
- Public: `GET /api/jobs`, `/api/scholarships`, `/api/admissions`, `/api/blogs`, `/api/foreign-studies` (filters, search, pagination, sort). Detail: `GET /api/jobs/:idOrSlug`, etc.
- Admin (JWT + Admin role): `GET/POST/PUT/DELETE /api/admin/jobs`, `/api/admin/scholarships`, `/api/admin/admissions`, `/api/admin/blogs`, `/api/admin/foreign-studies`, `GET/POST/DELETE /api/admin/notifications`.
- Rate limiting on `/api`; input sanitization and validation on admin/create/update.

## Frontend

- Theme: `ThemeContext` (dark/light), persisted in `localStorage`.
- Auth: `AuthContext` with `login`, `register`, `logout`, `refreshToken`; user + role persisted in `localStorage`; protected routes via `ProtectedRoute` (redirect to login or “Insufficient permissions”).
- API client: `services/axiosBase.js` adds JWT to requests; on 401, attempts refresh then retries or clears auth.

## Phase 5 – Viral Growth

- **Bookmarks**: `GET /api/auth/saved` and `GET /api/auth/bookmarks` (alias); save/unsave via existing `POST/DELETE /api/jobs|scholarships|admissions/:id/save`. User model: `savedJobs`, `savedScholarships`, `savedAdmissions`.
- **Trending**: `GET /api/trending/:type` (jobs | scholarships | admissions). Score = views + 5×bookmarks + deadline proximity; results cached in-memory (5 min TTL); replace with Redis for production.
- **Dashboard**: `GET /api/auth/dashboard` (JWT). Returns user profile summary, saved listings, recently viewed (jobs/scholarships/admissions), trending recommendations, and notifications matching user province/interests.
- **Recently viewed**: `POST /api/auth/recently-viewed` body `{ type, id }` (type: job | scholarship | admission). Stored per user (max 10 per type).
- **Notifications**: `POST /api/notifications/send` (Admin). Body: title, message, target_province?, target_interest?, link?. Placeholder for Email/Push/Telegram (Phase-6).
- **Newsletter**: `POST /api/newsletter/subscribe` (email, frequency?), `POST /api/newsletter/unsubscribe` (email). `POST /api/newsletter/send-daily` (Admin) placeholder for Nodemailer/SendGrid.
- **Views**: Job, Scholarship, Admission models have `views`; incremented on public detail `GET`. Used in trending and dashboard recommendations.
- **Frontend**: Home shows Trending Jobs, Featured Jobs, Latest Scholarships, Admission Deadlines, Trending Scholarships, Upcoming Admissions (skeleton loaders). Dashboard shows saved, alerts, recently viewed, profile overview, notification settings placeholders. Toast context for in-page alerts. Newsletter form in footer. SEO via `react-helmet-async` (title, description, canonical, OG tags). Sitemap placeholder: `client/public/sitemap.xml`.

## Phase 6 – Final Power Phase

- **Monetization**: Job/Scholarship have `isFeatured`, `isSponsored`. Public: `GET /api/monetization/featured/jobs|scholarships`, `/sponsored/jobs|scholarships`, `/ad-slots`. Admin: CRUD `/api/monetization/admin/ad-slots`, PATCH `/monetization/admin/jobs|scholarships/:id` for featured/sponsored. AdSlotConfig model for slot IDs. Cache invalidation on job/scholarship CRUD.
- **FCM**: User has `fcmToken` (select: false). `POST /api/auth/fcm-token` (JWT) registers token. Notifications send finds users by province/interest and uses stored tokens (Firebase Admin SDK placeholder).
- **AI Job Generator**: `POST /api/admin/jobs/generate` (Admin). Body: title, organization?, location?, skills[]. Returns description, summary, suggested fields. Placeholder template; replace with OpenAI/Claude in production.
- **Resume Analyzer**: `POST /api/users/resume-analyze` (JWT, multipart). Accepts PDF/DOCX (max 5MB). Placeholder extraction (skills, education, experience); matches top 10 jobs by skills; returns extracted data, jobs, matchedSkills. Frontend: protected `/resume-analyzer` page.
- **Caching**: Redis via `config/redis.js` (ioredis); fallback to in-memory if REDIS_URL missing. Keys: `trending:jobs|scholarships|admissions`, `featured:jobs|scholarships`. cacheGet/cacheSet/cacheDelPattern. Trending and monetization controllers use Redis; admin CRUD invalidates by prefix.
- **Security**: Helmet (contentSecurityPolicy disabled for flexibility), compression (gzip), express-mongo-sanitize, JSON body limit 1MB, existing rate limit. JWT refresh and role-based access unchanged.
- **Docker**: `server/Dockerfile` (Node 20, node ci production), `client/Dockerfile` (multi-stage: build + nginx), `docker-compose.yml` (mongodb, redis, backend, frontend). Health: `GET /api/health` returns mongo/redis status. Frontend nginx proxies `/api` to backend.
- **Frontend Phase 6**: Ad components (AdBanner, AdSidebar, AdInFeed) on Home and Jobs. NotificationProvider requests permission on login and registers placeholder FCM token. Admin tab “AI Job Generator” at `/admin/ai-job-generator`. Resume Analyzer at `/resume-analyzer` (protected). Lazy-loaded routes; code splitting via React.lazy.
