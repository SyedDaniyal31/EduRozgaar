# EduRozgaar – Project File Structure & Audit

**Last updated:** From full project audit.  
**Purpose:** Single reference for repository layout and high-level audit findings.

---

## 1. Repository root

```
EDU-E-Portal/
├── .env.example           # Root env template (if used)
├── .prettierrc            # Prettier config
├── LICENSE                # MIT
├── package.json           # Root scripts: dev:all, client, server, lint, format
├── package-lock.json
├── README.md              # Setup, run, Phase summary
├── docker-compose.yml     # mongodb, redis, backend, frontend
├── client/                # React frontend (Vite + Tailwind)
├── server/                # Node + Express backend
├── docs/                  # Documentation
└── mobile/                # React Native app (separate)
```

---

## 2. Client (React frontend)

```
client/
├── .dockerignore
├── .eslintrc.cjs
├── .prettierrc
├── Dockerfile             # Multi-stage: build + nginx
├── index.html
├── nginx.conf             # SPA + optional /api proxy
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js     # Theme: primary, mint, cream, golden, surface; keyframes
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── placeholder-job.svg
│   └── sitemap.xml
└── src/
    ├── App.jsx            # useRoutes(routes)
    ├── main.jsx           # React root, providers
    ├── index.css          # Tailwind layers; body bg; .scroll-reveal, .btn-theme
    │
    ├── components/
    │   ├── ads/
    │   │   ├── index.js
    │   │   ├── AdBanner.jsx
    │   │   ├── AdInFeed.jsx
    │   │   └── AdSidebar.jsx
    │   ├── auth/
    │   │   ├── ProtectedRoute.jsx   # Redirect / role check
    │   │   └── SocialAuthButton.jsx  # Google etc.
    │   ├── chatbot/
    │   │   └── Chatbot.jsx
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   └── FormField.jsx
    │   ├── layout/
    │   │   ├── DrawerMenu.jsx
    │   │   ├── Footer.jsx
    │   │   └── Navbar.jsx
    │   ├── listings/
    │   │   ├── HomeListingCard.jsx  # Job, Scholarship, Admission cards
    │   │   ├── ListingCardSkeleton.jsx
    │   │   └── SaveButton.jsx
    │   ├── newsletter/
    │   │   └── NewsletterSubscribe.jsx
    │   └── ui/
    │       ├── Alerts.jsx
    │       ├── Modals.jsx
    │       ├── Pagination.jsx
    │       ├── ScrollReveal.jsx     # Intersection Observer scroll reveal
    │       └── SearchBar.jsx
    │
    ├── constants/
    │   ├── index.js       # ROUTES, ROLES, API_BASE_URL
    │   ├── listings.js    # Categories, provinces, sort options
    │   ├── profileOptions.js
    │   └── seedData.js    # Sample blogs etc.
    │
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── LanguageContext.jsx      # en/ur
    │   ├── NotificationContext.jsx
    │   ├── ThemeContext.jsx         # light/dark
    │   └── ToastContext.jsx
    │
    ├── hooks/
    │   ├── useListings.js  # Pagination, filters, data for listing pages
    │   └── useLocalStorage.js
    │
    ├── layouts/
    │   └── MainLayout.jsx  # Navbar, Outlet, Footer
    │
    ├── pages/
    │   ├── Admin/
    │   │   ├── Admin.jsx             # Layout + nav
    │   │   ├── AIJobGenerator.jsx
    │   │   ├── AlertsAdmin.jsx
    │   │   ├── AnalyticsDashboard.jsx
    │   │   └── GrowthDashboard.jsx
    │   ├── Admissions/
    │   │   ├── Admissions.jsx
    │   │   └── AdmissionDetail.jsx
    │   ├── Auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── Badges/
    │   │   └── Badges.jsx           # Gamification
    │   ├── Blog/
    │   │   ├── Blog.jsx
    │   │   └── BlogPost.jsx
    │   ├── Contact/
    │   │   └── Contact.jsx
    │   ├── Dashboard/
    │   │   └── Dashboard.jsx
    │   ├── ExamPrep/
    │   │   ├── ExamDetail.jsx
    │   │   ├── ExamPrep.jsx
    │   │   └── QuizTake.jsx
    │   ├── ForeignStudies/
    │   │   └── ForeignStudies.jsx
    │   ├── Home/
    │   │   └── Home.jsx
    │   ├── Internships/
    │   │   ├── InternshipDetail.jsx
    │   │   └── Internships.jsx
    │   ├── IntlScholarships/
    │   │   ├── IntlScholarshipDetail.jsx
    │   │   └── IntlScholarships.jsx
    │   ├── Jobs/
    │   │   ├── JobDetail.jsx
    │   │   └── Jobs.jsx
    │   ├── Landing/
    │   │   ├── JobsCategoryLanding.jsx
    │   │   └── JobsProvinceLanding.jsx
    │   ├── Profile/
    │   │   └── Profile.jsx
    │   ├── ResumeAnalyzer/
    │   │   └── ResumeAnalyzer.jsx
    │   ├── SavedJobs/
    │   │   └── SavedJobs.jsx
    │   ├── Scholarships/
    │   │   ├── ScholarshipDetail.jsx
    │   │   └── Scholarships.jsx
    │   ├── SchoolsAndColleges/
    │   │   └── SchoolsAndColleges.jsx
    │   └── Webinars/
    │       └── Webinars.jsx
    │
    ├── routes/
    │   └── index.jsx      # All routes; lazy-loaded pages; ProtectedRoute, Admin children
    │
    ├── services/
    │   ├── authService.js
    │   ├── axiosBase.js   # Base URL, JWT, refresh on 401
    │   └── listingsService.js  # jobsApi, scholarshipsApi, ... badgesApi, chatbotApi, etc.
    │
    └── utils/
        ├── formatDate.js
        ├── index.js
        └── validation.js
```

---

## 3. Server (Node + Express)

```
server/
├── .dockerignore
├── .env                   # PORT, MONGO_URI, JWT_*, REDIS_URL, etc. (git-ignored)
├── .env.example
├── .eslintrc.cjs
├── Dockerfile             # Node 20, production
├── package.json
├── package-lock.json
└── src/
    ├── index.js           # Express app; middleware; mount all routers under /api; connectDB; cron
    │
    ├── config/
    │   ├── constants.js
    │   ├── db.js          # Mongoose connect
    │   └── redis.js       # ioredis; in-memory fallback
    │
    ├── controllers/
    │   ├── admin/
    │   │   ├── adminAdmissionsController.js
    │   │   ├── adminBlogsController.js
    │   │   ├── adminExamsController.js
    │   │   ├── adminForeignStudiesController.js
    │   │   ├── adminInternshipsController.js
    │   │   ├── adminIntlScholarshipsController.js
    │   │   ├── adminJobsController.js
    │   │   ├── adminNotificationsController.js
    │   │   ├── adminScholarshipsController.js
    │   │   ├── adminWebinarsController.js
    │   │   └── aiJobController.js
    │   ├── admissionsController.js
    │   ├── alertsController.js
    │   ├── analyticsController.js
    │   ├── authController.js
    │   ├── badgesController.js
    │   ├── blogsAutoGenerateController.js
    │   ├── blogsController.js
    │   ├── chatbotController.js
    │   ├── coverLetterController.js
    │   ├── dashboardController.js
    │   ├── examsController.js
    │   ├── fcmController.js
    │   ├── foreignStudiesController.js
    │   ├── growthDashboardController.js
    │   ├── internshipsController.js
    │   ├── intlScholarshipsController.js
    │   ├── jobsController.js
    │   ├── landingPagesController.js
    │   ├── monetizationController.js
    │   ├── newsletterController.js
    │   ├── notificationsController.js
    │   ├── notificationsListController.js
    │   ├── profileController.js
    │   ├── quizController.js
    │   ├── recentlyViewedController.js
    │   ├── recommendationsController.js
    │   ├── resumeAnalyzerController.js
    │   ├── savedController.js
    │   ├── scholarshipsController.js
    │   ├── scraperController.js
    │   ├── trendingController.js
    │   ├── webinarsController.js
    │   └── (no default export index; routes import individually)
    │
    ├── middleware/
    │   ├── auth.js        # requireAuth, requireRole, requireAdmin
    │   ├── errorHandler.js
    │   ├── rateLimit.js   # apiLimiter on /api
    │   ├── requestLogger.js
    │   ├── upload.js      # Multer for resume etc.
    │   └── validate.js
    │
    ├── models/
    │   ├── Admission.js
    │   ├── AdSlotConfig.js
    │   ├── AnalyticsEvent.js
    │   ├── BadgeDefinition.js
    │   ├── Blog.js
    │   ├── ChatHistory.js
    │   ├── Exam.js
    │   ├── ForeignStudy.js
    │   ├── Internship.js
    │   ├── InternshipApplication.js
    │   ├── IntlScholarship.js
    │   ├── Job.js
    │   ├── Mcq.js
    │   ├── NewsletterLog.js
    │   ├── NewsletterSubscriber.js
    │   ├── Notification.js
    │   ├── PastPaper.js
    │   ├── Quiz.js
    │   ├── QuizAttempt.js
    │   ├── ResumeScan.js
    │   ├── Scholarship.js
    │   ├── ScraperRun.js
    │   ├── University.js
    │   ├── User.js
    │   ├── UserBadge.js
    │   ├── Webinar.js
    │   └── WebinarRegistration.js
    │
    ├── routes/
    │   ├── index.js       # Export all routers
    │   ├── admin.js       # Mounts admin CRUD routes; requireAdmin
    │   ├── admissions.js
    │   ├── auth.js
    │   ├── badges.js
    │   ├── blogs.js
    │   ├── chatbot.js
    │   ├── exams.js
    │   ├── foreignStudies.js
    │   ├── health.js
    │   ├── internships.js
    │   ├── intlScholarships.js
    │   ├── jobs.js
    │   ├── monetization.js
    │   ├── newsletter.js
    │   ├── notifications.js
    │   ├── scholarships.js
    │   ├── trending.js
    │   ├── users.js       # profile, dashboard, resume-analyze, cover-letter, saved, recent-viewed, fcm
    │   ├── webinars.js
    │   └── v1/
    │       └── index.js   # Mobile / future API version
    │
    ├── data/
    │   └── seedJobs.js    # Seed data for jobs
    │
    ├── scheduler/
    │   └── cron.js        # Scraper cron; startScraperCron()
    │
    ├── scripts/
    │   ├── seedExamPrep.js
    │   ├── seedListings.js
    │   ├── seedPhase4.js
    │   ├── seedPhase5.js
    │   ├── seedPhase7.js
    │   ├── seedPhase8.js
    │   ├── seedPhase9.js
    │   └── seedUsers.js
    │
    ├── services/
    │   ├── blogAutoGenerateService.js
    │   ├── emailService.js
    │   ├── notificationService.js
    │   ├── scraperService.js
    │   └── (no index)
    │
    ├── utils/
    │   ├── apiResponse.js
    │   ├── asyncHandler.js
    │   ├── cacheKeys.js
    │   ├── jwt.js
    │   ├── sanitize.js
    │   ├── slugify.js
    │   ├── trendingCache.js
    │   └── (no index)
    │
    ├── validators/
    │   ├── authValidator.js
    │   └── jobValidator.js
    │
    └── __tests__/
        └── auth.test.js
```

---

## 4. Docs & mobile

```
docs/
├── ARCHITECTURE.md   # Auth, API conventions, Phase 5/6 summary
├── FILE_STRUCTURE.md # This file
└── ROADMAP.md

mobile/               # React Native (separate package)
├── api/
│   └── client.js
├── App.js
├── app.json
├── babel.config.js
├── i18n/
│   └── index.js
├── package.json
├── README.md
├── screens/
│   ├── AdmissionsScreen.js
│   ├── HomeScreen.js
│   ├── JobsScreen.js
│   ├── ProfileScreen.js
│   ├── SavedScreen.js
│   └── ScholarshipsScreen.js
└── theme.js
```

---

## 5. API surface (server)

All under `/api` unless noted.

| Prefix / Router   | Purpose |
|-------------------|--------|
| `GET /health`     | Health check (mongo/redis) |
| `/auth`           | Login, register, refresh, profile, fcm-token |
| `/admin/*`        | Admin CRUD: jobs, scholarships, admissions, blogs, foreign-studies, notifications, internships, webinars, intl-scholarships, universities; AI job generate; growth/analytics |
| `/jobs`           | List, get by id/slug, save/unsave, views |
| `/scholarships`   | List, get by id/slug, save/unsave |
| `/admissions`     | List, get by id/slug, save/unsave |
| `/blogs`          | List, get by slug |
| `/foreign-studies`| List, filters |
| `/trending/:type` | jobs | scholarships | admissions |
| `/newsletter`     | Subscribe, unsubscribe, send-daily (admin) |
| `/notifications`  | Send (admin), list (user) |
| `/monetization`   | Featured/sponsored, ad-slots |
| `/users`          | Profile, dashboard, resume-analyze, cover-letter, saved, recent-viewed, fcm (auth) |
| `/exams`          | List, get by slug, quizzes, attempt |
| `/internships`    | List, get, apply, save/unsave, my applications |
| `/chatbot`        | Query, history (auth) |
| `/webinars`       | List, upcoming, recorded, register, my registrations |
| `/intl-scholarships` | List, get, universities, save/unsave |
| `/badges`         | My badges, leaderboard, my rank (auth) |
| `/v1/*`           | Mobile / versioned API |

---

## 6. Frontend routes (client)

| Path | Auth | Description |
|------|------|-------------|
| `/` | No | Home |
| `/jobs`, `/jobs/province/:slug`, `/jobs/category/:slug`, `/jobs/:slug` | No | Jobs list, landing, detail |
| `/scholarships`, `/scholarships/:slug` | No | Scholarships |
| `/admissions`, `/admissions/:slug` | No | Admissions |
| `/schools-and-colleges` | No | Schools & colleges |
| `/foreign-studies` | No | Foreign studies |
| `/blog`, `/blog/:slug` | No | Blog |
| `/contact` | No | Contact |
| `/auth/login`, `/auth/register` | No | Auth |
| `/profile` | Yes | Profile |
| `/dashboard` | Yes | Dashboard |
| `/saved-jobs` | Yes | Saved jobs |
| `/admin`, `/admin/growth-dashboard`, `/admin/ai-job-generator`, `/admin/analytics`, `/admin/alerts` | Admin | Admin panel |
| `/resume-analyzer` | Yes | Resume analyzer |
| `/exam-prep`, `/exam-prep/quiz/:quizId`, `/exam-prep/:slug` | No / Yes | Exam prep, quiz, exam detail |
| `/internships`, `/internships/:idOrSlug` | No | Internships |
| `/webinars` | No | Webinars |
| `/intl-scholarships`, `/intl-scholarships/:id` | No | International scholarships |
| `/badges` | Yes | Badges & leaderboard |

---

## 7. Audit summary

### Strengths

- **Monorepo**: Clear separation of `client/`, `server/`, `docs/`, `mobile/`.
- **Backend**: Consistent use of Mongoose models, centralized auth middleware, route-per-domain, asyncHandler, error handler.
- **Frontend**: Central ROUTES/API_BASE_URL, lazy-loaded pages, context for theme/auth/toast/language, single listings service.
- **Security**: JWT + refresh, role-based routes, rate limiting on `/api`, mongo sanitize, Helmet, env-based secrets.
- **UX**: Scroll-reveal animations, QED theme (primary/mint/surface), responsive layout, dark mode, en/ur.
- **DevEx**: `npm run dev:all` runs client + server; README and docs present.

### Recommendations

1. **Env**: Ensure `server/.env` is never committed; keep `.env.example` updated (JWT, MONGO_URI, REDIS_URL, FCM, OAuth placeholders).
2. **Tests**: Only `server/src/__tests__/auth.test.js` present; add more server and client tests where critical.
3. **API versioning**: `/api/v1` exists for mobile; document versioning policy and keep web vs mobile contracts clear.
4. **Validation**: Validators exist for auth and job; extend to other admin/public inputs where needed.
5. **Docs**: Keep `ARCHITECTURE.md` and this file in sync when adding routes or major features.

### Tech stack (reference)

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, TailwindCSS, React Router 6, Axios, react-helmet-async |
| Backend | Node 20, Express, Mongoose, MongoDB |
| Auth | JWT (access + refresh), bcrypt, role-based (Admin/User) |
| Cache | Redis (ioredis) with in-memory fallback |
| DevOps | Docker, docker-compose (mongo, redis, backend, frontend) |

---

*End of file structure and audit.*
