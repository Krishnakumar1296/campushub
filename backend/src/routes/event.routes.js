import { Router } from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { nextSeq } from "../utils/sequences.js";
import { serializeEvent } from "../utils/serialize.js";

const router = Router();

const STATUSES = ["Upcoming", "Draft", "Completed", "Cancelled"];

const todayStr = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const cleanTags = (tags) =>
  Array.isArray(tags)
    ? tags.slice(0, 10).map((t) => String(t).trim()).filter(Boolean)
    : [];

router.get("/", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1, eventId: 1 });
    return res.json(events.map(serializeEvent));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await Event.findOne({ eventId: Number(req.params.id) });
    if (!event) return res.status(404).json({ ok: false, error: "Event not found." });
    return res.json({ ok: true, event: serializeEvent(event) });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const title = String(b.title ?? "").trim();
    if (!title)
      return res.status(422).json({ ok: false, error: "Title is required." });

    const deadline = b.registrationDeadline ? String(b.registrationDeadline).trim() : "";

    const event = await Event.create({
      eventId: await nextSeq("event", 1),
      title,
      description: String(b.description ?? "").trim() || title,
      longDescription: String(b.longDescription ?? ""),
      category: String(b.category ?? "").trim() || "Other",
      date: String(b.date ?? "").trim() || todayStr(),
      time: String(b.time ?? ""),
      endTime: String(b.endTime ?? ""),
      venue: String(b.venue ?? ""),
      department: String(b.department ?? ""),
      image: String(b.image ?? ""),
      registered: Math.max(0, parseInt(b.registered, 10) || 0),
      capacity: Math.max(1, parseInt(b.capacity, 10) || 1),
      attended: 0,
      registrationDeadline: deadline || null,
      status: STATUSES.includes(b.status) ? b.status : "Upcoming",
      tags: cleanTags(b.tags),
      createdAt: todayStr(),
      organizerId: "ORG-001",
    });

    return res.status(201).json({ ok: true, event: serializeEvent(event) });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const b = req.body || {};
    const update = {};

    if (b.title !== undefined) {
      const t = String(b.title).trim();
      if (!t) return res.status(422).json({ ok: false, error: "Title is required." });
      update.title = t;
    }
    for (const key of [
      "description",
      "longDescription",
      "category",
      "date",
      "time",
      "endTime",
      "venue",
      "department",
      "image",
    ]) {
      if (b[key] !== undefined) update[key] = String(b[key]);
    }
    if (b.capacity !== undefined)
      update.capacity = Math.max(0, parseInt(b.capacity, 10) || 0);
    if (b.registrationDeadline !== undefined)
      update.registrationDeadline = b.registrationDeadline
        ? String(b.registrationDeadline).trim()
        : null;
    if (b.status !== undefined && STATUSES.includes(b.status)) update.status = b.status;
    if (Array.isArray(b.tags)) update.tags = cleanTags(b.tags);

    if (Object.keys(update).length === 0)
      return res.status(422).json({ ok: false, error: "No valid fields to update." });

    const event = await Event.findOneAndUpdate(
      { eventId: Number(req.params.id) },
      { $set: update },
      { new: true }
    );
    if (!event) return res.status(404).json({ ok: false, error: "Event not found." });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const event = await Event.findOneAndDelete({ eventId });
    if (!event) return res.status(404).json({ ok: false, error: "Event not found." });
    await Registration.deleteMany({ eventId });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

export default router;
