import express from "express";
import {
  getUserPreferences,
  getTopPreferences,
} from "../controllers/preferenceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getUserPreferences); // GET /api/preferences
router.get("/top", getTopPreferences); // GET /api/preferences/top

export default router;
