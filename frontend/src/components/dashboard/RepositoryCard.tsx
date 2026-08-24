"use client";

import {
  FolderGit2,
  GitBranch,
  ShieldCheck,
  Clock3,
  RefreshCcw,
  ExternalLink,
} from "lucide-react";

type Repository = {
  name: string;
  branch: string;
  visibility: string;
  last_sync: string;
  files_indexed: number;
  indexing_completed: number;
  ai_status: string;
  html_url?: string;
};

type Props = {
  repository: Repository | null;
};

export default function RepositoryCard({
  repository,
}: Props) {
  if (!repository) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm border">
        <h2 className="text-2xl font-bold">
          Connected Repository
        </h2>

        <p className="mt-4 text-slate-500">
          No repository connected yet.
        </p>

        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
          Connect Repository
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <FolderGit2 className="h-7 w-7 text-blue-600" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Connected Repository
            </h2>

            <p className="text-slate-500">
              Enterprise AI analyzes this repository.
            </p>

          </div>

        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition">
          Connect New Repository
        </button>

      </div>

      

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            Repository
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {repository.name}
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <GitBranch
              size={18}
              className="text-blue-600"
            />

            <span className="text-sm text-slate-500">
              Branch
            </span>

          </div>

          <h3 className="mt-2 font-semibold text-slate-900">
            {repository.branch}
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={18}
              className="text-green-600"
            />

            <span className="text-sm text-slate-500">
              Visibility
            </span>

          </div>

          <h3 className="mt-2 font-semibold text-green-600">
            {repository.visibility}
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-50 p-5">

          <div className="flex items-center gap-2">

            <Clock3
              size={18}
              className="text-orange-500"
            />

            <span className="text-sm text-slate-500">
              Last Sync
            </span>

          </div>

          <h3 className="mt-2 font-semibold text-slate-900">
            {repository.last_sync}
          </h3>

        </div>

      </div>


      <div className="mt-8 grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border p-6">

          <h2 className="text-3xl font-bold text-blue-600">
            {repository.files_indexed}
          </h2>

          <p className="mt-2 text-slate-500">
            Files Indexed
          </p>

        </div>

        <div className="rounded-2xl border p-6">

          <h2 className="text-3xl font-bold text-green-600">
            {repository.indexing_completed}%
          </h2>

          <p className="mt-2 text-slate-500">
            Indexing Completed
          </p>

        </div>

        <div className="rounded-2xl border p-6">

          <h2 className="text-3xl font-bold text-purple-600">
            {repository.ai_status}
          </h2>

          <p className="mt-2 text-slate-500">
            AI Status
          </p>

        </div>

      </div>

      

      <div className="mt-8 flex gap-4">

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">

          <RefreshCcw size={18} />

          Sync Repository

        </button>

        <a
          href={repository.html_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border px-5 py-3 font-medium hover:bg-slate-100"
        >

          <ExternalLink size={18} />

          Open Repository

        </a>

      </div>

    </div>
  );
}