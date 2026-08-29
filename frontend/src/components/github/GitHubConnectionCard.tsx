"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Code2,
  GitBranch,
  Link2,
} from "lucide-react";

import {
  connectRepository,
} from "@/services/github";


interface GitHubConnectionCardProps {
  agentId: string;

  onConnected:
    () => Promise<void>
    | void;
}


export default function GitHubConnectionCard({
  agentId,
  onConnected,
}: GitHubConnectionCardProps) {

  const [
    repoUrl,
    setRepoUrl,
  ] = useState("");


  const [
    branch,
    setBranch,
  ] = useState(
    "main"
  );


  const [
    githubToken,
    setGithubToken,
  ] = useState("");


  const [
    connecting,
    setConnecting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // =========================================================
  // CONNECT
  // =========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    setError("");
    setSuccess("");


    if (!agentId) {

      setError(
        "Please select an agent first."
      );

      return;
    }


    if (!repoUrl.trim()) {

      setError(
        "GitHub repository URL is required."
      );

      return;
    }


    if (!branch.trim()) {

      setError(
        "Branch name is required."
      );

      return;
    }


    try {

      setConnecting(true);


      const response =
        await connectRepository({

          agent_id:
            agentId,

          repo_url:
            repoUrl.trim(),

          branch:
            branch.trim(),

          github_token:
            githubToken.trim()
              ? githubToken.trim()
              : null,

        });


      setSuccess(
        response.message ||
          "Repository connected successfully."
      );


      setRepoUrl("");
      setGithubToken("");


      await onConnected();


    } catch (err: any) {

      console.error(
        "CONNECT REPOSITORY ERROR:",
        err
      );


      setError(
        err.message ||
          "Failed to connect repository."
      );


    } finally {

      setConnecting(false);

    }
  }


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">

          <Code2
            size={24}
          />

        </div>


        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Connect GitHub Repository
          </h2>


          <p className="mt-1 text-sm text-slate-500">
            Connect a public repository or provide
            a GitHub token for a private repository.
          </p>

        </div>

      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 space-y-5"
      >


        {/* REPOSITORY URL */}

        <div>

          <label className="text-sm font-medium text-slate-700">
            Repository URL
          </label>


          <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-4">

            <Link2
              size={18}
              className="text-slate-400"
            />


            <input
              type="text"
              value={
                repoUrl
              }
              onChange={(e) =>
                setRepoUrl(
                  e.target.value
                )
              }
              placeholder="https://github.com/owner/repository.git"
              className="w-full bg-transparent px-3 py-3 outline-none"
            />

          </div>

        </div>


        {/* BRANCH */}

        <div>

          <label className="text-sm font-medium text-slate-700">
            Branch
          </label>


          <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-4">

            <GitBranch
              size={18}
              className="text-slate-400"
            />


            <input
              type="text"
              value={
                branch
              }
              onChange={(e) =>
                setBranch(
                  e.target.value
                )
              }
              placeholder="main"
              className="w-full bg-transparent px-3 py-3 outline-none"
            />

          </div>

        </div>


        {/* TOKEN */}

        <div>

          <label className="text-sm font-medium text-slate-700">
            GitHub Token
            <span className="ml-2 font-normal text-slate-400">
              Optional
            </span>
          </label>


          <input
            type="password"
            value={
              githubToken
            }
            onChange={(e) =>
              setGithubToken(
                e.target.value
              )
            }
            placeholder="Required only for private repositories"
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />


          <p className="mt-2 text-xs text-slate-400">
            Do not enter a token for public repositories.
          </p>

        </div>


        {/* ERRORS */}

        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>

        )}


        {success && (

          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>

        )}


        {/* BUTTON */}

        <button
          type="submit"
          disabled={
            connecting ||
            !agentId
          }
          className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {connecting
            ? "Cloning & Indexing Repository..."
            : "Connect Repository"}

        </button>


        {connecting && (

          <p className="text-center text-xs text-slate-500">
            Large repositories may take some time to clone,
            chunk, embed and index.
          </p>

        )}

      </form>

    </div>
  );
}