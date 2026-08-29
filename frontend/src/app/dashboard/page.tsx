"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


import {
  Agent,
  getAgents,
} from "@/lib/agents";

import {
  DocumentItem,
  DocumentsResponse,
  getDocuments,
} from "@/lib/documents";

import { logoutUser } from "@/services/auth";


export default function DashboardPage() {
  const router =
    useRouter();


  const [
    agents,
    setAgents,
  ] = useState<Agent[]>([]);


  const [
    selectedAgentId,
    setSelectedAgentId,
  ] = useState("");


  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>([]);


  const [
    stats,
    setStats,
  ] = useState({
    total: 0,
    indexed: 0,
    chunks: 0,
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    agentLoading,
    setAgentLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  useEffect(() => {
    loadDashboard();
  }, []);


  // =========================================================
  // RESET CURRENT AGENT WORKSPACE
  // =========================================================

  function resetWorkspace() {
    setDocuments([]);

    setStats({
      total: 0,
      indexed: 0,
      chunks: 0,
    });

    // Important:
    // Documents/repositories belong to
    // the previously selected agent.
    localStorage.removeItem(
      "selected_document_id"
    );

    localStorage.removeItem(
      "selected_repository_id"
    );
  }


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  async function loadDashboard() {
    try {
      setLoading(true);

      setError("");
      setSuccess("");


      const token =
        localStorage.getItem(
          "access_token"
        );


      if (!token) {
        setError(
          "You are not logged in. Please login first."
        );

        return;
      }


      // Backend GET /agents/
      // now returns ALL shared agents.
      const agentData =
        await getAgents();


      console.log(
        "AVAILABLE SHARED AGENTS:",
        agentData
      );


      const availableAgents =
        Array.isArray(
          agentData
        )
          ? agentData
          : [];


      setAgents(
        availableAgents
      );


      // No agents in organization yet
      if (
        availableAgents.length === 0
      ) {
        localStorage.removeItem(
          "selected_agent_id"
        );

        setSelectedAgentId("");

        resetWorkspace();

        return;
      }


      /*
       * IMPORTANT:
       *
       * DO NOT automatically do:
       *
       * agentData[0].agent_id
       *
       * User must choose an agent.
       */


      const savedAgentId =
        localStorage.getItem(
          "selected_agent_id"
        );


      // Validate stored agent
      // against agents returned by backend.
      const validAgent =
        savedAgentId
          ? availableAgents.find(
              (agent) =>
                agent.agent_id ===
                savedAgentId
            )
          : undefined;


      if (!validAgent) {
        localStorage.removeItem(
          "selected_agent_id"
        );

        setSelectedAgentId("");

        resetWorkspace();

        return;
      }


      // Valid agent from current session
      setSelectedAgentId(
        validAgent.agent_id
      );


      await loadDocumentsForAgent(
        validAgent.agent_id
      );

    } catch (err: any) {
  console.error(
    "DASHBOARD ERROR:",
    err
  );

  const message =
    err.message ||
    "Failed to load dashboard.";

  if (
    message.toLowerCase().includes(
      "authentication"
    ) ||
    message.toLowerCase().includes(
      "unauthorized"
    ) ||
    message.toLowerCase().includes(
      "token"
    )
  ) {
    logoutUser();

    router.replace(
      "/login"
    );

    return;
  }

  setError(message);

} finally {
  setLoading(false);
}
  }


  // =========================================================
  // LOAD DOCUMENTS OF SELECTED AGENT
  // =========================================================

  async function loadDocumentsForAgent(
    agentId: string
  ) {
    if (!agentId) {
      resetWorkspace();
      return;
    }


    try {
      const data:
        DocumentsResponse =
        await getDocuments(
          agentId
        );


      console.log(
        "DOCUMENTS:",
        data
      );


      setDocuments(
        Array.isArray(
          data.documents
        )
          ? data.documents
          : []
      );


      setStats({
        total:
          data.total || 0,

        indexed:
          data.indexed || 0,

        chunks:
          data.chunks || 0,
      });

    } catch (err: any) {
      console.error(
        "FAILED TO LOAD DOCUMENTS:",
        err
      );


      resetWorkspace();


      throw err;
    }
  }


  // =========================================================
  // CHANGE ACTIVE AGENT
  // =========================================================

  async function handleAgentChange(
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) {
    const agentId =
      event.target.value;


    setError("");
    setSuccess("");


    /*
     * Clear everything from old agent
     * before switching.
     */
    resetWorkspace();


    setSelectedAgentId(
      agentId
    );


    // User selected placeholder
    if (!agentId) {
      localStorage.removeItem(
        "selected_agent_id"
      );

      return;
    }


    localStorage.setItem(
      "selected_agent_id",
      agentId
    );


    try {
      setAgentLoading(true);


      await loadDocumentsForAgent(
        agentId
      );


      const selected =
        agents.find(
          (agent) =>
            agent.agent_id ===
            agentId
        );


      setSuccess(
        selected
          ? `${selected.name} selected successfully.`
          : "Agent selected successfully."
      );

    } catch (err: any) {
      setError(
        err.message ||
          "Failed to load agent workspace."
      );

    } finally {
      setAgentLoading(false);
    }
  }


  // =========================================================
  // FORMAT FILE SIZE
  // =========================================================

  function formatFileSize(
    bytes: number
  ) {
    if (!bytes) {
      return "0 KB";
    }


    const kb =
      bytes / 1024;


    if (kb < 1024) {
      return `${kb.toFixed(
        1
      )} KB`;
    }


    return `${(
      kb / 1024
    ).toFixed(1)} MB`;
  }


  // =========================================================
  // CURRENT AGENT
  // =========================================================

  const selectedAgent =
    agents.find(
      (agent) =>
        agent.agent_id ===
        selectedAgentId
    );


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }


  // =========================================================
  // AUTH / INITIAL ERROR
  // =========================================================

  if (
    error &&
    agents.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">

        <div className="mx-auto max-w-5xl">

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>


          <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">

            <h2 className="font-semibold">
              Error
            </h2>


            <p className="mt-2">
              {error}
            </p>


            <button
  type="button"
  onClick={() => {
    logoutUser();
    router.replace("/login");
  }}
  className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white"
>
  Go to Login
</button>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // ZERO AGENTS EXIST
  // =========================================================

  if (
    agents.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">

        <div className="mx-auto max-w-5xl">

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>


          <p className="mt-2 text-slate-500">
            Enterprise AI knowledge workspace
          </p>


          <div className="mt-8 rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🤖
            </div>


            <h2 className="mt-5 text-xl font-semibold">
              No Agents Available
            </h2>


            <p className="mx-auto mt-2 max-w-xl text-slate-500">
              There are no shared agents in the
              organization yet. Create the first
              agent to start adding documents,
              repositories and knowledge.
            </p>


            <button
              type="button"
              onClick={() =>
                router.push(
                  "/agents"
                )
              }
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Create First Agent
            </button>

          </div>

        </div>

      </div>
    );
  }

  function handleLogout() {
    logoutUser();

    router.replace("/login");
  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="mx-auto max-w-7xl">


        {/* HEADER */}

<div className="flex flex-col gap-6">

  {/* TOP ROW */}

  <div className="flex items-start justify-between gap-4">

    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Enterprise AI shared knowledge workspace
      </p>
    </div>


    <button
      type="button"
      onClick={handleLogout}
      className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
    >
      Logout
    </button>

  </div>


  {/* AGENT SELECTOR ROW */}

  <div className="flex flex-col gap-3 md:flex-row md:items-end">

    <div className="w-full md:w-80">

      <label
        htmlFor="active-agent"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Active Agent
      </label>


      <select
        id="active-agent"
        value={selectedAgentId}
        onChange={handleAgentChange}
        disabled={agentLoading}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
      >

        <option value="">
          Select an agent...
        </option>


        {agents.map((agent) => (
          <option
            key={agent.agent_id}
            value={agent.agent_id}
          >
            {agent.name}
          </option>
        ))}

      </select>

    </div>


    <button
      type="button"
      onClick={() =>
        router.push("/agents")
      }
      className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
    >
      + Create / View Agents
    </button>

  </div>

</div>

        


        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* ============================================= */}
        {/* NO AGENT SELECTED */}
        {/* ============================================= */}

        {!selectedAgentId && (

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              🤖
            </div>


            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              No agent selected
            </h2>


            <p className="mx-auto mt-2 max-w-2xl text-slate-500">
              Select any shared organization agent
              from the dropdown above or create a
              new agent. After selecting an agent,
              you can access its documents,
              GitHub repositories and AI chat.
            </p>


            <div className="mt-6 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/agents"
                  )
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                View Available Agents
              </button>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/agents"
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                + Create Agent
              </button>
              

            </div>

          </div>
        )}


        {/* ============================================= */}
        {/* SELECTED AGENT WORKSPACE */}
        {/* ============================================= */}

        {selectedAgentId && (
          <>


            {/* ACTIVE AGENT */}

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                    Active Shared Agent
                  </p>


                  <h2 className="mt-1 text-xl font-bold text-blue-950">
                    {selectedAgent?.name ||
                      "Selected Agent"}
                  </h2>


                  {selectedAgent?.description && (

                    <p className="mt-1 text-sm text-blue-700">
                      {
                        selectedAgent.description
                      }
                    </p>

                  )}


                  {selectedAgent?.created_by_name && (

                    <p className="mt-2 text-xs text-blue-500">
                      Created by:{" "}
                      {
                        selectedAgent.created_by_name
                      }
                    </p>

                  )}

                </div>


                {/* WORKSPACE ACTIONS */}

                <div className="flex flex-wrap gap-2">


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/documents"
                      )
                    }
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
                  >
                    Documents
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/github"
                      )
                    }
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
                  >
                    GitHub Agent
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/chat"
                      )
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Open Chat
                  </button>

                </div>

              </div>

            </div>


            {/* ============================================= */}
            {/* STATISTICS */}
            {/* ============================================= */}

            <div className="mt-8 grid gap-5 md:grid-cols-3">


              <StatCard
                title="Documents Uploaded"
                value={
                  stats.total
                }
              />


              <StatCard
                title="Indexed Documents"
                value={
                  stats.indexed
                }
              />


              <StatCard
                title="AI Knowledge Chunks"
                value={
                  stats.chunks
                }
              />


            </div>


            {/* ============================================= */}
            {/* DOCUMENTS */}
            {/* ============================================= */}

            <div className="mt-8 rounded-2xl border bg-white">


              <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">


                <div>

                  <h2 className="text-xl font-semibold">
                    Documents
                  </h2>


                  <p className="mt-1 text-sm text-slate-500">
                    Shared documents available to
                    the selected agent.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/documents"
                    )
                  }
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-white"
                >
                  Manage Documents
                </button>

              </div>


              {agentLoading ? (

                <div className="p-12 text-center text-slate-500">
                  Loading agent workspace...
                </div>

              ) : documents.length === 0 ? (

                <div className="p-12 text-center">

                  <p className="text-slate-500">
                    No documents found for this agent.
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/documents"
                      )
                    }
                    className="mt-4 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Upload Document
                  </button>

                </div>

              ) : (

                <div>


                  {documents.map(
                    (document) => (

                      <div
                        key={
                          document.document_id
                        }
                        className="flex flex-col gap-4 border-b p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
                      >


                        <div>

                          <h3 className="font-semibold">
                            {document.name}
                          </h3>


                          <p className="mt-1 text-sm text-slate-500">

                            {document.type}

                            {" • "}

                            {formatFileSize(
                              document.size
                            )}

                            {" • "}

                            {
                              document.chunks
                            }

                            {" chunks"}

                          </p>

                        </div>


                        <div className="flex items-center gap-4">


                          <div className="text-sm text-slate-500">
                            {
                              document.progress
                            }%
                          </div>
                          


                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              document.status ===
                              "Indexed"
                                ? "bg-green-100 text-green-700"

                                : document.status ===
                                    "Failed"

                                  ? "bg-red-100 text-red-700"

                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {
                              document.status
                            }
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </>
        )}

      </div>

    </div>
  );
}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6">

      <p className="text-sm text-slate-500">
        {title}
      </p>


      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}