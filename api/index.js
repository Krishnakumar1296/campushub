import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";
import { seedIfEmpty } from "../backend/src/utils/seed.js";

let ready;

function ensureDb() {
  if (!ready) {
    ready = connectDB()
      .then(() => seedIfEmpty())
      .catch((err) => {
        ready = undefined;
        throw err;
      });
  }
  return ready;
}

export default async function handler(req, res) {
  try {
    await ensureDb();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(500).json({ ok: false, error: "Database connection failed." });
    return;
  }
  return app(req, res);
}
