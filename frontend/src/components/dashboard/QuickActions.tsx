"use client";

import {
  FolderGit2,
  Upload,
  Bot,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

const actions = [
  {
    title: "Connect Repository",
    description: "Connect a new GitHub repository.",
    icon: FolderGit2,
    color: "bg-blue-100 text-blue-600",
    route: "/repositories",
  },
  {
    title: "Upload Documents",
    description: "Upload PDFs, DOCX or Markdown files.",
    icon: Upload,
    color: "bg-green-100 text-green-600",
    route: "/documents",
  },
  {
    title: "Start AI Chat",
    description: "Ask questions about your codebase.",
    icon: Bot,
    color: "bg-purple-100 text-purple-600",
    route: "/chat",
  },
  {
    title: "Re-index Repository",
    description: "Update vector embeddings after new commits.",
    icon: RefreshCcw,
    color: "bg-orange-100 text-orange-600",
    route: "/repositories",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="text-slate-500">
          Frequently used actions for your repository
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => router.push(action.route)}
              className="group rounded-3xl border bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${action.color}`}
              >
                <Icon size={28} />
              </div>

              {/* Title */}
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {action.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {action.description}
              </p>

              {/* Open */}
              <div className="mt-6">
                <span className="text-sm font-medium text-blue-600 group-hover:underline">
                  Open →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}