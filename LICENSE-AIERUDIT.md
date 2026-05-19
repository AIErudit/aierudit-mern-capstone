# AIErudit Capstone Overlay Notice

This repository is the official starter project for the
**Full-Stack Developer With AI** capstone at
[aierudit.com](https://aierudit.com). The runtime code is the
**AIErudit Bookshop** — a small MERN-stack online bookstore
authored from scratch for this course. It is not a fork of any
upstream project.

The repository is released under the MIT License. See the
`LICENSE` file at the root for the full text.

What AIErudit publishes on top of the runtime code:

- `STUDENT_INSTRUCTIONS.md` — the block-by-block walkthrough
  learners follow.
- `RUBRIC.md` — the 8-criterion grading checklist instructors
  apply to each submission.
- `.github/SUBMISSION.md` — the submission flow.
- This file — the overlay notice.
- `CAPSTONE_INSTRUCTOR_NOTES.md` — instructor-side ground truth
  for the five planted bugs (also visible to learners; the rubric
  scores the **observable symptoms** in the learner's own words,
  not "found the secret list").

These overlay files are likewise released under MIT, so you are
free to re-use them in your own learning artefacts.

## Trademark

"AIErudit", the "Orchestrator" mascot, and related AIErudit
branding are trademarks of AIErudit. The MIT license grants no
trademark rights. If you fork this repository to complete the
capstone, please keep this file and the upstream `LICENSE` in your
fork, and do not present your fork as an official AIErudit
product.

## Intentional bugs disclaimer

The bugs in this repository are intentional and are the
pedagogical payload of the capstone. They include realistic
failure modes — a race condition in checkout, missing input
validation on the cart, an authorization boundary gap on an admin
endpoint, a silent error swallow in the payment service, and an
N+1 query in the book listing. Do not deploy this code to
production. Do not enter real credit-card numbers or real personal
data into the seed user account.
