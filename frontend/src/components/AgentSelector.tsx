"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Agent,
  getAgents,
  setSelectedAgent,
  getSelectedAgent,
} from "@/lib/agents";


interface AgentSelectorProps {

  onAgentChange?: (
    agent: Agent | null
  ) => void;

}


export default function AgentSelector({
  onAgentChange,
}: AgentSelectorProps) {

  // ====================================================
  // STATE
  // ====================================================

  const [
    agents,
    setAgents,
  ] =
    useState<Agent[]>([]);


  const [
    selectedAgentId,
    setSelectedAgentId,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  // ====================================================
  // LOAD AGENTS
  // ====================================================

  useEffect(() => {

    loadAgents();

  }, []);


  async function loadAgents() {

    try {

      setLoading(true);

      setError("");


      const data =
        await getAgents();


      console.log(
        "AGENTS:",
        data
      );


      setAgents(
        data
      );


      // --------------------------------------------
      // No agents
      // --------------------------------------------

      if (
        data.length === 0
      ) {

        setSelectedAgentId("");

        return;

      }


      // --------------------------------------------
      // Check saved agent
      // --------------------------------------------

      const savedAgentId =
        getSelectedAgent();


      let agentToSelect:
        Agent | undefined;


      if (savedAgentId) {

        agentToSelect =
          data.find(
            (agent) =>
              agent.agent_id ===
              savedAgentId
          );

      }


      // --------------------------------------------
      // If saved agent doesn't exist,
      // select first agent
      // --------------------------------------------

      if (!agentToSelect) {

        agentToSelect =
          data[0];

      }


      setSelectedAgentId(
        agentToSelect.agent_id
      );


      setSelectedAgent(
        agentToSelect.agent_id
      );


      onAgentChange?.(
        agentToSelect
      );


    } catch (err: any) {

      console.error(
        "LOAD AGENTS ERROR:",
        err
      );


      setError(
        err.message ||
        "Failed to load agents."
      );


    } finally {

      setLoading(false);

    }

  }


  // ====================================================
  // CHANGE AGENT
  // ====================================================

  function handleAgentChange(
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) {

    const agentId =
      event.target.value;


    setSelectedAgentId(
      agentId
    );


    setSelectedAgent(
      agentId
    );


    const selectedAgent =
      agents.find(
        (agent) =>
          agent.agent_id ===
          agentId
      );


    if (selectedAgent) {

      onAgentChange?.(
        selectedAgent
      );

    }

  }


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="text-sm text-slate-500">

        Loading agents...

      </div>

    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (

      <div className="text-sm text-red-600">

        {error}

      </div>

    );

  }


  // ====================================================
  // NO AGENTS
  // ====================================================

  if (
    agents.length === 0
  ) {

    return (

      <div className="text-sm text-slate-500">

        No agents available.

      </div>

    );

  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="w-full">

      <label
        htmlFor="agent-selector"
        className="mb-2 block text-sm font-medium text-slate-700"
      >

        Active Agent

      </label>


      <select

        id="agent-selector"

        value={
          selectedAgentId
        }

        onChange={
          handleAgentChange
        }

        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"

      >

        {agents.map(
          (agent) => (

            <option
              key={
                agent.agent_id
              }

              value={
                agent.agent_id
              }
            >

              {agent.name}

            </option>

          )
        )}

      </select>

    </div>

  );

}