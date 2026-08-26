
"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";

import {
  registerUser,
} from "@/services/auth";


export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    agent_id: "",
    role: "developer",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [popup, setPopup] =
    useState<{
      type: "success" | "error";
      message: string;
    } | null>(null);


  function handleChange(
    event:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
      >
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  function showPopup(
    type: "success" | "error",
    message: string
  ) {
    setPopup({
      type,
      message,
    });

    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.agent_id.trim() ||
      !form.password.trim()
    ) {
      const message =
        "Please fill all required fields.";

      setError(message);
      showPopup(
        "error",
        message
      );

      return;
    }


    if (
      form.password !==
      form.confirmPassword
    ) {
      const message =
        "Passwords do not match.";

      setError(message);

      showPopup(
        "error",
        message
      );

      return;
    }


    if (
      form.password.length < 6
    ) {
      const message =
        "Password must be at least 6 characters.";

      setError(message);

      showPopup(
        "error",
        message
      );

      return;
    }


    try {
      setLoading(true);

      await registerUser({
        name: form.name.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        agent_id:
          form.agent_id.trim(),

        role:
          form.role,

        password:
          form.password,
      });


      const message =
        "Registration successful! Redirecting to login...";

      setSuccess(message);

      showPopup(
        "success",
        message
      );


      setForm({
        name: "",
        email: "",
        agent_id: "",
        role: "developer",
        password: "",
        confirmPassword: "",
      });


      setTimeout(() => {
        router.push(
          "/login"
        );
      }, 1800);

    } catch (error: any) {

      console.error(
        "REGISTER FORM ERROR:",
        error
      );

      const message =
        error.message ||
        "Registration failed.";

      setError(message);

      showPopup(
        "error",
        message
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      {/* POPUP */}

      {popup && (
        <div className="fixed right-5 top-5 z-[9999]">

          <div
            className={
              popup.type === "success"
                ? "flex min-w-[320px] items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"
                : "flex min-w-[320px] items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-xl"
            }
          >

            {popup.type ===
            "success" ? (
              <CheckCircle2
                size={24}
                className="text-green-600"
              />
            ) : (
              <XCircle
                size={24}
                className="text-red-600"
              />
            )}


            <div className="flex-1">

              <p
                className={
                  popup.type ===
                  "success"
                    ? "font-semibold text-green-700"
                    : "font-semibold text-red-700"
                }
              >
                {popup.type ===
                "success"
                  ? "Success"
                  : "Error"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {popup.message}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setPopup(null)
              }
              className="text-xl text-slate-400 hover:text-slate-700"
            >
              ×
            </button>

          </div>

        </div>
      )}


      <AuthCard>

        <AuthHeader
          title="Create Account"
          subtitle="Register to access Enterprise AI Copilot"
        />


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* NAME */}

          <div>

            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Enter your name"
                disabled={loading}
                autoComplete="name"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* AGENT ID */}

          <div>

            <label
              htmlFor="agent_id"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Agent ID
            </label>

            <div className="relative">

              <BadgeCheck
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="agent_id"
                name="agent_id"
                type="text"
                value={
                  form.agent_id
                }
                onChange={
                  handleChange
                }
                placeholder="EMP001"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* ROLE */}

          <div>

            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={
                handleChange
              }
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="developer">
                Developer
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="member">
                Member
              </option>
            </select>

          </div>


          {/* PASSWORD */}

          <div>

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                name="password"
                type="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter password"
                disabled={loading}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div>

            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={
                  form.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Confirm password"
                disabled={loading}
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* INLINE ERROR */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* INLINE SUCCESS */}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>


          <p className="text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>

          </p>

        </form>

      </AuthCard>
    </>
  );
}

