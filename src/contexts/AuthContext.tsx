// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { keycloak } from "@/lib/Keycloak";
import Keycloak from "keycloak-js";

interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  token: string | null;
  userProfile: UserProfile | null;
  updateToken: (minValidity?: number) => Promise<boolean>;
  messageLog: string[];
  keycloak?: Keycloak | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null); // Token can be null
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Add a loading state
  const [keyCloakRes, setKeyCloakRes] = useState<Keycloak | null>();

  const logMessage = (message: string) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      setMessageLog((prevLog) => [...prevLog, `[${timestamp}] ${message}`]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const initKeycloak = async () => {
      keycloak
        .init({
          onLoad: "check-sso",
        })
        .then((authenticated: boolean) => {
          setIsAuthenticated(authenticated);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Keycloak initialization failed:", error);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setToken(keycloak.token || null);
          setLoading(false);

          setKeyCloakRes(keycloak);
          setUserProfile({
            email: keycloak.idTokenParsed?.email,
            firstName: keycloak.idTokenParsed?.family_name,
            lastName: keycloak.idTokenParsed?.given_name,
            username: keycloak.idTokenParsed?.preferred_username,
          });
        });
    };

    initKeycloak();
  }, []);

  const login = async () => {
    try {
      logMessage("Initiating login process...");
      await keycloak.login({
        redirectUri: `${window.location.origin}/dashboard`,
      });
      // await keycloak.login();
      setIsAuthenticated(true);
    } catch (error) {
      logMessage(`Login failed: ${error}`);
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    logMessage("Initiating logout process...");
    keycloak.logout({
      redirectUri: `${window.location.origin}`,
    });
    setIsAuthenticated(false);
    setToken(null); // Set token to null on logout
    setUserProfile(null);
    logMessage("User logged out successfully.");
  };

  // const logout = async () => {
  //   try {
  //     // await keycloak.logout({ redirectUri: window.location.href });
  //     await keycloak.logout();
  //     setIsAuthenticated(false);
  //     setToken(null); // Set token to null on logout
  //     setUserProfile(null);
  //     logMessage("User logged out successfully.");
  //   } catch (error) {
  //     logMessage(`Logout failed: ${error}`);
  //   }
  // };

  const updateToken = async (minValidity: number = 5): Promise<boolean> => {
    try {
      logMessage("Refreshing token...");
      const refreshed = await keycloak.updateToken(minValidity);
      if (refreshed) {
        // Convert undefined token to null
        setToken(keycloak.token || null);
        logMessage("Token refreshed successfully.");
      } else {
        logMessage("Token not refreshed.");
      }
      return refreshed;
    } catch (error) {
      logMessage(`Failed to refresh token: ${error}`);
      console.error("Failed to refresh token:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    token,
    userProfile,
    updateToken,
    messageLog,
    keycloak: keyCloakRes,
  };

  // Render a loading indicator while initializing Keycloak
  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
