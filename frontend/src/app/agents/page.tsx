// "use client";

// import {
//   useEffect,
//   useState,
// } from "react";

// import {
//   Agent,
//   getAgents,
//   createAgent,
//   setSelectedAgent,
//   getSelectedAgent,
// } from "@/lib/agents";

// import {
//   useRouter,
// } from "next/navigation";

// import {
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";


// export default function AgentsPage() {
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
//     name,
//     setName,
//   ] = useState("");


//   const [
//     description,
//     setDescription,
//   ] = useState("");


//   const [
//     loading,
//     setLoading,
//   ] = useState(true);


//   const [
//     creating,
//     setCreating,
//   ] = useState(false);


//   const [
//     error,
//     setError,
//   ] = useState("");


//   const [
//     success,
//     setSuccess,
//   ] = useState("");


//   const [
//     popup,
//     setPopup,
//   ] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);


//   useEffect(() => {
//     loadAgents();
//   }, []);


//   // =========================================================
//   // POPUP
//   // =========================================================

//   function showPopup(
//     type: "success" | "error",
//     message: string
//   ) {
//     setPopup({
//       type,
//       message,
//     });


//     setTimeout(() => {
//       setPopup(null);
//     }, 3000);
//   }


//   // =========================================================
//   // CLEAR OLD AGENT WORKSPACE
//   // =========================================================

//   function clearOldWorkspace() {
//     localStorage.removeItem(
//       "selected_document_id"
//     );

//     localStorage.removeItem(
//       "selected_repository_id"
//     );
//   }


//   // =========================================================
//   // LOAD ALL SHARED AGENTS
//   // =========================================================

//   async function loadAgents() {
//     try {
//       setLoading(true);
//       setError("");


//       const data =
//         await getAgents();


//       const safeAgents =
//         Array.isArray(data)
//           ? data
//           : [];


//       setAgents(
//         safeAgents
//       );


//       const saved =
//         getSelectedAgent();


//       if (
//         saved &&
//         safeAgents.some(
//           (agent) =>
//             agent.agent_id ===
//             saved
//         )
//       ) {
//         setSelectedAgentId(
//           saved
//         );

//       } else {
//         localStorage.removeItem(
//           "selected_agent_id"
//         );

//         setSelectedAgentId("");
//       }


//     } catch (err: any) {

//       const message =
//         err.message ||
//         "Failed to load agents.";


//       setError(
//         message
//       );


//       showPopup(
//         "error",
//         message
//       );


//     } finally {
//       setLoading(false);
//     }
//   }


//   // =========================================================
//   // CREATE SHARED AGENT
//   // =========================================================

//   async function handleCreateAgent(
//     e: React.FormEvent
//   ) {
//     e.preventDefault();


//     setError("");
//     setSuccess("");


//     if (!name.trim()) {

//       const message =
//         "Agent name is required.";


//       setError(
//         message
//       );


//       showPopup(
//         "error",
//         message
//       );


//       return;
//     }


//     try {
//       setCreating(true);


//       const newAgent =
//         await createAgent({

//           name:
//             name.trim(),

//           description:
//             description.trim(),

//         });


//       setAgents(
//         (prev) => [
//           ...prev,
//           newAgent,
//         ]
//       );


//       // Clear old document/repository
//       // because we are changing agent.
//       clearOldWorkspace();


//       // Save newly created agent
//       // as selected.
//       setSelectedAgent(
//         newAgent.agent_id
//       );


//       setSelectedAgentId(
//         newAgent.agent_id
//       );


//       setName("");
//       setDescription("");


//       const message =
//         "Agent created and selected successfully.";


//       setSuccess(
//         message
//       );


//       showPopup(
//         "success",
//         message
//       );


//       /*
//        * Go back to dashboard instead of
//        * automatically going to Documents.
//        *
//        * Dashboard becomes the main
//        * workspace entry point.
//        */
//       setTimeout(() => {

//         router.push(
//           "/dashboard"
//         );

//       }, 800);


//     } catch (err: any) {

//       const message =
//         err.message ||
//         "Failed to create agent.";


//       setError(
//         message
//       );


//       showPopup(
//         "error",
//         message
//       );


//     } finally {
//       setCreating(false);
//     }
//   }


//   // =========================================================
//   // SELECT SHARED AGENT
//   // =========================================================

//   function handleSelectAgent(
//     agentId: string
//   ) {

//     clearOldWorkspace();


//     setSelectedAgent(
//       agentId
//     );


//     setSelectedAgentId(
//       agentId
//     );


//     const selected =
//       agents.find(
//         (agent) =>
//           agent.agent_id ===
//           agentId
//       );


//     const message =
//       selected
//         ? `${selected.name} selected successfully.`
//         : "Agent selected successfully.";


//     setSuccess(
//       message
//     );


//     showPopup(
//       "success",
//       message
//     );


//     /*
//      * Selection should return to Dashboard.
//      *
//      * Dashboard then gives:
//      * Documents
//      * GitHub Agent
//      * Open Chat
//      */
//     setTimeout(() => {

//       router.push(
//         "/dashboard"
//       );

//     }, 500);
//   }


//   // =========================================================
//   // CONTINUE TO DASHBOARD
//   // =========================================================

//   function handleContinueToDashboard(
//     agentId: string
//   ) {

//     clearOldWorkspace();


//     setSelectedAgent(
//       agentId
//     );


//     setSelectedAgentId(
//       agentId
//     );


//     router.push(
//       "/dashboard"
//     );
//   }


//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <>



//       {popup && (

//         <div className="fixed right-5 top-5 z-[9999]">

//           <div
//             className={
//               popup.type === "success"

//                 ? "flex min-w-[320px] items-center gap-3 rounded-xl border border-green-200 bg-white px-5 py-4 shadow-xl"

//                 : "flex min-w-[320px] items-center gap-3 rounded-xl border border-red-200 bg-white px-5 py-4 shadow-xl"
//             }
//           >


//             {popup.type ===
//             "success" ? (

//               <CheckCircle2
//                 size={24}
//                 className="text-green-600"
//               />

//             ) : (

//               <XCircle
//                 size={24}
//                 className="text-red-600"
//               />

//             )}


//             <div className="flex-1">

//               <p
//                 className={
//                   popup.type ===
//                   "success"

//                     ? "font-semibold text-green-700"

//                     : "font-semibold text-red-700"
//                 }
//               >

//                 {popup.type ===
//                 "success"
//                   ? "Success"
//                   : "Error"}

//               </p>


//               <p className="mt-1 text-sm text-slate-600">
//                 {popup.message}
//               </p>

//             </div>


//             <button
//               type="button"
//               onClick={() =>
//                 setPopup(null)
//               }
//               className="text-xl text-slate-400 hover:text-slate-700"
//             >
//               ×
//             </button>

//           </div>

//         </div>

//       )}


//       {/* ================================================= */}
//       {/* PAGE */}
//       {/* ================================================= */}

//       <div className="min-h-screen bg-slate-50 p-8">

//         <div className="mx-auto max-w-6xl">


//           {/* ================================================= */}
//           {/* PAGE HEADER */}
//           {/* ================================================= */}

//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

//             <div>

//               <h1 className="text-3xl font-bold text-slate-900">
//                 Agents
//               </h1>


//               <p className="mt-2 text-slate-500">
//                 Create or select a shared organization agent.
//               </p>

//             </div>


//             <button
//               type="button"
//               onClick={() =>
//                 router.push(
//                   "/dashboard"
//                 )
//               }
//               className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
//             >
//               Back to Dashboard
//             </button>

//           </div>


//           {/* ================================================= */}
//           {/* CREATE AGENT */}
//           {/* ================================================= */}

//           <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <h2 className="text-xl font-semibold text-slate-900">
//               Create Shared Agent
//             </h2>


//             <p className="mt-1 text-sm text-slate-500">
//               Create a shared workspace for documents,
//               repositories and Enterprise AI knowledge.
//             </p>


//             <form
//               onSubmit={
//                 handleCreateAgent
//               }
//               className="mt-5 space-y-5"
//             >


//               {/* AGENT NAME */}

//               <div>

//                 <label className="text-sm font-medium text-slate-700">
//                   Agent Name
//                 </label>


//                 <input
//                   value={
//                     name
//                   }
//                   onChange={(e) =>
//                     setName(
//                       e.target.value
//                     )
//                   }
//                   placeholder="Engineering Team"
//                   disabled={
//                     creating
//                   }
//                   className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//                 />

//               </div>


//               {/* DESCRIPTION */}

//               <div>

//                 <label className="text-sm font-medium text-slate-700">
//                   Description
//                 </label>


//                 <textarea
//                   value={
//                     description
//                   }
//                   onChange={(e) =>
//                     setDescription(
//                       e.target.value
//                     )
//                   }
//                   placeholder="Enterprise engineering knowledge"
//                   rows={4}
//                   disabled={
//                     creating
//                   }
//                   className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
//                 />

//               </div>


//               <button
//                 type="submit"
//                 disabled={
//                   creating
//                 }
//                 className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >

//                 {creating
//                   ? "Creating..."
//                   : "Create Agent"}

//               </button>

//             </form>


//             {error && (

//               <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                 {error}
//               </div>

//             )}


//             {success && (

//               <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//                 {success}
//               </div>

//             )}

//           </div>


//           {/* ================================================= */}
//           {/* SHARED AGENT LIST */}
//           {/* ================================================= */}

//           <div className="mt-10">

//             <div>

//               <h2 className="text-2xl font-semibold text-slate-900">
//                 Available Agents
//               </h2>


//               <p className="mt-1 text-sm text-slate-500">
//                 All active agents are shared across the
//                 organization. Select one to open its workspace.
//               </p>

//             </div>


//             {/* LOADING */}

//             {loading ? (

//               <div className="mt-5 rounded-xl border bg-white p-8 text-center text-slate-500">
//                 Loading agents...
//               </div>

//             ) : agents.length === 0 ? (

//               /* ZERO AGENTS */

//               <div className="mt-5 rounded-xl border bg-white p-8 text-center">

//                 <p className="font-medium text-slate-700">
//                   No agents available.
//                 </p>


//                 <p className="mt-2 text-sm text-slate-500">
//                   Create the first shared organization agent above.
//                 </p>

//               </div>

//             ) : (

//               /* AGENT CARDS */

//               <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">


//                 {agents.map(
//                   (agent) => {

//                     const isSelected =
//                       selectedAgentId ===
//                       agent.agent_id;


//                     return (

//                       <div
//                         key={
//                           agent.agent_id
//                         }
//                         className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
//                           isSelected
//                             ? "border-blue-600 ring-2 ring-blue-100"
//                             : "border-slate-200 hover:border-slate-300"
//                         }`}
//                       >


//                         {/* CARD HEADER */}

//                         <div className="flex items-start justify-between gap-3">

//                           <div>

//                             <h3 className="text-lg font-semibold text-slate-900">
//                               {agent.name}
//                             </h3>


//                             {agent.created_by_name && (

//                               <p className="mt-1 text-xs text-slate-400">
//                                 Created by:{" "}
//                                 {
//                                   agent.created_by_name
//                                 }
//                               </p>

//                             )}

//                           </div>


//                           {isSelected && (

//                             <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
//                               Selected
//                             </span>

//                           )}

//                         </div>


//                         {/* DESCRIPTION */}

//                         <p className="mt-3 text-sm text-slate-500">

//                           {agent.description ||
//                             "No description"}

//                         </p>


//                         {/* AGENT ID */}

//                         <p className="mt-4 break-all text-xs text-slate-400">

//                           Agent ID:{" "}
//                           {
//                             agent.agent_id
//                           }

//                         </p>


//                         {/* CREATOR / OWNER */}

//                         {agent.owner_id && (

//                           <p className="mt-2 break-all text-xs text-slate-400">

//                             Owner ID:{" "}
//                             {
//                               agent.owner_id
//                             }

//                           </p>

//                         )}


//                         {/* MEMBERS */}

//                         <p className="mt-3 text-sm text-slate-700">

//                           Members:{" "}

//                           {
//                             agent.members
//                               ?.length || 0
//                           }

//                         </p>


//                         {/* STATUS */}

//                         {agent.is_active !==
//                           undefined && (

//                           <div className="mt-3">

//                             <span
//                               className={`rounded-full px-3 py-1 text-xs font-medium ${
//                                 agent.is_active
//                                   ? "bg-green-100 text-green-700"
//                                   : "bg-slate-100 text-slate-600"
//                               }`}
//                             >

//                               {agent.is_active
//                                 ? "Active"
//                                 : "Inactive"}

//                             </span>

//                           </div>

//                         )}


//                         {/* SELECT BUTTON */}

//                         {!isSelected && (

//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleSelectAgent(
//                                 agent.agent_id
//                               )
//                             }
//                             className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
//                           >
//                             Select Agent
//                           </button>

//                         )}


//                         {/* CURRENT SELECTED AGENT */}

//                         {isSelected && (

//                           <>

//                             <button
//                               type="button"
//                               disabled
//                               className="mt-5 w-full cursor-default rounded-xl bg-blue-100 px-4 py-3 font-medium text-blue-700"
//                             >
//                               Selected Agent
//                             </button>


//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleContinueToDashboard(
//                                   agent.agent_id
//                                 )
//                               }
//                               className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
//                             >
//                               Open Workspace
//                             </button>

//                           </>

//                         )}

//                       </div>

//                     );
//                   }
//                 )}

//               </div>

//             )}

//           </div>

//         </div>

//       </div>

//     </>
//   );
// }


"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type FormEvent,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  type Agent,
  getAgents,
  createAgent,
  setSelectedAgent,
  getSelectedAgent,
} from "@/lib/agents";

export default function AgentsPage() {
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
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    popup,
    setPopup,
  ] = useState<{
    type:
      | "success"
      | "error";

    message:
      string;
  } | null>(
    null
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadAgents();
  }, []);

  // =========================================================
  // POPUP
  // =========================================================

  function showPopup(
    type:
      | "success"
      | "error",

    message:
      string
  ) {
    setPopup({
      type,
      message,
    });

    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }

  // =========================================================
  // CLEAR PREVIOUS WORKSPACE
  // =========================================================

  function clearOldWorkspace() {
    localStorage.removeItem(
      "selected_document_id"
    );

    localStorage.removeItem(
      "selected_repository_id"
    );
  }

  // =========================================================
  // LOAD SHARED AGENTS
  // =========================================================

  async function loadAgents() {
    try {
      setLoading(true);

      setError("");

      const data =
        await getAgents();

      const safeAgents =
        Array.isArray(
          data
        )
          ? data
          : [];

      setAgents(
        safeAgents
      );

      const saved =
        getSelectedAgent();

      if (
        saved &&
        safeAgents.some(
          (
            agent
          ) =>
            agent.agent_id ===
            saved
        )
      ) {
        setSelectedAgentId(
          saved
        );
      } else {
        localStorage.removeItem(
          "selected_agent_id"
        );

        setSelectedAgentId("");
      }
    } catch (
      err: any
    ) {
      const message =
        err.message ||
        "Failed to load agents.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // CREATE AGENT
  // =========================================================

  async function handleCreateAgent(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    setSuccess("");

    if (!name.trim()) {
      const message =
        "Agent name is required.";

      setError(
        message
      );

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
        (
          previous
        ) => [
          ...previous,
          newAgent,
        ]
      );

      clearOldWorkspace();

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

      setSuccess(
        message
      );

      showPopup(
        "success",
        message
      );

      setTimeout(() => {
        router.push(
          "/dashboard"
        );
      }, 800);
    } catch (
      err: any
    ) {
      const message =
        err.message ||
        "Failed to create agent.";

      setError(
        message
      );

      showPopup(
        "error",
        message
      );
    } finally {
      setCreating(false);
    }
  }

  // =========================================================
  // SELECT AGENT
  // =========================================================

  function handleSelectAgent(
    agentId:
      string
  ) {
    clearOldWorkspace();

    setSelectedAgent(
      agentId
    );

    setSelectedAgentId(
      agentId
    );

    const selected =
      agents.find(
        (
          agent
        ) =>
          agent.agent_id ===
          agentId
      );

    const message =
      selected
        ? `${selected.name} selected successfully.`
        : "Agent selected successfully.";

    setSuccess(
      message
    );

    showPopup(
      "success",
      message
    );

    setTimeout(() => {
      router.push(
        "/dashboard"
      );
    }, 500);
  }

  // =========================================================
  // CONTINUE TO DASHBOARD
  // =========================================================

  function handleContinueToDashboard(
    agentId:
      string
  ) {
    clearOldWorkspace();

    setSelectedAgent(
      agentId
    );

    setSelectedAgentId(
      agentId
    );

    router.push(
      "/dashboard"
    );
  }

  // =========================================================
  // FILTERS / STATS
  // =========================================================

  const filteredAgents =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return agents;
      }

      return agents.filter(
        (
          agent
        ) =>
          agent.name
            ?.toLowerCase()
            .includes(
              query
            ) ||
          agent.description
            ?.toLowerCase()
            .includes(
              query
            ) ||
          agent.created_by_name
            ?.toLowerCase()
            .includes(
              query
            )
      );
    }, [
      agents,
      searchTerm,
    ]);

  const activeAgents =
    agents.filter(
      (
        agent
      ) =>
        agent.is_active !==
        false
    ).length;

  const memberCount =
    agents.reduce(
      (
        total,
        agent
      ) =>
        total +
        (
          agent.members
            ?.length ||
          0
        ),
      0
    );

  const selectedAgent =
    agents.find(
      (
        agent
      ) =>
        agent.agent_id ===
        selectedAgentId
    );

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* =====================================================
          POPUP
      ====================================================== */}

      {popup && (
        <div className="fixed right-5 top-5 z-[9999]">
          <div
            className={`flex min-w-[320px] items-start gap-3 rounded-2xl border bg-white px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ${
              popup.type ===
              "success"
                ? "border-emerald-200"
                : "border-red-200"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                popup.type ===
                "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {popup.type ===
              "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-black ${
                  popup.type ===
                  "success"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {popup.type ===
                "success"
                  ? "Success"
                  : "Something went wrong"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {
                  popup.message
                }
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setPopup(
                  null
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================== */}

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] overflow-hidden bg-[#08111F] lg:flex lg:flex-col">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />

            <div className="absolute -bottom-28 right-[-100px] h-72 w-72 rounded-full bg-violet-600/10 blur-[110px]" />
          </div>

          <div className="relative flex h-full flex-col">
            {/* BRAND */}
            <div className="flex h-18 items-center gap-3 border-b border-white/[0.07] px-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                <Bot className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Enterprise AI
                </p>

                <p className="text-[10px] font-medium text-slate-500">
                  Operations Copilot
                </p>
              </div>
            </div>

            {/* SIDEBAR CONTENT */}
            <div className="flex-1 px-4 py-5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Organization
              </p>

              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                    <Users className="h-4 w-4 text-violet-400" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                      Shared Agents
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        agents.length
                      }
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-white/[0.06]" />

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                      Active Agents
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {
                        activeAgents
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* WORKSPACE MODEL */}
              <div className="mt-7">
                <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Agent Workspace
                </p>

                <div className="mt-3 space-y-1">
                  <SidebarItem
                    icon={
                      FileText
                    }
                    title="Documents"
                  />

                  <SidebarItem
                    icon={
                      Code2
                    }
                    title="Repositories"
                  />

                  <SidebarItem
                    icon={
                      Database
                    }
                    title="Vector Knowledge"
                  />

                  <SidebarItem
                    icon={
                      MessageSquare
                    }
                    title="Grounded Chat"
                  />
                </div>
              </div>

              {/* ACTIVE WORKSPACE */}
              {selectedAgent && (
                <div className="mt-7 rounded-2xl border border-blue-400/10 bg-blue-500/[0.06] p-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    <p className="text-[10px] font-bold uppercase tracking-wide text-blue-300">
                      Selected Workspace
                    </p>
                  </div>

                  <p className="mt-3 truncate text-xs font-bold text-white">
                    {
                      selectedAgent.name
                    }
                  </p>

                  <p className="mt-1 text-[9px] leading-5 text-slate-500">
                    Ready for enterprise knowledge workflows.
                  </p>
                </div>
              )}
            </div>

            {/* NAV */}
            <div className="border-t border-white/[0.07] p-4">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />

                Dashboard
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN
        ================================================== */}

        <main className="min-h-screen min-w-0 flex-1 lg:ml-[252px]">
          {/* HEADER */}
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-[72px] items-center justify-between px-5 py-3 lg:px-7">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard"
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-md shadow-blue-500/20">
                  <Users className="h-4 w-4 text-white" />
                </div>

                <div>
                  <h1 className="text-base font-black tracking-tight text-slate-950">
                    AI Workspaces
                  </h1>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Shared enterprise knowledge agents
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 sm:flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" />

                Dashboard
              </button>
            </div>
          </header>

          {/* PAGE */}
          <div className="relative overflow-hidden px-5 py-8 lg:px-7 lg:py-10">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-40 top-[-80px] h-[450px] w-[450px] rounded-full bg-blue-300/[0.08] blur-[140px]" />

              <div className="absolute right-[-150px] top-[300px] h-[450px] w-[450px] rounded-full bg-violet-300/[0.08] blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl">
              {/* HERO */}
              <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />

                    Shared Organization Intelligence
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                    Build specialized
                    <span className="bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                      {" "}
                      AI workspaces.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    Each agent acts as a shared knowledge workspace for
                    documents, GitHub repositories and grounded enterprise
                    conversations.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  {
                    activeAgents
                  } active workspaces
                </div>
              </section>

              {/* =================================================
                  OVERVIEW STATS
              ================================================== */}

              <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AgentStat
                  icon={
                    Bot
                  }
                  title="Shared Agents"
                  value={
                    agents.length
                  }
                  description="Organization workspaces"
                  color="blue"
                />

                <AgentStat
                  icon={
                    CheckCircle2
                  }
                  title="Active"
                  value={
                    activeAgents
                  }
                  description="Available for use"
                  color="emerald"
                />

                <AgentStat
                  icon={
                    Users
                  }
                  title="Memberships"
                  value={
                    memberCount
                  }
                  description="Agent member assignments"
                  color="violet"
                />
              </section>

              {/* =================================================
                  CREATE AGENT
              ================================================== */}

              <section className="mt-8 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                  {/* LEFT INFO */}
                  <div className="relative overflow-hidden bg-[#07111F] p-7 md:p-8">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-[90px]" />

                      <div className="absolute -bottom-24 right-[-80px] h-64 w-64 rounded-full bg-violet-600/20 blur-[100px]" />
                    </div>

                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                        <Plus className="h-5 w-5 text-white" />
                      </div>

                      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                        New Workspace
                      </p>

                      <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                        Create a shared AI agent
                      </h3>

                      <p className="mt-4 text-xs leading-6 text-slate-400">
                        Give teams a dedicated workspace where repositories,
                        documents and AI conversations stay organized under
                        one shared knowledge context.
                      </p>

                      <div className="mt-7 space-y-3">
                        <FeatureItem
                          icon={
                            FileText
                          }
                          text="Enterprise documents"
                        />

                        <FeatureItem
                          icon={
                            Code2
                          }
                          text="GitHub repositories"
                        />

                        <FeatureItem
                          icon={
                            Database
                          }
                          text="Vector knowledge"
                        />

                        <FeatureItem
                          icon={
                            MessageSquare
                          }
                          text="Grounded AI conversations"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FORM */}
                  <div className="p-7 md:p-8">
                    <div>
                      <p className="text-xs font-black text-slate-950">
                        Workspace Details
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Use a clear name so team members can identify the
                        workspace easily.
                      </p>
                    </div>

                    <form
                      onSubmit={
                        handleCreateAgent
                      }
                      className="mt-6 space-y-5"
                    >
                      {/* NAME */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          Agent Name
                        </label>

                        <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/50">
                          <Bot className="h-4 w-4 shrink-0 text-slate-400" />

                          <input
                            value={
                              name
                            }
                            onChange={(
                              event
                            ) =>
                              setName(
                                event.target.value
                              )
                            }
                            placeholder="Engineering Intelligence"
                            disabled={
                              creating
                            }
                            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          Description
                        </label>

                        <textarea
                          value={
                            description
                          }
                          onChange={(
                            event
                          ) =>
                            setDescription(
                              event.target.value
                            )
                          }
                          placeholder="Engineering documentation, repositories and technical knowledge..."
                          rows={4}
                          disabled={
                            creating
                          }
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100/50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* ALERTS */}
                      {error && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                          {
                            error
                          }
                        </div>
                      )}

                      {success && (
                        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                          {
                            success
                          }
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={
                          creating ||
                          !name.trim()
                        }
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {creating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />

                            Creating Workspace...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />

                            Create AI Workspace

                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </section>

              {/* =================================================
                  AVAILABLE AGENTS
              ================================================== */}

              <section className="mt-9">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                        Organization Workspaces
                      </p>
                    </div>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      Available AI Agents
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Select a workspace to access its documents,
                      repositories and enterprise AI context.
                    </p>
                  </div>

                  {/* SEARCH */}
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      value={
                        searchTerm
                      }
                      onChange={(
                        event
                      ) =>
                        setSearchTerm(
                          event.target.value
                        )
                      }
                      placeholder="Search workspaces..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50"
                    />
                  </div>
                </div>

                {/* LOADING */}
                {loading ? (
                  <div className="mt-5 flex flex-col items-center justify-center rounded-3xl border border-white bg-white/90 px-6 py-16 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      Loading AI workspaces
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Fetching shared organization agents...
                    </p>
                  </div>
                ) : agents.length ===
                  0 ? (
                  <div className="mt-5 rounded-3xl border border-white bg-white/90 px-6 py-16 text-center shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 via-violet-100 to-cyan-100">
                      <Bot className="h-7 w-7 text-blue-600" />
                    </div>

                    <h4 className="mt-5 text-lg font-black text-slate-900">
                      Create your first workspace
                    </h4>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      No shared agents exist yet. Create one above to start
                      building enterprise knowledge.
                    </p>
                  </div>
                ) : filteredAgents.length ===
                  0 ? (
                  <div className="mt-5 rounded-3xl border border-white bg-white/90 px-6 py-14 text-center shadow-sm">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No matching workspaces
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try another name, description or creator.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredAgents.map(
                      (
                        agent
                      ) => (
                        <AgentCard
                          key={
                            agent.agent_id
                          }
                          agent={
                            agent
                          }
                          selected={
                            selectedAgentId ===
                            agent.agent_id
                          }
                          onSelect={() =>
                            handleSelectAgent(
                              agent.agent_id
                            )
                          }
                          onOpen={() =>
                            handleContinueToDashboard(
                              agent.agent_id
                            )
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   AGENT CARD
========================================================= */

function AgentCard({
  agent,
  selected,
  onSelect,
  onOpen,
}: {
  agent:
    Agent;

  selected:
    boolean;

  onSelect:
    () => void;

  onOpen:
    () => void;
}) {
  const memberCount =
    agent.members
      ?.length ||
    0;

  const active =
    agent.is_active !==
    false;

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
        selected
          ? "border-blue-300 bg-linear-to-br from-blue-50 via-white to-violet-50/60 shadow-[0_18px_45px_rgba(37,99,235,0.12)]"
          : "border-white bg-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_18px_45px_rgba(37,99,235,0.09)]"
      }`}
    >
      {selected && (
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500" />
      )}

      {/* CARD TOP */}
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            selected
              ? "bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600"
          }`}
        >
          <Bot className="h-5 w-5" />
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
              active
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                active
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }`}
            />

            {active
              ? "Active"
              : "Inactive"}
          </span>

          {selected && (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-1 text-[9px] font-bold text-blue-700">
              <CheckCircle2 className="h-3 w-3" />

              Selected
            </span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <h3 className="mt-5 truncate text-lg font-black tracking-tight text-slate-950">
        {
          agent.name
        }
      </h3>

      <p className="mt-2 min-h-[48px] text-xs leading-6 text-slate-500">
        {agent.description ||
          "Shared enterprise knowledge workspace for documents, repositories and grounded AI."}
      </p>

      {/* META */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <MetaItem
          icon={
            Users
          }
          title="Members"
          value={String(
            memberCount
          )}
        />

        <MetaItem
          icon={
            ShieldCheck
          }
          title="Status"
          value={
            active
              ? "Available"
              : "Inactive"
          }
        />
      </div>

      {/* CREATOR */}
      {agent.created_by_name && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Created By
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
            {
              agent.created_by_name
            }
          </p>
        </div>
      )}

      {/* AGENT ID */}
      <div className="mt-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
          Agent ID
        </p>

        <p className="mt-1 truncate font-mono text-[10px] text-slate-500">
          {
            agent.agent_id
          }
        </p>
      </div>

      {/* ACTION */}
      {!selected ? (
        <button
          type="button"
          onClick={
            onSelect
          }
          disabled={
            !active
          }
          className="group/button mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Select Workspace

          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-1" />
        </button>
      ) : (
        <button
          type="button"
          onClick={
            onOpen
          }
          className="group/button mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5"
        >
          Open Workspace

          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-1" />
        </button>
      )}
    </article>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon: Icon,
  title,
  value,
}: {
  icon:
    ElementType;

  title:
    string;

  value:
    string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-bold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function AgentStat({
  icon: Icon,
  title,
  value,
  description,
  color,
}: {
  icon:
    ElementType;

  title:
    string;

  value:
    number;

  description:
    string;

  color:
    | "blue"
    | "emerald"
    | "violet";
}) {
  const styles = {
    blue: {
      icon:
        "bg-blue-50 text-blue-600",

      accent:
        "from-blue-600 to-cyan-500",
    },

    emerald: {
      icon:
        "bg-emerald-50 text-emerald-600",

      accent:
        "from-emerald-600 to-cyan-500",
    },

    violet: {
      icon:
        "bg-violet-50 text-violet-600",

      accent:
        "from-violet-600 to-purple-500",
    },
  };

  const current =
    styles[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.09)]">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-linear-to-r ${current.accent} opacity-0 transition group-hover:opacity-100`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
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
   FEATURE ITEM
========================================================= */

function FeatureItem({
  icon: Icon,
  text,
}: {
  icon:
    ElementType;

  text:
    string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-blue-300">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <p className="text-[11px] font-medium text-slate-300">
        {text}
      </p>

      <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-400" />
    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  title,
}: {
  icon:
    ElementType;

  title:
    string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <Icon className="h-3.5 w-3.5" />
      </div>

      <span className="text-[11px] font-medium text-slate-300">
        {title}
      </span>

      <CheckCircle2 className="ml-auto h-3 w-3 text-emerald-400" />
    </div>
  );
}