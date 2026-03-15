import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder, // Added this
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.js"; // Using your authorize middleware

const router = express.Router();

/* ====================================================
ORDER VALIDATIONS
====================================================
*/
const orderCreateValidation = [
  body("addressId")
    .isMongoId()
    .withMessage("Valid Shipping Address ID is required"),
  body("paymentMethod").notEmpty().withMessage("Payment method is required"),
];

const statusUpdateValidation = [
  body("orderStatus")
    .optional()
    .isIn([
      "pending",
      "confirmed",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),
  body("paymentStatus")
    .optional()
    .isIn(["pending", "paid", "failed"])
    .withMessage("Invalid payment status"),
];

/* ====================================================
CUSTOMER ROUTES
====================================================
*/

// Create a new order (Proceed to Checkout)
router.post(
  "/",
  protect,
  authorize("customer"),
  orderCreateValidation,
  createOrder,
);

// Get logged-in user's order history
router.get("/myorders", protect, authorize("customer"), getMyOrders);

// User cancels their own order (Only if pending/confirmed)
router.put("/:id/cancel", protect, authorize("customer"), cancelOrder);

/* ====================================================
ADMIN ROUTES (Management)
====================================================
*/

// Get all orders across the system
router.get("/all", protect, authorize("admin"), getAllOrders);

// Update order stage (Confirmed, Out for delivery, etc.)
router.put(
  "/:id/status",
  protect,
  authorize("admin", "customer"),
  statusUpdateValidation,
  updateOrderStatus,
);

/* ====================================================
SHARED ROUTES
====================================================
*/

// View specific order details
router.get("/:id", protect, authorize("customer", "admin"), getOrderById);

export default router;
