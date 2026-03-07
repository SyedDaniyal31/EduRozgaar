# EduRozgaar – Phase 2 & 3 Roadmap

**Context:** Phase 1 (Traffic Engine) is implemented: Government Job Scraper + SEO landing pages. This doc outlines Phase 2 (Retention) and Phase 3 (Mass Traffic) as per the Advanced Feature Integration spec.

---

## Phase 1 (Done)

- **Government Job Scraper** – `server/src/scheduler/jobScraper.js` runs every 6h via cron; targets FPSC, PPSC, NTS, WAPDA, Pakistan Army, HEC; duplicate rule: title + organization + deadline; placeholder for “trigger alerts” on new jobs.
- **SEO Traffic Engine** – Dynamic pages: `/jobs-in-<city|province>`, `/latest-government-jobs`, `/fpsc-jobs`, `/nts-jobs`, `/ppsc-jobs`, `/wapda-jobs`, `/government-jobs`, `/private-jobs`, `/scholarships-in-<country>`. Each page: meta title/description, OpenGraph, canonical, JSON-LD schema; sitemap entries in `GET /sitemap.xml`.

---

## Phase 2 – Retention

### Smart Job Alert System

- **User preferences:** Add fields to user/notification preferences: `province`, `degree`, `job_category`, `skills`, `career_interest`.
- **Matching:** When a job is created (or scraped), find users whose preferences match; enqueue/send alerts.
- **Channels:** Email, browser notification (existing FCM/web push), **Telegram** (new: `server/src/services/telegramService.js` – send message to channel on new job).
- **Integration:** Call alert dispatch from scraper (after `jobsAdded > 0`) and from job-creation API.

### Resume Analyzer + Job Matching

- **Extend existing resume module:** After resume upload, extract skills, education, experience (parsing logic or third-party).
- **Scoring:** Compute job match score from job requirements vs. extracted profile.
- **UI:** Show “Top matching jobs”, “Recommended skills”, “Career suggestions” (e.g. “Your Resume Matches 6 Jobs – Frontend Developer, Junior Software Engineer, …”).

---

## Phase 3 – Mass Traffic (Exam Preparation)

- **MCQ Practice:** Categories (Pakistan Affairs, General Knowledge, English, Mathematics, Computer Science, Current Affairs); timed quiz, instant scoring, leaderboard, difficulty levels.
- **Mock Tests:** Full exam simulations (CSS, PPSC, NTS, IELTS, TOEFL, Duolingo, SAT, GRE, GMAT); timer, score calculation, performance analytics.
- **Past Papers:** Downloadable resources by exam, subject, year.
- **Study Guides:** Structured pages e.g. `/exam/ielts-preparation`, `/exam/toefl-guide`, `/exam/css-preparation` with exam overview, test format, study plan, resources, practice tests.

---

## Other Items (Cross-Phase)

- **Telegram Job Alerts:** Implement `server/src/services/telegramService.js`; on new job post → send formatted message to Telegram channel (title, org, deadline, apply link).
- **Admin Dashboard:** Manage jobs, scholarships, exams, MCQs, past papers, blogs, notifications, users; analytics widgets (total users, new jobs, applications, exam participation).
- **Performance:** API caching (e.g. Redis), lazy loading, DB indexing, image optimization; target page load &lt; 2s.
- **Security:** Keep JWT, rate limiting, input validation, file upload validation, HTTPS.
- **Scalability:** Design for 100k+ MAU: Redis caching, CDN, horizontal scaling, background job queues.

---

## Tech Constraints (Unchanged)

- **Stack:** React + Vite (frontend), Node.js + Express (backend), MongoDB + Mongoose, TailwindCSS. No Next.js or new frameworks.
- **Style:** All new features must be modular extensions; no breaking existing routes, no duplicating models, no rewriting current pages.
