import express from "express";
import {
  manualSyncAppointments,
  manualSyncOrders,
  manualSyncAll,
} from "../controllers/syncController.js";

const router = express.Router();

// Manual sync endpoints (useful for testing and manual updates)
router.post("/appointments", manualSyncAppointments);
router.post("/orders", manualSyncOrders);
router.post("/all", manualSyncAll);

// Health check for sync service
router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Firebase-to-GoogleSheets Sync Service",
  });
});

export default router;
