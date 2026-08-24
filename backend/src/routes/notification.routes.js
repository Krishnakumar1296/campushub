import { Router } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { serializeNotification } from "../utils/serialize.js";

const router = Router();

const TYPES = ["success", "error", "info", "warning"];

router.get("/", async (req, res, next) => {
  try {
    const email = String(req.query.email ?? "").trim().toLowerCase();
    if (!email) return res.json([]);
    const docs = await Notification.find({
      $or: [{ userEmail: email }, { userEmail: null }],
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(50);
    return res.json(docs.map(serializeNotification));
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const title = String(b.title ?? "").trim();
    if (!title) return res.status(422).json({ ok: false, error: "Title is required." });

    await Notification.create({
      userEmail: b.userEmail ? String(b.userEmail).trim().toLowerCase() : null,
      type: TYPES.includes(b.type) ? b.type : "info",
      title,
      message: String(b.message ?? ""),
    });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const email = String(b.email ?? "").trim().toLowerCase();
    if (!email) return res.status(422).json({ ok: false, error: "Email required." });

    const scope = { $or: [{ userEmail: email }, { userEmail: null }] };

    if (b.all) {
      await Notification.updateMany(scope, { $set: { isRead: true } });
    } else {
      const id = String(b.id ?? "");
      if (!id) return res.status(422).json({ ok: false, error: "Notification id required." });
      if (mongoose.isValidObjectId(id)) {
        await Notification.updateMany(
          { ...scope, _id: new mongoose.Types.ObjectId(id) },
          { $set: { isRead: true } }
        );
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
