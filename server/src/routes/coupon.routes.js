import express from "express";
import { body } from "express-validator";
import { protect, userOnly } from "../middleware/auth.js";
import { applyCoupon, removeCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

// Apply coupon
router.post(
  "/apply",
  protect,
  userOnly,
  [body("code").notEmpty().withMessage("Coupon code is required")],
  applyCoupon
);

// Remove coupon
router.post("/remove", protect, userOnly, removeCoupon);

export default router;
