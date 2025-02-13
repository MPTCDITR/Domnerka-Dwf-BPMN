import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { keycloak, initOptions } from "@/lib/Keycloak";
import { KeycloakProfile } from "keycloak-js";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userProfile: KeycloakProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (minValidity: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<KeycloakProfile | null>(null);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init(initOptions);
        setIsAuthenticated(authenticated);

        if (authenticated) {
          setToken(
            typeof keycloak.token !== "undefined" ? keycloak.token : null
          );
          const profile = await keycloak.loadUserProfile();
          setUserProfile(profile);

          // Set up token refresh
          setInterval(async () => {
            try {
              const refreshed = await keycloak.updateToken(70);
              if (refreshed && typeof keycloak.token !== "undefined") {
                setToken(keycloak.token);
              }
            } catch (error) {
              console.error("Token refresh error:", error);
              await logout();
            }
          }, 60000);
        }
      } catch (error) {
        console.error("Keycloak initialization error:", error);
      }
    };

    initKeycloak();

    // Keycloak event listeners
    keycloak.onAuthSuccess = () => {
      console.log("Authentication successful");
    };

    keycloak.onAuthLogout = () => {
      console.log("User logged out");
      setIsAuthenticated(false);
      setToken(null);
      setUserProfile(null);
    };
  }, []);

  const login = async () => {
    try {
      await keycloak.login();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await keycloak.logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateToken = async (minValidity: number): Promise<boolean> => {
    try {
      return await keycloak.updateToken(minValidity);
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        userProfile,
        login,
        logout,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
