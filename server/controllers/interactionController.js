import interactionService from "../services/interactionService.js";

// @desc    Store a new user interaction
// @route   POST /api/interactions
// @access  Private
export const storeInteraction = async (req, res) => {
  try {
    const interactionData = { ...req.body, userId: req.user.id };
    const interaction = await interactionService.recordInteraction(interactionData);

    res.status(201).json({
      message: "Interaction recorded successfully",
      interaction,
    });
  } catch (error) {
    console.error("Error storing interaction:", error.message);
    if (error.message === "Missing required interaction fields") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get user interaction history
// @route   GET /api/interactions/user/:userId
// @access  Private
export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const interactions = await interactionService.getUserHistory(userId);
    res.status(200).json(interactions);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Get recent interactions for a user
// @route   GET /api/interactions/recent/:userId
// @access  Private
export const getRecentInteractions = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { limit = 10 } = req.query;

    const interactions = await interactionService.getRecentHistory(userId, Number(limit));
    res.status(200).json(interactions);
  } catch (error) {
    console.error("Error fetching recent interactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
