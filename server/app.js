import express from "express";
import cors from "cors";
import helmet from "helmet";

import interactionRoutes from "./routes/interactionRoutes.js";
import preferenceRoutes from "./routes/preferenceRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("MusicMenia Backend is Running!");
});

app.use("/api/interactions", interactionRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

export default app;
