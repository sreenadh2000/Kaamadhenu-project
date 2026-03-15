import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide a coupon code"],
      unique: true,
      trim: true,
      uppercase: true, // Automatically converts "save10" to "SAVE10"
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: [true, "Please specify discount type"],
    },
    discountValue: {
      type: Number,
      required: [true, "Please provide a discount value"],
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: null, // null implies unlimited usage
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "Please provide an end date"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Array to track which users have used this coupon
    usedByUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        count: { type: Number, default: 1 },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Custom validation to ensure end date is after start date
 */
couponSchema.path("endDate").validate(function (value) {
  return !this.startDate || value >= this.startDate;
}, "End date must be after the start date");

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;
