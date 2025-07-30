import { envVars } from "@/config";
import api from "../api/axios";
import { routes } from "../routes";
import { SignInFormData } from "../types/auth/types";

export async function signIn(data: SignInFormData) {
  try {
    const response = await api.post(routes.api.auth.logIn, data);
    if (response.data) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

// using axios because our centeral ../api/axios, by default adds access token, but we need refresh one
export async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${envVars.apiBaseUrl}${routes.api.auth.refreshAuthTokens}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get refresh token");
    }

    const refreshedTokens = await response.json();

    console.log('new refreshedTokens', refreshedTokens)

    return {
      ...token,
      accessToken: refreshedTokens.token,
      refreshToken: refreshedTokens.refreshToken,
      tokenExpires: refreshedTokens.tokenExpires,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
