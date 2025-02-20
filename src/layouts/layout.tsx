import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotAuthComponent from "@/components/contents/NotAuth";

const AuthLayout: React.FC = () => {
  const { isAuthenticated, keycloak } = useAuth();

  if (!isAuthenticated || !keycloak) {
    return <NotAuthComponent />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
