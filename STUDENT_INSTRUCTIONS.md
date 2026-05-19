# Full-Stack Developer With AI — Capstone Instructions

**Course:** full-stack-developer-with-ai · Module 6
**Version:** 2.0 — Sprint 118 (Bookshop starter)
**Starter repo:** [`AIErudit/aierudit-mern-capstone`](https://github.com/AIErudit/aierudit-mern-capstone)
**Default branch:** `main`

This document is mirrored into the starter repo as
`STUDENT_INSTRUCTIONS.md`. The AIErudit Module 06 reader shows the
same blocks — read either one; the contract is identical.

---

## What You Are Doing and Why

You are going to fork a deliberately broken MERN stack application — the **AIErudit Bookshop** — apply the AI-IDE discipline from Module 5 to a real codebase, find and document bugs, fix at least one of them, and submit your work for instructor review. When the instructor approves your submission and you have passed the certification quiz, you earn the course certificate.

This is not a demo exercise. The starter repo runs, the bugs are real, and the commits you make will be part of your public portfolio. The goal is to demonstrate that you can do the full loop — read a codebase, establish working context for an AI assistant, find problems systematically, fix one correctly, and leave a clean delivery trail — not just answer questions about how it works in theory.

The runtime is intentionally small (Express + Mongoose + React + Vite, two ports, one Mongo container). Five bugs are planted and documented in `CAPSTONE_INSTRUCTOR_NOTES.md`. The rubric does not penalize learners who read that file before hunting — but the 20% FINDINGS weight scores **observable symptoms in your own words**, not "I copy-pasted the instructor notes." A learner who reads the notes and writes the bug headings back fails the FINDINGS criterion.

---

## Prerequisites

Before you begin, confirm the following:

- **Node.js 20 or later** — run `node --version` to check. Node 18 will mostly work but the `package.json` engines field pins ≥20 and Mongoose 8 prefers it.
- **npm 10 or later** — run `npm --version`.
- **A MongoDB data source** — either a free-tier MongoDB Atlas cluster (`https://cloud.mongodb.com`) or Docker Desktop with Compose support. Both work; the repo ships a `docker-compose.yml` that boots a `mongo:6` container on `:27017`.
- **A GitHub account** — your fork will be public. If you do not have a GitHub account, create one at `https://github.com`.
- **An active AIErudit enrollment on this course** — your enrollment email is required in the submission template.

You do not need to install a specific AI IDE to complete the mandatory blocks. Any editor works. If you want to use Claude Code, Cursor, Windsurf, or another AI IDE for the optional honors blocks, install it after forking the repo.

---

## Block 6.1 — Pre-Flight

**Goal:** Get the app running locally and establish a baseline commit.
**Estimated time:** 20 minutes
**Required artifact:** Public fork with a `chore: fork baseline` commit

### What to do

1. Go to `https://github.com/AIErudit/aierudit-mern-capstone` and click "Fork." Keep visibility set to **Public**.
2. Clone your fork to your local machine:
   ```
   git clone https://github.com/<your-handle>/aierudit-mern-capstone
   cd aierudit-mern-capstone
   ```
3. Install server dependencies (from the repo root — the root `package.json` owns Express, Mongoose, JWT, bcryptjs):
   ```
   npm install
   ```
4. Install client dependencies (the React + Vite SPA is a separate workspace under `client/`):
   ```
   npm install --prefix client
   ```
5. Copy the environment template:
   ```
   cp .env.example .env
   ```
6. Open `.env` and supply the two values that **must** be set:
   - `MONGO_URI` — your MongoDB connection string. For local Docker, leave the default `mongodb://localhost:27017/aierudit_bookshop`. For Atlas, paste your cluster URI.
   - `JWT_SECRET` — any 32+ character random string. `openssl rand -base64 48` works.

   The other variables (`PORT`, `JWT_EXPIRES_IN`, `COOKIE_NAME`, `PAYMENT_MOCK_DELAY_MS`) have working defaults; touch them only if you need to.
7. Start MongoDB. If you are using the bundled compose file, run:
   ```
   docker compose up -d mongodb
   ```
   If you are using Atlas, skip this step.
8. Seed the database:
   ```
   npm run data:import
   ```
   Console output confirms the seed: 2 users, 10 books, ~12 reviews.
9. Start both processes (the root `npm run dev` uses `concurrently` to run the Express server on `:5000` and the Vite client on `:3000`):
   ```
   npm run dev
   ```
10. Open `http://localhost:3000` in a browser. Confirm the home page lists books.
11. Log in using the seed credentials: `john@learner.aierudit.io` / `123456`. Confirm you can open a book detail page and add a book to the cart.
12. Make a baseline commit:
    ```
    git commit --allow-empty -m "chore: fork baseline"
    git push origin main
    ```

### Acceptance criteria

- Fork is accessible at `https://github.com/<your-handle>/aierudit-mern-capstone` without GitHub login.
- `chore: fork baseline` is present in the commit history.
- The app loads and the seed user can log in.

### Common pitfalls

- Running `npm install` only at the repo root and skipping `npm install --prefix client`. The client has its own dependency tree (React, Vite, RTK Query, react-router-dom).
- Putting a real MongoDB Atlas connection string in `.env.example` by accident — `.env.example` must use placeholder values only. If you want Atlas, put the credentials in `.env`, which is gitignored.
- Forgetting to push the baseline commit before starting other work. The timestamp on this commit is how the reviewer confirms when you started.
- Trying to log in before `npm run data:import` completes — the seed user does not exist until the script prints "imported users: 2".

---

## Block 6.2 — Rules File

**Goal:** Write a rules file that gives an AI assistant enough context to help you without inventing missing information.
**Estimated time:** 25 minutes
**Required artifact:** `CLAUDE.md` or `AGENTS.md` at repo root, at least 3 original rules, 200 lines or fewer

### What to do

1. Read these files to understand the codebase structure:
   - `server/server.js` — entry point, middleware, and route registration under `/api/v1/*`.
   - `server/routes/` — route wiring.
   - `server/controllers/` and `server/services/` — handlers and business logic.
   - `server/models/` — Mongoose schemas (`User`, `Book`, `Review`, `Order`, `Cart`).
   - `client/src/pages/` — the SPA routed pages (Home, BookDetail, Cart, Checkout, Login, Register, Orders, Admin).
   - `client/src/store/api/` — RTK Query endpoints.
2. Create `CLAUDE.md` at the repo root (or `AGENTS.md` if you are using Codex).
3. Write a **Stack** section listing:
   - Node version (≥20) and npm version (≥10).
   - Express version (check root `package.json`).
   - Mongoose version (8.x — note that Mongoose 8 dropped Node 16 support).
   - That the client is Vite + React 18 + Redux Toolkit Query (not Create React App).
   - The commands to run the dev server (`npm run dev`), run tests (`npm test`), and seed the database (`npm run data:import` / `npm run data:destroy`).
4. Write an **Architecture** section — one short paragraph describing the three-tier shape: a Vite-served React SPA on `:3000` talking to an Express REST API on `:5000` under `/api/v1/*`, backed by MongoDB via Mongoose, with JWT held in an httpOnly cookie.
5. Write at least **3 unwritten rules** — facts about this codebase that a developer joining the project would not know from reading the README. These should be specific to this repo, not generic web development advice.

   Good examples:
   - "Stock decrement happens inside `server/services/checkoutService.js::placeOrder`; the controller layer does not touch stock directly."
   - "The User model uses an `isAdmin` boolean, not a role enum. Admin gating runs through `server/middleware/authMiddleware.js::requireAdmin`."
   - "RTK Query endpoints live under `client/src/store/api/*Api.js` and share a base URL via `baseApi.js`. New endpoints must register with the store in `store.js`."

   Poor examples that do not count:
   - "Write clean code."
   - "Use meaningful variable names."
   - "Test your changes before committing."

6. Add a **Forbidden patterns** line: "Do not commit `.env` or any file containing real credentials, secrets, or API keys."
7. Count lines. If your draft exceeds 200 lines, cut the least important content first — keep rules, cut prose.
8. Commit:
   ```
   git add CLAUDE.md
   git commit -m "chore: add rules file"
   git push
   ```

### Acceptance criteria

- `CLAUDE.md` or `AGENTS.md` exists at the repo root.
- At least 3 rules are specific to this codebase.
- File is 200 lines or fewer.
- No secrets, credentials, or API keys in the file.

### Common pitfalls

- Writing rules that describe general programming practices rather than facts about this specific repo.
- Accidentally adding `.env` to the rules file while referencing environment variables — mention variable names only, never their values.
- Exceeding 200 lines by transcribing the entire route list — summarize the API shape rather than listing every endpoint.
- Pinning to Create React App in the Stack section. The client is Vite; the rules file must say Vite or the model will suggest CRA-specific scripts (`react-scripts start`, etc.) that do not exist.

---

## Block 6.3 — README Rewrite

**Goal:** Replace the lean stub `README.md` with documentation a new developer can use to get running in under ten minutes.
**Estimated time:** 20 minutes
**Required artifact:** Rewritten `README.md` with all six required sections; `.env.example` committed with placeholder values

### What to do

1. Open `README.md`. The shipped version is intentionally lean and explicitly calls out that rewriting and expanding it is one of the rubric-scored deliverables. Replace the contents.
2. Write a new README with the following sections:

   **AIErudit Bookshop**
   One paragraph describing what the app is and its purpose in this capstone.

   **Prerequisites**
   - Node.js 20+
   - npm 10+
   - MongoDB Atlas free tier or Docker Desktop
   - A GitHub account

   **Setup**
   Numbered steps: clone, `npm install`, `npm install --prefix client`, copy `.env.example` to `.env`, fill in `MONGO_URI` and `JWT_SECRET`.

   **Seed the database**
   - Import: `npm run data:import`
   - Destroy: `npm run data:destroy`

   **Run**
   - Development (both servers): `npm run dev` (server on `:5000`, client on `:3000`).
   - Production-ish: `npm start` for the server; the client is meant to be built via `npm run build --prefix client` and served separately (the Block 6.7 honors flow shows one way).

   **Test credentials**
   List the seed user email and password so a new developer can verify the app works without signing up:
   - Non-admin: `john@learner.aierudit.io` / `123456`
   - Admin: `admin@aierudit.io` / `AdminPassword!2026`

3. Open `.env.example`. Confirm it exists and contains placeholder values — not real credentials — for all required variables (`MONGO_URI`, `JWT_SECRET`, plus the defaults already present).
4. Commit both files:
   ```
   git add README.md .env.example
   git commit -m "docs: rewrite readme and add env example"
   git push
   ```

### Acceptance criteria

- `README.md` no longer matches the shipped stub. It has the six required sections.
- `.env.example` is present and committed with placeholder values.
- No real credentials appear in either file.

### Common pitfalls

- Leaving the original "This README is intentionally lean" disclaimer in place — that paragraph is part of the stub you are replacing.
- Writing `.env.example` with a real MongoDB Atlas URI — use `mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DBNAME` as the placeholder shape.
- Omitting the `npm install --prefix client` step from the Setup section — this is the most common reason new developers hit a build error.
- Documenting Create React App commands (`react-scripts start`, `react-scripts build`). The client uses Vite — the relevant commands are `npm run dev --prefix client` and `npm run build --prefix client`.

---

## Block 6.4 — FINDINGS and Fix

**Goal:** Use the FINDINGS pattern to document at least 3 bugs, then fix one of them cleanly.
**Estimated time:** 60 minutes
**Required artifact:** `FINDINGS.md` with at least 3 rows; at least 1 row with a commit hash in the Status column; fix must not break the runtime

### What to do

1. Create `FINDINGS.md` at the repo root with this header:
   ```
   | Issue | Symptom | Root cause (observed) | Fix applied | Commit | Status |
   |---|---|---|---|---|---|
   ```
2. Use the bug-hunt prompt pattern from Module 5 to investigate the codebase. Ground every prompt in an observable symptom. For example:
   - "Logged in as `john@learner.aierudit.io`, I `POST /api/v1/cart/items` with `{bookId: '<valid id>', quantity: -3}` via the browser dev-tools console. The response is 200 and the cart line for that book is reduced by 3. The Mongoose schema for `Cart` has no min or integer constraint. Here is `server/controllers/cartController.js::addItem`: [paste]. What is the root cause and what minimal change would close it?"
   - Do not use: "Find all the bugs in the codebase."
3. Document at least 3 issues. For each row, write:
   - **Issue**: a short title
   - **Symptom**: what you can observe without running the fix — the specific endpoint, screen, action, log output, or test failure
   - **Root cause (observed)**: what you found in the code that explains the symptom
   - **Fix applied**: what you changed, or leave blank until you apply the fix
   - **Commit**: the commit hash of the fix, or leave blank
   - **Status**: `identified` or `fixed — commit <hash>`
4. Choose one issue to fix. Before writing any fix code, add a characterization test in `experiments/m2-char-tests/` that captures the current broken behavior (see Block 6.6 for the full characterization-test instructions if you want full credit; for this mandatory block, a simple `console.assert` or a failing Jest test is sufficient as evidence that you understood the bug before fixing it).
5. Apply the minimal fix. Change only what is needed to address the specific symptom — do not refactor adjacent code in the same commit.
6. Verify the fix:
   - Does `npm run dev` still start without errors?
   - Can `john@learner.aierudit.io` still log in?
   - Does the symptom you described in FINDINGS no longer appear?
7. Commit the fix:
   ```
   git add <changed files>
   git commit -m "fix: <describe the fix in one line>"
   git push
   ```
8. Copy the commit hash (`git rev-parse HEAD` prints the full hash) into the FINDINGS row.
9. Update the row Status to `fixed — commit <hash>`.
10. Commit the updated FINDINGS:
    ```
    git add FINDINGS.md
    git commit -m "docs: update findings with fix commit"
    git push
    ```

### Where the planted bugs live

There are five planted bugs in this starter. Each is documented in detail in `CAPSTONE_INSTRUCTOR_NOTES.md` and marked in source with a `// CAPSTONE-BUG-N:` comment. You may grep for `CAPSTONE-BUG-` to find them. Reading the notes file is allowed — the rubric scores the **observable symptom in your own words** and the **clean fix commit**, not the act of finding the markers.

| # | Surface | One-line symptom hint |
|---|---|---|
| 1 | `server/services/checkoutService.js::placeOrder` | Two concurrent place-order POSTs against a book with `stock: 1` both succeed; `book.stock` becomes negative. |
| 2 | `server/controllers/cartController.js::addItem` | The cart accepts negative and fractional `quantity` values. |
| 3 | `server/routes/admin.routes.js` (refund route) | A non-admin authenticated user can issue refunds. |
| 4 | `server/services/paymentService.js::processPayment` | Declined mock-payment results in `isPaid: true`. |
| 5 | `server/controllers/bookController.js::list` | `GET /api/v1/books` produces N+1 review queries (visible with `mongoose.set('debug', true)`). |

The seed books include several titles with low stock (`stock: 1` or `stock: 4`) precisely so Bug 1 can be reproduced without re-seeding.

### Acceptance criteria

- `FINDINGS.md` has at least 3 rows beyond the header.
- Every row has a specific observable symptom — not a general description of the problem area.
- At least 1 row has `Status: fixed — commit <real-hash>`.
- The fix commit does not break `npm run dev` startup or the seed-user login flow.

### Common pitfalls

- Writing "Cart total is wrong" as a symptom — instead write: "POST `/api/v1/cart/items` with body `{bookId: '<valid id>', quantity: -3}` returns 200 and the cart line for that book is reduced by 3 in `server/controllers/cartController.js::addItem`. No validation runs before the persist."
- Fixing more than one issue in a single commit — keep fixes atomic. Each FINDINGS row that is marked fixed should have its own commit.
- Committing a fix and then committing another commit that reverts part of it — the reviewer looks at the full commit history.
- Making a fix that resolves the symptom but introduces a new failure in a different part of the app.

---

## Block 6.5 — Mermaid C4 Diagram (Optional — Honors)

**Goal:** Add a two-level C4 architecture diagram to the repo.
**Estimated time:** 30 minutes
**Required artifact:** `docs/architecture.md` with at least two Mermaid diagram blocks

### What to do

1. Create `docs/architecture.md`.
2. Write a **C4 Context diagram** using Mermaid. Show:
   - External actors: Shopper and Admin (the two user types in the seed data).
   - The system boundary: AIErudit Bookshop.
   - External services: MongoDB (Atlas or local) and the in-process mock payment service. The starter does not call a real payment provider — `server/services/paymentService.js` simulates one. Show the mock as an internal container, not an external system.
3. Write a **C4 Container diagram** using Mermaid. Show:
   - React SPA (Vite, browser).
   - Express REST API (`server/server.js`, port 5000).
   - MongoDB database.
   - Optionally, the static-file delivery surface used in production (nginx serving the Vite build, as Block 6.7 sets up).
4. Below each diagram, add one short paragraph describing an architectural decision that is not visible in the diagram — for example, why the JWT lives in an httpOnly cookie rather than localStorage, or why the Vite dev server proxies API calls to `:5000` in development.
5. Commit:
   ```
   git add docs/architecture.md
   git commit -m "docs: add mermaid c4 architecture diagrams"
   git push
   ```

### Acceptance criteria

- `docs/architecture.md` exists and has at least two Mermaid blocks.
- Context diagram shows external actors and the MongoDB external dependency.
- Container diagram shows the three-tier structure (SPA, API, DB).
- No placeholder nodes ("TODO", "???", "Add me").

### Common pitfalls

- Using a generic Mermaid flowchart instead of C4 conventions. If you are not familiar with C4 syntax in Mermaid, use standard flowchart nodes and explicitly label each node with its C4 type (e.g., `Person`, `System`, `Container`).
- Drawing the mock payment service as an external system. It runs inside the Express process — it belongs in the Container diagram, not the Context diagram.
- Omitting the React SPA as a distinct container — the browser-side app is its own deployable unit and should appear in the Container diagram as a separate box from the API.
- Drawing the context diagram at the container level of detail — the Context diagram should show what interacts with the system from outside, not the internal structure.

---

## Block 6.6 — Characterization Tests (Optional — Honors)

**Goal:** Write characterization tests that capture the current behavior of two functions in the starter repo.
**Estimated time:** 45 minutes
**Required artifact:** At least 2 test files in `experiments/m2-char-tests/`; tests run with `npx jest experiments/m2-char-tests/`

### What to do

1. Create the directory:
   ```
   mkdir -p experiments/m2-char-tests
   ```
2. Choose two functions or route handlers that were not involved in your Block 6.4 fix. Good targets:
   - `server/controllers/authController.js` (login / register handlers).
   - `server/controllers/orderController.js` (order detail handler).
   - `server/middleware/authMiddleware.js::protect` (token parsing).
3. For each function, create a test file named `char_<module>_<function>.test.js` — for example, `char_authController_login.test.js`.
4. In each file, write at least 3 test cases:
   - Import the function or mock the Express request/response pair directly.
   - Use inputs you know the function receives.
   - Assert the current output — not what it should do, but what it actually does.
5. Add a comment in at least one test case explaining what you expected vs. what you observed. For example:
   ```js
   // Expected: returns 401 for missing token.
   // Observed: returns 401 with body { message: 'Not authorized' } and no `code` field.
   ```
6. Run the tests:
   ```
   npx jest experiments/m2-char-tests/
   ```
   All tests must pass before you commit.
7. Commit:
   ```
   git add experiments/
   git commit -m "test: add characterization tests for <module> <function>"
   git push
   ```

### Note on running Jest with ESM

The starter is ESM-only (`"type": "module"` in the root `package.json`). The root `npm test` script already passes `--experimental-vm-modules` to Jest; replicate the same flag if you invoke `npx jest` directly: `node --experimental-vm-modules ./node_modules/jest/bin/jest.js experiments/m2-char-tests/`.

### Acceptance criteria

- At least 2 files exist in `experiments/m2-char-tests/`.
- All tests pass with `npx jest experiments/m2-char-tests/` (or the ESM-aware equivalent above).
- At least one test has a comment describing expected vs. observed behavior.

### Common pitfalls

- Writing tests that assert what the function should do according to the spec rather than what it currently does. A characterization test is a behavioral snapshot — it freezes the current reality, including bugs.
- Requiring the full Express app to start for a unit-level test. Import the function directly and mock its Mongoose model dependencies using `jest.unstable_mockModule()` (the ESM-friendly equivalent of `jest.mock()`).
- Putting characterization tests in the main `server/__tests__/` directory — they belong in `experiments/m2-char-tests/` because they are exploration artifacts, not regression suite entries.

---

## Block 6.7 — Docker Compose (Optional — Honors)

**Goal:** Extend the shipped `docker-compose.yml` so a single command boots **the full stack** — server, client, and MongoDB.
**Estimated time:** 40 minutes
**Required artifact:** Updated `docker-compose.yml` at repo root; `docker compose up --build` starts successfully; the app is accessible at `http://localhost:3000` within 60 seconds

### What to do

1. Open the shipped `docker-compose.yml`. It currently defines only the `mongodb` service. Your job is to add `server` and `client` services so the whole stack boots from one command.
2. Create a server `Dockerfile` at the repo root:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY server ./server
   EXPOSE 5000
   CMD ["node", "server/server.js"]
   ```
3. Create `client/Dockerfile` as a multi-stage build that produces a static bundle and serves it with nginx:
   ```dockerfile
   FROM node:20-alpine AS build
   WORKDIR /app
   COPY client/package*.json ./
   RUN npm ci
   COPY client/ ./
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   ```
4. Add the `server` and `client` services to `docker-compose.yml`. Use the service name `mongodb` (not `localhost`) for the server's `MONGO_URI`:
   ```yaml
   server:
     build: .
     ports:
       - "5000:5000"
     env_file: .env
     environment:
       - MONGO_URI=mongodb://mongodb:27017/aierudit_bookshop
     depends_on:
       - mongodb
   client:
     build:
       context: .
       dockerfile: client/Dockerfile
     ports:
       - "3000:80"
     depends_on:
       - server
   ```
5. Create a `.dockerignore` at the repo root containing:
   ```
   node_modules
   client/node_modules
   .env
   .git
   ```
6. Run the build:
   ```
   docker compose up --build
   ```
7. Verify the app loads at `http://localhost:3000`. The Vite build is static, so the client speaks to the API at the same origin under `/api/v1/*` — if you use the client image standalone, make sure it proxies API calls through nginx (one accepted approach is to add an nginx proxy rule under `client/nginx.conf` that forwards `/api/` to `http://server:5000/api/`).
8. Commit:
   ```
   git add docker-compose.yml Dockerfile client/Dockerfile .dockerignore
   git commit -m "chore: extend compose to boot full stack"
   git push
   ```

### Acceptance criteria

- `docker compose up --build` completes without errors.
- The app is accessible at `http://localhost:3000` within 60 seconds.
- MongoDB data persists across `docker compose down && docker compose up` cycles (the shipped `mongo_data` volume continues to be used).

### Common pitfalls

- Using `localhost` as the MongoDB hostname in the server container's `MONGO_URI`. Inside Docker, services refer to each other by service name. Use `mongodb://mongodb:27017/aierudit_bookshop`, not `mongodb://localhost:27017/aierudit_bookshop`.
- Forgetting `.dockerignore`. The image build copies `node_modules` into the container, which is slow and sometimes causes platform incompatibility.
- Hardcoding `aierudit_store` as the database name (that was the e-commerce-store starter's name in earlier capstones). The current DB name is `aierudit_bookshop`.
- Pinning the Dockerfile to `node:18-alpine`. Mongoose 8 wants Node 20; pin to `node:20-alpine`.

---

## Optional Extension — Browser Regression and MCP Retrieval

**Goal:** Add one current AI-delivery extension after the mandatory fix: browser-observable validation, a repo design contract, a documentation-grounded lookup surface, and a living-KB traceability map.
**Estimated time:** 45–60 minutes
**Optional artifacts:** `DESIGN.md`, `docs/ai-lab.md`, `docs/kb-traceability.md`, browser evidence screenshots or transcript

### What to do

1. Create `DESIGN.md` for the touched screen or admin surface. Keep it under 120 lines and include state, density, accessibility, and anti-slop rules.
2. Add `docs/ai-lab.md` describing one read-only MCP-style or HTTP-wrapper capability, such as book-inventory lookup, order-status lookup, or refund-history search (read-only — the wrapper must not mutate state).
3. Run a browser regression path manually or with an automation helper: start the app, navigate to the changed flow, capture the failing state before the fix and the passing state after the fix.
4. Add an evidence section to `report.md` with the command, route, seed user, screenshots or transcript, and the exact source doc used by the retrieval lane.
5. Add `docs/kb-traceability.md` with source IDs, claim IDs, validation evidence, owner, and freshness trigger for at least three reusable claims.

### Evidence packet shape

```markdown
## Optional AI Delivery Extension

### Browser Regression
- Route: `/cart`
- Baseline symptom: cart accepts `quantity: -3` and the line total goes negative (CAPSTONE-BUG-2)
- Validation command: `npm run dev` plus browser walkthrough on `:3000`
- Evidence: `docs/evidence/cart-before.png`, `docs/evidence/cart-after.png`

### MCP / Wrapper Lookup
- Capability: `lookup_book_inventory`
- Source file: `server/models/Book.js`
- Allowed action: read-only lookup by book id or ISBN
- Denied action: stock mutation

### Retrieval Citation
- Source doc: `README.md#environment-variables`
- Used to explain why the fix needs `.env.example` but not real credentials

### Living KB Traceability
- KB file: `docs/kb-traceability.md`
- Source-to-claim: `README.md#environment-variables` -> `CLAIM-env-example-no-secrets`
- Claim-to-validation: `CLAIM-env-example-no-secrets` -> `SMOKE-cart-validation-2026-05-19`
- Freshness trigger: recheck after env-contract, dependency, or auth-flow changes
```

### Common pitfalls

- Adding write-capable tools to a public fork. Keep this extension read-only.
- Capturing screenshots without naming the route, command, and seed state.
- Treating `DESIGN.md` as a mood board instead of a compact review contract.
- Writing a KB summary without source IDs and validation IDs. A living KB must be traceable, not just polished.

---

## Block 6.8 — report.md

**Goal:** Write a concise delivery report that a reviewer can read in two minutes.
**Estimated time:** 20 minutes
**Required artifact:** `report.md` at repo root; 200 words or fewer; three required sections

### What to do

1. Create `report.md` at the repo root.
2. Write these three sections exactly as headings (the automated check looks for them by name):

   **What I did**
   One paragraph listing which mandatory blocks you completed and which honors blocks you attempted.

   **What I found**
   One paragraph summarizing the most interesting or surprising bug from `FINDINGS.md` and why it matters for a production application.

   **What I would do next**
   One paragraph describing one thing you would improve or investigate given more time.

3. Count the words. A word processor or `wc -w report.md` works. If the count is over 200, cut sentences that repeat what is already said elsewhere.
4. Commit:
   ```
   git add report.md
   git commit -m "docs: add capstone report"
   git push
   ```

### Acceptance criteria

- `report.md` is at the repo root.
- "What I did", "What I found", and "What I would do next" are present as section headings.
- Total word count is 200 or fewer.
- No confidential information, no real credentials, no API keys.

### Common pitfalls

- Writing a marketing summary ("I learned a tremendous amount and grew as a developer") instead of a technical delivery report.
- Exceeding 200 words because of long sentences that could be cut — the limit is strict because the instructor reads many submissions.
- Omitting one of the three required section headings — even if the content is there, the automated check looks for the exact heading text.

---

## Block 6.9 — Submit

**Goal:** Submit your fork URL and completion checklist to the AIErudit support queue.
**Estimated time:** 10 minutes
**Required artifact:** Support form submission with the canonical subject template

### What to do

Before submitting, do a final check:
- Your fork is public on GitHub and the default branch is `main`.
- `CLAUDE.md` or `AGENTS.md` is committed.
- `README.md` is rewritten (no longer the shipped lean stub).
- `.env.example` is committed with placeholder values only.
- `FINDINGS.md` has at least 3 rows with observable symptoms and at least 1 fix commit hash.
- `report.md` is at the repo root and is 200 words or fewer.
- You have completed the certification quiz in the AIErudit learner dashboard (the quiz is in Module 6) and you know your score.

Then open the AIErudit support form:

1. Go to `https://aierudit.com/creator/support` (you must be logged in to AIErudit).
2. Click "New case."
3. Set the category to **Other**.
4. Copy and fill in the subject and body templates below.
5. Submit the case.

If you do not have access to `/creator/support`, email `support@aierudit.com` using the same subject and body templates.

---

## Submission Template

Copy this exactly. Replace the bracketed values.

**Subject:**
```
[CAPSTONE] <your-enrollment-email>
```

**Body:**
```
Fork URL: https://github.com/<your-handle>/aierudit-mern-capstone
Default branch: main

Checklist:
[ ] Public fork exists with baseline commit "chore: fork baseline"
[ ] CLAUDE.md or AGENTS.md committed at repo root, at least 3 unwritten rules, 200 lines or fewer, no credentials
[ ] README rewritten beyond the shipped stub, .env.example present with placeholder values
[ ] FINDINGS.md has at least 3 rows with observable symptoms
[ ] At least 1 FINDINGS row has Status: fixed with a verifiable commit hash
[ ] Fix commit does not break the runtime (npm run dev starts, seed user can log in)
[ ] report.md is at repo root, three required sections present, 200 words or fewer

Honors blocks completed (check all that apply):
[ ] Mermaid C4 diagram in docs/architecture.md
[ ] Characterization tests in experiments/m2-char-tests/ (run with npx jest experiments/m2-char-tests/)
[ ] docker-compose.yml extended to boot the full stack with docker compose up --build

Optional extension completed (if applicable):
[ ] DESIGN.md plus browser regression evidence
[ ] docs/ai-lab.md with read-only MCP/wrapper lookup and retrieval citation
[ ] docs/kb-traceability.md with source-to-claim-to-validation map

Certification quiz score: ___/40

Any notes for the reviewer:
```

Fill in each checkbox that applies by replacing `[ ]` with `[x]`. Leave uncompleted items as `[ ]`.

---

## Reviewer SLA and What Happens Next

After you submit:
- An instructor will review your fork within **5 business days**.
- If your submission meets all criteria and your quiz score is 80% or higher, the instructor marks the support case resolved and triggers a certificate grant. Your certificate for the course will appear at `/courses/full-stack-developer-with-ai/certificate` within 24 hours.
- If your submission needs work, the instructor sets the case to "waiting for you" and sends a reply listing exactly which criteria were not met and what you need to change. Address the feedback, push the updates to your fork, and reply to the case with an updated checklist. There is no penalty for one return-with-feedback cycle.

---

## FAQ

**What if my fix breaks the app?**
Revert the fix commit with `git revert <hash>`. Review the symptom again and apply a smaller, more targeted change. A fix that introduces a new failure is scored lower than no fix at all, so it is better to mark the issue `identified` and attempt a different bug than to ship a fix that breaks the runtime.

**Do I have to complete all three honors blocks?**
No. One honors block is enough to meet the minimum for standard certificate consideration. Completing two honors blocks qualifies you for the honors certificate if your total rubric score reaches 90 and your quiz score is 80% or higher. Completing all three earns the same honors recognition as completing two — there is no tier above honors in the current rubric.

**Can I use a different AI IDE?**
Yes. The rules file name changes by IDE: `.cursorrules` for Cursor, `.windsurfrules` for Windsurf, `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex, `.github/copilot-instructions.md` for GitHub Copilot, `.clinerules` for Cline. Any of these counts for Block 6.2 as long as the file is committed and meets the content criteria. If you use an IDE not listed here, name your rules file `CLAUDE.md` — it is the most universally recognized convention.

**Can I fix more than one bug?**
Yes. The minimum is one fix with a commit hash, but you are welcome to fix additional bugs. Each fix should be a separate commit. Update the corresponding FINDINGS row for each fix. Multiple fixes do not change the rubric score on Criterion 4, but they do strengthen Criterion 5 and 6 if the commits are clean and the fixes are verified.

**The app fails to start after my fix. What should I do?**
Run `git diff HEAD~1` to see exactly what the fix changed. Check the MongoDB connection string, any import statements you changed, and any route handler logic. If you cannot identify the regression, use `git bisect` or revert the fix commit and try a narrower approach. Do not submit a broken runtime — the instructor's smoke test is a hard requirement.

**Can I use a private fork?**
No. The submission process requires the reviewer to clone your fork directly. A private fork cannot be reviewed. If your repo is currently private, go to repository Settings on GitHub and change visibility to Public before submitting.

**Can I use MongoDB Atlas instead of a local MongoDB?**
Yes. Use your Atlas free-tier cluster connection string in `.env`. For Block 6.7 (Docker Compose), you can either use the local `mongodb` container defined in the compose file or configure the compose `server` service to point to your Atlas cluster. If you use Atlas in the compose file, document that in `docker-compose.yml` as a comment so the reviewer knows what connection is expected.

**What if I find fewer than 3 bugs?**
Look more carefully. The starter repo was designed with five planted bugs documented in `CAPSTONE_INSTRUCTOR_NOTES.md` and marked in source with `// CAPSTONE-BUG-N:` comments. If you have been looking at the same file for 30 minutes without finding a third observable issue, try the following surfaces: `server/services/checkoutService.js::placeOrder`, `server/controllers/cartController.js::addItem`, and `server/controllers/bookController.js::list`. A structured bug-hunt prompt grounded in the specific endpoint behavior you observe will produce better results than asking an AI to "find bugs" without a symptom.

---

## Code of Conduct

Do not commit secrets, API keys, access tokens, MongoDB connection strings with real credentials, or personal authentication tokens into any file in this repository, including `FINDINGS.md`, `report.md`, your rules file, or any characterization test. The repository is public. Any secret committed to a public repository should be treated as compromised and rotated immediately.
