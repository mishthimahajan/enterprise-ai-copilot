// "use client";

// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   getDocuments,
//   uploadDocument,
//   DocumentItem,
// } from "@/lib/documents";

// import {useRouter} from "next/navigation";

// export default function DocumentsPage() {
//   const [documents, setDocuments] =
//     useState<DocumentItem[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [uploading, setUploading] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");

//   const fileInputRef =
//     useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   async function loadDocuments() {
//     const agentId =
//       localStorage.getItem(
//         "selected_agent_id"
//       );

//     if (!agentId) {
//       setError(
//         "Please select an agent first."
//       );

//       setLoading(false);

//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await getDocuments(
//           agentId
//         );

//       setDocuments(
//         data.documents || []
//       );

//     } catch (error: any) {
//       console.error(
//         "Load documents error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Failed to load documents."
//       );

//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadDocuments();
//   }, []);

//   function openFilePicker() {
//     if (uploading) {
//       return;
//     }

//     fileInputRef.current?.click();
//   }

//   async function handleFileChange(
//     event: React.ChangeEvent<HTMLInputElement>
//   ) {
//     const file =
//       event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     await handleUpload(file);

//     event.target.value = "";
//   }

//   async function handleUpload(
//     file: File
//   ) {
//     try {
//       setUploading(true);
//       setError("");
//       setSuccess("");

//       const agentId =
//         localStorage.getItem(
//           "selected_agent_id"
//         );

//       if (!agentId) {
//         throw new Error(
//           "Please select an agent first."
//         );
//       }

//       await uploadDocument(
//         agentId,
//         file
//       );

//       const data =
//         await getDocuments(
//           agentId
//         );

//       setDocuments(
//         data.documents || []
//       );

//       setSuccess(
//         "Document uploaded and indexed successfully."
//       );

//     } catch (error: any) {
//       console.error(
//         "Upload error:",
//         error
//       );

//       setError(
//         error.message ||
//           "Document upload failed."
//       );

//     } finally {
//       setUploading(false);
//     }
//   }

//   function formatSize(
//     bytes: number
//   ) {
//     if (!bytes) {
//       return "0 KB";
//     }

//     if (
//       bytes <
//       1024 * 1024
//     ) {
//       return `${(
//         bytes / 1024
//       ).toFixed(1)} KB`;
//     }

//     return `${(
//       bytes /
//       1024 /
//       1024
//     ).toFixed(1)} MB`;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">

//       <div className="mx-auto max-w-7xl">

//         <div className="flex items-center justify-between">

//           <div>
//             <h1 className="text-3xl font-bold">
//               Documents
//             </h1>

//             <p className="mt-2 text-gray-600">
//               Documents available to the selected agent.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={openFilePicker}
//             disabled={uploading}
//             className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {uploading
//               ? "Uploading..."
//               : "Upload Document"}
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".pdf,.docx,.txt,.md"
//             onChange={handleFileChange}
//             disabled={uploading}
//             className="hidden"
//           />

//         </div>

//         {error && (
//           <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
//             {success}
//           </div>
//         )}

//         <div className="mt-8 rounded-xl bg-white p-6 shadow">

//           {loading ? (
//             <div className="py-10 text-center text-gray-500">
//               Loading documents...
//             </div>

//           ) : documents.length === 0 ? (
//             <div className="py-10 text-center">

//               <p className="text-gray-500">
//                 No documents available.
//               </p>

//               <p className="mt-2 text-sm text-gray-400">
//                 Upload a PDF, DOCX, TXT or Markdown file.
//               </p>

//             </div>

//           ) : (
//             <div className="space-y-3">

//               {documents.map(
//                 (document) => (
//                   <div
//                     key={
//                       document.document_id ||
//                       document.id
//                     }
//                     className="flex items-center justify-between rounded-lg border p-5"
//                   >

//                     <div>

//                       <h3 className="font-semibold">
//                         {document.name}
//                       </h3>

//                       <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

//                         <span>
//                           {document.type}
//                         </span>

//                         <span>
//                           {document.chunks} chunks
//                         </span>

//                         <span>
//                           {formatSize(
//                             document.size
//                           )}
//                         </span>

//                         <span>
//                           {document.progress}%
//                         </span>

//                       </div>

//                     </div>

//                     <div className="flex items-center gap-3">

//   <span
//     className={
//       document.status === "Indexed"
//         ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
//         : document.status === "Failed"
//         ? "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
//         : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
//     }
//   >
//     {document.status}
//   </span>

//   {document.status ===
//     "Indexed" && (
//     <button
//       type="button"
//       onClick={() => {
//         localStorage.setItem(
//           "selected_document_id",
//           document.document_id
//         );

//         router.push(
//           `/chat?document_id=${encodeURIComponent(
//             document.document_id
//           )}`
//         );
//       }}
//       className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
//     >
//       Chat with Document
//     </button>
//   )}

// </div>

//                   </div>
//                 )
//               )}

//             </div>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// }

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Database,
  File,
  FileText,
  Loader2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";

import {
  getDocuments,
  uploadDocument,
  type DocumentItem,
} from "@/lib/documents";

export default function DocumentsPage() {
  const router =
    useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
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
    agentId,
    setAgentId,
  ] = useState("");

  // =========================================================
  // LOAD DOCUMENTS
  // =========================================================

  async function loadDocuments() {
    const selectedAgentId =
      localStorage.getItem(
        "selected_agent_id"
      );

    if (!selectedAgentId) {
      setAgentId("");

      setError(
        "Please select an agent first."
      );

      setLoading(false);

      return;
    }

    setAgentId(
      selectedAgentId
    );

    try {
      setLoading(true);

      setError("");

      const data =
        await getDocuments(
          selectedAgentId
        );

      setDocuments(
        Array.isArray(
          data.documents
        )
          ? data.documents
          : []
      );
    } catch (
      error: any
    ) {
      console.error(
        "Load documents error:",
        error
      );

      setError(
        error.message ||
          "Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================================================
  // FILE PICKER
  // =========================================================

  function openFilePicker() {
    if (uploading) {
      return;
    }

    fileInputRef.current
      ?.click();
  }

  // =========================================================
  // FILE CHANGE
  // =========================================================

  async function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    await handleUpload(
      file
    );

    event.target.value =
      "";
  }

  // =========================================================
  // UPLOAD
  // =========================================================

  async function handleUpload(
    file: File
  ) {
    try {
      setUploading(true);

      setError("");

      setSuccess("");

      const selectedAgentId =
        localStorage.getItem(
          "selected_agent_id"
        );

      if (
        !selectedAgentId
      ) {
        throw new Error(
          "Please select an agent first."
        );
      }

      await uploadDocument(
        selectedAgentId,
        file
      );

      const data =
        await getDocuments(
          selectedAgentId
        );

      setDocuments(
        Array.isArray(
          data.documents
        )
          ? data.documents
          : []
      );

      setSuccess(
        "Document uploaded and indexed successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (
      error: any
    ) {
      console.error(
        "Upload error:",
        error
      );

      setError(
        error.message ||
          "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // =========================================================
  // FORMAT SIZE
  // =========================================================

  function formatSize(
    bytes: number
  ) {
    if (!bytes) {
      return "0 KB";
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(1)} MB`;
  }

  // =========================================================
  // FILTER + STATS
  // =========================================================

  const filteredDocuments =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return documents;
      }

      return documents.filter(
        (document) =>
          document.name
            ?.toLowerCase()
            .includes(
              query
            ) ||
          document.type
            ?.toLowerCase()
            .includes(
              query
            ) ||
          document.status
            ?.toLowerCase()
            .includes(
              query
            )
      );
    }, [
      documents,
      searchTerm,
    ]);

  const stats =
    useMemo(() => {
      const indexed =
        documents.filter(
          (document) =>
            document.status ===
            "Indexed"
        ).length;

      const processing =
        documents.filter(
          (document) =>
            document.status !==
              "Indexed" &&
            document.status !==
              "Failed"
        ).length;

      const failed =
        documents.filter(
          (document) =>
            document.status ===
            "Failed"
        ).length;

      const chunks =
        documents.reduce(
          (
            total,
            document
          ) =>
            total +
            (
              document.chunks ||
              0
            ),
          0
        );

      return {
        total:
          documents.length,
        indexed,
        processing,
        failed,
        chunks,
      };
    }, [
      documents,
    ]);

  // =========================================================
  // OPEN CHAT
  // =========================================================

  function openDocumentChat(
    document:
      DocumentItem
  ) {
    if (
      document.status !==
      "Indexed"
    ) {
      return;
    }

    localStorage.setItem(
      "selected_document_id",
      document.document_id
    );

    localStorage.removeItem(
      "selected_repository_id"
    );

    router.push(
      `/chat?document_id=${encodeURIComponent(
        document.document_id
      )}`
    );
  }

  // =========================================================
  // NO AGENT
  // =========================================================

  if (
    !loading &&
    !agentId
  ) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F7FB] px-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[140px]" />

          <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-300/10 blur-[130px]" />
        </div>

        <div className="relative w-full max-w-xl rounded-3xl border border-white bg-white/90 p-9 text-center shadow-[0_25px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
            <Bot className="h-7 w-7 text-white" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-950">
            Select an AI agent first
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
            Documents belong to shared AI workspaces. Select an agent from
            the dashboard before uploading or chatting with enterprise
            knowledge.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />

            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================== */}

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] overflow-hidden bg-[#08111F] lg:flex lg:flex-col">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-[-100px] h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />

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

            {/* WORKSPACE */}
            <div className="flex-1 px-4 py-5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Knowledge Workspace
              </p>

              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                      Active Agent
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-200">
                      {shortenId(
                        agentId
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Document Pipeline
                </p>

                <div className="mt-3 space-y-1">
                  <SidebarStatusItem
                    icon={
                      Upload
                    }
                    title="Upload"
                  />

                  <SidebarStatusItem
                    icon={
                      FileText
                    }
                    title="Parse Content"
                  />

                  <SidebarStatusItem
                    icon={
                      Database
                    }
                    title="Create Embeddings"
                  />

                  <SidebarStatusItem
                    icon={
                      Search
                    }
                    title="Semantic Retrieval"
                  />
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <p className="text-[11px] font-bold text-slate-200">
                    Knowledge Layer Online
                  </p>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  Indexed documents are available for grounded enterprise
                  AI retrieval.
                </p>
              </div>
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

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/chat"
                  )
                }
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <MessageSquare className="h-4 w-4" />

                AI Chat
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN
        ================================================== */}

        <main className="min-h-screen min-w-0 flex-1 lg:ml-[252px]">
          {/* TOP HEADER */}
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-[72px] flex-col gap-4 px-5 py-3 md:flex-row md:items-center md:justify-between lg:px-7">
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
                  <FileText className="h-4 w-4 text-white" />
                </div>

                <div>
                  <h1 className="text-base font-black tracking-tight text-slate-950">
                    Enterprise Knowledge
                  </h1>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Document ingestion and RAG workspace
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  openFilePicker
                }
                disabled={
                  uploading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}

                {uploading
                  ? "Uploading & Indexing..."
                  : "Upload Document"}
              </button>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept=".pdf,.docx,.txt,.md,.pptx"
                onChange={
                  handleFileChange
                }
                disabled={
                  uploading
                }
                className="hidden"
              />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="relative overflow-hidden px-5 py-8 lg:px-7 lg:py-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-40 top-[-80px] h-[450px] w-[450px] rounded-full bg-blue-300/[0.08] blur-[140px]" />

              <div className="absolute right-[-130px] top-[250px] h-[430px] w-[430px] rounded-full bg-violet-300/[0.08] blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-7xl">
              {/* HERO */}
              <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />

                    Enterprise RAG Knowledge Base
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
                    Turn documents into
                    <span className="bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                      {" "}
                      searchable knowledge.
                    </span>
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    Upload enterprise documents, automatically index their
                    content, and ask grounded AI questions using semantic
                    retrieval.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  Agent workspace active
                </div>
              </section>

              {/* ALERTS */}
              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-sm">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-700 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                  {success}
                </div>
              )}

              {/* STATS */}
              <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KnowledgeStat
                  icon={
                    FileText
                  }
                  title="Documents"
                  value={
                    stats.total
                  }
                  description="Uploaded files"
                  color="blue"
                />

                <KnowledgeStat
                  icon={
                    CheckCircle2
                  }
                  title="Indexed"
                  value={
                    stats.indexed
                  }
                  description="Ready for AI"
                  color="emerald"
                />

                <KnowledgeStat
                  icon={
                    Database
                  }
                  title="Knowledge Chunks"
                  value={
                    stats.chunks
                  }
                  description="Searchable units"
                  color="violet"
                />

                <KnowledgeStat
                  icon={
                    Loader2
                  }
                  title="Processing"
                  value={
                    stats.processing
                  }
                  description="Currently indexing"
                  color="amber"
                />
              </section>

              {/* UPLOAD PANEL */}
              <section className="mt-8 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  {/* LEFT */}
                  <div className="p-6 md:p-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                        <Upload className="h-5 w-5 text-white" />
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-950">
                          Add enterprise knowledge
                        </h3>

                        <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
                          Upload files to the active AI workspace. The backend
                          parses, chunks, embeds and indexes the content for
                          semantic retrieval.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        openFilePicker
                      }
                      disabled={
                        uploading
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}

                      {uploading
                        ? "Processing file..."
                        : "Choose Document"}
                    </button>
                  </div>

                  {/* RIGHT */}
                  <div className="border-t border-slate-100 bg-linear-to-br from-blue-50/70 via-violet-50/50 to-cyan-50/60 p-6 lg:border-l lg:border-t-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Supported Formats
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "PDF",
                        "DOCX",
                        "PPTX",
                        "TXT",
                        "Markdown",
                      ].map(
                        (
                          format
                        ) => (
                          <span
                            key={
                              format
                            }
                            className="rounded-lg border border-white bg-white/80 px-3 py-2 text-[10px] font-bold text-slate-600 shadow-sm"
                          >
                            {
                              format
                            }
                          </span>
                        )
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                      <div>
                        <p className="text-xs font-bold text-emerald-900">
                          Agent-scoped indexing
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-emerald-700/70">
                          Uploaded knowledge is associated with the currently
                          selected enterprise AI workspace.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* DOCUMENT LIBRARY */}
              <section className="mt-8 overflow-hidden rounded-3xl border border-white bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                {/* HEADER */}
                <div className="flex flex-col gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-950">
                        Document Library
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Browse indexed enterprise knowledge for this agent.
                      </p>
                    </div>
                  </div>

                  {/* SEARCH */}
                  <div className="relative w-full md:w-[320px]">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
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
                      placeholder="Search documents..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center px-6 py-16">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      Loading enterprise knowledge
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Fetching documents for the selected agent...
                    </p>
                  </div>
                ) : documents.length ===
                  0 ? (
                  <EmptyDocuments
                    onUpload={
                      openFilePicker
                    }
                  />
                ) : filteredDocuments.length ===
                  0 ? (
                  <div className="px-6 py-14 text-center">
                    <Search className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No matching documents
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try a different search term.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredDocuments.map(
                      (
                        document
                      ) => (
                        <DocumentRow
                          key={
                            document.document_id ||
                            document.id
                          }
                          document={
                            document
                          }
                          formattedSize={formatSize(
                            document.size
                          )}
                          onChat={() =>
                            openDocumentChat(
                              document
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
   DOCUMENT ROW
========================================================= */

function DocumentRow({
  document,
  formattedSize,
  onChat,
}: {
  document:
    DocumentItem;

  formattedSize:
    string;

  onChat:
    () => void;
}) {
  const indexed =
    document.status ===
    "Indexed";

  const failed =
    document.status ===
    "Failed";

  return (
    <div className="group flex flex-col gap-5 p-5 transition hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between md:p-6">
      {/* INFO */}
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 via-violet-50 to-cyan-50">
          <File className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="max-w-full truncate text-sm font-black text-slate-900">
              {document.name}
            </h4>

            <DocumentStatus
              status={
                document.status
              }
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-slate-400">
            <span>
              {document.type ||
                "Document"}
            </span>

            <span>
              {
                document.chunks
              }{" "}
              chunks
            </span>

            <span>
              {
                formattedSize
              }
            </span>
          </div>

          {/* PROGRESS */}
          <div className="mt-4 max-w-sm">
            <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
              <span>
                Indexing progress
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
                className={`h-full rounded-full transition-all ${
                  failed
                    ? "bg-red-500"
                    : indexed
                      ? "bg-linear-to-r from-emerald-500 to-cyan-500"
                      : "bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500"
                }`}
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
        </div>
      </div>

      {/* ACTION */}
      <div className="flex shrink-0 items-center gap-2 md:justify-end">
        {indexed ? (
          <button
            type="button"
            onClick={
              onChat
            }
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/15 transition hover:-translate-y-0.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />

            Ask AI
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[10px] font-bold text-slate-400">
            {failed ? (
              <XCircle className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
            )}

            {failed
              ? "Unavailable"
              : "Indexing"}
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function DocumentStatus({
  status,
}: {
  status:
    string;
}) {
  if (
    status ===
    "Indexed"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

        Indexed
      </span>
    );
  }

  if (
    status ===
    "Failed"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-bold text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700">
      <Loader2 className="h-3 w-3 animate-spin" />

      {status ||
        "Processing"}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function KnowledgeStat({
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
    | "violet"
    | "amber";
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

    amber: {
      icon:
        "bg-amber-50 text-amber-600",

      accent:
        "from-amber-500 to-orange-500",
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
   EMPTY STATE
========================================================= */

function EmptyDocuments({
  onUpload,
}: {
  onUpload:
    () => void;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-100 via-violet-100 to-cyan-100">
        <FileText className="h-7 w-7 text-blue-600" />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        Build your knowledge base
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Upload your first document and Enterprise AI will convert it into
        searchable knowledge for grounded question answering.
      </p>

      <button
        type="button"
        onClick={
          onUpload
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
      >
        <Upload className="h-4 w-4" />

        Upload First Document
      </button>
    </div>
  );
}

/* =========================================================
   SIDEBAR STATUS
========================================================= */

function SidebarStatusItem({
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

/* =========================================================
   SHORT ID
========================================================= */

function shortenId(
  value:
    string
) {
  if (!value) {
    return "Not selected";
  }

  if (
    value.length <=
    16
  ) {
    return value;
  }

  return `${value.slice(
    0,
    8
  )}...${value.slice(
    -5
  )}`;
}