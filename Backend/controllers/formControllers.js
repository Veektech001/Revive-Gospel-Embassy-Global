import { Visitor, Subscriber } from "../models/formModels.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// POST /api/visitors
export const createVisitor = asyncHandler(async (req, res) => {
  const b = req.body;
  const data = {
    name: clean(b.name, 100),
    phone: clean(b.phone, 30),
    email: clean(b.email, 120).toLowerCase(),
    address: clean(b.address),
    visitDate: clean(b.visitDate, 20),
    service: b.service === "Friday" ? "Friday" : "Sunday",
    question: clean(b.question, 2000),
  };
  if (!data.name) throw new HttpError(400, "Enter your name.", { name: "Enter your name." });
  if (!data.phone && !data.email) {
    throw new HttpError(400, "Enter a phone number or an email so we can reach you.");
  }
  if (data.email && !EMAIL_RE.test(data.email)) throw new HttpError(400, "Enter a valid email address.");

  await Visitor.create(data);
  res.status(201).json({ message: "Thank you. We'll be in touch soon." });
});

// POST /api/newsletter
export const subscribe = asyncHandler(async (req, res) => {
  const email = clean(req.body.email, 120).toLowerCase();
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "Enter a valid email address, like name@example.com.");
  // Subscribing twice is fine: no error, no duplicate.
  await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  res.status(201).json({ message: "You're subscribed." });
});

// GET /api/visitors  (admin)
export const listVisitors = asyncHandler(async (req, res) => {
  const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(500);
  res.json({ visitors });
});

// PATCH /api/visitors/:id  (admin) — mark as followed up
export const updateVisitor = asyncHandler(async (req, res) => {
  const visitor = await Visitor.findByIdAndUpdate(
    req.params.id,
    { followedUp: Boolean(req.body.followedUp) },
    { new: true }
  );
  if (!visitor) throw new HttpError(404, "Visitor not found.");
  res.json({ visitor });
});

// GET /api/newsletter  (admin)
export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ subscribers });
});
