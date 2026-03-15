import { create } from "zustand";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export const useCartStore = create((set, get) => ({
  cartData: null,
  cartItems: [],
  loading: false,
  error: null,
  successMessage: null,

  //////////////////////////////////////////////////////
  // GET CART
  //////////////////////////////////////////////////////
  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("/carts");
      if (res.data.success) {
        set({
          cartData: res.data.cart,
          cartItems: res.data.cart.items || [],
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch cart",
        loading: false,
      });

      toast.error(err.response?.data?.message || "Failed to fetch cart");
    }
  },

  //////////////////////////////////////////////////////
  // ADD TO CART
  //////////////////////////////////////////////////////
  addToCart: async (product, variant, quantity = 1) => {
    set({ loading: true, error: null });

    try {
      const productId = product._id;
      const variantId = variant._id;

      const res = await axios.post("/carts", {
        productId,
        variantId,
        quantity,
      });

      if (res.data.success) {
        set({
          cartData: res.data.cart,
          cartItems: res.data.cart.items,
          loading: false,
          successMessage: "Item added to cart",
        });

        toast.success("Added to cart");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to add item",
        loading: false,
      });

      toast.error(err.response?.data?.message || "Failed to add item");
    }
  },

  //////////////////////////////////////////////////////
  // UPDATE CART ITEM
  //////////////////////////////////////////////////////
  updateCartItem: async (ProItem, quantity) => {
    // 1. Get snapshot for rollback if API fails
    const previousItems = get().cartItems;
    const previousData = get().cartData;

    // Handle the ID safely (Object vs String)
    const productId = ProItem.productId?._id || ProItem.productId;
    const variantId = ProItem.variantId;

    // 2. OPTIMISTIC UPDATE: Update the UI immediately
    // This makes the + and - buttons feel instant
    set((state) => ({
      cartItems: state.cartItems.map((item) => {
        const itemProdId = item.productId?._id || item.productId;
        return itemProdId === productId && item.variantId === variantId
          ? { ...item, quantity } // Manually override the quantity
          : item;
      }),
    }));

    try {
      const res = await axios.put(`/carts/${productId}/${variantId}`, {
        quantity,
      });

      if (res.data.success) {
        // 3. SUCCESS: Sync with the real server data (totals, stock flags)
        set({
          cartData: res.data.cart,
          cartItems: res.data.cart.items,
          loading: false,
        });
        // Optional: toast.success("Synced");
      }
    } catch (err) {
      // 4. ROLLBACK: If server says "No" (e.g., out of stock), revert UI
      set({
        cartItems: previousItems,
        cartData: previousData,
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  },

  //////////////////////////////////////////////////////
  // REMOVE ITEM
  //////////////////////////////////////////////////////
  removeFromCart: async (productId, variantId) => {
    const previousItems = get().cartItems;
    const previousData = get().cartData;

    // 1. Optimistic Update (Remove immediately from UI)
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) =>
          (item.productId._id || item.productId) !== productId ||
          item.variantId !== variantId,
      ),
    }));

    try {
      const res = await axios.delete(`/carts/${productId}/${variantId}`);

      if (res.data.success) {
        set({
          cartData: res.data.cart,
          cartItems: res.data.cart.items,
          loading: false,
        });
        toast.success("Item removed");
      }
    } catch (err) {
      // Rollback if DB fails
      set({ cartItems: previousItems, cartData: previousData, loading: false });
      toast.error("Failed to remove item");
    }
  },

  //////////////////////////////////////////////////////
  // CLEAR CART
  //////////////////////////////////////////////////////
  clearCart: async () => {
    // Save current state for a potential rollback
    const previousItems = get().cartItems;
    const previousData = get().cartData;

    // 1. OPTIMISTIC UPDATE: Clear UI immediately
    set({
      cartItems: [],
      cartData: { items: [], actualAmount: 0, discountedTotalPrice: 0 },
      loading: true,
      error: null,
    });

    try {
      const res = await axios.delete("/carts");

      if (res.data.success) {
        set({
          cartData: res.data.cart,
          cartItems: res.data.cart.items,
          loading: false,
        });
        // toast.success("Cart cleared"); // Optional: handleConfirm handles alert
      }
    } catch (err) {
      // 2. ROLLBACK: If server fails, bring the items back
      set({
        cartItems: previousItems,
        cartData: previousData,
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to clear cart");
    }
  },

  //////////////////////////////////////////////////////
  // CALCULATED VALUES
  //////////////////////////////////////////////////////
  //   cartCount: () => {
  //     const items = get().cartItems;
  //     return items.reduce((acc, item) => acc + item.quantity, 0);
  //   },
  cartCount: () => {
    const items = get().cartItems || [];
    return items.length; // Just the count of unique items/variants
  },

  cartTotal: () => {
    const cart = get().cartData;
    return cart?.discountedTotalPrice || 0;
  },

  //////////////////////////////////////////////////////
  // CLEAR STATUS
  //////////////////////////////////////////////////////
  clearStatus: () => set({ error: null, successMessage: null }),
}));
