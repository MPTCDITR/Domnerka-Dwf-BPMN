import React from "react";
import { Outlet } from "react-router-dom";
import NotAuthComponent from "@/components/contents/NotAuth";
import useAuth from "@/hooks/useAuth";

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
