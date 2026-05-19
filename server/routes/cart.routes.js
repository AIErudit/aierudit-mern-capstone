import express from "express";
import { getCart, addItem, removeItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/items", addItem);
router.delete("/items/:bookId", removeItem);

export default router;
