import { Router } from "express";
import {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
  listUsers,
  setRole,
} from "../controllers/authControllers.js";
import { protect, requireAdmin } from "../middleWare/auth.js";
import { authLimiter } from "../middleWare/rateLimits.js";

export const authRoutes = Router();
authRoutes.post("/register", authLimiter, register);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/forgot-password", authLimiter, forgotPassword);
authRoutes.post("/reset-password", authLimiter, resetPassword);
authRoutes.get("/me", protect, me);

export const userRoutes = Router();
userRoutes.use(protect, requireAdmin);
userRoutes.get("/", listUsers);
userRoutes.patch("/:id/role", setRole);
