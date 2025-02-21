import { jwtDecode } from "jwt-decode";
/**
 * Decodes the JWT access token and extracts user details.
 * @param {Object} user - The user object from the authentication context, which can be undefined or null.
 * @returns {KeyClockUser|null} The decoded token with user details or null if no user or token.
 */
export const decodeUserToken = (
  user?: {
    access_token?: string;
  } | null
): KeyClockUser | null => {
  if (!user || !user.access_token) {
    return null;
  }

  try {
    const decodedToken: KeyClockUser = jwtDecode<KeyClockUser>(
      user.access_token
    );
    return decodedToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export interface KeyClockUser {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  allowed_origins: string[];
  realm_access: {
    roles: string[];
  };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  usergroups?: string[];
}
