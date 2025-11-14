import express from "express";
import cors from "cors";
import "./config/env.js";
import { initOAuth2Client } from "./routes/gmail.js";
import gmailRoutes from "./routes/gmail.js";
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";

const app = express();
initOAuth2Client();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// Mount routes
app.use("/gmail", authRoutes);
app.use("/gmail", gmailRoutes);
app.use("/subscriptions", subscriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
