import { create } from "zustand";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,

  //////////////////////////////////////////////
  // REGISTER (Auto Login)
  //////////////////////////////////////////////
  register: async (formData) => {
    set({ loading: true, error: null });

    try {
      console.log("form data :", formData);
      const res = await axios.post("/users/register", formData);
      console.log(" registered user :", res.data);
      if (res.data.success) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          successMessage: "Registered successfully",
        });

        // Optionally fetch fresh user data
        await get().checkAuth();
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration failed",
        loading: false,
      });
    }
  },

  //////////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////////
  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post("/auth/login", credentials);

      if (res.data.success) {
        set({
          user: res.data.data,
          isAuthenticated: true,
          loading: false,
          successMessage: "Login successful",
        });

        await get().checkAuth();
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  //////////////////////////////////////////////
  // CHECK SESSION (Call /auth/me)
  //////////////////////////////////////////////
  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/me");

      if (res.data.success) {
        set({
          user: res.data.data,
          isAuthenticated: true,
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },
  ////////////////////////////////////////////
  // UPDATE USER
  ////////////////////////////////////////////
  updateProfile: async (id, userData) => {
    set({ loading: true, error: null, successMessage: null });

    try {
      const res = await axios.patch(`/users/${id}`, userData);
      if (res.data.success) {
        set({
          user: res.data.user, // update store with new user
          loading: false,
          successMessage: "Profile updated successfully",
        });
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update profile",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  },

  //////////////////////////////////////////////
  // REFRESH ACCESS TOKEN
  //////////////////////////////////////////////
  refreshAccessToken: async () => {
    try {
      await axios.post("/auth/refresh-token");
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
      });
      return false;
    }
  },

  //////////////////////////////////////////////
  // LOGOUT
  //////////////////////////////////////////////
  logout: async () => {
    try {
      await axios.post("/auth/logout");

      set({
        user: null,
        isAuthenticated: false,
        successMessage: "Logged out successfully",
      });
      toast.success(" Successfully Logged out..");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      set({
        error: "Logout failed",
      });
    }
  },

  /////////////////////////////////////////////
  // Get Auth Me
  ////////////////////////////////////////////

  clearStatus: () => set({ error: null, successMessage: null }),
}));
