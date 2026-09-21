

"use client";

import { useState } from "react";

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
  const [loading, setLoading] =
    useState(false);

  

  const loginUser = async (
    data: LoginData
  ): Promise<LoginResponse> => {
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

      const token =
        response.data.access_token;

      if (!token) {
        throw new Error(
          "Access token not returned by backend."
        );
      }

      if (
        typeof window !==
        "undefined"
      ) {
        
        window.localStorage.removeItem(
          "selected_agent_id"
        );

        window.localStorage.removeItem(
          "selected_document_id"
        );

        window.localStorage.removeItem(
          "selected_repository_id"
        );

        
        window.localStorage.setItem(
          "access_token",
          token
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      const detail =
        error?.response?.data?.detail;

      let message =
        "Unable to sign in. Please check your credentials.";

      if (
        typeof detail === "string"
      ) {
        message = detail;
      } else if (
        error?.message
      ) {
        message =
          error.message;
      }

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  

  const logoutUser = () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    window.localStorage.removeItem(
      "access_token"
    );

    window.localStorage.removeItem(
      "selected_agent_id"
    );

    window.localStorage.removeItem(
      "selected_document_id"
    );

    window.localStorage.removeItem(
      "selected_repository_id"
    );
  };

 

  const getToken = ():
    string | null => {
    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    return window.localStorage.getItem(
      "access_token"
    );
  };

  

  const isLoggedIn = () => {
    return Boolean(
      getToken()
    );
  };

  return {
    loginUser,
    logoutUser,
    getToken,
    isLoggedIn,
    loading,
  };
}