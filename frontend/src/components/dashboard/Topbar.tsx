"use client";

import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

type Props = {
  user?: {
    name: string;
    role: string;
    agent_id: string;
  };
};

export default function Topbar({
  user,
}: Props) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">

      {/* Search */}

      <div className="relative w-full max-w-md">

        <Search
          className="absolute left-4 top-3.5 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search repositories, documents..."
          className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-500"
        />

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell
            size={22}
            className="text-slate-600"
          />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

        </button>

        <div className="flex items-center gap-3">

          <UserCircle2
            className="text-blue-600"
            size={42}
          />

          <div>

            <h3 className="font-semibold text-slate-900">
              {user?.name || "Guest User"}
            </h3>

            <p className="text-sm text-slate-500">
              {user?.role || "User"}
            </p>

            <p className="text-xs text-slate-400">
              {user?.agent_id || ""}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}