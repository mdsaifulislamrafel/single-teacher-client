/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../provider/AuthContext";
import Loading from "../components/Loading";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && ["/login", "/register"].includes(location.pathname)) {
      window.location.href = "/";
    }
  }, [location.pathname, token]);

  if (loading) return <Loading />;

  if (!token) return <Navigate to="/login" replace />;

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
