import express from "express";
import {
  storeInteraction,
  getUserInteractions,
  getRecentInteractions,
} from "../controllers/interactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All interaction routes are protected

router.post("/", storeInteraction);
router.get("/user/:userId", getUserInteractions);
router.get("/recent/:userId", getRecentInteractions);

export default router;
