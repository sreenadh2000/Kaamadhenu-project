import { create } from "zustand";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  adminSelectedUser: null,
  loading: false,
  error: null,

  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  },

  /////////////////////////////////////////////////////////
  // PUBLIC ACTIONS
  /////////////////////////////////////////////////////////

  registerUser: async (userData) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/users/register", userData);

      if (res.data.success) {
        toast.success("User registered successfully");
        set({ loading: false });
        return res.data.user;
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      set({ error: msg, loading: false });
      toast.error(msg);
      return null;
    }
  },

  /////////////////////////////////////////////////////////
  // ADMIN ACTIONS
  /////////////////////////////////////////////////////////

  // Get All Users
  fetchAllUsers: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("/users", { params });

      if (res.data.success) {
        set({
          users: res.data.users,
          //   pagination: {
          //     currentPage: res.data.currentPage || 1,
          //     totalPages: res.data.totalPages || 1,
          //     totalUsers: res.data.totalUsers || res.data.users.length,
          //   },
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "Failed to fetch users", loading: false });
      toast.error("Failed to fetch users");
    }
  },

  // Update User (Admin / Owner)
  updateUser: async (userId, userData) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.patch(`/users/${userId}`, userData);

      if (res.data.success) {
        set((state) => ({
          users: state.users.map((u) => (u._id === userId ? res.data.user : u)),
          selectedUser: res.data.user,
          loading: false,
        }));

        toast.success("User updated successfully");
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      set({ error: msg, loading: false });
      toast.error(msg);
      return false;
    }
  },

  // Delete User (Admin Only)
  deleteUser: async (userId) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.delete(`/users/${userId}`);

      if (res.data.success) {
        set((state) => ({
          users: state.users.filter((u) => u._id !== userId),
          loading: false,
        }));

        toast.success("User deleted successfully");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  /////////////////////////////////////////////////////////
  // SHARED ACTIONS
  /////////////////////////////////////////////////////////

  // Get user by id
  fetchUserById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`/users/${id}`);

      if (res.data.success) {
        set({
          selectedUser: res.data.user,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "User not found", loading: false });
      toast.error("User not found");
    }
  },

  // Get user from admin by id
  fetchUserByIdForAdmin: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/users/admin/${id}`);

      if (res.data.success) {
        set({
          adminSelectedUser: res.data.data,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: "User not found", loading: false });
      toast.error("User not found");
    }
  },

  clearUserDetails: () => set({ selectedUser: null, error: null }),
}));
