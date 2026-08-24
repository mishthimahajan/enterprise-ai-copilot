"use client";

import { Sparkles } from "lucide-react";

type Props = {
  user?: {
    name: string;
    role: string;
    agent_id: string;
  };
};

export default function Welcome({ user }: Props) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";

  return (
    <section className="mb-8 rounded-3xl bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">

      <div className="flex items-center gap-3">

        <Sparkles size={28} />

        <div>

          <h1 className="text-3xl font-bold">
            {greeting},{" "}
            {user?.name || "Developer"} 👋
          </h1>

          <p className="mt-2 text-blue-100">
            Welcome back to Enterprise AI Operations Copilot.
          </p>

        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-blue-100">
            Agent ID
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {user?.agent_id || "--"}
          </h2>

        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-blue-100">
            Role
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {user?.role || "--"}
          </h2>

        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <p className="text-sm text-blue-100">
            Status
          </p>

          <h2 className="mt-2 text-xl font-semibold text-green-300">
            Online
          </h2>

        </div>

      </div>

    </section>
  );
}