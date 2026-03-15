import axios from "axios";
// import { useAuthStore } from "../store/auth/useAuthStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 REQUIRED for cookies
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     //////////////////////////////////////////////////////
//     // INTERNET CONNECTION ERROR
//     //////////////////////////////////////////////////////
//     if (!error.response) {
//       alert("Your internet connection is not good. Please check your network.");
//       return Promise.reject(error);
//     }

//     //////////////////////////////////////////////////////
//     // SESSION TIMEOUT (401)
//     //////////////////////////////////////////////////////
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const { refreshAccessToken, logout } = useAuthStore.getState();

//       const refreshed = await refreshAccessToken();

//       if (refreshed) {
//         return axiosInstance(originalRequest);
//       } else {
//         logout();

//         alert("Session expired. Please login again.");

//         window.location.href = "/"; // redirect to home/login
//       }
//     }

//     return Promise.reject(error);
//   },
// );
export default axiosInstance;
