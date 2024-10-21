import Axios from "axios";

import { API_URL } from "@/config";
import { useNotificationStore } from "@/stores/notifications";
import storage from "@/utils/storage";
import { useAuth } from "@/stores/useAuth";

export const authAxios = Axios.create({
  baseURL: API_URL,
});

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = "application/json";
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await Axios.post(
          `${API_URL}/api-auth/v1/token/refresh/`,
          {
            refresh: storage.getRefreshToken(),
          }
        );
        storage.setAccessToken(data.access as string);
        originalRequest.headers.authorization = `Bearer ${data.access}`;
        return axios(originalRequest);
      } catch (error) {
        useAuth.getState().logout();
        return Promise.reject(error);
      }
    }

    const message = error.response?.data?.message || error.message;
    useNotificationStore.getState().addNotification({
      type: "error",
      title: "Error",
      message,
    });

    useAuth.getState().logout();
    return Promise.reject(error);
  }
);
