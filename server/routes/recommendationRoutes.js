import express from "express";
import {
  getSongRecommendations,
  getArtistRecommendations,
} from "../controllers/recommendationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All recommendation routes are protected

router.get("/songs", getSongRecommendations); // GET /api/recommendations/songs
router.get("/artists", getArtistRecommendations); // GET /api/recommendations/artists

export default router;
