import express from "express";
import { body } from "express-validator";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Admin-only routes
// router.use(protect, adminOnly);

router.post(
  "/",
  [
    body("code").notEmpty().withMessage("Coupon code is required"),
    body("discountType")
      .isIn(["PERCENTAGE", "FLAT"])
      .withMessage("Invalid discount type"),
    body("discountValue")
      .isFloat({ min: 0 })
      .withMessage("Discount value must be >= 0"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("endDate").notEmpty().withMessage("End date is required"),
  ],
  createCoupon
);

router.get("/", getAllCoupons);
router.get("/:id", getCouponById);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
