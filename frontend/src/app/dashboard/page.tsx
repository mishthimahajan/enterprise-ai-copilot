"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Agent,
  getAgents,
} from "@/lib/agents";

import {
  DocumentItem,
  DocumentsResponse,
  getDocuments,
} from "@/lib/documents";


export default function DashboardPage() {

  const router =
    useRouter();


  

  const [agents, setAgents] =
    useState<Agent[]>([]);


  const [
    selectedAgentId,
    setSelectedAgentId,
  ] = useState("");


  const [
    documents,
    setDocuments,
  ] =
    useState<DocumentItem[]>([]);


  const [stats, setStats] =
    useState({
      total: 0,
      indexed: 0,
      chunks: 0,
    });


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  useEffect(() => {

    loadDashboard();

  }, []);


  

  async function loadDashboard() {

    try {

      setLoading(true);
      setError("");


      

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


    
      const agentData =
        await getAgents();


      console.log(
        "USER AGENTS:",
        agentData
      );


      setAgents(
        agentData
      );


      if (
        agentData.length === 0
      ) {

        setDocuments([]);

        setStats({
          total: 0,
          indexed: 0,
          chunks: 0,
        });

        return;
      }


      

      const savedAgentId =
        localStorage.getItem(
          "selected_agent_id"
        );


      let agentId =
        savedAgentId;


      
      if (
        !agentId ||
        !agentData.some(
          (agent) =>
            agent.agent_id ===
            agentId
        )
      ) {

        agentId =
          agentData[0].agent_id;
      }


      setSelectedAgentId(
        agentId
      );


      localStorage.setItem(
        "selected_agent_id",
        agentId
      );


      

      await loadDocumentsForAgent(
        agentId
      );


    } catch (err: any) {

      console.error(
        "DASHBOARD ERROR:",
        err
      );


      setError(
        err.message ||
        "Failed to load dashboard."
      );


    } finally {

      setLoading(false);

    }

  }




  async function loadDocumentsForAgent(
    agentId: string
  ) {

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
        data.documents || []
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


      setDocuments([]);


      setStats({
        total: 0,
        indexed: 0,
        chunks: 0,
      });


      throw err;

    }

  }


  

  async function handleAgentChange(
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) {

    const agentId =
      event.target.value;


    setSelectedAgentId(
      agentId
    );


    localStorage.setItem(
      "selected_agent_id",
      agentId
    );


    try {

      setLoading(true);
      setError("");


      await loadDocumentsForAgent(
        agentId
      );


    } catch (err: any) {

      setError(
        err.message ||
        "Failed to load documents."
      );


    } finally {

      setLoading(false);

    }

  }


  

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


  

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-10">

        <p className="text-slate-500">
          Loading dashboard...
        </p>

      </div>

    );

  }


  

  if (error) {

    return (

      <div className="min-h-screen bg-slate-50 p-10">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>


        <div className="mt-8 rounded-xl bg-red-50 p-6 text-red-700">

          <h2 className="font-semibold">
            Error
          </h2>

          <p className="mt-2">
            {error}
          </p>


          <button
            onClick={() =>
              router.push(
                "/login"
              )
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white"
          >
            Go to Login
          </button>

        </div>

      </div>

    );

  }




  if (
    agents.length === 0
  ) {

    return (

      <div className="min-h-screen bg-slate-50 p-10">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>


        <div className="mt-8 rounded-xl border bg-white p-8">

          <h2 className="text-xl font-semibold">
            No Agents Available
          </h2>


          <p className="mt-2 text-slate-500">
            Create an agent or ask an
            existing agent owner to add
            you as a member.
          </p>


          <button
            onClick={() =>
              router.push(
                "/agents"
              )
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
          >
            Manage Agents
          </button>

        </div>

      </div>

    );

  }




  return (

    <div className="min-h-screen bg-slate-50 p-8">


      <div className="mx-auto max-w-7xl">


        

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">


          <div>

            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>


            <p className="mt-2 text-slate-500">
              Enterprise AI knowledge
              workspace
            </p>

          </div>


          

          <div className="w-full md:w-80">

            <label className="mb-2 block text-sm font-medium">
              Active Agent
            </label>


            <select
              value={
                selectedAgentId
              }
              onChange={
                handleAgentChange
              }
              className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-blue-500"
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

        </div>


        {/* STATISTICS */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">


          <StatCard
            title="Documents Uploaded"
            value={stats.total}
          />


          <StatCard
            title="Indexed Documents"
            value={stats.indexed}
          />


          <StatCard
            title="AI Knowledge Chunks"
            value={stats.chunks}
          />


        </div>


        {/* DOCUMENTS */}

        <div className="mt-8 rounded-2xl border bg-white">


          <div className="flex items-center justify-between border-b p-6">

            <div>

              <h2 className="text-xl font-semibold">
                Documents
              </h2>


              <p className="mt-1 text-sm text-slate-500">
                Documents available to
                the selected agent.
              </p>

            </div>


            <button
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


          {documents.length ===
          0 ? (

            <div className="p-12 text-center">

              <p className="text-slate-500">
                No documents found for
                this agent.
              </p>

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

                        {document.chunks}
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

                        {document.status}

                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


      </div>


    </div>

  );

}




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