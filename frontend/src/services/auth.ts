import axios from "axios";

import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth";


const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {

  const response = await API.post(
    "/login",
    data
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "token",
      response.data.access_token
    );
  }

  return response.data;
};


export const register = async (
  data: RegisterRequest
) => {

  const response = await API.post(
    "/register",
    data
  );

  return response.data;
};


export const logout = () => {

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};


export const getToken = () => {

  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};


export const isAuthenticated = () => {

  if (typeof window === "undefined") {
    return false;
  }

  return !!localStorage.getItem("token");
};


export default API;