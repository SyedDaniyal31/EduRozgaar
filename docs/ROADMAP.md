# EduRozgaar – Roadmap

## Phase 1 (Current)
- [x] Monorepo structure
- [x] Frontend placeholder pages and sample data
- [x] Backend health + jobs API
- [x] Mongoose schemas (User, Job, Scholarship, Admission, Blog, ForeignStudy, Notification)
- [x] Dark/Light theme, Navbar, Footer, Drawer, Axios base config

## Phase 2 (Done)
- [x] JWT + refresh token authentication
- [x] Role-based access (Admin, User)
- [x] Protected routes and API endpoints (requireAuth, requireAdmin)
- [x] User profile (province, interests, notification prefs) and saved jobs/scholarships placeholders
- [x] Google OAuth placeholder (frontend); backend ready for GOOGLE_CLIENT_ID

## Phase 3 (Dynamic Listings – Done)
- [x] Jobs, Scholarships, Admissions list APIs with filters, search, pagination, sorting
- [x] Detail APIs with related listings and SEO-friendly slugs
- [x] Save/Bookmark endpoints (JWT-protected)
- [x] Frontend: dynamic list + detail pages, filters, search, pagination, sort
- [x] Save button (Login to Save for guests), Profile & Saved page show saved items
- [ ] Schools & Colleges directory, Foreign studies content

## Phase 4 (Backend APIs + Admin CRUD – Done)
- [x] Admin CRUD for Jobs, Scholarships, Admissions, Blogs, Foreign Studies, Notifications (JWT + Admin)
- [x] Public APIs: Jobs, Scholarships, Admissions, Blogs, Foreign Studies (filters, search, pagination, slugs)
- [x] Response shape: `data`, `pagination` (page, limit, total, totalPages), `filters`
- [x] Rate limiting, input sanitization, MongoDB indexes
- [x] Full seed: 50 jobs, 30 scholarships, 20 admissions, 20 blogs, 10 foreign studies, 10 notifications

## Phase 5 (Viral Growth Features – Done)
- [x] Bookmark/Save: GET/POST/DELETE bookmarks, dashboard saved listings, login prompt for guests
- [x] Trending algorithm: views + bookmarks + deadline proximity; `/api/trending/:type` (jobs, scholarships, admissions); in-memory cache (Redis-ready)
- [x] Dashboard API: GET `/api/auth/dashboard` — saved, recently viewed, notifications, trending recommendations
- [x] Notifications: POST `/api/notifications/send` (admin), target by province & interest; placeholder Email/Push/Telegram
- [x] Newsletter: subscribe/unsubscribe, send-daily placeholder (Nodemailer/SendGrid)
- [x] Views count on Job, Scholarship, Admission; recently viewed tracking (POST `/api/auth/recently-viewed`)
- [x] Frontend: Home trending/featured sections, Dashboard with saved/notifications/recently viewed, toast system, newsletter in footer
- [x] SEO: react-helmet-async, meta + OG tags, canonical URLs, sitemap placeholder
- [x] Seed: Phase-5 script (newsletter subscribers, user bookmarks, view counts)

## Phase 6 (Final Power Phase – Done)
- [x] **Monetization**: Featured/Sponsored jobs & scholarships (isFeatured, isSponsored); Ad slot config CRUD; GET `/monetization/featured|sponsored|ad-slots`; admin PATCH for job/scholarship monetization
- [x] **Firebase / FCM**: User.fcmToken; POST `/auth/fcm-token`; notification send targets province/interest and logs targetCount (FCM send placeholder)
- [x] **AI Job Generator**: POST `/admin/jobs/generate` (title, organization, location, skills); returns SEO-friendly description + suggested fields; Admin UI with editable output
- [x] **Resume Analyzer**: POST `/users/resume-analyze` (multipart PDF/DOCX); placeholder NLP extract (skills, education, experience); top 10 matching jobs with matched skills; Student UI (protected)
- [x] **Caching**: Redis (ioredis) with in-memory fallback; trending, featured, most-viewed cache keys; cache invalidation on admin job/scholarship CRUD
- [x] **Security**: Helmet, compression, express-mongo-sanitize, rate limiting; JWT refresh; input sanitization; role-based access
- [x] **Docker**: Dockerfile (server, client with nginx), docker-compose (mongodb, redis, backend, frontend); health check with mongo/redis status
- [x] **Frontend**: Ad slots (AdBanner, AdSidebar, AdInFeed) on Home, Jobs; Notification permission + FCM token register on login; Admin AI Job Generator tab; Resume Analyzer page; code-split routes

## Phase 7 (Investor-Grade Features – Done)
- [x] **AI Recommendations**: GET `/api/v1/recommendations/me` — personalized jobs, scholarships, admissions by province, interests, viewed/bookmarked; Redis cache; "Recommended for You" on Home, Jobs, Scholarships with skeleton loaders
- [x] **Multi-Channel Alerts**: POST `/api/v1/alerts/telegram/send`, `/api/v1/alerts/whatsapp/send` (admin) — province & interest targeting; Admin Alerts tab; placeholders for Telegram/WhatsApp API
- [x] **Mobile API v1**: Versioned `/api/v1/*` — jobs, scholarships, admissions, foreign-studies, trending, recommended, bookmarks, notifications; RESTful, same filters/search/pagination as web
- [x] **Multi-Language**: English + Urdu; LanguageContext + switcher in Navbar; Profile preferred language; placeholder i18n for nav and home
- [x] **SEO Engine**: Landing pages `/jobs/province/:slug`, `/jobs/category/:slug` with meta + schema from GET `/api/v1/landing-pages/:type/:slug`; redirect to list with filter; Job detail JSON-LD JobPosting schema
- [x] **Analytics**: AnalyticsEvent model; POST `/api/v1/analytics/event` (search, view, click, etc.); GET `/api/v1/analytics/dashboard` (admin) — daily active users, trending searches, notification metrics; Admin Analytics tab; seedPhase7 script
