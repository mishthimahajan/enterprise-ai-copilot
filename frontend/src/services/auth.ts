// import axios from "axios";

// import {
//   LoginRequest,
//   RegisterRequest,
//   AuthResponse,
// } from "@/types/auth";


// const API = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// export const login = async (
//   data: LoginRequest
// ): Promise<AuthResponse> => {

//   const response = await API.post(
//     "/login",
//     data
//   );

//   if (typeof window !== "undefined") {
//     localStorage.setItem(
//       "token",
//       response.data.access_token
//     );
//   }

//   return response.data;
// };


// export const register = async (
//   data: RegisterRequest
// ) => {

//   const response = await API.post(
//     "/register",
//     data
//   );

//   return response.data;
// };


// export const logout = () => {

//   if (typeof window !== "undefined") {
//     localStorage.removeItem("token");
//   }
// };


// export const getToken = () => {

//   if (typeof window === "undefined") {
//     return null;
//   }

//   return localStorage.getItem("token");
// };


// export const isAuthenticated = () => {

//   if (typeof window === "undefined") {
//     return false;
//   }

//   return !!localStorage.getItem("token");
// };


// export default API;


import API from "./api";


export interface RegisterData {
  name: string;
  email: string;
  agent_id: string;
  password: string;
  role: string;
}


export interface LoginData {
  email: string;
  password: string;
}


export interface AuthResponse {
  access_token?: string;
  token?: string;
  token_type?: string;

  user?: {
    user_id?: string;
    name?: string;
    email?: string;
    agent_id?: string;
    role?: string;
  };

  message?: string;
}


export async function registerUser(
  data: RegisterData
): Promise<AuthResponse> {
  try {
    const response =
      await API.post<AuthResponse>(
        "/register",
        data
      );

    return response.data;

  } catch (error: any) {

    const detail =
      error.response?.data?.detail;

    if (
      typeof detail === "string"
    ) {
      throw new Error(detail);
    }

    throw new Error(
      "Registration failed."
    );
  }
}


export async function loginUser(
  data: LoginData
): Promise<AuthResponse> {
  try {
    const response =
      await API.post<AuthResponse>(
        "/login",
        data
      );

    const result =
      response.data;


    const token =
      result.access_token ||
      result.token;


    if (!token) {
      throw new Error(
        "Authentication token was not returned."
      );
    }


    localStorage.setItem(
      "access_token",
      token
    );


    return result;

  } catch (error: any) {

    const detail =
      error.response?.data?.detail;

    if (
      typeof detail === "string"
    ) {
      throw new Error(detail);
    }

    throw new Error(
      error.message ||
      "Login failed."
    );
  }
}


export function logoutUser() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "selected_agent_id"
  );
}


export function getToken():
  string | null {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "token"
  );
}


export function isAuthenticated():
  boolean {

  return Boolean(
    getToken()
  );
}