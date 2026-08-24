import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import registrationRoutes from "./src/routes/registration.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { seedIfEmpty } from "./src/utils/seed.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) =>
  res.json({ ok: true, message: "CampusHub API is running." })
);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", adminRoutes);

app.use((req, res) => res.status(404).json({ ok: false, error: "Route not found." }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ ok: false, error: "Internal server error." });
});

connectDB()
  .then(() => seedIfEmpty())
  .then(() => {
    app.listen(PORT, () =>
      console.log(`CampusHub API listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
