import { Router } from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Notification from "../models/Notification.js";
import { nextRegId } from "../utils/sequences.js";
import { serializeRegistration } from "../utils/serialize.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = String(req.query.studentId);
    const regs = await Registration.find(filter).sort({ registeredAt: -1, _id: -1 });
    return res.json(regs.map(serializeRegistration));
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const b = req.body || {};
    const eventId = parseInt(b.eventId, 10);
    const student = b.student && typeof b.student === "object" ? b.student : {};
    const studentId = String(student.id ?? "").trim();

    if (!eventId || !studentId)
      return res
        .status(422)
        .json({ ok: false, error: "Event and student details are required." });

    const event = await Event.findOne({ eventId });
    if (!event) return res.status(404).json({ ok: false, error: "Event not found." });

    const existing = await Registration.findOne({ eventId, studentId });
    if (existing)
      return res.json({
        ok: false,
        duplicate: true,
        error: `You are already registered for ${event.title}.`,
      });

    if ((event.registered || 0) >= (event.capacity || 0))
      return res.json({ ok: false, error: `${event.title} is full.` });

    let reg;
    try {
      reg = await Registration.create({
        regId: await nextRegId(),
        eventId,
        studentId,
        studentName: String(student.name ?? "").trim() || studentId,
        email: String(student.email ?? "").trim().toLowerCase(),
        department: String(student.department ?? ""),
        year: String(student.year ?? ""),
        status: "Registered",
        registeredAt: new Date(),
      });
    } catch (err) {
      if (err?.code === 11000)
        return res.json({
          ok: false,
          duplicate: true,
          error: `You are already registered for ${event.title}.`,
        });
      throw err;
    }

    await Event.updateOne({ eventId }, { $inc: { registered: 1 } });

    if (reg.email) {
      await Notification.create({
        userEmail: reg.email,
        type: "success",
        title: "Registration successful",
        message: `Your ticket for ${event.title} (${reg.regId}) has been generated.`,
      });
    }

    return res.json({ ok: true, regId: reg.regId });
  } catch (err) {
    return next(err);
  }
});

router.post("/checkin", async (req, res, next) => {
  try {
    const regId = String(req.body?.regId ?? "").trim();
    if (!regId)
      return res.status(422).json({ ok: false, error: "Registration ID is required." });

    const reg = await Registration.findOne({ regId });
    if (!reg)
      return res.status(404).json({ ok: false, error: "Registration not found." });

    if (reg.status === "Checked-in")
      return res.json({ ok: true, already: true, registration: serializeRegistration(reg) });

    reg.status = "Checked-in";
    reg.checkedInAt = new Date();
    await reg.save();

    await Event.updateOne({ eventId: reg.eventId }, { $inc: { attended: 1 } });

    if (reg.email) {
      const event = await Event.findOne({ eventId: reg.eventId });
      await Notification.create({
        userEmail: reg.email,
        type: "success",
        title: "Attendance recorded",
        message: `${reg.studentName} was checked in at ${event?.title ?? "the event"}.`,
      });
    }

    return res.json({ ok: true, already: false, registration: serializeRegistration(reg) });
  } catch (err) {
    return next(err);
  }
});

export default router;
