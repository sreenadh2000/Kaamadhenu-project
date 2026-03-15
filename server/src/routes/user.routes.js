////// This is for the Cookies and protect route change ///////
import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  getAllUsers,
  getUserById,
  patchUser,
  deleteUser,
  getAdminUserById,
} from "../controllers/user.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/*
========================================
PUBLIC ROUTE
========================================
*/

// Register (auto login)
router
  .route("/register")
  .post(
    [
      body("firstName").trim().notEmpty().withMessage("First name is required"),
      body("lastName").trim().notEmpty().withMessage("Last name is required"),
      body("email").isEmail().withMessage("Please provide a valid email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    registerUser,
  );

/*
========================================
ADMIN ONLY ROUTES
========================================
*/

// Get all users (Admin only)
router.route("/").get(protect, authorize("admin"), getAllUsers);

// 🔹 Place this BEFORE "/:id"
router.route("/admin/:id").get(protect, authorize("admin"), getAdminUserById);

/*
========================================
PROTECTED USER ROUTES
========================================
*/

// Get single user
router
  .route("/:id")
  .get(protect, getUserById)

  // Update user (Owner or Admin)
  .patch(
    protect,
    [
      body("firstName")
        .optional()
        .notEmpty()
        .withMessage("First name cannot be empty"),
      body("lastName")
        .optional()
        .notEmpty()
        .withMessage("Last name cannot be empty"),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email"),
      body("phone")
        .optional()
        .isMobilePhone()
        .withMessage("Provide a valid phone number"),
    ],
    patchUser,
  )

  // Delete user (Admin only)
  .delete(protect, authorize("admin"), deleteUser);

export default router;
