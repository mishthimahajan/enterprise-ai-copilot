"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Lock,
  UserRound,
} from "lucide-react";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";

import useAuth from "@/hooks/useAuth";


export default function LoginForm() {

  const router = useRouter();
const searchParams = useSearchParams();

const redirect = searchParams.get("redirect") || "/dashboard";


  const {
    loginUser,
    loading,
  } = useAuth();


  const [
    agentId,
    setAgentId,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");





  useEffect(() => {

    const token =
      localStorage.getItem(
        "access_token"
      );


    
    if (token) {

      router.push(redirect);

    }

  }, [router]);





  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    try {

      await loginUser({

        agent_id:
          agentId.trim(),

        password:
          password,

      });

      /*
       * Your useAuth hook may already redirect
       * after successful login.
       *
       * If it DOES NOT redirect, uncomment:
       *
       * router.replace("/dashboard");
       */

    } catch (err: any) {

      alert(
        err.message ||
          "Login failed"
      );

    }

  };


  return (

    <AuthCard>

      <AuthHeader
        title="Enterprise AI"
        subtitle="Sign in using your Agent ID"
      />


      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >


        {/* AGENT ID */}

        <div>

          <label className="text-sm font-medium">
            Agent ID
          </label>


          <div className="mt-2 flex items-center rounded-xl border px-4">

            <UserRound
              className="text-slate-400"
              size={18}
            />


            <input
              type="text"
              placeholder="EMP001"
              value={
                agentId
              }
              onChange={(e) =>
                setAgentId(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-3 py-4 outline-none"
              required
            />

          </div>

        </div>


        {/* PASSWORD */}

        <div>

          <label className="text-sm font-medium">
            Password
          </label>


          <div className="mt-2 flex items-center rounded-xl border px-4">

            <Lock
              className="text-slate-400"
              size={18}
            />


            <input
              type="password"
              placeholder="********"
              value={
                password
              }
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-transparent px-3 py-4 outline-none"
              required
            />

          </div>

        </div>


        {/* REMEMBER / FORGOT PASSWORD */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm">

            <input
              type="checkbox"
            />

            Remember Me

          </label>


          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>


        {/* LOGIN BUTTON */}

        <button
          type="submit"
          disabled={
            loading
          }
          className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >

          {loading
            ? "Signing In..."
            : "Sign In"}

        </button>


        {/* REGISTER */}

        <p className="text-center text-sm text-slate-500">

          Don't have an account?{" "}

          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>

        </p>

      </form>

    </AuthCard>

  );
}