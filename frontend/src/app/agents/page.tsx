"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Agent,
  getAgents,
  createAgent,
  setSelectedAgent,
  getSelectedAgent,
} from "@/lib/agents";

import {
  useRouter,
} from "next/navigation";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";


export default function AgentsPage() {
  const router = useRouter();

  const [agents, setAgents] =
    useState<Agent[]>([]);

  const [
    selectedAgentId,
    setSelectedAgentId,
  ] = useState("");

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [popup, setPopup] =
    useState<{
      type: "success" | "error";
      message: string;
    } | null>(null);


  useEffect(() => {
    loadAgents();
  }, []);


  function showPopup(
    type: "success" | "error",
    message: string
  ) {
    setPopup({
      type,
      message,
    });

    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }


  async function loadAgents() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAgents();

      setAgents(data);

      const saved =
        getSelectedAgent();

      if (
        saved &&
        data.some(
          (agent) =>
            agent.agent_id === saved
        )
      ) {
        setSelectedAgentId(
          saved
        );
      }

    } catch (err: any) {

      const message =
        err.message ||
        "Failed to load agents.";

      setError(message);

      showPopup(
        "error",
        message
      );

    } finally {
      setLoading(false);
    }
  }


  async function handleCreateAgent(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      const message =
        "Agent name is required.";

      setError(message);

      showPopup(
        "error",
        message
      );

      return;
    }

    try {
      setCreating(true);

      const newAgent =
        await createAgent({
          name:
            name.trim(),

          description:
            description.trim(),
        });


      setAgents(
        (prev) => [
          ...prev,
          newAgent,
        ]
      );


      // Save selected agent
      setSelectedAgent(
        newAgent.agent_id
      );

      setSelectedAgentId(
        newAgent.agent_id
      );


      setName("");
      setDescription("");


      const message =
        "Agent created and selected successfully.";

      setSuccess(message);

      showPopup(
        "success",
        message
      );


      // Automatically move to documents
      setTimeout(() => {
        router.push(
          "/documents"
        );
      }, 1500);

    } catch (err: any) {

      const message =
        err.message ||
        "Failed to create agent.";

      setError(message);

      showPopup(
        "error",
        message
      );

    } finally {
      setCreating(false);
    }
  }


  function handleSelectAgent(
    agentId: string
  ) {
    setSelectedAgent(
      agentId
    );

    setSelectedAgentId(
      agentId
    );

    const message =
      "Agent selected successfully.";

    setSuccess(message);

    showPopup(
      "success",
      message
    );
  }


  function handleContinueToDocuments(
    agentId: string
  ) {
    // Make absolutely sure
    // selected agent is stored
    setSelectedAgent(
      agentId
    );

    setSelectedAgentId(
      agentId
    );

    router.push(
      "/documents"
    );
  }


  return (
    <>
      {/* POPUP */}

      {popup && (
        <div className="fixed right-5 top-5 z-[9999]">

          <div
            className={
              popup.type === "success"
                ? "flex min-w-[320px] items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"
                : "flex min-w-[320px] items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-xl"
            }
          >

            {popup.type ===
            "success" ? (
              <CheckCircle2
                size={24}
                className="text-green-600"
              />
            ) : (
              <XCircle
                size={24}
                className="text-red-600"
              />
            )}


            <div className="flex-1">

              <p
                className={
                  popup.type ===
                  "success"
                    ? "font-semibold text-green-700"
                    : "font-semibold text-red-700"
                }
              >
                {popup.type ===
                "success"
                  ? "Success"
                  : "Error"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {popup.message}
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setPopup(null)
              }
              className="text-xl text-slate-400 hover:text-slate-700"
            >
              ×
            </button>

          </div>

        </div>
      )}


      <div className="min-h-screen bg-slate-50 p-8">

        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADER */}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Agents
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your Enterprise AI agents.
              </p>

            </div>


            {selectedAgentId && (
              <button
                type="button"
                onClick={() =>
                  handleContinueToDocuments(
                    selectedAgentId
                  )
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Continue to Documents
              </button>
            )}

          </div>


          {/* CREATE AGENT */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              Create Agent
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create an AI workspace for your documents and knowledge.
            </p>


            <form
              onSubmit={
                handleCreateAgent
              }
              className="mt-5 space-y-5"
            >

              {/* AGENT NAME */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Agent Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="Engineering Team"
                  disabled={creating}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enterprise engineering knowledge"
                  rows={4}
                  disabled={creating}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />

              </div>


              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating
                  ? "Creating..."
                  : "Create Agent"}
              </button>

            </form>


            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}


            {success && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {success}
              </div>
            )}

          </div>


          {/* AGENT LIST */}

          <div className="mt-10">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-semibold text-slate-900">
                  Your Agents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select an agent to manage its documents.
                </p>

              </div>

            </div>


            {loading ? (

              <div className="mt-5 rounded-xl border bg-white p-8 text-center text-slate-500">
                Loading agents...
              </div>

            ) : agents.length === 0 ? (

              <div className="mt-5 rounded-xl border bg-white p-8 text-center">

                <p className="font-medium text-slate-700">
                  No agents available.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first agent above.
                </p>

              </div>

            ) : (

              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {agents.map(
                  (agent) => {

                    const isSelected =
                      selectedAgentId ===
                      agent.agent_id;

                    return (

                      <div
                        key={
                          agent.agent_id
                        }
                        className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                          isSelected
                            ? "border-blue-600 ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >

                        {/* CARD HEADER */}

                        <div className="flex items-center justify-between gap-3">

                          <h3 className="text-lg font-semibold text-slate-900">
                            {agent.name}
                          </h3>


                          {isSelected && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                              Selected
                            </span>
                          )}

                        </div>


                        <p className="mt-2 text-sm text-slate-500">
                          {agent.description ||
                            "No description"}
                        </p>


                        <p className="mt-4 break-all text-xs text-slate-400">
                          Agent ID:{" "}
                          {agent.agent_id}
                        </p>


                        <p className="mt-2 text-sm text-slate-700">
                          Members:{" "}
                          {agent.members
                            ?.length || 0}
                        </p>


                        {/* SELECT BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleSelectAgent(
                              agent.agent_id
                            )
                          }
                          disabled={
                            isSelected
                          }
                          className={`mt-5 w-full rounded-xl px-4 py-3 font-medium transition ${
                            isSelected
                              ? "cursor-default bg-blue-100 text-blue-700"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {isSelected
                            ? "Selected Agent"
                            : "Select Agent"}
                        </button>


                        {/* CONTINUE BUTTON */}

                        {isSelected && (
                          <button
                            type="button"
                            onClick={() =>
                              handleContinueToDocuments(
                                agent.agent_id
                              )
                            }
                            className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                          >
                            Continue to Documents
                          </button>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}