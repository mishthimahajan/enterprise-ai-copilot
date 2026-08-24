"use client";

import {
  FolderGit2,
  GitBranch,
  Lock,
  Globe,
  Clock3,
  Eye,
  RefreshCcw,
  Trash2,
} from "lucide-react";

const repositories = [
  {
    id: 1,
    name: "enterprise-ai-copilot",
    owner: "OpenAI Team",
    branch: "main",
    visibility: "Private",
    lastSync: "5 min ago",
    status: "Indexed",
  },
  {
    id: 2,
    name: "employee-management-system",
    owner: "Development Team",
    branch: "dev",
    visibility: "Public",
    lastSync: "20 min ago",
    status: "Processing",
  },
];

export default function ConnectedRepositories() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

     

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Connected Repositories
          </h2>

          <p className="mt-2 text-slate-500">
            Manage repositories connected to the Enterprise AI Copilot.
          </p>

        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition">
          + Add Repository
        </button>

      </div>

    

      <div className="mt-8 space-y-6">

        {repositories.map((repo) => (

          <div
            key={repo.id}
            className="rounded-2xl border p-6 hover:shadow-md transition"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                  <FolderGit2 className="h-7 w-7 text-blue-600" />
                </div>

                <div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {repo.name}
                  </h3>

                  <p className="text-slate-500">
                    Owner: {repo.owner}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">

                    <div className="flex items-center gap-2">

                      <GitBranch
                        size={16}
                        className="text-blue-600"
                      />

                      {repo.branch}

                    </div>

                    <div className="flex items-center gap-2">

                      {repo.visibility === "Private" ? (
                        <Lock
                          size={16}
                          className="text-red-500"
                        />
                      ) : (
                        <Globe
                          size={16}
                          className="text-green-500"
                        />
                      )}

                      {repo.visibility}

                    </div>

                    <div className="flex items-center gap-2">

                      <Clock3
                        size={16}
                        className="text-orange-500"
                      />

                      {repo.lastSync}

                    </div>

                  </div>

                </div>

              </div>

             

              <div className="flex flex-col items-end gap-4">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    repo.status === "Indexed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {repo.status}
                </span>

                <div className="flex gap-3">

                  <button className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-100">

                    <Eye size={18} />

                    View

                  </button>

                  <button className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-100">

                    <RefreshCcw size={18} />

                    Re-index

                  </button>

                  <button className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600">

                    <Trash2 size={18} />

                    Remove

                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}