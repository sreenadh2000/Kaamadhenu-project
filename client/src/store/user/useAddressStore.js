import { create } from "zustand";
import { toast } from "react-toastify";
import axios from "../../utils/axios";

export const useAddressStore = create((set) => ({
  addresses: [],
  loading: false,
  error: null,
  successMessage: null,

  ////////////////////////////////////////////
  // GET ADDRESSES
  ////////////////////////////////////////////
  fetchAddresses: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/addresses");
      if (res.data.success) {
        set({
          addresses: res.data.addresses,
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch addresses",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to fetch addresses");
    }
  },

  ////////////////////////////////////////////
  // CREATE ADDRESS
  ////////////////////////////////////////////
  createAddress: async (data) => {
    try {
      set({ loading: true });

      const res = await axios.post("/addresses", data);

      if (res.data.success) {
        set((state) => ({
          addresses: [res.data.address, ...state.addresses],
          loading: false,
          successMessage: "Address added successfully",
        }));
        toast.success("Address added successfully");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create address",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Failed to create address");
    }
  },

  ////////////////////////////////////////////
  // UPDATE ADDRESS
  ////////////////////////////////////////////
  updateAddress: async (id, data) => {
    try {
      set({ loading: true });
      const res = await axios.put(`/addresses/${id}`, data);

      if (res.data.success) {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr._id === id ? res.data.data : addr,
          ),
          loading: false,
          successMessage: "Address updated successfully",
        }));
        toast.success("Address updated successfully");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Update failed",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Update failed");
    }
  },

  ////////////////////////////////////////////
  // DELETE ADDRESS
  ////////////////////////////////////////////
  deleteAddress: async (id) => {
    try {
      await axios.delete(`/addresses/${id}`);

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr._id !== id),
        successMessage: "Address deleted successfully",
      }));
      toast.success("Address deleted successfully");
    } catch (err) {
      set({
        error: err.response?.data?.message || "Delete failed",
      });
      toast.error(err.response?.data?.message || "Delete failed");
    }
  },

  ////////////////////////////////////////////
  // SET DEFAULT ADDRESS
  ////////////////////////////////////////////
  setDefaultAddress: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.put(`/addresses/${id}/default`);

      if (res.data.success) {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === id,
          })),
          loading: false,
          successMessage: "Default address updated successfully",
        }));
        toast.success("Default address updated successfully");
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to set default address",
        loading: false,
      });
      toast.error(
        err.response?.data?.message || "Failed to set default address",
      );
    }
  },
  clearStatus: () => set({ error: null, successMessage: null }),
}));
