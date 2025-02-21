import React from "react";
import { useAuth } from "react-oidc-context";
import { Outlet } from "react-router-dom";
import NotAuthComponent from "@/components/contents/NotAuth";

const AuthLayout: React.FC = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <NotAuthComponent />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
