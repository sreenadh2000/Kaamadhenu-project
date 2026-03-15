import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts) // ✅ Public
  .post(
    protect, // 🔐 Must be logged in
    authorize("admin"), // 👑 Must be admin
    upload.array("images", 5),
    [
      body("name").trim().notEmpty().withMessage("Product name is required"),
      body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),
      body("categoryId").isMongoId().withMessage("Invalid Category ID format"),

      body("stock").custom((value) => {
        const s = typeof value === "string" ? JSON.parse(value) : value;
        if (!s.unit || s.quantity === undefined) {
          throw new Error("Stock must contain quantity and unit");
        }
        return true;
      }),

      body("variants")
        .optional()
        .custom((value) => {
          const v = typeof value === "string" ? JSON.parse(value) : value;
          if (!Array.isArray(v)) {
            throw new Error("Variants must be an array");
          }
          return true;
        }),
    ],
    createProduct,
  );

router
  .route("/:id")
  .get(getProductById) // ✅ Public
  .put(
    protect,
    authorize("admin"),
    upload.array("images", 5),
    [
      body("categoryId")
        .optional()
        .isMongoId()
        .withMessage("Invalid Category ID"),
    ],
    updateProduct,
  )
  .delete(protect, authorize("admin"), deleteProduct);

export default router;
