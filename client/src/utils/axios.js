import axios from "axios";
import { useAuthStore } from "../store/auth/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 REQUIRED for cookies
});
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const isAuthRoute = originalRequest.url.includes("/auth");
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthRoute // 🔥 THIS WAS MISSING
//     ) {
//       originalRequest._retry = true;

//       const refreshed = await useAuthStore.getState().refreshAccessToken();

//       if (refreshed) {
//         return axiosInstance(originalRequest);
//       } else {
//         useAuthStore.getState().logout();
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default axiosInstance;
