"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";


interface LoginData {
  agent_id: string;
  password: string;
}


interface LoginResponse {
  access_token: string;
  token_type: string;
}


export default function useAuth() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // LOGIN
  // ==========================================

  const loginUser = async (
    data: LoginData
  ) => {

    try {

      setLoading(true);


      const response =
        await api.post<LoginResponse>(
          "/login",
          {
            agent_id:
              data.agent_id.trim(),

            password:
              data.password,
          }
        );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      const token =
        response.data.access_token;


      if (!token) {

        throw new Error(
          "Access token not returned by backend"
        );

      }


      // ========================================
      // SAVE JWT
      // ========================================

      localStorage.setItem(
        "access_token",
        token
      );


      console.log(
        "TOKEN SAVED:",
        localStorage.getItem(
          "access_token"
        )
          ? "YES"
          : "NO"
      );


      // Remove previously selected shared agent
      // so another user doesn't inherit it.

      localStorage.removeItem(
        "selected_agent_id"
      );


      // ========================================
      // REDIRECT
      // ========================================

      router.push(
        "/dashboard"
      );


      return response.data;


    } catch (error: any) {

      console.error(
        "LOGIN ERROR:",
        error
      );


      const message =
        error.response?.data?.detail ||
        error.message ||
        "Login failed";


      throw new Error(
        message
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logoutUser = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "selected_agent_id"
    );

    router.push(
      "/login"
    );

  };


  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {

    if (
      typeof window ===
      "undefined"
    ) {

      return null;

    }


    return localStorage.getItem(
      "access_token"
    );

  };


  return {

    loginUser,

    logoutUser,

    getToken,

    loading,

  };

}