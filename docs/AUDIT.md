# EduRozgaar – Complete Project Audit

**Date:** March 2026  
**Scope:** Structure, dependencies, configuration, backend, frontend, security, documentation, testing, build/run, Git.

---

## Executive Summary

The project is a **full-stack monorepo** (Node/Express + React/Vite) with a separate **mobile** (Expo) directory. Structure is clear, auth and security middleware are in place, and documentation is useful. Main gaps: **no root `.env.template`** (docs reference it), **minimal automated testing** (no test runner or CI), and **no Prettier config**. No `dangerouslySetInnerHTML` or hardcoded secrets were found in app code.

**Priority actions:**
1. Add root `.env.template` (SERVER + CLIENT sections) so setup matches README/DEPLOYMENT.
2. Run `npm audit` in `server/` and `client/` and fix critical/high where possible.
3. Require `JWT_SECRET` in production (fail startup if missing).
4. Add a `test` script and optionally Jest/Vitest + CI for lint/test.

---

## 1. Structure

| Area | Finding |
|------|---------|
| **Root** | `package.json`, `README.md`, `DEPLOYMENT.md`, `.gitignore`, `client/`, `server/`, `mobile/`, `docs/`. No npm workspaces; no root `config` or `tsconfig`. |
| **Server** | `server/src/`: `config/`, `controllers/`, `models/`, `routes/`, `middleware/`, `services/`, `utils/`, `validators/`, `scheduler/`, `seed/`, `scripts/`, `data/`, `__tests__/`. Has `.eslintrc.cjs`, `Dockerfile`. |
| **Client** | `client/src/`: `components/`, `pages/`, `routes/`, `services/`, `context/`, `hooks/`, `utils/`, `constants/`, `layouts/`. Vite, Tailwind, PostCSS, ESLint, `Dockerfile`. |
| **Gaps** | `mobile/` exists but root scripts/docs focus on client + server. Root `.env.template` referenced in docs but **not present** in repo. |

**Recommendation:** Add root `.env.template`; optionally document how to run the mobile app.

---

## 2. Dependencies

| Package | Main deps (examples) |
|---------|------------------------|
| **Root** | Dev: `concurrently`, `prettier`. Scripts delegate to client/server. |
| **Server** | `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `dotenv`, `compression`, `ioredis`, `multer`, `node-cron`. Dev: `eslint`. |
| **Client** | `react`, `react-dom`, `react-router-dom`, `axios`, `react-helmet-async`, `jspdf`, `html2canvas`. Dev: `vite`, `@vitejs/plugin-react`, `eslint`, `tailwindcss`, etc. |

- No npm workspaces; client and server are independent.
- Versions look current; no duplicate/conflict audit was run.

**Recommendation:** Run `npm audit` in `server/` and `client/`; fix critical/high. Consider locking major versions for production.

---

## 3. Configuration

| Item | Detail |
|------|--------|
| **Server env** | `MONGO_URI`, `PORT`, `NODE_ENV`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_EXPIRES_IN`, `SITE_URL`, `FRONTEND_URL`/`APP_URL`, `REDIS_URL`, `DISABLE_SCRAPER_CRON`. No secrets in code. |
| **Client env** | `VITE_API_URL` (API base), `VITE_APP_URL` (site/canonical). Used in `constants/index.js` and various pages. |
| **.gitignore** | `.env`, `server/.env`, `client/.env`, and common variants ignored. |
| **ESLint** | Server: recommended + Node/ES2022. Client: React + Hooks + react-refresh. No Prettier config file (format script uses Prettier with paths). |

**Required for run:** Server: `MONGO_URI`, `JWT_SECRET` (production). Client build: `VITE_API_URL`, `VITE_APP_URL`.

**Recommendation:** Add root `.env.template` listing all server/client vars. Add `.prettierrc` or document the format script.

---

## 4. Backend

| Area | Finding |
|------|---------|
| **Routes** | health, jobs, scholarships, admissions, blogs, foreignStudies, auth, admin, trending, newsletter, notifications, monetization, users, v1, exams, internships, chatbot, webinars, intlScholarships, badges, seo, resumes. |
| **Models** | User, Job, Scholarship, Admission, Blog, ForeignStudy, Exam, Internship, Resume, Application, Notification, Newsletter*, Webinar*, IntlScholarship, Badge*, Analytics*, Scraper*, ChatHistory, Quiz*, etc. |
| **index.js order** | dotenv → helmet → compression → cors → json → mongoSanitize → requestLogger → apiLimiter → static (sitemap, robots) → API routers → errorHandler. |
| **Auth** | Register/login (validated), JWT access + refresh, forgot/reset password (token in DB, email service). `requireAuth` middleware for protected routes. |
| **Security** | CORS (default), rate limit on `/api`, helmet (CSP off), mongo-sanitize. |

**Recommendation:** Stricter CORS origin in production; consider tiered rate limit for auth routes.

---

## 5. Frontend

| Area | Finding |
|------|---------|
| **Layout** | `components/` (common, layout, ui, auth, listings, ads, newsletter, chatbot), `pages/` (Auth, Home, Jobs, Scholarships, Admissions, Blog, Admin, Dashboard, ExamPrep, etc.), `routes/index.jsx`, `services/`, `context/`, `hooks/`, `utils/`, `constants/`, `layouts/MainLayout.jsx`. |
| **Routing** | Single route config; lazy-loaded pages; `MainLayoutWrapper`; `ProtectedRoute` for auth. |
| **API** | `API_BASE_URL` from `VITE_API_URL` in `constants/index.js`; Axios instance in `axiosBase.js`; refresh-token logic. Vite proxy `/api` → backend. |
| **State** | React Context only (Auth, Theme, Toast, Language, Notification). No Redux. |

---

## 6. Security

| Check | Result |
|-------|--------|
| **process.env** | Used only for config; no secrets in responses or logs. |
| **JWT** | Fallback secret in code; production warning in `index.js`. |
| **.gitignore** | Covers `server/.env`, `client/.env`, build dirs, `node_modules`. |
| **Client XSS** | No `dangerouslySetInnerHTML` in `client/src`. |

**Recommendation:** Require `JWT_SECRET` when `NODE_ENV === 'production'` (exit if missing).

---

## 7. Documentation

| Doc | Content |
|-----|---------|
| **README.md** | Overview, stack, install, env (refers to root `.env.template`), MongoDB, run, seed, Docker. |
| **DEPLOYMENT.md** | Prerequisites, MongoDB, env tables, seed, run locally, production build/run, Docker. References root `.env.template`. |
| **docs/SETUP_AND_RUN.md** | Step-by-step MongoDB, env, run and test. |

**Gap:** Root `.env.template` is referenced but **not in repo**.

**Recommendation:** Add `.env.template`; optionally add a short Testing section.

---

## 8. Testing

| Item | Finding |
|------|---------|
| **Tests** | `server/src/__tests__/auth.test.js` – small in-file checks; no Jest/Vitest. |
| **Scripts/CI** | No `test` script in package.json; no CI workflow. |

**Recommendation:** Add `test` script; consider Jest/Vitest + supertest and a CI workflow for lint/test.

---

## 9. Build & Run

| Task | How |
|------|-----|
| **Install** | Root + `client` + `server` each `npm install` (no workspaces). |
| **Dev** | Root `npm run dev` = client only; `npm run dev:all` = server + client (concurrently). |
| **Build** | Root `npm run build` → client Vite build → `client/dist/`. |
| **Run prod** | Root `npm run start:server` runs server. |
| **Seed** | Root `npm run seed` runs server main seed; server has phase/listing seeds. |

Scripts and docs are aligned.

---

## 10. Git

| Item | Finding |
|------|---------|
| **.gitignore** | `node_modules/`, `.env` and variants, `server/.env`, `client/.env`, `client/dist/`, `server/dist/`, logs, IDE/OS, coverage. |
| **Secrets** | No committed `.env` with real secrets in audited state. |

**Recommendation:** Keep `.env` out of commits; consider a pre-commit or CI check that blocks `server/.env` and `client/.env`.

---

## Summary Table

| Category   | Status   | Notes                                      |
|-----------|----------|--------------------------------------------|
| Structure | Good     | Clear; add `.env.template`                 |
| Deps      | Good     | Run `npm audit`                            |
| Config    | Good     | Env-based; template missing                |
| Backend   | Good     | Auth, rate limit, sanitize                 |
| Frontend  | Good     | Vite, context, centralized API             |
| Security  | Good     | No XSS in app code; harden JWT in prod     |
| Docs      | Good     | Align with `.env.template`                 |
| Testing   | Minimal  | No runner/CI                               |
| Build/Run | Good     | Matches docs                               |
| Git       | Good     | Sensible .gitignore                        |
