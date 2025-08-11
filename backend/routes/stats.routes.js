// routes/stats.routes.js
import { Router } from "express";
import { getAdminStats, getUserStats } from "../controller/stats.controller.js";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Admin-only route for getting dashboard statistics
router.get("/admin", isLoggedIn, authorizedRoles("admin"), getAdminStats);

router.get("/user", isLoggedIn, getUserStats);

export default router;
