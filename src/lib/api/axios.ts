import axios from "axios";
import { envVars } from "@/config";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "../routes";
import { parseErrorToString } from "../helpers/formatError";
import { showErrorToast } from "@/components/common/ToastMessages";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const api = axios.create({
  baseURL: envVars.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicEndpoints = ["/auth/login", "/auth/refresh"];

api.interceptors.request.use(
  async (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );
    if (!isPublicEndpoint) {
      const session = await getSession();
      const accessToken = session?.user?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isPublic = publicEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint),
    );

    if (error?.response?.status === 401 && !isPublic && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        const refreshToken = session?.user?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post(routes.api.auth.refreshAuthTokens, {
          refreshToken,
        });

        const { token: newAccessToken } = response.data;

        refreshSubscribers.forEach((callback) => callback(newAccessToken));
        refreshSubscribers = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        showErrorToast("Your session has expired. Please sign in again.");

        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        try {
          await signOut({ redirect: false });
          if (typeof window !== "undefined") {
            window.location.href = routes.ui.signIn;
          } else {
            redirect(routes.ui.signIn);
          }
        } catch (logoutError) {
          console.error("Error during forced logout:", logoutError);
          showErrorToast("Error during logout.");
        }

        return Promise.reject(refreshError);
      }
    } else if (error?.response?.status === 401 && isPublic) {
      const parsedMessage = parseErrorToString(
        error?.response?.data || error?.message || "Authentication failed",
      );
      showErrorToast(parsedMessage);
    } else {
      const parsedMessage = parseErrorToString(
        error?.response?.data || error?.message || "Something went wrong",
      );
      showErrorToast(parsedMessage);

      if (error.response) {
        console.log("Response Error:", error.response.data);
      } else if (error.request) {
        console.log("Request Error:", error.request);
      } else {
        console.log("Error:", error.message);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
