import express from "express";
import { list, getById } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", list);
router.get("/:id", getById);

export default router;
