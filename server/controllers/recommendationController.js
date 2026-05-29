import recommendationService from "../services/recommendationService.js";

// @desc    Get song recommendations for a user
// @route   GET /api/recommendations/songs/:userId
// @access  Private
export const getSongRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    const parsedLimit = Number(limit);
    const safeLimit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 50)
      : 10;
    const recommendations = await recommendationService.getSongRecommendations(
      userId,
      safeLimit
    );
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching song recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get artist recommendations for a user
// @route   GET /api/recommendations/artists/:userId
// @access  Private
export const getArtistRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 5 } = req.query;
    const parsedLimit = Number(limit);
    const safeLimit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 20)
      : 5;
    const recommendations = await recommendationService.getArtistRecommendations(
      userId,
      safeLimit
    );
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching artist recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
