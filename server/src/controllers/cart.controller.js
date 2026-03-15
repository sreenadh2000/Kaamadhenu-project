/// This is the new Code

import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// --- HELPERS ---

const UNIT_MAP = { kg: 1000, gm: 1, l: 1000, ml: 1, others: 1 };
const toBaseUnit = (qty, unit) => (qty || 0) * (UNIT_MAP[unit] || 1);

/**
 * Centered logic for totals to ensure consistency across all endpoints
 */
const syncCartCalculations = (cart) => {
  // Update individual item totals first
  cart.items.forEach((item) => {
    item.discountedTotal = item.quantity * item.actualPrice;
  });

  // Calculate Global Totals
  cart.actualAmount = cart.items.reduce(
    (acc, i) => acc + i.actualPrice * i.quantity,
    0,
  );

  let discountedTotalPrice = cart.items.reduce(
    (acc, i) => acc + i.discountedTotal,
    0,
  );

  // Apply Coupon Logic if it exists in your schema
  if (cart.coupon && cart.coupon.active) {
    const discount = cart.coupon.discountAmount || 0;
    discountedTotalPrice = Math.max(0, discountedTotalPrice - discount);
  }

  cart.discountedTotalPrice = discountedTotalPrice;
  return cart;
};

/**
 * Validates stock and updates items with availableQuantity and isOutOfStock flags
 */
const updateStockFlags = (product, cartItems) => {
  const productAvailable = toBaseUnit(
    product.stock?.quantity,
    product.stock?.unit,
  );

  // Calculate total base units used by all variants of this product in cart
  let totalUsedBaseUnits = 0;
  cartItems.forEach((item) => {
    const variant = product.variants.id(item.variantId);
    if (variant) {
      totalUsedBaseUnits +=
        item.quantity * toBaseUnit(variant.stockQuantity, variant.quantityUnit);
    }
  });

  // Update flags for each item
  cartItems.forEach((item) => {
    const variant = product.variants.id(item.variantId);
    if (!variant) return;

    const perVariantBaseUnit = toBaseUnit(
      variant.stockQuantity,
      variant.quantityUnit,
    );

    // Logic: If product has no stock or variant is huge, maxQty is 0
    item.availableQuantity =
      perVariantBaseUnit > 0
        ? Math.floor(productAvailable / perVariantBaseUnit)
        : 0;

    // Item is out of stock if total used exceeds available OR product itself is marked inactive
    item.isOutOfStock =
      totalUsedBaseUnits > productAvailable ||
      !product.isActive ||
      product.stock.quantity <= 0;
  });
};

// --- CONTROLLERS ---

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );
    if (!cart) return res.json({ success: true, cart: { items: [] } });

    // Group items by Product to run stock validation efficiently
    const productIds = [
      ...new Set(cart.items.map((i) => i.productId?._id?.toString())),
    ];

    for (const pId of productIds) {
      const productDoc = cart.items.find(
        (i) => i.productId?._id?.toString() === pId,
      )?.productId;
      if (productDoc) {
        const relatedItems = cart.items.filter(
          (i) => i.productId?._id?.toString() === pId,
        );
        updateStockFlags(productDoc, relatedItems);
      }
    }

    syncCartCalculations(cart);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive)
    return res.status(404).json({ message: "Product unavailable" });

  const variant = product.variants.id(variantId);
  if (!variant) return res.status(404).json({ message: "Variant not found" });

  let cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

  const index = cart.items.findIndex(
    (i) =>
      i.productId.toString() === productId &&
      i.variantId.toString() === variantId,
  );

  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      variantId,
      quantity,
      actualPrice: variant.price,
      discountedTotal: quantity * variant.price,
    });
  }

  // Stock check before saving
  const relatedItems = cart.items.filter(
    (i) => i.productId.toString() === productId,
  );
  updateStockFlags(product, relatedItems);

  if (relatedItems.some((i) => i.isOutOfStock)) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient stock available" });
  }

  syncCartCalculations(cart);
  await cart.save();
  res.status(201).json({ success: true, cart });
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    const itemIndex = cart?.items.findIndex(
      (i) =>
        i.productId.toString() === productId &&
        i.variantId.toString() === variantId,
    );

    if (!cart || itemIndex === -1)
      return res.status(404).json({ message: "Item not found" });

    cart.items[itemIndex].quantity = quantity;

    const product = await Product.findById(productId);
    const relatedItems = cart.items.filter(
      (i) => i.productId.toString() === productId,
    );

    updateStockFlags(product, relatedItems);
    syncCartCalculations(cart);

    cart.markModified("items");
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId &&
          i.variantId.toString() === variantId
        ),
    );

    syncCartCalculations(cart);
    cart.markModified("items");
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          items: [],
          actualAmount: 0,
          discountedTotalPrice: 0,
          coupon: null,
        },
      },
      { new: true },
    );
    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
