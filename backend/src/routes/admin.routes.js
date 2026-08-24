import { Router } from "express";
import { runSeed } from "../utils/seed.js";

const router = Router();

const handle = (message) => async (req, res) => {
  try {
    await runSeed();
    res.json({ ok: true, message });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

router.get("/setup", handle("Demo database created and seeded. You can close this tab."));
router.get("/reset", handle("Demo data has been reset."));

export default router;
