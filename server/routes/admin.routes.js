import express from "express";
import { listOrders, refund } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin order listing is correctly behind both protect AND requireAdmin.
router.get("/orders", protect, requireAdmin, listOrders);

// CAPSTONE-BUG-3: this route is registered with only `protect` and NOT
// `requireAdmin`. Any logged-in user (including a non-admin seed user like
// john@learner.aierudit.io) can POST to /admin/orders/:id/refund and refund
// any order, including orders they do not own. Expected fix: add
// `requireAdmin` to the middleware chain on this route.
router.post("/orders/:id/refund", protect, refund);

export default router;
