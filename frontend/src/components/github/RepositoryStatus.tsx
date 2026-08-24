"use client";

import {
  CheckCircle2,
  Loader2,
  Database,
  FolderGit2,
  Brain,
} from "lucide-react";

export default function RepositoryStatus() {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

   

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Repository Status
        </h2>

        <p className="mt-2 text-slate-500">
          Current progress of repository analysis and indexing.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

      

        <div className="rounded-2xl border p-6">

          <div className="flex items-center gap-3">

            <FolderGit2 className="h-10 w-10 rounded-xl bg-blue-100 p-2 text-blue-600" />

            <div>

              <h3 className="font-semibold">
                GitHub Connected
              </h3>

              <p className="text-sm text-green-600">
                Connected
              </p>

            </div>

          </div>

        </div>

        

        <div className="rounded-2xl border p-6">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-10 w-10 rounded-xl bg-green-100 p-2 text-green-600" />

            <div>

              <h3 className="font-semibold">
                Repository Cloned
              </h3>

              <p className="text-sm text-green-600">
                Completed
              </p>

            </div>

          </div>

        </div>

       

        <div className="rounded-2xl border p-6">

          <div className="flex items-center gap-3">

            <Brain className="h-10 w-10 rounded-xl bg-purple-100 p-2 text-purple-600" />

            <div>

              <h3 className="font-semibold">
                Embeddings
              </h3>

              <p className="text-sm text-orange-600">
                Generating...
              </p>

            </div>

          </div>

        </div>

        

        <div className="rounded-2xl border p-6">

          <div className="flex items-center gap-3">

            <Database className="h-10 w-10 rounded-xl bg-orange-100 p-2 text-orange-600" />

            <div>

              <h3 className="font-semibold">
                Vector Database
              </h3>

              <p className="text-sm text-slate-600">
                Waiting...
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Progress */}

      <div className="mt-10">

        <div className="mb-2 flex justify-between">

          <span className="font-medium text-slate-700">
            Indexing Progress
          </span>

          <span className="text-blue-600 font-semibold">
            68%
          </span>

        </div>

        <div className="h-3 w-full rounded-full bg-slate-200">

          <div className="h-3 w-2/3 rounded-full bg-blue-600"></div>

        </div>

      </div>

      {/* Processing Steps */}

      <div className="mt-8 space-y-4">

        <div className="flex items-center gap-3">

          <CheckCircle2 className="text-green-600" size={20} />

          <span>Repository validated successfully</span>

        </div>

        <div className="flex items-center gap-3">

          <CheckCircle2 className="text-green-600" size={20} />

          <span>Repository cloned successfully</span>

        </div>

        <div className="flex items-center gap-3">

          <Loader2
            className="animate-spin text-blue-600"
            size={20}
          />

          <span>Generating vector embeddings...</span>

        </div>

        <div className="flex items-center gap-3 text-slate-400">

          <Database size={20} />

          <span>Uploading vectors to Qdrant...</span>

        </div>

      </div>

    </div>
  );
}