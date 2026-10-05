import axios from "axios";
import { createClient } from "@/lib/supabase/client";

const api = axios.create({
  timeout: 10000,
});

let accessToken: string | null = null;
const client = createClient();

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

api.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      try {
        const { data } = await client.auth.getSession();
        accessToken = data.session?.access_token || null;
      } catch (e) {
        console.error(e);
      }
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onAccessTokenFetched(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data, error: refreshError } = await client.auth.refreshSession();
        if (refreshError) throw refreshError;
        const newAccessToken = data.session?.access_token;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          isRefreshing = false;
          onAccessTokenFetched(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
        throw new Error("No new access token");
      } catch (refreshError: unknown) {
        isRefreshing = false;
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
