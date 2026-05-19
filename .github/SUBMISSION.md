# How to submit your capstone

This file is the short version of the submission flow described in
[`STUDENT_INSTRUCTIONS.md`](../STUDENT_INSTRUCTIONS.md). When you
have completed all five mandatory blocks (Pre-flight, Rules File,
README rewrite, FINDINGS + fix, `report.md`) and at least one of
the three honors blocks (Mermaid C4 / characterization tests /
docker-compose), do the following:

1. **Push your fork.** Make sure all your work is on the default
   branch (`main`) of your fork at
   `https://github.com/<your-username>/aierudit-mern-capstone`.
2. **Make sure the fork is public.** Settings → General → Change
   visibility → Public. Reviewers cannot grade a private fork and
   will return your submission with status "Cannot access".
3. **Open a new email** to `support@aierudit.com` with:
   - **Subject:** `[CAPSTONE] <your-enrollment-email>`
   - **Body:** copy the template below, fill in your fork URL and
     the list of completed honors blocks.

```text
Hello,

I have completed the Full-Stack Developer With AI capstone. Please
review my fork against the rubric.

Fork URL: https://github.com/<your-username>/aierudit-mern-capstone
Default branch: main

Mandatory blocks complete: 6.1, 6.2, 6.3, 6.4, 6.8, 6.9.
Honors blocks attempted: 6.5 / 6.6 / 6.7 (delete the ones you did
not do).
Optional AI delivery extension attempted: DESIGN.md / docs/ai-lab.md /
docs/kb-traceability.md (delete this line if you did not do it).

Notes (optional): <anything you want the reviewer to know>.

Thanks,
<your name>
```

Reviewer SLA: **5 business days**. You will get one of three
verdicts back in the same email thread: **approve** (your
certificate will be issued), **iterate** (specific changes
requested, you may resubmit), or **return** (the submission cannot
be reviewed yet — usually because the fork is private, the default
branch is empty, or the rubric expects work that is missing).

The certificate is issued only after **both gates** pass:

1. The 40-question certification quiz inside the AIErudit module
   shows ≥80%.
2. The instructor approves your fork against `RUBRIC.md`.

If you have already passed the quiz but are waiting on review,
your certificate state will read "Awaiting capstone review" until
the reviewer sends the approve verdict.

Do **not** post your fork URL in any AIErudit chat, public forum,
or social channel while the review is pending — the reviewer queue
runs only out of `support@aierudit.com`.

Do **not** paste API keys, JWT secrets, or any value from your
local `.env` into the email or the fork. Any commit that contains
a credential is an automatic rubric fail on Criterion 2 (rules
file with credentials) or Criterion 5 (fix commit breaks the
runtime contract by leaking secrets).
