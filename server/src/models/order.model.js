import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ADDRESS SNAPSHOT: Captures address at the moment of purchase
    addressSnapshot: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, require: true },
      pincode: { type: String, required: true },
    },
    // ITEMS SNAPSHOT: Captures product details and prices at purchase time
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId, // From the nested variants in Product
          required: true,
        },
        productName: { type: String, required: true },
        variantName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // Price at the time of order
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discountSource: {
      type: String,
      enum: ["PROMOTION", "COUPON_CODE", null],
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    actualAmount: {
      type: Number,
      required: true,
      help: "The final amount the customer pays",
    },
    paymentMethod: {
      type: String,
      default: "COD",
      enum: ["COD"], // Easily expandable to "UPI" or "CARD" later
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
    },
    orderStatus: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "confirmed",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        comment: { type: String },
      },
    ],
    // Useful for tracking when the status changed to Delivered
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
