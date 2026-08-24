import "dotenv/config";
import { connectDB } from "./src/config/db.js";
import { seedIfEmpty } from "./src/utils/seed.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

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
