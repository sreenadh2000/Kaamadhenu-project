import { useAuthStore } from "../../store/auth/useAuthStore";
import { useLocation } from "react-router";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth/un-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
