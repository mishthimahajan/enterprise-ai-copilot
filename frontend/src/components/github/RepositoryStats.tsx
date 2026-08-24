"use client";

import {
  Files,
  FileCode2,
  Brain,
  MessageSquare,
  Clock3,
  GitBranch,
} from "lucide-react";

const stats = [
  {
    title: "Total Files",
    value: "1,248",
    icon: Files,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Indexed Files",
    value: "1,210",
    icon: FileCode2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Vector Embeddings",
    value: "18,562",
    icon: Brain,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "AI Questions",
    value: "248",
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function RepositoryStats() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Repository Statistics
        </h2>

        <p className="mt-2 text-slate-500">
          Overview of the connected repository and AI indexing progress.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border p-6 transition hover:shadow-md"
            >

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="mt-5 text-3xl font-bold text-slate-900">
                {stat.value}
              </h3>

              <p className="mt-2 text-slate-500">
                {stat.title}
              </p>

            </div>
          );
        })}

      </div>

      

      <div className="mt-10 grid gap-6 md:grid-cols-2">

       

        <div className="rounded-2xl bg-slate-50 p-6">

          <div className="flex items-center gap-3">

            <Clock3 className="text-blue-600" size={24} />

            <div>

              <h3 className="font-semibold text-slate-900">
                Last Synchronization
              </h3>

              <p className="text-slate-500">
                Today • 10:42 AM
              </p>

            </div>

          </div>

        </div>

       

        <div className="rounded-2xl bg-slate-50 p-6">

          <div className="flex items-center gap-3">

            <GitBranch className="text-green-600" size={24} />

            <div>

              <h3 className="font-semibold text-slate-900">
                Active Branch
              </h3>

              <p className="text-slate-500">
                main
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}