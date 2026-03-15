// PublicRoute.jsx
import { Navigate } from "react-router";
import { useAuthStore } from "../../store/auth/useAuthStore";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const redirectPath = user.role === "admin" ? "/admin" : "/products";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
