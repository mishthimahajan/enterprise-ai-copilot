"use client";

import {
  Brain,
  Code2,
  Lightbulb,
  Star,
  FileCode2,
  ArrowRight,
} from "lucide-react";

export default function RepositoryInsights() {
  return (
    <div className="space-y-6">

      {/* AI Summary */}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              AI Repository Summary
            </h2>

            <p className="text-sm text-slate-500">
              Generated after indexing.
            </p>

          </div>

        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">
          This repository is a full-stack application built with
          Next.js and FastAPI. It contains authentication,
          repository indexing, GitHub integration, vector search,
          and AI-powered code understanding.
        </p>

      </div>

      {/* Languages */}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <Code2 className="text-purple-600" />

          <h2 className="text-lg font-semibold">
            Languages
          </h2>

        </div>

        <div className="mt-5 flex flex-wrap gap-3">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            TypeScript
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            Python
          </span>

          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
            JavaScript
          </span>

        </div>

      </div>

      {/* Frameworks */}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <Star className="text-orange-500" />

          <h2 className="text-lg font-semibold">
            Frameworks
          </h2>

        </div>

        <div className="mt-5 space-y-3">

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            Next.js
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            FastAPI
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            Tailwind CSS
          </div>

        </div>

      </div>

      {/* Important Files */}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <FileCode2 className="text-blue-600" />

          <h2 className="text-lg font-semibold">
            Important Files
          </h2>

        </div>

        <div className="mt-5 space-y-3">

          <div className="flex items-center justify-between rounded-xl border p-3">

            <span>README.md</span>

            <ArrowRight size={18} />

          </div>

          <div className="flex items-center justify-between rounded-xl border p-3">

            <span>package.json</span>

            <ArrowRight size={18} />

          </div>

          <div className="flex items-center justify-between rounded-xl border p-3">

            <span>requirements.txt</span>

            <ArrowRight size={18} />

          </div>

        </div>

      </div>

      {/* AI Suggestions */}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <Lightbulb className="text-yellow-500" />

          <h2 className="text-lg font-semibold">
            AI Suggestions
          </h2>

        </div>

        <ul className="mt-5 space-y-3 text-sm text-slate-600">

          <li>• Improve API documentation.</li>

          <li>• Add unit tests for authentication.</li>

          <li>• Optimize database queries.</li>

          <li>• Add error handling for GitHub API failures.</li>

        </ul>

      </div>

    </div>
  );
}