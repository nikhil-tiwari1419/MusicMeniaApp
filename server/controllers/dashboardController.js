import dashboardService from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const dashboard = await dashboardService.getPersonalizedDashboard(userId);
    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error generating dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
