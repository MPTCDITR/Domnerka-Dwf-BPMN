import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }

  return context;
};

export default useAuth;
