# EduRozgaar – Pakistan Job & Education E-Portal

A production-ready platform to **help students, provide job & education alerts, and reduce unemployment** in Pakistan. Monetization is secondary; the focus is on impact, scalability, and future-ready architecture.

## Vision

- **Primary**: Student support, job & education alerts, reducing unemployment.
- **Secondary**: Scalable foundation for ads, paid features, or premium content later.

## Tech Stack

| Layer    | Stack                          |
| -------- | ------------------------------ |
| Frontend | React.js, Vite, TailwindCSS, React Router, Axios |
| Backend  | Node.js, Express.js            |
| Database | MongoDB with Mongoose          |
| Auth     | JWT / OAuth / role-based (Phase-2) |

## Project Structure (Monorepo)

```
root/
├── client/          # React frontend
│   └── src/
│       ├── assets/
│       ├── components/   (common, layout, ui)
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── layouts/
│       └── constants/
├── server/          # Node backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       ├── utils/
│       └── validators/
├── docs/            # Documentation
├── .env.example
└── README.md
```

## Installation

1. **Clone and install dependencies**

   ```bash
   cd EDU-E-Portal
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

2. **Environment**

   Copy `.env.example` to `.env` in the **root** and in **server/** (or set `server/.env`):

   ```bash
   cp .env.example .env
   cp .env.example server/.env
   ```

   Set at least `PORT`, `MONGO_URI`, and `JWT_SECRET`. Optional: `JWT_EXPIRES_IN`, `REFRESH_EXPIRES_IN`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for OAuth.

3. **MongoDB**

   Ensure MongoDB is running locally (or use a cloud URI in `MONGO_URI`).

## Running the Project

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start React dev server (Vite)  |
| `npm run server`  | Start Express API server       |
| `npm run build`   | Build frontend for production  |
| `npm run start:server` | Run backend in production |

**Development:** Open two terminals:

- Terminal 1: `npm run server` (API at `http://localhost:5000`)
- Terminal 2: `npm run dev` (App at `http://localhost:5173`)

Frontend is configured to call `http://localhost:5000/api` via Axios.

**Seed data:** From `server/` run (in order if starting fresh):
- `npm run seed:users` – 5 students + 1 admin (e.g. `admin@edurozgaar.pk` / `Admin1234`).
- `npm run seed:phase4` – 50 jobs, 30 scholarships, 20 admissions, 20 blogs, 10 foreign studies, 10 notifications. Use `SEED_FORCE=1` to clear and reseed.
- `npm run seed:phase5` – Newsletter subscribers, user bookmarks, recently viewed, and view counts for trending (run after seed:users + seed:phase4).
- `npm run seed:phase7` – Analytics events, preferred language and channel preferences for sample users (run after seed:phase5). From `server/`: `node src/scripts/seedPhase7.js`.

## Docker (Phase 6)

From repo root:

```bash
docker compose up --build
```

- **MongoDB** on 27017, **Redis** on 6379, **Backend** on 5000, **Frontend** (nginx) on 80.
- Set `JWT_SECRET`, `MONGO_URI`, `REDIS_URL` via env or `.env`. Frontend build uses `VITE_API_URL=/api` so nginx can proxy to backend.

## Future Roadmap

- **Phase 5 (done)**: Viral growth — trending listings, dashboard, notifications, newsletter, SEO, toast alerts.
- **Phase 6 (done)**: Monetization (ads, featured/sponsored), FCM tokens, AI job generator, resume analyzer, Redis cache, Docker, security hardening.
- **Phase 7 (done)**: Investor-grade — AI recommendations API (`/api/v1/recommendations/me`), multi-channel alerts (Telegram/WhatsApp placeholders), Mobile API v1, English/Urdu i18n, SEO landing pages (`/jobs/province/:slug`, `/jobs/category/:slug`), analytics dashboard, schema markup.

## License

MIT.
