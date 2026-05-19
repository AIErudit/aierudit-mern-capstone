# Security Policy

## Intentional vulnerabilities

This repository contains **deliberately planted bugs** for use in the
AIErudit Full-Stack AI capstone exercise. The planted bugs are documented
in [`CAPSTONE_INSTRUCTOR_NOTES.md`](CAPSTONE_INSTRUCTOR_NOTES.md) and are
marked in source with `// CAPSTONE-BUG-N:` comments.

Please **do not file CVEs** for the planted bugs. They are intentional
teaching artifacts; reporting them to vulnerability databases would create
noise and is not the right disclosure channel.

## Reporting unintentional issues

If you discover a security issue that is **not** documented as a planted
bug:

- Open a GitHub Issue describing the observable symptom (specific
  endpoint, screen, log line, or test failure).
- Do not include exploit payloads in public issues.
- Tag the issue with `unintentional-bug` so reviewers can distinguish it
  from learner FINDINGS work.

## Do not deploy this codebase to production

The planted bugs include realistic security failure modes (race conditions,
authorization gaps, input validation gaps, silent error handling). The
intent is pedagogical. A production deployment would be unsafe.
