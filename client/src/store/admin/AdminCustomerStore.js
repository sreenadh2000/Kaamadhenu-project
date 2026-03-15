import { create } from "zustand";
import axios from "axios";

const baseUrl = "http://localhost:4000";

export const useAdminCustomerStore = create((set, get) => ({
  // ... (keep categoriesData and productsData as they are) ...

  customersData: [],
  selectedCustomer: null,
  customerOrders: [],
  customerCart: null,
  loading: false,
  error: null,
  successMessage: null,

  //////////////////////////////////// Customers Section ////////////////////////////////

  // 1. GET ALL CUSTOMERS
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${baseUrl}/users`); // Adjust endpoint if needed (e.g., /customers)
      if (res.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data.users || [];
        set({ customersData: data, loading: false });
      }
    } catch (err) {
      set({ error: "Failed to load customers", loading: false });
    }
  },

  // 2. GET CUSTOMER BY ID
  fetchCustomerById: async (id) => {
    set({ loading: true, error: null, selectedCustomer: null });
    try {
      const res = await axios.get(`${baseUrl}/users/${id}`);
      if (res.status === 200) {
        set({ selectedCustomer: res.data, loading: false });
      }
    } catch (err) {
      set({ error: "Customer not found", loading: false });
    }
  },

  // 3. CREATE CUSTOMER
  addCustomer: async (customerForm) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await axios.post(`${baseUrl}/users`, customerForm);
      if (res.status === 201) {
        set((state) => ({
          customersData: [res.data, ...state.customersData],
          successMessage: "Customer account created!",
          loading: false,
        }));
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create customer",
        loading: false,
      });
    }
  },

  // 4. UPDATE CUSTOMER (General Info)
  updateCustomer: async (id, updatedData) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const res = await axios.put(`${baseUrl}/users/${id}`, updatedData);
      if (res.status === 200) {
        set((state) => ({
          customersData: state.customersData.map((c) =>
            c.id === id ? res.data : c
          ),
          selectedCustomer: res.data,
          successMessage: "Customer details updated!",
          loading: false,
        }));
      }
    } catch (err) {
      set({ error: "Update failed", loading: false });
    }
  },

  // 5. DELETE CUSTOMER
  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${baseUrl}/users/${id}`);
      if (res.status === 200) {
        set((state) => ({
          customersData: state.customersData.filter((c) => c.id !== id),
          successMessage: "Customer deleted successfully",
          loading: false,
        }));
      }
    } catch (err) {
      set({ error: "Delete failed", loading: false });
    }
  },

  // 1. FETCH ORDERS BY CUSTOMER ID
  fetchCustomerOrders: async (customerId) => {
    set({ loading: true, error: null, customerOrders: [] });
    try {
      // Assuming your API supports filtering orders by customer_id
      const res = await axios.get(
        `${baseUrl}/orders?customer_id=${customerId}`
      );
      if (res.status === 200) {
        // Handle both direct arrays or nested objects
        const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
        set({ customerOrders: data, loading: false });
      }
    } catch (err) {
      set({ error: "Failed to load customer orders", loading: false });
    }
  },

  // 2. FETCH CART BY USER ID
  fetchCustomerCart: async (userId) => {
    set({ loading: true, error: null, customerCart: null });
    try {
      // Fetches the specific cart for the user
      const res = await axios.get(`${baseUrl}/carts?user_id=${userId}`);
      if (res.status === 200) {
        // Carts usually return a single object or an array with one item
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        set({ customerCart: data, loading: false });
      }
    } catch (err) {
      set({ error: "Failed to load customer cart", loading: false });
    }
  },

  // Helper to clear alerts
  clearStatus: () => set({ error: null, successMessage: null }),
}));
