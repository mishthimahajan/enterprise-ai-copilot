"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  GitHubRepository,
} from "@/services/github";


interface RepositoryStatusProps {
  repositories:
    GitHubRepository[];

  loading:
    boolean;
}


export default function RepositoryStatus({
  repositories,
  loading,
}: RepositoryStatusProps) {

  if (loading) {

    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-900">
          Repository Status
        </h2>


        <p className="mt-3 text-slate-500">
          Loading repository status...
        </p>

      </div>
    );
  }


  const processing =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Processing"
    );


  const failed =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Failed"
    );


  const indexed =
    repositories.filter(
      (repo) =>
        repo.status ===
        "Indexed"
    );


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold text-slate-900">
        Repository Status
      </h2>


      <p className="mt-1 text-sm text-slate-500">
        Current indexing status for this agent.
      </p>


      <div className="mt-5 grid gap-4 md:grid-cols-3">


        {/* INDEXED */}

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={21}
              className="text-green-600"
            />


            <div>

              <p className="text-sm text-green-700">
                Indexed
              </p>


              <p className="text-2xl font-bold text-green-900">
                {indexed.length}
              </p>

            </div>

          </div>

        </div>


        {/* PROCESSING */}

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

          <div className="flex items-center gap-3">

            <Clock3
              size={21}
              className="text-yellow-600"
            />


            <div>

              <p className="text-sm text-yellow-700">
                Processing
              </p>


              <p className="text-2xl font-bold text-yellow-900">
                {processing.length}
              </p>

            </div>

          </div>

        </div>


        {/* FAILED */}

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="flex items-center gap-3">

            <XCircle
              size={21}
              className="text-red-600"
            />


            <div>

              <p className="text-sm text-red-700">
                Failed
              </p>


              <p className="text-2xl font-bold text-red-900">
                {failed.length}
              </p>

            </div>

          </div>

        </div>

      </div>


      {repositories.length === 0 && (

        <p className="mt-5 text-sm text-slate-500">
          No repository has been connected yet.
        </p>

      )}

    </div>
  );
}