// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { keycloak } from "@/lib/Keycloak";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null); // Token can be null
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [messageLog, setMessageLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  const logMessage = (message: string) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      setMessageLog((prevLog) => [...prevLog, `[${timestamp}] ${message}`]);
    }
  };

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        logMessage("Initializing Keycloak...");
        const authenticated = await keycloak.init({ onLoad: "login-required" });
        setIsAuthenticated(authenticated);

        // Convert undefined token to null
        setToken(keycloak.token || null);

        if (authenticated) {
          logMessage("User authenticated successfully.");
          const profile = await fetchUserProfile();
          setUserProfile(profile);
        } else {
          logMessage("User not authenticated.");
        }
      } catch (error) {
        logMessage(`Failed to initialize Keycloak: ${error}`);
        console.error("Failed to initialize Keycloak:", error);
      } finally {
        setLoading(false); // Mark initialization as complete
      }
    };

    initKeycloak();
  }, []);

  const fetchUserProfile = async (): Promise<UserProfile> => {
    try {
      logMessage("Fetching user profile...");
      const profile = await keycloak.loadUserProfile();
      logMessage("User profile fetched successfully.");
      return {
        username: profile.username || "",
        email: profile.email || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
      };
      logout;
    } catch (error) {
      logMessage(`Failed to fetch user profile: ${error}`);
      console.error("Failed to fetch user profile:", error);
      return {
        username: "",
        email: "",
        firstName: "",
        lastName: "",
      };
    }
  };

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
  };

  // Render a loading indicator while initializing Keycloak
  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
