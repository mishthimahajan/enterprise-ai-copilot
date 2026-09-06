// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useRouter,
// } from "next/navigation";


// import {
//   Agent,
//   getAgents,
// } from "@/lib/agents";

// import {
//   DocumentItem,
//   DocumentsResponse,
//   getDocuments,
// } from "@/lib/documents";

// import { logoutUser } from "@/services/auth";


// export default function DashboardPage() {
//   const router =
//     useRouter();


//   const [
//     agents,
//     setAgents,
//   ] = useState<Agent[]>([]);


//   const [
//     selectedAgentId,
//     setSelectedAgentId,
//   ] = useState("");


//   const [
//     documents,
//     setDocuments,
//   ] = useState<DocumentItem[]>([]);


//   const [
//     stats,
//     setStats,
//   ] = useState({
//     total: 0,
//     indexed: 0,
//     chunks: 0,
//   });


//   const [
//     loading,
//     setLoading,
//   ] = useState(true);


//   const [
//     agentLoading,
//     setAgentLoading,
//   ] = useState(false);


//   const [
//     error,
//     setError,
//   ] = useState("");


//   const [
//     success,
//     setSuccess,
//   ] = useState("");


//   useEffect(() => {
//     loadDashboard();
//   }, []);


//   // =========================================================
//   // RESET CURRENT AGENT WORKSPACE
//   // =========================================================

//   function resetWorkspace() {
//     setDocuments([]);

//     setStats({
//       total: 0,
//       indexed: 0,
//       chunks: 0,
//     });

//     // Important:
//     // Documents/repositories belong to
//     // the previously selected agent.
//     localStorage.removeItem(
//       "selected_document_id"
//     );

//     localStorage.removeItem(
//       "selected_repository_id"
//     );
//   }


//   // =========================================================
//   // LOAD DASHBOARD
//   // =========================================================

//   async function loadDashboard() {
//     try {
//       setLoading(true);

//       setError("");
//       setSuccess("");


//       const token =
//         localStorage.getItem(
//           "access_token"
//         );


//       if (!token) {
//         setError(
//           "You are not logged in. Please login first."
//         );

//         return;
//       }


//       // Backend GET /agents/
//       // now returns ALL shared agents.
//       const agentData =
//         await getAgents();


//       console.log(
//         "AVAILABLE SHARED AGENTS:",
//         agentData
//       );


//       const availableAgents =
//         Array.isArray(
//           agentData
//         )
//           ? agentData
//           : [];


//       setAgents(
//         availableAgents
//       );


//       // No agents in organization yet
//       if (
//         availableAgents.length === 0
//       ) {
//         localStorage.removeItem(
//           "selected_agent_id"
//         );

//         setSelectedAgentId("");

//         resetWorkspace();

//         return;
//       }


//       /*
//        * IMPORTANT:
//        *
//        * DO NOT automatically do:
//        *
//        * agentData[0].agent_id
//        *
//        * User must choose an agent.
//        */


//       const savedAgentId =
//         localStorage.getItem(
//           "selected_agent_id"
//         );


//       // Validate stored agent
//       // against agents returned by backend.
//       const validAgent =
//         savedAgentId
//           ? availableAgents.find(
//               (agent) =>
//                 agent.agent_id ===
//                 savedAgentId
//             )
//           : undefined;


//       if (!validAgent) {
//         localStorage.removeItem(
//           "selected_agent_id"
//         );

//         setSelectedAgentId("");

//         resetWorkspace();

//         return;
//       }


//       // Valid agent from current session
//       setSelectedAgentId(
//         validAgent.agent_id
//       );


//       await loadDocumentsForAgent(
//         validAgent.agent_id
//       );

//     } catch (err: any) {
//   console.error(
//     "DASHBOARD ERROR:",
//     err
//   );

//   const message =
//     err.message ||
//     "Failed to load dashboard.";

//   if (
//     message.toLowerCase().includes(
//       "authentication"
//     ) ||
//     message.toLowerCase().includes(
//       "unauthorized"
//     ) ||
//     message.toLowerCase().includes(
//       "token"
//     )
//   ) {
//     logoutUser();

//     router.replace(
//       "/login"
//     );

//     return;
//   }

//   setError(message);

// } finally {
//   setLoading(false);
// }
//   }


//   // =========================================================
//   // LOAD DOCUMENTS OF SELECTED AGENT
//   // =========================================================

//   async function loadDocumentsForAgent(
//     agentId: string
//   ) {
//     if (!agentId) {
//       resetWorkspace();
//       return;
//     }


//     try {
//       const data:
//         DocumentsResponse =
//         await getDocuments(
//           agentId
//         );


//       console.log(
//         "DOCUMENTS:",
//         data
//       );


//       setDocuments(
//         Array.isArray(
//           data.documents
//         )
//           ? data.documents
//           : []
//       );


//       setStats({
//         total:
//           data.total || 0,

//         indexed:
//           data.indexed || 0,

//         chunks:
//           data.chunks || 0,
//       });

//     } catch (err: any) {
//       console.error(
//         "FAILED TO LOAD DOCUMENTS:",
//         err
//       );


//       resetWorkspace();


//       throw err;
//     }
//   }


//   // =========================================================
//   // CHANGE ACTIVE AGENT
//   // =========================================================

//   async function handleAgentChange(
//     event:
//       React.ChangeEvent<HTMLSelectElement>
//   ) {
//     const agentId =
//       event.target.value;


//     setError("");
//     setSuccess("");


//     /*
//      * Clear everything from old agent
//      * before switching.
//      */
//     resetWorkspace();


//     setSelectedAgentId(
//       agentId
//     );


//     // User selected placeholder
//     if (!agentId) {
//       localStorage.removeItem(
//         "selected_agent_id"
//       );

//       return;
//     }


//     localStorage.setItem(
//       "selected_agent_id",
//       agentId
//     );


//     try {
//       setAgentLoading(true);


//       await loadDocumentsForAgent(
//         agentId
//       );


//       const selected =
//         agents.find(
//           (agent) =>
//             agent.agent_id ===
//             agentId
//         );


//       setSuccess(
//         selected
//           ? `${selected.name} selected successfully.`
//           : "Agent selected successfully."
//       );

//     } catch (err: any) {
//       setError(
//         err.message ||
//           "Failed to load agent workspace."
//       );

//     } finally {
//       setAgentLoading(false);
//     }
//   }


//   // =========================================================
//   // FORMAT FILE SIZE
//   // =========================================================

//   function formatFileSize(
//     bytes: number
//   ) {
//     if (!bytes) {
//       return "0 KB";
//     }


//     const kb =
//       bytes / 1024;


//     if (kb < 1024) {
//       return `${kb.toFixed(
//         1
//       )} KB`;
//     }


//     return `${(
//       kb / 1024
//     ).toFixed(1)} MB`;
//   }


//   // =========================================================
//   // CURRENT AGENT
//   // =========================================================

//   const selectedAgent =
//     agents.find(
//       (agent) =>
//         agent.agent_id ===
//         selectedAgentId
//     );


//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 p-10">
//         <p className="text-slate-500">
//           Loading dashboard...
//         </p>
//       </div>
//     );
//   }


//   // =========================================================
//   // AUTH / INITIAL ERROR
//   // =========================================================

//   if (
//     error &&
//     agents.length === 0
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-50 p-10">

//         <div className="mx-auto max-w-5xl">

//           <h1 className="text-3xl font-bold">
//             Dashboard
//           </h1>


//           <div className="mt-8 rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">

//             <h2 className="font-semibold">
//               Error
//             </h2>


//             <p className="mt-2">
//               {error}
//             </p>


//             <button
//   type="button"
//   onClick={() => {
//     logoutUser();
//     router.replace("/login");
//   }}
//   className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-white"
// >
//   Go to Login
// </button>

//           </div>

//         </div>

//       </div>
//     );
//   }


//   // =========================================================
//   // ZERO AGENTS EXIST
//   // =========================================================

//   if (
//     agents.length === 0
//   ) {
//     return (
//       <div className="min-h-screen bg-slate-50 p-10">

//         <div className="mx-auto max-w-5xl">

//           <h1 className="text-3xl font-bold">
//             Dashboard
//           </h1>


//           <p className="mt-2 text-slate-500">
//             Enterprise AI knowledge workspace
//           </p>


//           <div className="mt-8 rounded-2xl border bg-white p-10 text-center shadow-sm">

//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
//               🤖
//             </div>


//             <h2 className="mt-5 text-xl font-semibold">
//               No Agents Available
//             </h2>


//             <p className="mx-auto mt-2 max-w-xl text-slate-500">
//               There are no shared agents in the
//               organization yet. Create the first
//               agent to start adding documents,
//               repositories and knowledge.
//             </p>


//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   "/agents"
//                 )
//               }
//               className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
//             >
//               + Create First Agent
//             </button>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   function handleLogout() {
//     logoutUser();

//     router.replace("/login");
//   }


//   // =========================================================
//   // DASHBOARD
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-8">

//       <div className="mx-auto max-w-7xl">


//         {/* HEADER */}

// <div className="flex flex-col gap-6">

//   {/* TOP ROW */}

//   <div className="flex items-start justify-between gap-4">

//     <div>
//       <h1 className="text-3xl font-bold text-slate-900">
//         Dashboard
//       </h1>

//       <p className="mt-2 text-slate-500">
//         Enterprise AI shared knowledge workspace
//       </p>
//     </div>


//     <button
//       type="button"
//       onClick={handleLogout}
//       className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 shadow-sm transition hover:bg-red-50"
//     >
//       Logout
//     </button>

//   </div>


//   {/* AGENT SELECTOR ROW */}

//   <div className="flex flex-col gap-3 md:flex-row md:items-end">

//     <div className="w-full md:w-80">

//       <label
//         htmlFor="active-agent"
//         className="mb-2 block text-sm font-medium text-slate-700"
//       >
//         Active Agent
//       </label>


//       <select
//         id="active-agent"
//         value={selectedAgentId}
//         onChange={handleAgentChange}
//         disabled={agentLoading}
//         className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//       >

//         <option value="">
//           Select an agent...
//         </option>


//         {agents.map((agent) => (
//           <option
//             key={agent.agent_id}
//             value={agent.agent_id}
//           >
//             {agent.name}
//           </option>
//         ))}

//       </select>

//     </div>


//     <button
//       type="button"
//       onClick={() =>
//         router.push("/agents")
//       }
//       className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
//     >
//       + Create / View Agents
//     </button>

//   </div>

// </div>

        


//         {/* ERROR */}

//         {error && (
//           <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}


//         {/* SUCCESS */}

//         {success && (
//           <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
//             {success}
//           </div>
//         )}


//         {/* ============================================= */}
//         {/* NO AGENT SELECTED */}
//         {/* ============================================= */}

//         {!selectedAgentId && (

//           <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
//               🤖
//             </div>


//             <h2 className="mt-5 text-xl font-semibold text-slate-900">
//               No agent selected
//             </h2>


//             <p className="mx-auto mt-2 max-w-2xl text-slate-500">
//               Select any shared organization agent
//               from the dropdown above or create a
//               new agent. After selecting an agent,
//               you can access its documents,
//               GitHub repositories and AI chat.
//             </p>


//             <div className="mt-6 flex flex-wrap justify-center gap-3">

//               <button
//                 type="button"
//                 onClick={() =>
//                   router.push(
//                     "/agents"
//                   )
//                 }
//                 className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
//               >
//                 View Available Agents
//               </button>


//               <button
//                 type="button"
//                 onClick={() =>
//                   router.push(
//                     "/agents"
//                   )
//                 }
//                 className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
//               >
//                 + Create Agent
//               </button>
              

//             </div>

//           </div>
//         )}


//         {/* ============================================= */}
//         {/* SELECTED AGENT WORKSPACE */}
//         {/* ============================================= */}

//         {selectedAgentId && (
//           <>


//             {/* ACTIVE AGENT */}

//             <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

//               <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">


//                 <div>

//                   <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
//                     Active Shared Agent
//                   </p>


//                   <h2 className="mt-1 text-xl font-bold text-blue-950">
//                     {selectedAgent?.name ||
//                       "Selected Agent"}
//                   </h2>


//                   {selectedAgent?.description && (

//                     <p className="mt-1 text-sm text-blue-700">
//                       {
//                         selectedAgent.description
//                       }
//                     </p>

//                   )}


//                   {selectedAgent?.created_by_name && (

//                     <p className="mt-2 text-xs text-blue-500">
//                       Created by:{" "}
//                       {
//                         selectedAgent.created_by_name
//                       }
//                     </p>

//                   )}

//                 </div>


//                 {/* WORKSPACE ACTIONS */}

//                 <div className="flex flex-wrap gap-2">


//                   <button
//                     type="button"
//                     onClick={() =>
//                       router.push(
//                         "/documents"
//                       )
//                     }
//                     className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
//                   >
//                     Documents
//                   </button>


//                   <button
//                     type="button"
//                     onClick={() =>
//                       router.push(
//                         "/github"
//                       )
//                     }
//                     className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm"
//                   >
//                     GitHub Agent
//                   </button>


//                   <button
//                     type="button"
//                     onClick={() =>
//                       router.push(
//                         "/chat"
//                       )
//                     }
//                     className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
//                   >
//                     Open Chat
//                   </button>

//                 </div>

//               </div>

//             </div>


//             {/* ============================================= */}
//             {/* STATISTICS */}
//             {/* ============================================= */}

//             <div className="mt-8 grid gap-5 md:grid-cols-3">


//               <StatCard
//                 title="Documents Uploaded"
//                 value={
//                   stats.total
//                 }
//               />


//               <StatCard
//                 title="Indexed Documents"
//                 value={
//                   stats.indexed
//                 }
//               />


//               <StatCard
//                 title="AI Knowledge Chunks"
//                 value={
//                   stats.chunks
//                 }
//               />


//             </div>


//             {/* ============================================= */}
//             {/* DOCUMENTS */}
//             {/* ============================================= */}

//             <div className="mt-8 rounded-2xl border bg-white">


//               <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">


//                 <div>

//                   <h2 className="text-xl font-semibold">
//                     Documents
//                   </h2>


//                   <p className="mt-1 text-sm text-slate-500">
//                     Shared documents available to
//                     the selected agent.
//                   </p>

//                 </div>


//                 <button
//                   type="button"
//                   onClick={() =>
//                     router.push(
//                       "/documents"
//                     )
//                   }
//                   className="rounded-lg bg-blue-600 px-5 py-2.5 text-white"
//                 >
//                   Manage Documents
//                 </button>

//               </div>


//               {agentLoading ? (

//                 <div className="p-12 text-center text-slate-500">
//                   Loading agent workspace...
//                 </div>

//               ) : documents.length === 0 ? (

//                 <div className="p-12 text-center">

//                   <p className="text-slate-500">
//                     No documents found for this agent.
//                   </p>


//                   <button
//                     type="button"
//                     onClick={() =>
//                       router.push(
//                         "/documents"
//                       )
//                     }
//                     className="mt-4 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
//                   >
//                     Upload Document
//                   </button>

//                 </div>

//               ) : (

//                 <div>


//                   {documents.map(
//                     (document) => (

//                       <div
//                         key={
//                           document.document_id
//                         }
//                         className="flex flex-col gap-4 border-b p-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
//                       >


//                         <div>

//                           <h3 className="font-semibold">
//                             {document.name}
//                           </h3>


//                           <p className="mt-1 text-sm text-slate-500">

//                             {document.type}

//                             {" • "}

//                             {formatFileSize(
//                               document.size
//                             )}

//                             {" • "}

//                             {
//                               document.chunks
//                             }

//                             {" chunks"}

//                           </p>

//                         </div>


//                         <div className="flex items-center gap-4">


//                           <div className="text-sm text-slate-500">
//                             {
//                               document.progress
//                             }%
//                           </div>
                          


//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-medium ${
//                               document.status ===
//                               "Indexed"
//                                 ? "bg-green-100 text-green-700"

//                                 : document.status ===
//                                     "Failed"

//                                   ? "bg-red-100 text-red-700"

//                                   : "bg-yellow-100 text-yellow-700"
//                             }`}
//                           >
//                             {
//                               document.status
//                             }
//                           </span>

//                         </div>

//                       </div>

//                     )
//                   )}

//                 </div>

//               )}

//             </div>

//           </>
//         )}

//       </div>

//     </div>
//   );
// }


// // =========================================================
// // STAT CARD
// // =========================================================

// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: number;
// }) {
//   return (
//     <div className="rounded-2xl border bg-white p-6">

//       <p className="text-sm text-slate-500">
//         {title}
//       </p>


//       <p className="mt-2 text-3xl font-bold">
//         {value}
//       </p>

//     </div>
//   );
// }


"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";

import { useRouter } from "next/navigation";

import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  XCircle,
} from "lucide-react";

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
  const router = useRouter();

  const [agents, setAgents] = useState<Agent[]>([]);

  const [selectedAgentId, setSelectedAgentId] =
    useState("");

  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [stats, setStats] = useState({
    total: 0,
    indexed: 0,
    chunks: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [agentLoading, setAgentLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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

      const agentData =
        await getAgents();

      console.log(
        "AVAILABLE SHARED AGENTS:",
        agentData
      );

      const availableAgents =
        Array.isArray(agentData)
          ? agentData
          : [];

      setAgents(
        availableAgents
      );

      // No agents created yet
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
       * Do not automatically select
       * first agent.
       *
       * User must choose an agent.
       */

      const savedAgentId =
        localStorage.getItem(
          "selected_agent_id"
        );

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
        message
          .toLowerCase()
          .includes(
            "authentication"
          ) ||
        message
          .toLowerCase()
          .includes(
            "unauthorized"
          ) ||
        message
          .toLowerCase()
          .includes(
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
  // LOAD DOCUMENTS FOR SELECTED AGENT
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
      ChangeEvent<HTMLSelectElement>
  ) {
    const agentId =
      event.target.value;

    setError("");
    setSuccess("");

    resetWorkspace();

    setSelectedAgentId(
      agentId
    );

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
  // LOGOUT
  // =========================================================

  function handleLogout() {
    logoutUser();

    router.replace(
      "/login"
    );
  }

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-500/15" />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-700">
            Loading enterprise workspace
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Preparing agents and knowledge...
          </p>
        </div>
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
      <FullPageMessage
        type="error"
        title="Unable to load workspace"
        description={error}
        action="Go to Login"
        onAction={() => {
          logoutUser();
          router.replace("/login");
        }}
      />
    );
  }

  // =========================================================
  // ZERO AGENTS
  // =========================================================

  if (
    agents.length === 0
  ) {
    return (
      <FullPageMessage
        type="empty"
        title="No AI agents available"
        description="There are no shared agents in the organization yet. Create the first AI workspace to start indexing documents, repositories and enterprise knowledge."
        action="Create First Agent"
        onAction={() =>
          router.push(
            "/agents"
          )
        }
      />
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] overflow-hidden border-r border-white/10 bg-[#07111F] lg:flex lg:flex-col">
        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-[-100px] h-80 w-80 rounded-full bg-blue-600/15 blur-[110px]" />

          <div className="absolute bottom-[-100px] right-[-100px] h-80 w-80 rounded-full bg-violet-600/10 blur-[110px]" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* BRAND */}
          <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-white">
                Enterprise AI
              </p>

              <p className="text-[11px] font-medium text-slate-500">
                Operations Copilot
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Workspace
            </p>

            <nav className="mt-3 space-y-1.5">
              <SidebarItem
                icon={
                  LayoutDashboard
                }
                title="Dashboard"
                active
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
              />

              <SidebarItem
                icon={Bot}
                title="AI Agents"
                onClick={() =>
                  router.push(
                    "/agents"
                  )
                }
              />

              <SidebarItem
                icon={Code2}
                title="GitHub Agent"
                onClick={() =>
                  router.push(
                    "/github"
                  )
                }
              />

              <SidebarItem
                icon={
                  FileText
                }
                title="Documents"
                onClick={() =>
                  router.push(
                    "/documents"
                  )
                }
              />

              <SidebarItem
                icon={
                  MessageSquare
                }
                title="AI Chat"
                onClick={() =>
                  router.push(
                    "/chat"
                  )
                }
              />
            </nav>

            <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Platform
            </p>

            <nav className="mt-3 space-y-1.5">
              <SidebarItem
                icon={Users}
                title="Shared Workspace"
                onClick={() =>
                  router.push(
                    "/agents"
                  )
                }
              />

              <SidebarItem
                icon={
                  Settings
                }
                title="Settings"
                onClick={() =>
                  router.push(
                    "/settings"
                  )
                }
              />
            </nav>
          </div>

          {/* SYSTEM STATUS */}
          <div className="p-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <p className="text-xs font-semibold text-white">
                  AI Platform Online
                </p>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Enterprise knowledge services are available.
              </p>
            </div>

            <button
              onClick={
                handleLogout
              }
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="min-h-screen lg:ml-[260px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between px-5 lg:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Enterprise Workspace
              </p>

              <h1 className="mt-1 text-lg font-black tracking-tight text-slate-950">
                Knowledge Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  router.push(
                    "/chat"
                  )
                }
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 sm:flex"
              >
                <Search className="h-4 w-4" />

                Ask Copilot
              </button>

              <button
                onClick={
                  handleLogout
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:hidden"
              >
                <LogOut className="h-4 w-4" />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <div className="relative overflow-hidden px-5 py-8 lg:px-8 lg:py-10">
          {/* BACKGROUND */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-48 top-[-120px] h-[500px] w-[500px] rounded-full bg-blue-300/10 blur-[140px]" />

            <div className="absolute right-[-150px] top-[180px] h-[450px] w-[450px] rounded-full bg-violet-300/10 blur-[140px]" />

            <div
              className="absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
                backgroundSize:
                  "52px 52px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[1450px]">
            {/* =====================================================
                WELCOME / AGENT SELECTOR
            ====================================================== */}

            <section className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />

                  Enterprise AI Knowledge Workspace
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                  Manage your
                  <span className="bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    {" "}
                    enterprise knowledge.
                  </span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Select a shared AI agent to access its documents,
                  repositories and grounded AI conversations.
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(
                    "/agents"
                  )
                }
                className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />

                Manage Agents

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </section>

            {/* AGENT CONTROL PANEL */}
            <section className="mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 via-violet-100 to-cyan-100">
                    <Bot className="h-5 w-5 text-violet-600" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-950">
                      Active Shared Agent
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Choose the knowledge workspace you want to use.
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-[360px]">
                  <select
                    id="active-agent"
                    value={
                      selectedAgentId
                    }
                    onChange={
                      handleAgentChange
                    }
                    disabled={
                      agentLoading
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/70 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      Select an agent...
                    </option>

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
                          {
                            agent.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </section>

            {/* ALERTS */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-700 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <p>
                  {success}
                </p>
              </div>
            )}

            {/* =====================================================
                NO AGENT SELECTED
            ====================================================== */}

            {!selectedAgentId && (
              <section className="mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                <div className="relative px-6 py-16 text-center md:px-10">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[120px]" />
                  </div>

                  <div className="relative">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
                      <Bot className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
                      Select an AI workspace
                    </h3>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                      Choose any shared organization agent above. Once
                      selected, its documents, knowledge statistics and
                      AI tools will become available.
                    </p>

                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                      <button
                        onClick={() =>
                          router.push(
                            "/agents"
                          )
                        }
                        className="rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                      >
                        View Available Agents
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            "/agents"
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                      >
                        + Create Agent
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* =====================================================
                SELECTED AGENT WORKSPACE
            ====================================================== */}

            {selectedAgentId && (
              <>
                {/* ACTIVE AGENT HERO */}
                <section className="relative mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-[#07111F] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.18)] md:p-7">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-28 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

                    <div className="absolute -right-20 bottom-[-120px] h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />

                    <div
                      className="absolute inset-0 opacity-[0.025]"
                      style={{
                        backgroundImage:
                          "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                        backgroundSize:
                          "42px 42px",
                      }}
                    />
                  </div>

                  <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>

                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                            Active Shared Agent
                          </p>
                        </div>

                        <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                          {selectedAgent?.name ||
                            "Selected Agent"}
                        </h3>

                        {selectedAgent?.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            {
                              selectedAgent.description
                            }
                          </p>
                        )}

                        {selectedAgent?.created_by_name && (
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            Created by{" "}
                            <span className="text-slate-300">
                              {
                                selectedAgent.created_by_name
                              }
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2">
                      <WorkspaceAction
                        icon={
                          FileText
                        }
                        title="Documents"
                        onClick={() =>
                          router.push(
                            "/documents"
                          )
                        }
                      />

                      <WorkspaceAction
                        icon={Code2}
                        title="GitHub Agent"
                        onClick={() =>
                          router.push(
                            "/github"
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          router.push(
                            "/chat"
                          )
                        }
                        className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
                      >
                        <MessageSquare className="h-4 w-4" />

                        Open AI Chat
                      </button>
                    </div>
                  </div>
                </section>

                {/* =================================================
                    REAL STATISTICS
                ================================================== */}

                <section className="mt-7 grid gap-5 md:grid-cols-3">
                  <DashboardStatCard
                    icon={
                      FileText
                    }
                    title="Documents Uploaded"
                    value={
                      stats.total
                    }
                    description="Files in this workspace"
                    color="blue"
                  />

                  <DashboardStatCard
                    icon={
                      CheckCircle2
                    }
                    title="Indexed Documents"
                    value={
                      stats.indexed
                    }
                    description="Ready for retrieval"
                    color="emerald"
                  />

                  <DashboardStatCard
                    icon={
                      Database
                    }
                    title="AI Knowledge Chunks"
                    value={
                      stats.chunks
                    }
                    description="Searchable RAG chunks"
                    color="violet"
                  />
                </section>

                {/* QUICK ACTIONS */}
                <section className="mt-8">
                  <div>
                    <p className="text-lg font-black text-slate-950">
                      Quick Actions
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Continue building the selected agent workspace.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <QuickAction
                      icon={
                        Upload
                      }
                      title="Upload Document"
                      description="Add enterprise documents to the active agent."
                      gradient="from-blue-600 to-cyan-500"
                      onClick={() =>
                        router.push(
                          "/documents"
                        )
                      }
                    />

                    <QuickAction
                      icon={Code2}
                      title="Connect GitHub"
                      description="Index source code for developer intelligence."
                      gradient="from-violet-600 to-purple-500"
                      onClick={() =>
                        router.push(
                          "/github"
                        )
                      }
                    />

                    <QuickAction
                      icon={
                        MessageSquare
                      }
                      title="Ask Copilot"
                      description="Start a grounded conversation with this agent."
                      gradient="from-emerald-600 to-cyan-500"
                      onClick={() =>
                        router.push(
                          "/chat"
                        )
                      }
                    />
                  </div>
                </section>

                {/* =================================================
                    DOCUMENTS
                ================================================== */}

                <section className="mt-8 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
                  {/* DOCUMENT HEADER */}
                  <div className="flex flex-col gap-5 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-950">
                          Knowledge Documents
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Shared documents indexed for this AI agent.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          "/documents"
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                    >
                      <FileText className="h-4 w-4" />

                      Manage Documents
                    </button>
                  </div>

                  {/* DOCUMENT CONTENT */}

                  {agentLoading ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16">
                      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading agent workspace...
                      </p>
                    </div>
                  ) : documents.length ===
                    0 ? (
                    <div className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>

                      <h4 className="mt-5 font-bold text-slate-900">
                        No documents indexed yet
                      </h4>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Upload your first enterprise document to turn this
                        agent into a searchable knowledge workspace.
                      </p>

                      <button
                        onClick={() =>
                          router.push(
                            "/documents"
                          )
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                      >
                        <Upload className="h-4 w-4" />

                        Upload Document
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {documents.map(
                        (
                          document
                        ) => (
                          <DocumentRow
                            key={
                              document.document_id
                            }
                            document={
                              document
                            }
                            formattedSize={formatFileSize(
                              document.size
                            )}
                          />
                        )
                      )}
                    </div>
                  )}
                </section>

                {/* PLATFORM STATUS */}
                <section className="mt-8 rounded-3xl border border-blue-100 bg-linear-to-r from-blue-50 via-violet-50/50 to-cyan-50 p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Enterprise AI workspace operational
                        </p>

                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          Persistent storage, vector retrieval and
                          grounded generation are available.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "FastAPI",
                        "MongoDB",
                        "Qdrant",
                        "Gemini",
                      ].map(
                        (
                          service
                        ) => (
                          <span
                            key={
                              service
                            }
                            className="rounded-lg border border-white bg-white/80 px-3 py-2 text-[11px] font-bold text-slate-600 shadow-sm"
                          >
                            {
                              service
                            }
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  title,
  active = false,
  onClick,
}: {
  icon: ElementType;
  title: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
        active
          ? "bg-linear-to-r from-blue-600/20 via-violet-600/10 to-transparent text-white ring-1 ring-blue-400/10"
          : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <Icon
        className={`h-4 w-4 ${
          active
            ? "text-blue-400"
            : "text-slate-500"
        }`}
      />

      {title}
    </button>
  );
}

/* =========================================================
   WORKSPACE ACTION
========================================================= */

function WorkspaceAction({
  icon: Icon,
  title,
  onClick,
}: {
  icon: ElementType;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={
        onClick
      }
      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-slate-300 backdrop-blur transition hover:border-blue-400/20 hover:bg-blue-500/10 hover:text-white"
    >
      <Icon className="h-4 w-4" />

      {title}
    </button>
  );
}

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStatCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}: {
  icon: ElementType;
  title: string;
  value: number;
  description: string;
  color:
    | "blue"
    | "emerald"
    | "violet";
}) {
  const styles = {
    blue: {
      icon:
        "bg-blue-50 text-blue-600",
      glow:
        "from-blue-600 to-cyan-500",
    },

    emerald: {
      icon:
        "bg-emerald-50 text-emerald-600",
      glow:
        "from-emerald-600 to-cyan-500",
    },

    violet: {
      icon:
        "bg-violet-50 text-violet-600",
      glow:
        "from-violet-600 to-purple-500",
    },
  };

  const current =
    styles[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.10)]">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-linear-to-r ${current.glow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${current.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  gradient,
  onClick,
}: {
  icon: ElementType;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={
        onClick
      }
      className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.10)]"
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${gradient} shadow-lg shadow-blue-500/10`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      <h3 className="mt-5 text-sm font-bold text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-slate-500">
        {description}
      </p>

      <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
    </button>
  );
}

/* =========================================================
   DOCUMENT ROW
========================================================= */

function DocumentRow({
  document,
  formattedSize,
}: {
  document: DocumentItem;
  formattedSize: string;
}) {
  const isIndexed =
    document.status ===
    "Indexed";

  const isFailed =
    document.status ===
    "Failed";

  return (
    <div className="group flex flex-col gap-5 p-5 transition hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-violet-50">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-slate-900">
            {document.name}
          </h4>

          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {document.type}

            <span className="mx-2 text-slate-300">
              •
            </span>

            {formattedSize}

            <span className="mx-2 text-slate-300">
              •
            </span>

            {document.chunks}{" "}
            chunks
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        {/* PROGRESS */}
        <div className="w-28">
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>
              Progress
            </span>

            <span>
              {
                document.progress
              }
              %
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 transition-all"
              style={{
                width: `${Math.min(
                  Math.max(
                    document.progress ||
                      0,
                    0
                  ),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* STATUS */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
            isIndexed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : isFailed
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isIndexed
                ? "bg-emerald-500"
                : isFailed
                  ? "bg-red-500"
                  : "bg-amber-500"
            }`}
          />

          {
            document.status
          }
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   FULL PAGE MESSAGE
========================================================= */

function FullPageMessage({
  type,
  title,
  description,
  action,
  onAction,
}: {
  type:
    | "error"
    | "empty";
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) {
  const isError =
    type === "error";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F7FB] px-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[130px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[450px] w-[450px] rounded-full bg-violet-300/10 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-xl rounded-3xl border border-white bg-white/90 p-9 text-center shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            isError
              ? "bg-red-50"
              : "bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500"
          }`}
        >
          {isError ? (
            <XCircle className="h-7 w-7 text-red-500" />
          ) : (
            <Bot className="h-7 w-7 text-white" />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
          {description}
        </p>

        <button
          onClick={
            onAction
          }
          className={`mt-7 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 ${
            isError
              ? "bg-red-600 shadow-red-500/20 hover:bg-red-700"
              : "bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 shadow-blue-500/20"
          }`}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
