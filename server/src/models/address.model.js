import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    // Matches 'userId: ObjectId' from your structure
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      trim: true,
      lowercase: true,
    },
    addressLine1: {
      type: String,
      required: [true, "Please provide address line 1"],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please provide city"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "Please provide state"],
      trim: true,
    },
    // Matches 'pincode: String' from your structure
    pincode: {
      type: String,
      required: [true, "Please provide pincode"],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// Prevents re-compiling the model if it already exists (useful for Next.js/Hot Reloading)
const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
