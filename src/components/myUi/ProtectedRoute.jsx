// src/components/ProtectedRoute.js
import { useUserContext } from "@/context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/");
    }
  }, [user.isAuthenticated, navigate]);

  if (!user.isAuthenticated) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
