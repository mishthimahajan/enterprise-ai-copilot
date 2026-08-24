"use client";

import {
  FolderGit2,
  GitBranch,
  Lock,
  Search,
  RefreshCcw,
  Settings,
} from "lucide-react";

export default function RepositoryHeader() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      

        <div className="flex items-center gap-5">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <FolderGit2 className="h-8 w-8 text-blue-600" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              enterprise-ai-copilot
            </h1>

            <p className="mt-2 text-slate-500">
              AI-powered Enterprise Code Intelligence Platform
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">

              <div className="flex items-center gap-2">

                <GitBranch
                  size={18}
                  className="text-blue-600"
                />

                <span>main</span>

              </div>

              <div className="flex items-center gap-2">

                <Lock
                  size={18}
                  className="text-red-500"
                />

                <span>Private Repository</span>

              </div>

            </div>

          </div>

        </div>

        

        <div className="flex flex-wrap gap-4">

          <button className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-slate-100">

            <RefreshCcw size={18} />

            Sync

          </button>

          <button className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-slate-100">

            <Settings size={18} />

            Settings

          </button>

        </div>

      </div>

      

      <div className="mt-8">

        <div className="flex items-center rounded-xl border bg-slate-50 px-4">

          <Search
            className="text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search files, folders, classes, functions..."
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

      </div>

    </div>
  );
}