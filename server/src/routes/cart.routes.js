import express from "express";
import { body } from "express-validator";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

/*
====================================================
CART VALIDATIONS
====================================================
*/
const cartAddValidation = [
  body("productId").isMongoId().withMessage("Valid Product ID is required"),
  body("variantId").isMongoId().withMessage("Valid Variant ID is required"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const cartUpdateValidation = [
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

/*
====================================================
SHARED ROUTES (Both Customer and Admin)
====================================================
*/

// Get the logged-in user's cart
router.get("/", protect, authorize("customer", "admin"), getCart);

// Add item to cart
router.post(
  "/",
  protect,
  authorize("customer", "admin"),
  cartAddValidation,
  addToCart,
);

// Clear entire cart
router.delete("/", protect, authorize("customer", "admin"), clearCart);

// Update specific item quantity
router.put(
  "/:productId/:variantId",
  protect,
  authorize("customer", "admin"),
  cartUpdateValidation,
  updateCartItem,
);

// Remove specific item from cart
router.delete(
  "/:productId/:variantId",
  protect,
  authorize("customer", "admin"),
  removeFromCart,
);

export default router;
