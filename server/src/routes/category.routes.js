import express from "express";
import { body } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories) // ✅ PUBLIC
  .post(
    protect, // 🔐 Must be logged in
    authorize("admin"), // 👑 Must be admin
    [body("name").trim().notEmpty().withMessage("Category name is required")],
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryById) // ✅ PUBLIC
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

export default router;
