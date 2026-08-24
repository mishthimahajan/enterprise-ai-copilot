"use client";

import {
  FileText,
  Database,
  Brain,
  Clock3,
} from "lucide-react";

const stats = [
  {
    title: "Documents Uploaded",
    value: "24",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Indexed Documents",
    value: "22",
    icon: Database,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "AI Knowledge Chunks",
    value: "5,842",
    icon: Brain,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Last Upload",
    value: "Today",
    icon: Clock3,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DocumentStats() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Documentation Statistics
        </h2>

        <p className="mt-2 text-slate-500">
          Overview of uploaded and indexed documentation.
        </p>

      </div>

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

      <div className="mt-10 rounded-2xl bg-slate-50 p-6">

        <div className="flex items-center justify-between">

          <span className="font-medium text-slate-700">
            Indexing Progress
          </span>

          <span className="font-semibold text-blue-600">
            92%
          </span>

        </div>

        <div className="mt-3 h-3 w-full rounded-full bg-slate-200">

          <div className="h-3 w-[92%] rounded-full bg-blue-600"></div>

        </div>

      </div>

    </div>
  );
}