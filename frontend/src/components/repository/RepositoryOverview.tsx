"use client";

import {
  Files,
  FileCode2,
  Brain,
  HardDrive,
  Clock3,
  GitBranch,
  Code2,
  Activity,
} from "lucide-react";

const overview = [
  {
    title: "Total Files",
    value: "1,248",
    icon: Files,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Source Files",
    value: "986",
    icon: FileCode2,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "AI Chunks",
    value: "18,562",
    icon: Brain,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Repository Size",
    value: "245 MB",
    icon: HardDrive,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function RepositoryOverview() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

     

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Repository Overview
        </h2>

        <p className="mt-2 text-slate-500">
          Summary of your connected repository and indexing status.
        </p>

      </div>

      

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {overview.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border p-6 transition hover:shadow-lg"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="mt-5 text-3xl font-bold text-slate-900">
                {item.value}
              </h3>

              <p className="mt-2 text-slate-500">
                {item.title}
              </p>

            </div>
          );
        })}

      </div>

      {/* Repository Information */}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">

        {/* Left Card */}

        <div className="rounded-2xl bg-slate-50 p-6">

          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Repository Information
          </h3>

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Clock3 className="text-blue-600" />

                <span>Last Updated</span>

              </div>

              <span className="font-medium">
                Today, 10:42 AM
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <GitBranch className="text-green-600" />

                <span>Default Branch</span>

              </div>

              <span className="font-medium">
                main
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Code2 className="text-purple-600" />

                <span>Main Language</span>

              </div>

              <span className="font-medium">
                TypeScript
              </span>

            </div>

          </div>

        </div>

        {/* Right Card */}

        <div className="rounded-2xl bg-slate-50 p-6">

          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            AI Indexing Progress
          </h3>

          <div className="flex items-center gap-3">

            <Activity className="text-blue-600" />

            <span className="font-medium">
              92% Completed
            </span>

          </div>

          <div className="mt-6 h-4 rounded-full bg-slate-200">

            <div className="h-4 w-[92%] rounded-full bg-blue-600"></div>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Almost all files have been indexed successfully. AI is ready to
            answer repository-related questions.
          </p>

        </div>

      </div>

    </div>
  );
}