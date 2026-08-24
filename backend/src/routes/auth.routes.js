import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { nextUserId } from "../utils/sequences.js";
import { serializeUser } from "../utils/serialize.js";

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/signup", async (req, res, next) => {
  try {
    const b = req.body || {};
    const name = String(b.name ?? "").trim();
    const email = String(b.email ?? "").trim().toLowerCase();
    const password = String(b.password ?? "");
    const role = "student";

    if (name.length < 3)
      return res.status(422).json({ ok: false, error: "Please enter your full name." });
    if (!EMAIL_RE.test(email))
      return res.status(422).json({ ok: false, error: "Please enter a valid email address." });
    if (password.length < 6)
      return res.status(422).json({ ok: false, error: "Password must be at least 6 characters." });
    if (b.role && b.role !== "student")
      return res
        .status(403)
        .json({ ok: false, error: "Only student accounts can be created via sign-up." });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ ok: false, error: "An account with this email already exists. Try signing in instead." });

    const userId = await nextUserId("STU");

    const user = await User.create({
      userId,
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      phone: String(b.phone ?? "").trim(),
      department: String(b.department ?? "").trim(),
      year: String(b.year ?? "").trim(),
      bio: "",
    });

    await Notification.create({
      userEmail: email,
      type: "success",
      title: "Welcome to CampusHub",
      message: `Your ${role} account (${userId}) has been created successfully.`,
    });

    return res.status(201).json({ ok: true, user: serializeUser(user) });
  } catch (err) {
    if (err?.code === 11000)
      return res
        .status(409)
        .json({ ok: false, error: "An account with this email already exists. Try signing in instead." });
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const b = req.body || {};
    const email = String(b.email ?? "").trim().toLowerCase();
    const password = String(b.password ?? "");
    const role = b.role ? String(b.role) : null;

    if (!email || !password)
      return res.status(422).json({ ok: false, error: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ ok: false, error: "Incorrect email or password." });

    if (role && user.role !== role)
      return res.status(403).json({ ok: false, error: `This account is not a ${role} account.` });

    return res.json({ ok: true, user: serializeUser(user) });
  } catch (err) {
    return next(err);
  }
});

export default router;
