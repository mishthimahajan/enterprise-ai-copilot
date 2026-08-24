"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, BadgeCheck } from "lucide-react";
import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import useAuth from "@/hooks/useAuth";

export default function RegisterForm() {
  const { registerUser, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    agent_id: "",
    password: "",
    confirm_password: "",
    role: "Developer",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await registerUser(form);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create Account"
        subtitle="Register to access Enterprise AI"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        

        <div>
          <label className="text-sm font-medium">
            Full Name
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <User
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-4 outline-none bg-transparent"
            />
          </div>
        </div>

        

        <div>
          <label className="text-sm font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <Mail
              size={18}
              className="text-slate-400"
            />

            <input
              type="email"
              name="email"
              placeholder="john@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-4 outline-none bg-transparent"
            />
          </div>
        </div>

        

        <div>
          <label className="text-sm font-medium">
            Agent ID
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <BadgeCheck
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              name="agent_id"
              placeholder="EMP001"
              value={form.agent_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-4 outline-none bg-transparent"
            />
          </div>
        </div>

        
        <div>
          <label className="text-sm font-medium">
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border px-4 py-4 outline-none"
          >
            <option>Developer</option>
            <option>Manager</option>
            <option>HR</option>
            <option>Admin</option>
          </select>
        </div>

        

        <div>
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <Lock
              size={18}
              className="text-slate-400"
            />

            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-4 outline-none bg-transparent"
            />
          </div>
        </div>

        

        <div>
          <label className="text-sm font-medium">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <Lock
              size={18}
              className="text-slate-400"
            />

            <input
              type="password"
              name="confirm_password"
              placeholder="********"
              value={form.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-4 outline-none bg-transparent"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white hover:bg-blue-700 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}