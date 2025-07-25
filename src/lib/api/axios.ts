import axios from "axios";
import { envVars } from "@/config";
import { getSession } from "next-auth/react";

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
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Response Error:", error.response.data);
    } else if (error.request) {
      console.log("Request Error:", error.request);
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
