import preferenceService from "../services/preferenceService.js";

// @desc    Get user preferences
// @route   GET /api/preferences/:userId
// @access  Private
export const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetType } = req.query;
    const preferences = await preferenceService.getUserPreferences(userId, targetType);
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get top user preferences
// @route   GET /api/preferences/top/:userId
// @access  Private
export const getTopPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetType, limit = 10 } = req.query;

    if (!targetType) {
      return res.status(400).json({ message: "targetType is required" });
    }

    const preferences = await preferenceService.getTopPreferences(userId, targetType, Number(limit));
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error fetching top preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
