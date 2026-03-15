import Coupon from "../models/coupon.model.js";
import Cart from "../models/cart.model.js";

// ================= APPLY COUPON =================
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon not found or inactive", success: false });
    }

    // Check if coupon is expired
    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) {
      return res
        .status(400)
        .json({ message: "Coupon is not valid at this time", success: false });
    }

    // Find if the user has already used this coupon
    const userUsage = coupon.usedByUsers.find(
      (u) => u.userId.toString() === userId.toString()
    );

    const userUsageCount = userUsage ? userUsage.count : 0;

    if (coupon.usageLimit && userUsageCount >= coupon.usageLimit) {
      return res.status(400).json({
        message: `You have already used this coupon ${userUsageCount} times. Limit is ${coupon.usageLimit}`,
        success: false,
      });
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // Check min order value
    if (
      coupon.minOrderValue &&
      cart.discountedTotalPrice < coupon.minOrderValue
    ) {
      return res.status(400).json({
        message: `Cart total must be at least ${coupon.minOrderValue} to use this coupon`,
        success: false,
      });
    }

    // Apply discount
    let discountAmount = 0;
    if (coupon.discountType === "FLAT") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cart.discountedTotalPrice * coupon.discountValue) / 100;
    }

    cart.coupon = {
      couponId: coupon._id,
      code: coupon.code,
      discountAmount,
      active: true,
    };

    cart.discountedTotalPrice = Math.max(
      0,
      cart.discountedTotalPrice - discountAmount
    );

    await cart.save();

    return res.status(200).json({
      message: `Coupon applied successfully`,
      data: cart,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= REMOVE COUPON =================
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    cart.coupon = null;
    // Recalculate totals without coupon
    cart.discountedTotalPrice = cart.items.reduce(
      (acc, item) => acc + item.discountedTotal,
      0
    );
    await cart.save();

    res
      .status(200)
      .json({ message: "Coupon removed", data: cart, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ================= ADMIN: CREATE COUPON =================
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      usageLimit,
      startDate,
      endDate,
    } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Coupon code already exists", success: false });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue,
      usageLimit,
      startDate,
      endDate,
      isActive: true,
    });

    res
      .status(201)
      .json({ message: "Coupon created", data: coupon, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// ================= ADMIN: GET ALL COUPON =================
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ data: coupons, count: coupons.length, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// ================= ADMIN: GET COUPON BY ID =================
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon not found", success: false });
    }
    res.status(200).json({ data: coupon, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// ================= ADMIN: UPDATE COUPON =================
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon not found", success: false });
    }

    res
      .status(200)
      .json({ message: "Coupon updated", data: coupon, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// ================= ADMIN: DELETE COUPON =================
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon not found", success: false });
    }

    res.status(200).json({
      message: "Coupon deleted successfully",
      data: coupon,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// ================= APPLY AT CHECKOUT =================
export const markCouponUsed = async (couponId, userId) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) return;

  const userUsage = coupon.usedByUsers.find(
    (u) => u.userId.toString() === userId.toString()
  );

  if (userUsage) {
    // Increment the count
    userUsage.count += 1;
    userUsage.usedAt = new Date();
  } else {
    // First time user is using this coupon
    coupon.usedByUsers.push({ userId, count: 1, usedAt: new Date() });
  }

  coupon.usedCount += 1;
  await coupon.save();
};
