import express from "express";
import { placeOrderHandler } from "../controllers/checkoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/place-order", protect, placeOrderHandler);

export default router;
