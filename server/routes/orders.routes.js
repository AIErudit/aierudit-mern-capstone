import express from "express";
import { myOrders, getOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/mine", myOrders);
router.get("/:id", getOrder);

export default router;
