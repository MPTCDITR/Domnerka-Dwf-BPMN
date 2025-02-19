import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const from = location.state?.from?.pathname || location;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
