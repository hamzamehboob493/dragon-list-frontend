import axios from "axios";
import { envVars } from "@/config";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { routes } from "../routes";
import { parseErrorToString } from "../helpers/formatError";
import { showErrorToast } from "@/components/common/ToastMessages";

const api = axios.create({
  baseURL: envVars.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicEndpoints = ["/auth/login"];

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
    const isPublic = publicEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint),
    );

    if (error?.response?.status === 401 && !isPublic) {
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        await signOut({ redirect: false });
        redirect(routes.ui.signIn);
      } catch (logoutError) {
        console.error("Error during forced logout:", logoutError);
        showErrorToast("Error during logout.");
      }
    } else {
      const parsedMessage = parseErrorToString(
        error?.response?.data || error?.message || "Something went wrong"
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
