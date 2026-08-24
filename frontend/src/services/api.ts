import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000",

  timeout: 120000,
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem(
          "access_token"
        );

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers[
        "Content-Type"
      ];
    } else {
      config.headers[
        "Content-Type"
      ] = "application/json";
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data
    );

    return Promise.reject(error);
  }
);

export default API;