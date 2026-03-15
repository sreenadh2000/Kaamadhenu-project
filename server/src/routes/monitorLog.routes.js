import express from "express";
import {
  getMonitorLogs,
  getSystemHealth,
  getDatabaseHealth,
  getApiStats,
} from "../controllers/monitorLog.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/logs", getMonitorLogs);
router.get("/health/system", getSystemHealth);
router.get("/health/database", getDatabaseHealth);
router.get("/stats/api", getApiStats);

export default router;
