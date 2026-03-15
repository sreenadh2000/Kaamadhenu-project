// import { createBrowserRouter } from "react-router";
// import { RouterProvider } from "react-router-dom";
// import { userRoutes } from "./routes/user.routes";
// import { adminRoutes } from "./routes/admin.routes";
// import { authRoutes } from "./routes/auth.routes";

// const router = createBrowserRouter([
//   authRoutes,
//   userRoutes, // default route
//   adminRoutes, // admin routes
// ]);
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;
// src/App.js
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store/auth/useAuthStore";
import { adminRoutes } from "./routes/admin.routes";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  // 1. AUTH ROUTES (No Layout)
  authRoutes,

  // 2. USER ROUTES (Mixed Public & Private)
  userRoutes,

  // 3. ADMIN ROUTES (Fully Protected)
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [adminRoutes], // Wraps the entire adminRoutes object
  },
]);

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {/* <AuthProvider> */}
      <RouterProvider router={router} />

      {/* </AuthProvider> */}
      {/* 🔥 Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
      />
    </>
  );
}

export default App;
