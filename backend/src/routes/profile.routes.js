import { Router } from "express";
import User from "../models/User.js";
import { serializeProfile } from "../utils/serialize.js";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ ok: false });
    return res.json({ ok: true, profile: serializeProfile(user) });
  } catch (err) {
    return next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const id = String(b.id ?? "").trim();
    if (!id)
      return res.status(422).json({ ok: false, error: "Profile id is required." });

    const update = {};
    for (const key of ["name", "email", "phone", "department", "year", "bio"]) {
      if (b[key] !== undefined) update[key] = String(b[key]).trim();
    }

    await User.updateOne({ userId: id }, { $set: update });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
