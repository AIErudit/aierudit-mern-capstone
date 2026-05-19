# Capstone Rubric — Full-Stack Developer With AI

**Course:** full-stack-developer-with-ai
**Applies to:** Module 6 (`full-stack-ai-module-06-capstone`)
**Version:** 2.0 — Sprint 118 (Bookshop starter)
**Starter repo:** [`AIErudit/aierudit-mern-capstone`](https://github.com/AIErudit/aierudit-mern-capstone)

---

## Scoring Rubric

| # | Criterion | Weight | Auto-checkable |
|---|---|---|---|
| 1 | Public fork exists, baseline commit present | 10% | Yes |
| 2 | Rules file in repo, at least 3 unwritten rules, 200 lines or fewer | 15% | Yes |
| 3 | README rewritten (no longer the shipped stub), `.env.example` present with placeholders | 15% | Yes |
| 4 | `FINDINGS.md` has at least 3 issues, at least 1 fixed with commit hash | 20% | Semi |
| 5 | Fix commit does not break the runtime (manual smoke) | 10% | Manual |
| 6 | Commits look organic — clear messages, sensible time spread | 10% | Semi |
| 7 | `report.md` at repo root, 200 words or fewer, three required sections present | 5% | Yes |
| 8 | At least 1 honors block completed (Mermaid / char-tests / docker-compose full stack) | 15% | Semi |

**Total:** 100 points

---

## Thresholds

| Outcome | Requirement |
|---|---|
| Pass (standard certificate) | Score of 70 or above **and** instructor approval |
| Honors (certificate with honors badge) | Score of 90 or above **and** completion of at least 2 of 3 honors blocks **and** instructor approval |
| Certification quiz threshold | 80% (32 of 40) on the 40-question certification quiz |
| Return with feedback | Score below 70, or any mandatory criterion marked 0, or quiz score below 80% |

Both conditions — rubric score at threshold AND certification quiz at threshold — must hold for a certificate to be issued. A student with a rubric score of 95 but a quiz score of 78 is returned with feedback until the quiz threshold is met.

---

## Approve vs Return with Feedback

**Mark "Approved" when:**
- All mandatory blocks are complete and artifacts are present.
- FINDINGS.md has at least 3 rows, at least 1 row has a verifiable commit hash in `Status: fixed`.
- The fix commit is accessible, the branch history is coherent, and a manual smoke test (login with seed user) passes on the fork.
- `report.md` has three sections and is at or under 200 words.
- The certification quiz score meets 80%.

**Mark "Return with feedback" when:**
- Any mandatory artifact is missing or its acceptance criteria are not met.
- The FINDINGS rows have no observable symptoms (just general descriptions).
- The fix commit introduces a new runtime failure.
- `report.md` exceeds 200 words or is missing one or more required sections.
- The certification quiz score is below 80%.
- The repo is private rather than public.
- The rules file contains secrets or credentials.

When returning with feedback, the support case is set to `waiting_for_creator` status. The reply message must list each failing criterion by number, state what is missing or incorrect, and explain what the student must do to address it. Do not give vague feedback like "the FINDINGS need more detail" — say exactly which rows are missing an observable symptom and what a valid symptom looks like for that issue.

---

## Criterion Detail

### Criterion 1 — Public fork exists, baseline commit present (10 points)

Auto-checkable: Yes.

The reviewer visits `https://github.com/<student-handle>/aierudit-mern-capstone` without logging in to GitHub. If the repo is not accessible, score is 0.

Check: Is the first commit after the fork a commit with message `chore: fork baseline`? If yes: 10 points. If the baseline commit is present but later in history (i.e., the student made changes first): 5 points and a note in the feedback. If absent: 0 points.

---

### Criterion 2 — Rules file in repo, at least 3 unwritten rules, 200 lines or fewer (15 points)

Auto-checkable: Yes (presence and line count); semi (quality of rules).

Check: Does `CLAUDE.md` or `AGENTS.md` exist at the repo root? If not: 0 points.

Line count at or under 200: full score available. Line count over 200: deduct 5 points and note.

Rules quality:
- 15 points: at least 3 rules that are specific to this codebase (e.g., "Stock decrement happens inside `server/services/checkoutService.js::placeOrder`; controllers do not touch stock directly", "The User model uses an `isAdmin` boolean — admin gating runs through `server/middleware/authMiddleware.js::requireAdmin`"). Generic rules ("use meaningful variable names") do not count.
- 10 points: 2 codebase-specific rules plus 1 generic.
- 5 points: 1 codebase-specific rule plus generic boilerplate.
- 0 points: no rules file, or file contains only generic advice unrelated to the codebase.

Automatic fail on this criterion if the rules file contains secrets, credentials, or API keys. Add a note in the feedback directing the student to remove the secret from Git history before resubmission.

---

### Criterion 3 — README rewritten, `.env.example` present (15 points)

Auto-checkable: Yes.

Check: Does `README.md` still contain the shipped stub line "This README is intentionally lean"? If yes: 0 points — the student has not completed this block.

If the stub disclaimer is absent and the file has been replaced, award points on:
- 8 points: README contains all required sections (Description, Prerequisites, Setup, Seed, Run, Test Credentials).
- 4 points: README is missing one required section.
- 0 points: README exists but is a stub of less than 50 words.
- 7 points: `.env.example` is present, committed, contains placeholder values for the required variables (`MONGO_URI`, `JWT_SECRET`, and any others used by the runtime — `JWT_EXPIRES_IN`, `COOKIE_NAME`, `PAYMENT_MOCK_DELAY_MS`, `PORT`), and contains no real credentials.
- 0 points for the `.env.example` portion if it contains a real MongoDB Atlas connection string or any credential.

---

### Criterion 4 — FINDINGS.md has at least 3 issues, at least 1 fixed with commit hash (20 points)

Auto-checkable: Presence and row count (yes); symptom quality and commit verification (semi).

Row count: does `FINDINGS.md` have at least 3 rows beyond the header? If fewer than 3 rows: 0 points.

Symptom quality (10 points):
- 10 points: all documented rows have a specific observable symptom — a named endpoint, screen state, log line, or test failure that another developer can reproduce without guessing.
- 7 points: some rows have observable symptoms; at least one is vague.
- 3 points: rows exist but most symptoms are too general to reproduce.
- 0 points: no rows, or rows describe general areas rather than observable symptoms.

Fix quality (10 points):
- 10 points: at least 1 row shows `Status: fixed — commit <hash>`, the commit hash resolves in the fork's history, and the commit message describes the fix.
- 5 points: at least 1 row shows a fixed status but the commit hash is incorrect or does not resolve.
- 0 points: no rows are marked fixed.

### Cross-check against planted-bug ground truth

The starter ships with five planted bugs documented in `CAPSTONE_INSTRUCTOR_NOTES.md`:

| # | Surface | Bug class |
|---|---|---|
| 1 | `server/services/checkoutService.js::placeOrder` | Concurrency / race condition |
| 2 | `server/controllers/cartController.js::addItem` | Input validation gap |
| 3 | `server/routes/admin.routes.js` (refund route) | Authorization boundary |
| 4 | `server/services/paymentService.js::processPayment` | Silent error swallow |
| 5 | `server/controllers/bookController.js::list` | N+1 query |

A FINDINGS row that points at one of these surfaces with the correct observable symptom always scores full marks on Symptom quality. A FINDINGS row that points at a different surface with a real reproducible symptom is also valid — learners are encouraged to spot **unintentional** issues beyond the planted set. The scoring is on the symptom, not on which file is named.

---

### Criterion 5 — Fix commit does not break the runtime (10 points)

Auto-checkable: No. Manual smoke test required.

The reviewer clones the fork and runs:
```
npm install
npm install --prefix client
cp .env.example .env
# Edit .env: provide a real MONGO_URI (local Docker or Atlas) and a JWT_SECRET.
docker compose up -d mongodb     # or use Atlas
npm run data:import
npm run dev
```
Then opens `http://localhost:3000` and logs in as `john@learner.aierudit.io` / `123456`.

- 10 points: app starts, login works, cart can be populated.
- 5 points: app starts but an error appears that is directly related to the fix commit.
- 0 points: app fails to start, or the login flow is broken as a direct result of the fix.

Note: if the app fails to start for reasons unrelated to the fix (e.g., a missing MongoDB Atlas credential in `.env`) and the student's fork otherwise passes all other criteria, the reviewer should attempt to run with a local `.env` and note the dependency in feedback. Do not penalize for Atlas configuration issues if `.env.example` is correct.

---

### Criterion 6 — Commits look organic (10 points)

Auto-checkable: Semi. Reviewers use `git log --oneline` to assess commit spread and message quality.

- 10 points: commits have clear messages (not "update", "fix", "wip" as the entire message), logical ordering, and are spread across the work session rather than all committed simultaneously.
- 7 points: commit messages are mostly clear but one or two are uninformative.
- 3 points: multiple sequential commits with single-word or placeholder messages.
- 0 points: a single commit containing all capstone work, or all commits have empty or placeholder messages.

The reviewer is checking for authentic engagement, not a specific commit count. Ten commits with clear messages is better than thirty commits with "update" messages. Squash commits that combine multiple hours of work are a yellow flag — ask the student to clarify in the support reply if the commit history looks suspicious.

---

### Criterion 7 — report.md at repo root, 200 words or fewer, three required sections (5 points)

Auto-checkable: Yes (presence, sections); semi (word count verification).

- 5 points: `report.md` exists at repo root, all three sections ("What I did", "What I found", "What I would do next") are present as headings, and the total word count is 200 or fewer.
- 3 points: file exists but one section heading is missing or the word count is between 201 and 250 words.
- 0 points: file is absent, two or more sections are missing, or word count exceeds 250.

---

### Criterion 8 — At least 1 honors block completed (15 points)

Auto-checkable: Semi.

- 0 honors blocks: 0 points.
- 1 honors block completed and passing acceptance criteria: 10 points. Standard certificate is available if total score otherwise meets the 70% threshold.
- 2 honors blocks completed and passing acceptance criteria: 15 points. Honors certificate is available if total score meets the 90% threshold.
- 3 honors blocks completed and passing acceptance criteria: 15 points plus a reviewer note commending the extra work. Same honors threshold applies.

For each honors block, the reviewer checks the specific acceptance criteria listed in Module 6 (Blocks 6.5, 6.6, 6.7). A Mermaid diagram that exists but uses placeholder nodes ("TODO") does not count. Characterization tests that cannot be run with `npx jest experiments/m2-char-tests/` (or the ESM-aware variant) do not count. A `docker-compose.yml` that exists with only the shipped `mongodb` service (i.e., the student did not extend it to boot the full stack) does not count — Block 6.7 specifically asks for the full stack.

---

## How Instructors Review

### Pre-review checklist (5-minute pass, before cloning)

1. Open the fork URL from the support case. Confirm the repo is public and the default branch is `main`.
2. Check that `chore: fork baseline` is present in the commit history (Criterion 1).
3. View `CLAUDE.md` or `AGENTS.md` in the GitHub file browser. Confirm it is present, under 200 lines, and not obviously a template copy. Scan for credentials. (Criterion 2)
4. View `README.md`. Confirm the shipped stub disclaimer is gone and the six required sections are present. (Criterion 3)
5. View `FINDINGS.md`. Count rows. Check that at least one row has a commit hash in the Status column. (Criterion 4)
6. View `report.md`. Check the three section headings. Run a quick word count. (Criterion 7)
7. Check `git log --oneline` output (visible on GitHub Commits page). Note commit spread and message quality. (Criterion 6)
8. Check for honors blocks: does `docs/architecture.md` exist? Does `experiments/m2-char-tests/` exist? Was `docker-compose.yml` extended beyond the shipped `mongodb`-only service? (Criterion 8)
9. If the optional AI delivery extension is claimed, verify `DESIGN.md`, `docs/ai-lab.md`, and `docs/kb-traceability.md` exist and contain no credentials. This does not change the rubric score, but it can strengthen instructor feedback.
10. Record the certification quiz score from the support case body.

### Full review (fork clone, smoke test)

1. Clone the fork locally: `git clone https://github.com/<student-handle>/aierudit-mern-capstone`.
2. Copy `.env.example` to `.env` and supply a local MongoDB URI and a JWT secret.
3. Run `npm install && npm install --prefix client`.
4. Boot MongoDB: `docker compose up -d mongodb` (or use Atlas).
5. Run `npm run data:import`.
6. Run `npm run dev`. Confirm the app starts on port 3000 and 5000.
7. Log in as `john@learner.aierudit.io` / `123456`. Open a book detail page and add a book to the cart. (Criterion 5 smoke test)
8. Locate the fix commit hash from `FINDINGS.md`. Run `git show <hash>` to confirm the commit changes match the described fix.
9. If honors blocks are present, run `npx jest experiments/m2-char-tests/` and `docker compose up --build` as appropriate.

### Recording the outcome

- If approved: set the support case to `resolved`. Add a reply that states the rubric score and the certificate will be available within 24 hours. Trigger the manual certificate grant in `/admin`. If the student qualifies for honors, include that in the reply.
- If returned with feedback: set the case to `waiting_for_creator`. Write a reply listing each failing criterion by number, what was found, and what the student must do to address it. Keep the tone constructive — the student has done significant work and a specific, actionable reply is more useful than a general request to "improve quality."

### Handling edge cases

- **Fork is private:** Message the student immediately. Do not attempt to clone. Award 0 on Criterion 1 until the repo is made public.
- **Missing `.env` — app cannot start:** Attempt with a personal test `.env`. Note in feedback that the `.env.example` must have all required keys with placeholders so any reviewer can run the app.
- **Certification quiz score not in submission:** Request the score in the case reply before proceeding with the rubric review. The quiz threshold is a hard requirement.
- **Suspicious commit history (all work committed in one batch with timestamps within 30 seconds):** Note the concern in the case, request a brief explanation from the student, and review the diff carefully before scoring Criterion 6.
- **Student submits a fork of an older starter (different stack):** Earlier capstones used an e-commerce-store starter rather than the Bookshop. If you receive such a submission, accept it under the older rubric if the work otherwise meets the criteria, and note in the reply that the canonical starter is now `aierudit-mern-capstone` (Bookshop).
