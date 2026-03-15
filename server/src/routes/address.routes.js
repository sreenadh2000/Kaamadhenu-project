import express from "express";
import { body } from "express-validator";

import {
  getAddressById,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/*
====================================================
CUSTOMER ROUTES (Only logged-in customers)
====================================================
*/

const addressValidation = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("addressLine1").trim().notEmpty().withMessage("Address line 1 required"),
  body("city").trim().notEmpty().withMessage("City required"),
  body("state").trim().notEmpty().withMessage("State required"),
  body("pincode").trim().notEmpty().withMessage("Pincode required"),
];

// Get all my addresses
router.get("/", protect, authorize("customer"), getAddresses);

// Create new address
router.post(
  "/",
  protect,
  authorize("customer"),
  addressValidation,
  createAddress,
);

// Get single address (only if belongs to user)
router.get("/:id", protect, authorize("customer"), getAddressById);

// Update address (only own)
router.put(
  "/:id",
  protect,
  authorize("customer"),
  addressValidation,
  updateAddress,
);

// Delete address (only own)
router.delete("/:id", protect, authorize("customer"), deleteAddress);

// Set default address
router.put("/:id/default", protect, authorize("customer"), setDefaultAddress);

/*
====================================================
ADMIN ROUTES (Read-Only)
====================================================
*/

// Admin can view any user's addresses
// router.get(
//   "/admin/user/:userId",
//   protect,
//   authorize("admin"),
//   adminGetUserAddresses,
// );

export default router;
