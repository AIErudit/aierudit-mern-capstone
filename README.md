# AIErudit Bookshop — Capstone Starter

A deliberately broken MERN-stack online bookstore. Starter project for the
**AIErudit Full-Stack Developer With AI** capstone.

## What this is

You are about to clone a small MERN application (Express + Mongoose +
React 18 + Redux Toolkit) that runs end-to-end on your machine. It has
intentional bugs. Your capstone work is to discover them, document them
with observable symptoms, and fix at least one of them with a clean,
minimal commit.

The full capstone instructions live in the **AIErudit Full-Stack AI**
course at https://aierudit.com — Module 6 (Capstone). Open that module
on a second monitor before you start.

This README is intentionally lean. Rewriting and expanding it is one of
the rubric-scored deliverables. The five-paragraph version you produce
should let a new contributor stand the project up from a clean clone in
ten minutes.

## Stack

- **Backend:** Node 20 + Express 4 + Mongoose 8 + JWT in httpOnly cookies
- **Frontend:** React 18 + Vite 5 + Redux Toolkit Query
- **Database:** MongoDB 6 (local or Atlas)
- **Tests:** Jest + supertest scaffold (one example test only)

## Layout

```
server/                    Express API (controllers + services + models)
  config/                  DB connection
  controllers/             HTTP-layer handlers, thin
  services/                Business logic; race conditions and silent
                           errors live here intentionally
  models/                  Mongoose schemas (User, Book, Order, Review)
  middleware/              Auth + error handling
  routes/                  Route wiring under /api/v1/*
  data/                    Seed scripts (npm run data:import)

client/                    Vite + React 18 + RTK Query SPA
  src/pages/               Routed pages
  src/components/          Reusable UI
  src/store/               RTK store + slices + API endpoints

CAPSTONE_INSTRUCTOR_NOTES.md   Planted-bug ground truth (instructor side)
NOTICE.md                       Trademark + heritage
SECURITY.md                     Intentional-bugs disclaimer
```

## Quick start

```bash
# 1. Clone your fork
git clone https://github.com/<your-handle>/aierudit-mern-capstone
cd aierudit-mern-capstone

# 2. Install
npm install
npm install --prefix client

# 3. Start MongoDB (option A: docker-compose)
docker compose up -d mongodb

# 4. Configure
cp .env.example .env
# Edit .env: JWT_SECRET is required.

# 5. Seed data (creates john@learner.aierudit.io / 123456)
npm run data:import

# 6. Run dev (server :5000, client :3000)
npm run dev

# 7. Verify: http://localhost:3000 and log in as the seed user.
```

If `npm run dev` does not boot cleanly on first try, the capstone has
already started — you are in Block 6.1, hunting your first observable
symptom.

## Capstone hand-off

- The rubric is in the AIErudit course module (Block 6.0).
- Planted bugs live throughout `server/` and `client/`. Use the
  grounded bug-hunt prompt template from Module 5.
- Document at least 3 issues in `FINDINGS.md` with observable symptoms,
  then fix one with an atomic commit.
- Push to your fork. The instructor reviews from your fork URL.

## License

MIT — see [`LICENSE`](LICENSE).
