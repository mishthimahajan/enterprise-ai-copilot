"use client";

import { useEffect, useState } from "react";

import {
  Agent,
  getAgents,
  createAgent,
  setSelectedAgent,
  getSelectedAgent,
} from "@/lib/agents";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      setLoading(true);
      setError("");

      const data = await getAgents();

      setAgents(data);

      const saved = getSelectedAgent();

      if (
        saved &&
        data.some((agent) => agent.agent_id === saved)
      ) {
        setSelectedAgentId(saved);
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to load agents."
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
      setError("Agent name is required.");
      return;
    }

    try {
      setCreating(true);

      const newAgent = await createAgent({
        name: name.trim(),
        description: description.trim(),
      });

      setAgents((prev) => [
        ...prev,
        newAgent,
      ]);

      // automatically select new agent
      setSelectedAgent(newAgent.agent_id);
      setSelectedAgentId(newAgent.agent_id);

      setName("");
      setDescription("");

      setSuccess(
        "Agent created and selected."
      );
    } catch (err: any) {
      setError(
        err.message || "Failed to create agent."
      );
    } finally {
      setCreating(false);
    }
  }

  function handleSelectAgent(
    agentId: string
  ) {
    setSelectedAgent(agentId);
    setSelectedAgentId(agentId);

    setSuccess(
      "Agent selected successfully."
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Agents
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your Enterprise AI agents.
        </p>

        {/* CREATE AGENT */}

        <div className="mt-8 rounded-2xl border bg-white p-6">

          <h2 className="text-xl font-semibold">
            Create Agent
          </h2>

          <form
            onSubmit={handleCreateAgent}
            className="mt-5 space-y-5"
          >

            <div>
              <label className="text-sm font-medium">
                Agent Name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Engineering Team"
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Enterprise engineering knowledge"
                rows={4}
                className="mt-2 w-full rounded-xl border px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Agent"}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-green-600">
              {success}
            </p>
          )}
        </div>

        {/* AGENT LIST */}

        <div className="mt-10">

          <h2 className="text-2xl font-semibold">
            Your Agents
          </h2>

          {loading ? (
            <p className="mt-5">
              Loading agents...
            </p>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {agents.map((agent) => {
                const isSelected =
                  selectedAgentId ===
                  agent.agent_id;

                return (
                  <div
                    key={agent.agent_id}
                    className={`rounded-2xl border bg-white p-5 ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <h3 className="text-lg font-semibold">
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
                      Agent ID: {agent.agent_id}
                    </p>

                    <p className="mt-2 text-sm">
                      Members:{" "}
                      {agent.members?.length || 0}
                    </p>

                    <button
                      onClick={() =>
                        handleSelectAgent(
                          agent.agent_id
                        )
                      }
                      disabled={isSelected}
                      className={`mt-5 w-full rounded-xl px-4 py-3 font-medium ${
                        isSelected
                          ? "cursor-default bg-blue-100 text-blue-700"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {isSelected
                        ? "Selected Agent"
                        : "Select Agent"}
                    </button>
                  </div>
                );
              })}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}