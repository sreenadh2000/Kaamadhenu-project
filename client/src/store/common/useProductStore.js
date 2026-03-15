import { create } from "zustand";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export const useProductStore = create((set, get) => ({
  categoriesData: [],
  selectedCategory: null,
  productsData: [],
  selectedProduct: null,
  loading: false,
  error: null,
  successMessage: null,

  //////////////////////////////////////////////////////
  // CATEGORY SECTION
  //////////////////////////////////////////////////////

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/categories");
      if (res.data.success) {
        set({
          categoriesData: res.data.categories,
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load categories",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to load categories");
    }
  },

  fetchCategoryById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/categories/${id}`);

      if (res.data.success) {
        set({
          selectedCategory: res.data.category,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "Category not found", loading: false });
      toast.error("Category not found");
    }
  },

  addCategory: async (formData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await axios.post("/categories", formData);

      if (res.data.success) {
        set((state) => ({
          categoriesData: [...state.categoriesData, res.data.category],
          successMessage: res.data.message,
          loading: false,
        }));
        toast.success(res.data.message);
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Creation failed",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Creation failed");
    }
  },

  updateCategory: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/categories/${id}`, updatedData);

      if (res.data.success) {
        set((state) => ({
          categoriesData: state.categoriesData.map((cat) =>
            cat._id === id ? res.data.category : cat,
          ),
          successMessage: res.data.message,
          loading: false,
        }));
        toast.success(res.data.message);
      }
    } catch (err) {
      set({ error: "Update failed", loading: false });
      toast.error("Update failed");
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`/categories/${id}`);

      if (res.data.success) {
        set((state) => ({
          categoriesData: state.categoriesData.filter((cat) => cat._id !== id),
          successMessage: res.data.message,
          loading: false,
        }));
        toast.success(res.data.message);
      }
    } catch (err) {
      set({ error: "Delete failed", loading: false });
      toast.error("Delete failed");
    }
  },

  //////////////////////////////////////////////////////
  // PRODUCT SECTION
  //////////////////////////////////////////////////////
  fetchProducts: async (categoryId = null) => {
    set({ loading: true, error: null });

    try {
      const url = categoryId
        ? `/products?categoryId=${categoryId}`
        : "/products";

      const res = await axios.get(url);

      if (res.data.success) {
        set({
          productsData: res.data.products,
          selectedCategory: categoryId, // track selected filter
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch products",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/products/${id}`);

      if (res.data.success) {
        set({
          selectedProduct: res.data.product,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "Product not found", loading: false });
      toast.error(err.response?.data?.message || "Product not found");
    }
  },

  //////////////////////////////////////////////////////
  // CREATE PRODUCT (Multipart)
  //////////////////////////////////////////////////////

  addProduct: async (productForm) => {
    set({ loading: true, error: null, successMessage: null });

    try {
      let formData = new FormData();

      // Basic fields
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("categoryId", productForm.category_id);
      formData.append("isActive", productForm.is_active);

      // Stock object (must match backend structure)
      formData.append(
        "stock",
        JSON.stringify({
          quantity: Number(productForm.stock_quantity),
          unit: productForm.stock_unit,
        }),
      );

      // Variants array
      if (productForm.variants?.length > 0) {
        const formattedVariants = productForm.variants.map((v) => ({
          variantName: v.variant_name,
          price: Number(v.regular_price),
          stockQuantity: Number(v.stock_quantity),
          quantityUnit: v.unit,
        }));

        formData.append("variants", JSON.stringify(formattedVariants));
      }

      // Images (REAL FILES, not URL)
      productForm.images.forEach((img) => {
        formData.append("images", img.file);
      });

      const res = await axios.post("/products", formData);

      if (res.data.success) {
        set((state) => ({
          productsData: [res.data.product, ...state.productsData],
          successMessage: "Product added successfully",
          loading: false,
        }));
        toast.success("Product added successfully");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to add product",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  },

  //////////////////////////////////////////////////////
  // UPDATE PRODUCT
  //////////////////////////////////////////////////////

  updateProduct: async (id, updatedData) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();

      Object.keys(updatedData).forEach((key) => {
        if (key === "stock" || key === "variants" || key === "existingImages") {
          formData.append(key, JSON.stringify(updatedData[key]));
        } else if (key === "images") {
          updatedData.images.forEach((file) => formData.append("images", file));
        } else {
          formData.append(key, updatedData[key]);
        }
      });

      const res = await axios.put(`/products/${id}`, formData);

      if (res.data.success) {
        set((state) => ({
          productsData: state.productsData.map((p) =>
            p._id === id ? res.data.product : p,
          ),
          selectedProduct: res.data.product,
          successMessage: "Product updated successfully",
          loading: false,
        }));
        toast.success("Product updated successfully");
      }
    } catch (err) {
      set({ error: "Update failed", loading: false });
      toast(err.response?.data?.message || "Update failed");
    }
  },

  //////////////////////////////////////////////////////
  // DELETE PRODUCT
  //////////////////////////////////////////////////////

  deleteProduct: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.delete(`/products/${id}`);

      if (res.data.success) {
        set((state) => ({
          productsData: state.productsData.filter((p) => p._id !== id),
          successMessage: res.data.message,
          loading: false,
        }));
        toast.success(res.data.message);
      }
    } catch (err) {
      set({
        error: "Could not delete product",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  },

  clearStatus: () => set({ error: null, successMessage: null }),
}));
