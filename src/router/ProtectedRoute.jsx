/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // লোকালস্টোরেজ থেকে টোকেন চেক করা

  if (token) {
    return <Navigate to="/" replace />; // যদি টোকেন থাকে, তাহলে হোমপেজে পাঠিয়ে দাও
  }

  return children; // যদি টোকেন না থাকে, তাহলে কম্পোনেন্ট রেন্ডার করো
};

export default ProtectedRoute;
