"use client";

import { useState } from "react";
import {
  FolderGit2,
  Link2,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function GitHubConnectionCard() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);

    // Backend API will be connected later
    setTimeout(() => {
      setLoading(false);
      alert("Repository Connected Successfully!");
    }, 2000);
  };

  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">

     

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <FolderGit2 className="h-7 w-7 text-blue-600" />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Connect GitHub Repository
          </h2>

          <p className="text-slate-500">
            Connect a GitHub repository so the AI can analyze your codebase.
          </p>

        </div>

      </div>


      <div className="mt-8">

        <label className="font-medium text-slate-700">
          Repository URL
        </label>

        <div className="mt-2 flex items-center rounded-xl border px-4">

          <Link2 className="text-slate-400" size={20} />

          <input
            type="text"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

      </div>

     

      <div className="mt-6">

        <label className="font-medium text-slate-700">
          GitHub Personal Access Token
          <span className="ml-2 text-sm text-slate-400">
            (Optional)
          </span>
        </label>

        <div className="mt-2 flex items-center rounded-xl border px-4">

          <KeyRound className="text-slate-400" size={20} />

          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxx"
            className="w-full bg-transparent px-3 py-4 outline-none"
          />

        </div>

      </div>

     

      <div className="mt-8 rounded-2xl bg-slate-50 p-5">

        <h3 className="font-semibold text-slate-900">
          Before Connecting
        </h3>

        <ul className="mt-4 space-y-3 text-sm text-slate-600">

          <li>✓ Repository must exist.</li>

          <li>✓ You must have repository access.</li>

          <li>✓ Public repositories don't require a token.</li>

          <li>✓ Private repositories require a Personal Access Token.</li>

        </ul>

      </div>

      

      <button
        onClick={handleConnect}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-5 w-5" />
            Connect Repository
          </>
        )}
      </button>

    </div>
  );
}