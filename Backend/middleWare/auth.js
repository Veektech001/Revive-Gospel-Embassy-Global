import jwt from "jsonwebtoken";
import { config } from "../utils/config.js";
import { User } from "../models/userModels.js";
import { HttpError, asyncHandler } from "../utils/httpError.js";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/** Requires a logged-in member. Adds req.user. */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Log in to continue.");

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    throw new HttpError(401, "Your session has expired. Log in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, "This account no longer exists. Log in again.");
  req.user = user;
  next();
});

/** Use after protect: only admins may continue. */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return next(new HttpError(403, "Only church admins can do this."));
  }
  next();
}
