import Keycloak, { KeycloakPkceMethod } from "keycloak-js";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const authority = import.meta.env.VITE_KEYCLOAK_URL;
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

// Define types for Keycloak configuration and initialization options
interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

interface KeycloakInitOptions {
  checkLoginIframe?: boolean;
  pkceMethod?: KeycloakPkceMethod;
  onLoad?: "check-sso" | "login-required";
}

// Keycloak instance configuration
const keycloakConfig: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const userManager = new UserManager({
  authority,
  client_id: clientId,
  redirect_uri: `${window.location.origin}`,
  post_logout_redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  monitorSession: true, // this allows cross tab login/logout detection
});

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, `${window.location.origin}/`);
};

// Validate environment variables
if (!keycloakConfig.url || !keycloakConfig.realm || !keycloakConfig.clientId) {
  throw new Error("Missing Keycloak configuration in environment variables.");
}

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

// Keycloak initialization options
const initOptions: KeycloakInitOptions = {
  checkLoginIframe: false, // Disable iframe checking for better security
  pkceMethod: "S256", // Use PKCE for enhanced security
  onLoad: "check-sso", // Check SSO status on load
};

// Keycloak event listeners
keycloak.onAuthSuccess = () => {
  console.log("Authentication successful");
};

keycloak.onAuthError = (error) => {
  console.error("Authentication error:", error);
};

keycloak.onAuthRefreshSuccess = () => {
  console.log("Token refresh successful");
};

keycloak.onAuthRefreshError = () => {
  console.error("Token refresh failed");
};

keycloak.onAuthLogout = () => {
  console.log("User logged out");
};

keycloak.onTokenExpired = () => {
  console.log("Token expired");
};

// Export Keycloak instance and initialization options
export { keycloak, initOptions, userManager, onSigninCallback };
