# Instructor Notes — Planted Bug Ground Truth

This file is the source of truth for the **5 planted bugs** in the
AIErudit Bookshop capstone starter. Instructors use it to grade learner
`FINDINGS.md` submissions.

The bugs are also marked in source with comments like
`// CAPSTONE-BUG-1: <one-line description>`. Grep for `CAPSTONE-BUG-`
to find all five.

Learners can read this file too. The rubric does not penalize that —
the 20% FINDINGS weight scores **observable symptoms** in the learner's
own words, not "found the secret bugs." A learner who reads this file
and lists the bug headings without writing observable symptoms still
fails the FINDINGS criterion.

---

## CAPSTONE-BUG-1 — Race condition in checkout (place-order service)

**Location:** `server/services/checkoutService.js` in `placeOrder()`.

**What is broken:** When two users concurrently place an order for the
same book with only 1 copy in stock, both POSTs return success. The
service reads stock, deducts in JS, then writes — there is no atomic
decrement at the database level.

**Observable symptom:** Run two concurrent `curl` POSTs to
`/api/v1/checkout/place-order` with a book whose `stock` is 1. Both
return `{success: true, orderId: ...}`. The book document ends with
`stock: -1`.

**Expected fix:** Use `findOneAndUpdate` with the filter
`{ _id: bookId, stock: { $gte: requestedQty } }` and the update
`{ $inc: { stock: -requestedQty } }`. If the result is `null`, the
stock was insufficient — return a 409.

**Realistic FINDINGS row:**
> | Concurrent place-order can oversell last-copy books | Two simultaneous POSTs to `/api/v1/checkout/place-order` with book stock=1 both return success; book.stock becomes -1 | Stock check and stock write are non-atomic across two DB calls | Use Mongoose findOneAndUpdate with conditional $inc to atomically decrement only when stock is sufficient | `abc1234` | fixed |

---

## CAPSTONE-BUG-2 — Validation gap on cart quantity

**Location:** `server/controllers/cartController.js` in `addItem()`.

**What is broken:** The handler reads `req.body.quantity` and persists
it directly into the user's cart without validating it as a positive
integer. Negative values reduce existing cart line totals; floats and
strings reach Mongo.

**Observable symptom:** POST `/api/v1/cart/items` with body
`{bookId: "<valid id>", quantity: -3}` returns success and reduces the
cart line by 3. POST with `{quantity: 1.5}` succeeds; the cart line
becomes 1.5 (fractional book).

**Expected fix:** Validate `quantity` is a positive integer (≥1 and
≤999 makes sense). Reject with 400 otherwise. Mirror the validation in
the Mongoose schema with `validate: Number.isInteger` and `min: 1`.

**Realistic FINDINGS row:**
> | Cart accepts negative and fractional quantities | POST /api/v1/cart/items with quantity=-3 succeeds and reduces existing line by 3; quantity=1.5 stores a fractional value | The controller has no input validation and the schema has no min or integer constraint | Validate at the controller boundary AND add schema-level constraints | `def5678` | fixed |

---

## CAPSTONE-BUG-3 — Auth boundary on admin refund endpoint

**Location:**
`server/routes/admin.routes.js` — the `POST /orders/:id/refund` route
is registered with only the `protect` middleware (authenticated user)
and not the `requireAdmin` middleware (admin-only).

**What is broken:** Any authenticated user can issue refunds on any
order, including orders they do not own.

**Observable symptom:** Log in as `john@learner.aierudit.io` (not an
admin). Send POST to `/api/v1/admin/orders/<any-order-id>/refund`.
Receive 200 with a refund record.

**Expected fix:** Add `requireAdmin` to the route definition. Consider
also a 401 response shape that distinguishes "not logged in" from
"logged in but not admin" so debugging is easier.

**Realistic FINDINGS row:**
> | Non-admin users can issue refunds | Logged in as john@learner.aierudit.io, POST /api/v1/admin/orders/:id/refund returns 200 with refund | The admin refund route is protected only by `protect`, not by `requireAdmin` | Add `requireAdmin` middleware to the route definition | `ghi9abc` | fixed |

---

## CAPSTONE-BUG-4 — Silent error swallow in payment service

**Location:**
`server/services/paymentService.js` in `processPayment()`. The function
wraps the payment provider call (here a mock) in `try { ... } catch (e)
{ return { success: true }; }`. The success object is returned
regardless of whether the underlying call succeeded.

**What is broken:** Any payment-provider error (timeout, invalid card,
declined transaction) is silently swallowed and reported as a
successful charge. The order is marked paid without a real charge.

**Observable symptom:** Place an order with the mock payment card
number `4000000000000002` (the mock treats this as DECLINED). The
order detail screen shows `isPaid: true` and a payment timestamp. The
server logs show "payment provider declined" but no error reaches the
HTTP response.

**Expected fix:** Re-throw or return `{success: false, error: ...}` on
catch. Update the calling code in `checkoutService` to mark the order
unpaid and present a retry surface.

**Realistic FINDINGS row:**
> | Declined payments are reported as successful | Mock card 4000000000000002 (declined) results in order isPaid=true; server log shows declined but no error reaches the client | The payment service wraps its provider call in a try/catch that returns success on any error | Re-throw or return {success: false}; update checkout to mark unpaid and surface a retry path | `jkl2def` | fixed |

---

## CAPSTONE-BUG-5 — N+1 query in book listing

**Location:** `server/controllers/bookController.js` in `list()`. After
fetching the page of books, the controller iterates each book and
queries its reviews one at a time to compute the average rating.

**What is broken:** Page latency scales linearly with page size.
Mongoose query logs show one query for books + N queries for reviews
(one per book in the page). A page of 20 books generates 21 queries.

**Observable symptom:** Enable Mongoose query logging (set
`mongoose.set('debug', true)` or pass `--debug`). Hit `GET /api/v1/books`.
Observe N+1 queries: one books query, then one find-reviews query per
book in the result.

**Expected fix:** Use a Mongoose `populate('reviews', 'rating')` call
with a `$group` or `$lookup` aggregation; OR denormalize average
rating onto the Book document and recompute on review create/update.
The first option is the smaller change.

**Realistic FINDINGS row:**
> | Book list endpoint generates N+1 review queries | Mongoose debug log shows one find on books followed by one find-reviews call per book in the page | The list controller iterates books and queries reviews per book instead of using populate or aggregation | Replace per-book review loop with a single populate or $lookup aggregation | `mno3ghi` | fixed |

---

## Notes on bug selection

These five bugs cover the five teaching surfaces of Module 5:

| Bug | Module 5 concept |
|---|---|
| BUG-1 (race condition) | Concurrency safety in production code |
| BUG-2 (validation gap) | Input validation at the boundary |
| BUG-3 (auth boundary) | Authorization layering |
| BUG-4 (silent error swallow) | Error handling and observability |
| BUG-5 (N+1 query) | Performance audit on hot endpoints |

A learner who finds and documents 3 of these covers the rubric's
20% FINDINGS weight. A learner who fixes one demonstrates the
safe-refactor recipe.
