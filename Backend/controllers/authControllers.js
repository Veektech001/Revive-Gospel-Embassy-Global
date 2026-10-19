import crypto from "node:crypto";
import { User } from "../models/userModels.js";
import { signToken } from "../middleWare/auth.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";
import { sendEmail } from "../utils/email.js";
import { config } from "../utils/config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v) => (typeof v === "string" ? v.trim() : "");

function checkPassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters.", { password: "Use at least 8 characters." });
  }
}

const authResponse = (user) => ({ token: signToken(user), user: user.toPublic() });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email).toLowerCase();
  const phone = clean(req.body.phone);
  const { password } = req.body;

  const details = {};
  if (!name) details.name = "Enter your name.";
  if (!EMAIL_RE.test(email)) details.email = "Enter a valid email address.";
  if (Object.keys(details).length) throw new HttpError(400, Object.values(details)[0], details);
  checkPassword(password);

  if (await User.exists({ email })) {
    throw new HttpError(409, "An account with this email already exists. Log in instead.", {
      email: "This email is already registered.",
    });
  }

  const user = new User({ name, email, phone });
  await user.setPassword(password);
  await user.save();
  res.status(201).json(authResponse(user));
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const { password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !password || !(await user.checkPassword(password))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }
  user.lastLoginAt = new Date();
  await user.save();
  res.json(authResponse(user));
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

// POST /api/auth/forgot-password
// Always answers the same way so nobody can test which emails are registered.
export const forgotPassword = asyncHandler(async (req, res) => {
  const email = clean(req.body.email).toLowerCase();
  const user = EMAIL_RE.test(email) ? await User.findOne({ email }) : null;

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const link = `${config.frontendUrls[0]}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your RGE password",
      text: `Hello ${user.name},\n\nUse this link to choose a new password. It works for 1 hour:\n${link}\n\nIf you didn't ask for this, you can ignore this email.\n\nRevive Gospel Embassy`,
      html: `<p>Hello ${user.name},</p><p>Use this link to choose a new password. It works for 1 hour:</p><p><a href="${link}">Reset my password</a></p><p>If you didn't ask for this, you can ignore this email.</p><p>Revive Gospel Embassy</p>`,
    });
  }

  res.json({ message: "If that email has an account, we've sent a link to reset the password." });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const token = clean(req.body.token);
  checkPassword(req.body.password);
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } });
  if (!token || !user) {
    throw new HttpError(400, "This reset link is invalid or has expired. Request a new one.");
  }
  await user.setPassword(req.body.password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json(authResponse(user));
});

// ── Admin ────────────────────────────────────────────────────

// GET /api/users  (admin)
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(1000);
  res.json({ users: users.map((u) => ({ ...u.toPublic(), lastLoginAt: u.lastLoginAt })) });
});

// PATCH /api/users/:id/role  (admin)
export const setRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["member", "admin"].includes(role)) throw new HttpError(400, "Role must be member or admin.");
  if (req.params.id === req.user.id && role !== "admin") {
    throw new HttpError(400, "You can't remove your own admin access.");
  }
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "Member not found.");
  user.role = role;
  await user.save();
  res.json({ user: user.toPublic() });
});
