////// This is the new Code /////////
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    discountedTotal: {
      type: Number,
      required: true,
    },

    // 🔥 STOCK STATUS (IMPORTANT)
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
    availableQuantity: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],

    coupon: {
      couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
      code: String,
      discountAmount: { type: Number, default: 0 },
      active: { type: Boolean, default: false },
    },

    actualAmount: { type: Number, default: 0 },
    discountedTotalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
