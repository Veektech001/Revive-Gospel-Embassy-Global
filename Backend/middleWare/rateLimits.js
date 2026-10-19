import rateLimit from "express-rate-limit";

const opts = (limit, message) => ({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: message },
  skip: () => process.env.NODE_ENV === "test",
});

// Slow down password guessing
export const authLimiter = rateLimit(opts(20, "Too many attempts. Wait 15 minutes and try again."));

// Stop spam on the public forms
export const formLimiter = rateLimit(opts(10, "Too many submissions. Wait 15 minutes and try again."));
