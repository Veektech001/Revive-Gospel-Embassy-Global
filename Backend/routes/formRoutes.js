import { Router } from "express";
import {
  createVisitor,
  listVisitors,
  updateVisitor,
  subscribe,
  listSubscribers,
} from "../controllers/formControllers.js";
import { protect, requireAdmin } from "../middleWare/auth.js";
import { formLimiter } from "../middleWare/rateLimits.js";

export const visitorRoutes = Router();
visitorRoutes.post("/", formLimiter, createVisitor);
visitorRoutes.get("/", protect, requireAdmin, listVisitors);
visitorRoutes.patch("/:id", protect, requireAdmin, updateVisitor);

export const newsletterRoutes = Router();
newsletterRoutes.post("/", formLimiter, subscribe);
newsletterRoutes.get("/", protect, requireAdmin, listSubscribers);
