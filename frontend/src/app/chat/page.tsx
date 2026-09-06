// "use client";

// import {
//   FormEvent,
//   Suspense,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import {
//   clearChatHistory,
//   getChatHistory,
//   sendChatMessage,
//   type ChatSource,
// } from "@/lib/chat";

// import {
//   getDocuments,
//   type DocumentItem,
// } from "@/lib/documents";



// type Message = {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   sources?: ChatSource[];
// };


// function ChatContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const bottomRef =
//     useRef<HTMLDivElement | null>(
//       null
//     );

//   const [
//     agentId,
//     setAgentId,
//   ] = useState("");

//   const [
//     repositoryId,
//     setRepositoryId,
//   ] = useState("");

//   const [
//     documents,
//     setDocuments,
//   ] = useState<DocumentItem[]>([]);

//   const [
//     selectedDocumentId,
//     setSelectedDocumentId,
//   ] = useState("");

//   const [
//     messages,
//     setMessages,
//   ] = useState<Message[]>([]);

//   const [
//     question,
//     setQuestion,
//   ] = useState("");

//   const [
//     loading,
//     setLoading,
//   ] = useState(false);

//   const [
//     pageLoading,
//     setPageLoading,
//   ] = useState(true);

//   const [
//     error,
//     setError,
//   ] = useState("");

//   const [
//     success,
//     setSuccess,
//   ] = useState("");


//   const isRepositoryChat =
//     repositoryId.length > 0;


//   const indexedDocuments =
//     documents.filter(
//       (document) =>
//         document.status ===
//         "Indexed"
//     );


//   const selectedDocument =
//     indexedDocuments.find(
//       (document) =>
//         document.document_id ===
//         selectedDocumentId
//     );


//   const canChat =
//     Boolean(
//       agentId &&
//         (
//           repositoryId ||
//           selectedDocumentId
//         )
//     );


//   // =====================================================
//   // SCROLL
//   // =====================================================

//   useEffect(() => {
//     bottomRef.current
//       ?.scrollIntoView({
//         behavior: "smooth",
//       });
//   }, [
//     messages,
//     loading,
//   ]);


//   // =====================================================
//   // INITIALIZE
//   // =====================================================

//   useEffect(() => {
//     async function initialize() {
//       try {
//         setPageLoading(true);
//         setError("");

//         const savedAgentId =
//           localStorage.getItem(
//             "selected_agent_id"
//           );

//         if (!savedAgentId) {
//           setError(
//             "Please select an agent first."
//           );

//           return;
//         }

//         setAgentId(
//           savedAgentId
//         );


//         // -----------------------------------------------
//         // CHECK REPOSITORY
//         // -----------------------------------------------

//         const urlRepositoryId =
//           searchParams.get(
//             "repository_id"
//           );

//         const savedRepositoryId =
//           localStorage.getItem(
//             "selected_repository_id"
//           );

//         const currentRepositoryId =
//           urlRepositoryId ||
//           savedRepositoryId ||
//           "";


//         if (currentRepositoryId) {
//           setRepositoryId(
//             currentRepositoryId
//           );

//           localStorage.setItem(
//             "selected_repository_id",
//             currentRepositoryId
//           );

//           localStorage.removeItem(
//             "selected_document_id"
//           );

//           setSelectedDocumentId("");
//           setDocuments([]);
//           await loadHistory(
//             savedAgentId,
//             null,
//             currentRepositoryId
//           );
          

//           return;
//         }


//         // -----------------------------------------------
//         // DOCUMENT MODE
//         // -----------------------------------------------

//         setRepositoryId("");

//         const documentResponse =
//           await getDocuments(
//             savedAgentId
//           );


//         let availableDocuments:
//           DocumentItem[] = [];


//         if (
//           documentResponse &&
//           Array.isArray(
//             documentResponse.documents
//           )
//         ) {
//           availableDocuments =
//             documentResponse.documents;
//         }


//         setDocuments(
//           availableDocuments
//         );


//         const urlDocumentId =
//           searchParams.get(
//             "document_id"
//           );

//         const savedDocumentId =
//           localStorage.getItem(
//             "selected_document_id"
//           );

//         const documentId =
//           urlDocumentId ||
//           savedDocumentId ||
//           "";


//         if (!documentId) {
//           return;
//         }


//         const validDocument =
//           availableDocuments.find(
//             (document) =>
//               document.document_id ===
//                 documentId &&
//               document.status ===
//                 "Indexed"
//           );


//         if (!validDocument) {
//           localStorage.removeItem(
//             "selected_document_id"
//           );

//           return;
//         }


//         setSelectedDocumentId(
//           documentId
//         );

//         localStorage.setItem(
//           "selected_document_id",
//           documentId
//         );


//         await loadHistory(
//           savedAgentId,
//           documentId,
//           null
//         );

//       } catch (err: unknown) {
//         console.error(
//           "CHAT INITIALIZATION ERROR:",
//           err
//         );

//         setError(
//           getErrorMessage(
//             err,
//             "Failed to initialize chat."
//           )
//         );

//       } finally {
//         setPageLoading(false);
//       }
//     }


//     initialize();

//   }, [
//     searchParams,
//   ]);


//   // =====================================================
//   // LOAD DOCUMENT HISTORY
//   // =====================================================

//   async function loadHistory(
//     currentAgentId: string,
//     documentId: string | null = null,
//     currentRepositoryId: string | null = null
//   ) {
//     try {
//       setError("");
//       const response =
//         await getChatHistory(
//           currentAgentId,
//           documentId,
//           currentRepositoryId
//         );


//       const responseData =
//         response as unknown;


//       let rawMessages: any[] =
//         [];


//       if (
//         Array.isArray(
//           responseData
//         )
//       ) {
//         rawMessages =
//           responseData;

//       } else if (
//         responseData &&
//         typeof responseData ===
//           "object"
//       ) {
//         const objectData =
//           responseData as Record<
//             string,
//             unknown
//           >;


//         if (
//           Array.isArray(
//             objectData.messages
//           )
//         ) {
//           rawMessages =
//             objectData.messages;

//         } else if (
//           Array.isArray(
//             objectData.history
//           )
//         ) {
//           rawMessages =
//             objectData.history;
//         }
//       }


//       const restored:
//         Message[] =
//         rawMessages.map(
//           (
//             item: any,
//             index: number
//           ) => ({
//             id:
//               item.id ||
//               item.message_id ||
//               `history-${index}`,

//             role:
//               item.role === "user"
//                 ? "user"
//                 : "assistant",

//             content:
//               item.content ||
//               item.message ||
//               "",

//             sources:
//               Array.isArray(
//                 item.sources
//               )
//                 ? item.sources
//                 : [],
//           })
//         );


//       setMessages(
//         restored
//       );

//     } catch (err: unknown) {
//       console.error(
//         "HISTORY ERROR:",
//         err
//       );

//       setMessages([]);
//       setError(
//         getErrorMessage(
//           err,
//           "failed to load chat history."
//         )
//       );
//     }
//   }


//   // =====================================================
//   // DOCUMENT CHANGE
//   // =====================================================

//   async function handleDocumentChange(
//     event:
//       React.ChangeEvent<HTMLSelectElement>
//   ) {
//     const documentId =
//       event.target.value;

//     setMessages([]);
//     setQuestion("");
//     setError("");
//     setSuccess("");

//     setSelectedDocumentId(
//       documentId
//     );

//     setRepositoryId("");

//     localStorage.removeItem(
//       "selected_repository_id"
//     );


//     if (!documentId) {
//       localStorage.removeItem(
//         "selected_document_id"
//       );

//       return;
//     }


//     localStorage.setItem(
//       "selected_document_id",
//       documentId
//     );


//     if (agentId) {
//       await loadHistory(
//         agentId,
//         documentId,
//         null
//       );
//     }
//   }


//   // =====================================================
//   // SEND
//   // =====================================================

//   async function handleSubmit(
//     event:
//       FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     const cleanQuestion =
//       question.trim();


//     if (!cleanQuestion) {
//       return;
//     }


//     if (!agentId) {
//       setError(
//         "Please select an agent first."
//       );

//       return;
//     }


//     if (
//       !selectedDocumentId &&
//       !repositoryId
//     ) {
//       setError(
//         "Please select a document or repository first."
//       );

//       return;
//     }


//     const userMessage:
//       Message = {
//       id:
//         `user-${Date.now()}`,

//       role:
//         "user",

//       content:
//         cleanQuestion,
//     };


//     setMessages(
//       (previous) => [
//         ...previous,
//         userMessage,
//       ]
//     );

//     setQuestion("");
//     setError("");
//     setSuccess("");
//     setLoading(true);


//     try {
//       const response =
//         await sendChatMessage(
//           cleanQuestion,
//           agentId,

//           isRepositoryChat
//             ? null
//             : selectedDocumentId,

//           isRepositoryChat
//             ? repositoryId
//             : null
//         );


//       const assistantMessage:
//         Message = {
//         id:
//           `assistant-${Date.now()}`,

//         role:
//           "assistant",

//         content:
//           response.answer ||
//           "No answer returned.",

//         sources:
//           Array.isArray(
//             response.sources
//           )
//             ? response.sources
//             : [],
//       };


//       setMessages(
//         (previous) => [
//           ...previous,
//           assistantMessage,
//         ]
//       );

//     } catch (err: unknown) {
//       console.error(
//         "CHAT ERROR:",
//         err
//       );

//       setError(
//         getErrorMessage(
//           err,
//           "Failed to get AI response."
//         )
//       );

//     } finally {
//       setLoading(false);
//     }
//   }


//   // =====================================================
//   // CLEAR CHAT
//   // =====================================================

//  // =====================================================
// // CLEAR CHAT
// // =====================================================

// async function handleClearChat() {
//   setError("");
//   setSuccess("");

//   if (!agentId) {
//     setError(
//       "Please select an agent first."
//     );

//     return;
//   }

//   if (
//     !selectedDocumentId &&
//     !repositoryId
//   ) {
//     setError(
//       "Please select a document or repository first."
//     );

//     return;
//   }

//   const confirmed =
//     window.confirm(
//       isRepositoryChat
//         ? "Clear chat history for this repository?"
//         : "Clear chat history for this document?"
//     );

//   if (!confirmed) {
//     return;
//   }

//   try {
//     // ===============================================
//     // REPOSITORY CHAT
//     // ===============================================

//     if (isRepositoryChat) {
//       await clearChatHistory(
//         agentId,
//         null,
//         repositoryId
//       );

//       setMessages([]);

//       setSuccess(
//         "Repository chat history cleared."
//       );

//       return;
//     }

//     // ===============================================
//     // DOCUMENT CHAT
//     // ===============================================

//     await clearChatHistory(
//       agentId,
//       selectedDocumentId,
//       null
//     );

//     setMessages([]);

//     setSuccess(
//       "Document chat history cleared."
//     );

//   } catch (err: unknown) {
//     console.error(
//       "CLEAR CHAT ERROR:",
//       err
//     );

//     setError(
//       getErrorMessage(
//         err,
//         "Failed to clear chat."
//       )
//     );
//   }
// }


//   // =====================================================
//   // LOADING SCREEN
//   // =====================================================

//   if (pageLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="text-center">

//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

//           <p className="mt-4 text-slate-500">
//             Loading chat...
//           </p>

//         </div>
//       </div>
//     );
//   }


//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">

//       <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">


//         {/* HEADER */}

//         <div className="border-b p-6">

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

//             <div>

//               <h1 className="text-2xl font-bold">
//                 Enterprise AI Chat
//               </h1>


//               <p className="mt-2 text-sm text-slate-500">
//                 {isRepositoryChat
//                   ? "Ask questions about the selected GitHub repository."
//                   : "Ask questions about an indexed document."}
//               </p>


//               {agentId && (
//                 <p className="mt-2 text-xs text-slate-400">
//                   Active Agent:{" "}
//                   {agentId}
//                 </p>
//               )}

//             </div>


//             {/* DOCUMENT SELECTOR */}

//             {!isRepositoryChat && (

//               <div className="flex gap-3">

//                 <select
//                   value={
//                     selectedDocumentId
//                   }
//                   onChange={
//                     handleDocumentChange
//                   }
//                   disabled={
//                     loading
//                   }
//                   className="min-w-72 rounded-xl border px-4 py-3"
//                 >

//                   <option value="">
//                     Select document...
//                   </option>


//                   {indexedDocuments.map(
//                     (document) => (

//                       <option
//                         key={
//                           document.document_id
//                         }
//                         value={
//                           document.document_id
//                         }
//                       >
//                         {document.name}
//                       </option>

//                     )
//                   )}

//                 </select>


//                 <button
//                   type="button"
//                   onClick={
//                     handleClearChat
//                   }
//                   disabled={
//                     !selectedDocumentId
//                   }
//                   className="rounded-xl border border-red-200 px-4 py-3 text-red-600 disabled:opacity-40"
//                 >
//                   Clear Chat
//                 </button>

//               </div>

//             )}


//             {/* REPOSITORY CONTROLS */}

//             {isRepositoryChat && (

//               <div className="flex gap-3">

//                 <button
//                   type="button"
//                   onClick={() =>
//                     router.push(
//                       "/github"
//                     )
//                   }
//                   className="rounded-xl border px-4 py-3"
//                 >
//                   ← GitHub Agent
//                 </button>


//                 <button
//                   type="button"
//                   onClick={
//                     handleClearChat
//                   }
//                   className="rounded-xl border border-red-200 px-4 py-3 text-red-600"
//                 >
//                   Clear Chat
//                 </button>

//               </div>

//             )}

//           </div>


//           {/* REPOSITORY BANNER */}

//           {isRepositoryChat && (

//             <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

//               <p className="text-xs font-semibold uppercase text-indigo-500">
//                 GitHub Repository Chat
//               </p>


//               <p className="mt-1 font-semibold text-indigo-900">
//                 Repository Indexed
//               </p>


//               <p className="mt-1 break-all text-xs text-indigo-600">
//                 {repositoryId}
//               </p>

//             </div>

//           )}


//           {/* DOCUMENT BANNER */}

//           {!isRepositoryChat &&
//             selectedDocument && (

//               <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

//                 <p className="text-xs font-semibold uppercase text-blue-500">
//                   Current Document
//                 </p>

//                 <p className="mt-1 font-semibold text-blue-900">
//                   {selectedDocument.name}
//                 </p>

//               </div>

//             )}

//         </div>


//         {/* ERROR */}

//         {error && (

//           <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//             {error}
//           </div>

//         )}


//         {/* SUCCESS */}

//         {success && (

//           <div className="mx-6 mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
//             {success}
//           </div>

//         )}


//         {/* CHAT AREA */}

//         <div className="flex-1 space-y-5 overflow-y-auto p-6">


//           {messages.length === 0 &&
//             !loading && (

//               <div className="flex min-h-80 items-center justify-center">

//                 <div className="text-center">

//                   <div className="text-4xl">
//                     {isRepositoryChat
//                       ? "💻"
//                       : "💬"}
//                   </div>


//                   <h2 className="mt-4 text-xl font-semibold">
//                     {isRepositoryChat
//                       ? "Repository ready"
//                       : selectedDocument
//                         ? "Document ready"
//                         : "Select a document"}
//                   </h2>


//                   <p className="mt-2 text-sm text-slate-500">
//                     {isRepositoryChat
//                       ? "Ask anything about this codebase."
//                       : selectedDocument
//                         ? "Ask anything about this document."
//                         : "Select an indexed document first."}
//                   </p>

//                 </div>

//               </div>

//             )}


//           {messages.map(
//             (message) => (

//               <div
//                 key={
//                   message.id
//                 }
//                 className={
//                   message.role === "user"
//                     ? "flex justify-end"
//                     : "flex justify-start"
//                 }
//               >

//                 <div
//                   className={
//                     message.role === "user"
//                       ? "max-w-[80%] rounded-2xl bg-blue-600 px-5 py-4 text-white"
//                       : "max-w-[85%] rounded-2xl border bg-slate-50 px-5 py-4"
//                   }
//                 >

//                   <p className="mb-2 text-xs font-semibold opacity-70">
//                     {message.role === "user"
//                       ? "You"
//                       : "Enterprise AI"}
//                   </p>


//                   <p className="whitespace-pre-wrap">
//                     {message.content}
//                   </p>


//                   {message.sources &&
//                     message.sources.length >
//                       0 && (

//                       <div className="mt-4 border-t pt-4">

//                         <p className="text-xs font-semibold uppercase text-slate-500">
//                           Sources
//                         </p>


//                         <div className="mt-2 space-y-2">

//                           {message.sources.map(
//                             (
//                               source,
//                               index
//                             ) => (

//                               <div
//                                 key={
//                                   `source-${index}`
//                                 }
//                                 className="rounded-lg border bg-white p-3 text-xs"
//                               >

//                                 <div
//   key={`source-${index}`}
//   className="rounded-lg border bg-white p-3 text-xs"
// >
//   <p className="break-all font-semibold text-slate-800">
//     {source.file_path ||
//       source.filename ||
//       "Source"}
//   </p>

//   <div className="mt-2 flex flex-wrap gap-2 text-slate-500">

//     {source.language && (
//       <span className="rounded-md bg-slate-100 px-2 py-1">
//         {source.language}
//       </span>
//     )}

//     {source.chunk_index !== undefined && (
//       <span className="rounded-md bg-slate-100 px-2 py-1">
//         Chunk {source.chunk_index}
//       </span>
//     )}

//     {source.source_type && (
//       <span className="rounded-md bg-slate-100 px-2 py-1">
//         {source.source_type}
//       </span>
//     )}

//   </div>

//   {source.score !== undefined && (
//     <p className="mt-2 text-slate-500">
//       Relevance:{" "}
//       {(source.score * 100).toFixed(1)}
//       %
//     </p>
//   )}
// </div>

//                               </div>

//                             )
//                           )}

//                         </div>

//                       </div>

//                     )}

//                 </div>

//               </div>

//             )
//           )}


//           {loading && (

//             <div className="flex justify-start">

//               <div className="rounded-2xl border bg-slate-50 px-5 py-4 text-slate-500">
//                 Searching knowledge and generating answer...
//               </div>

//             </div>

//           )}


//           <div
//             ref={
//               bottomRef
//             }
//           />

//         </div>


//         {/* INPUT */}

//         <form
//           onSubmit={
//             handleSubmit
//           }
//           className="border-t p-5"
//         >

//           <div className="flex gap-3">

//             <input
//               value={
//                 question
//               }
//               onChange={(event) =>
//                 setQuestion(
//                   event.target.value
//                 )
//               }
//               disabled={
//                 !canChat ||
//                 loading
//               }
//               placeholder={
//                 isRepositoryChat
//                   ? "Ask about this repository..."
//                   : selectedDocument
//                     ? `Ask about ${selectedDocument.name}...`
//                     : "Select a document first..."
//               }
//               className="flex-1 rounded-xl border px-4 py-3 outline-none disabled:bg-slate-100"
//             />


//             <button
//               type="submit"
//               disabled={
//                 !canChat ||
//                 loading ||
//                 !question.trim()
//               }
//               className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white disabled:opacity-50"
//             >
//               {loading
//                 ? "Thinking..."
//                 : "Send"}
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// }


// // =========================================================
// // ERROR HELPER
// // =========================================================

// function getErrorMessage(
//   error: unknown,
//   fallback: string
// ): string {
//   if (
//     error instanceof Error
//   ) {
//     return error.message;
//   }

//   return fallback;
// }


// // =========================================================
// // PAGE
// // =========================================================

// export default function ChatPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-screen items-center justify-center">
//           Loading chat...
//         </div>
//       }
//     >
//       <ChatContent />
//     </Suspense>
//   );
// }


"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ElementType,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  FileCode2,
  FileText,
  GitBranch,
  Loader2,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  clearChatHistory,
  getChatHistory,
  sendChatMessage,
  type ChatSource,
} from "@/lib/chat";

import {
  getDocuments,
  type DocumentItem,
} from "@/lib/documents";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
};

function ChatContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [
    agentId,
    setAgentId,
  ] = useState("");

  const [
    repositoryId,
    setRepositoryId,
  ] = useState("");

  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>([]);

  const [
    selectedDocumentId,
    setSelectedDocumentId,
  ] = useState("");

  const [
    messages,
    setMessages,
  ] = useState<Message[]>([]);

  const [
    question,
    setQuestion,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const isRepositoryChat =
    repositoryId.length > 0;

  const indexedDocuments =
    documents.filter(
      (document) =>
        document.status ===
        "Indexed"
    );

  const selectedDocument =
    indexedDocuments.find(
      (document) =>
        document.document_id ===
        selectedDocumentId
    );

  const canChat =
    Boolean(
      agentId &&
        (
          repositoryId ||
          selectedDocumentId
        )
    );

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });
  }, [
    messages,
    loading,
  ]);

  // =====================================================
  // INITIALIZE
  // =====================================================

  useEffect(() => {
    async function initialize() {
      try {
        setPageLoading(true);
        setError("");

        const savedAgentId =
          localStorage.getItem(
            "selected_agent_id"
          );

        if (!savedAgentId) {
          setError(
            "Please select an agent first."
          );

          return;
        }

        setAgentId(
          savedAgentId
        );

        // ===============================================
        // REPOSITORY MODE
        // ===============================================

        const urlRepositoryId =
          searchParams.get(
            "repository_id"
          );

        const savedRepositoryId =
          localStorage.getItem(
            "selected_repository_id"
          );

        const currentRepositoryId =
          urlRepositoryId ||
          savedRepositoryId ||
          "";

        if (
          currentRepositoryId
        ) {
          setRepositoryId(
            currentRepositoryId
          );

          localStorage.setItem(
            "selected_repository_id",
            currentRepositoryId
          );

          localStorage.removeItem(
            "selected_document_id"
          );

          setSelectedDocumentId("");

          setDocuments([]);

          await loadHistory(
            savedAgentId,
            null,
            currentRepositoryId
          );

          return;
        }

        // ===============================================
        // DOCUMENT MODE
        // ===============================================

        setRepositoryId("");

        const documentResponse =
          await getDocuments(
            savedAgentId
          );

        let availableDocuments:
          DocumentItem[] = [];

        if (
          documentResponse &&
          Array.isArray(
            documentResponse.documents
          )
        ) {
          availableDocuments =
            documentResponse.documents;
        }

        setDocuments(
          availableDocuments
        );

        const urlDocumentId =
          searchParams.get(
            "document_id"
          );

        const savedDocumentId =
          localStorage.getItem(
            "selected_document_id"
          );

        const documentId =
          urlDocumentId ||
          savedDocumentId ||
          "";

        if (!documentId) {
          return;
        }

        const validDocument =
          availableDocuments.find(
            (document) =>
              document.document_id ===
                documentId &&
              document.status ===
                "Indexed"
          );

        if (!validDocument) {
          localStorage.removeItem(
            "selected_document_id"
          );

          return;
        }

        setSelectedDocumentId(
          documentId
        );

        localStorage.setItem(
          "selected_document_id",
          documentId
        );

        await loadHistory(
          savedAgentId,
          documentId,
          null
        );
      } catch (
        err: unknown
      ) {
        console.error(
          "CHAT INITIALIZATION ERROR:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Failed to initialize chat."
          )
        );
      } finally {
        setPageLoading(false);
      }
    }

    initialize();
  }, [
    searchParams,
  ]);

  // =====================================================
  // LOAD HISTORY
  // =====================================================

  async function loadHistory(
    currentAgentId:
      string,

    documentId:
      string | null =
      null,

    currentRepositoryId:
      string | null =
      null
  ) {
    try {
      setError("");

      const response =
        await getChatHistory(
          currentAgentId,
          documentId,
          currentRepositoryId
        );

      const responseData =
        response as unknown;

      let rawMessages:
        any[] = [];

      if (
        Array.isArray(
          responseData
        )
      ) {
        rawMessages =
          responseData;
      } else if (
        responseData &&
        typeof responseData ===
          "object"
      ) {
        const objectData =
          responseData as Record<
            string,
            unknown
          >;

        if (
          Array.isArray(
            objectData.messages
          )
        ) {
          rawMessages =
            objectData.messages;
        } else if (
          Array.isArray(
            objectData.history
          )
        ) {
          rawMessages =
            objectData.history;
        }
      }

      const restored:
        Message[] =
        rawMessages.map(
          (
            item: any,
            index: number
          ) => ({
            id:
              item.id ||
              item.message_id ||
              `history-${index}`,

            role:
              item.role ===
              "user"
                ? "user"
                : "assistant",

            content:
              item.content ||
              item.message ||
              "",

            sources:
              Array.isArray(
                item.sources
              )
                ? item.sources
                : [],
          })
        );

      setMessages(
        restored
      );
    } catch (
      err: unknown
    ) {
      console.error(
        "HISTORY ERROR:",
        err
      );

      setMessages([]);

      setError(
        getErrorMessage(
          err,
          "Failed to load chat history."
        )
      );
    }
  }

  // =====================================================
  // DOCUMENT CHANGE
  // =====================================================

  async function handleDocumentChange(
    event:
      ChangeEvent<HTMLSelectElement>
  ) {
    const documentId =
      event.target.value;

    setMessages([]);

    setQuestion("");

    setError("");

    setSuccess("");

    setSelectedDocumentId(
      documentId
    );

    setRepositoryId("");

    localStorage.removeItem(
      "selected_repository_id"
    );

    if (!documentId) {
      localStorage.removeItem(
        "selected_document_id"
      );

      return;
    }

    localStorage.setItem(
      "selected_document_id",
      documentId
    );

    if (agentId) {
      await loadHistory(
        agentId,
        documentId,
        null
      );
    }
  }

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanQuestion =
      question.trim();

    if (!cleanQuestion) {
      return;
    }

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      return;
    }

    if (
      !selectedDocumentId &&
      !repositoryId
    ) {
      setError(
        "Please select a document or repository first."
      );

      return;
    }

    const userMessage:
      Message = {
        id:
          `user-${Date.now()}`,

        role:
          "user",

        content:
          cleanQuestion,
      };

    setMessages(
      (
        previous
      ) => [
        ...previous,
        userMessage,
      ]
    );

    setQuestion("");

    setError("");

    setSuccess("");

    setLoading(true);

    try {
      const response =
        await sendChatMessage(
          cleanQuestion,
          agentId,

          isRepositoryChat
            ? null
            : selectedDocumentId,

          isRepositoryChat
            ? repositoryId
            : null
        );

      const assistantMessage:
        Message = {
          id:
            `assistant-${Date.now()}`,

          role:
            "assistant",

          content:
            response.answer ||
            "No answer returned.",

          sources:
            Array.isArray(
              response.sources
            )
              ? response.sources
              : [],
        };

      setMessages(
        (
          previous
        ) => [
          ...previous,
          assistantMessage,
        ]
      );
    } catch (
      err: unknown
    ) {
      console.error(
        "CHAT ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to get AI response."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CLEAR CHAT
  // =====================================================

  async function handleClearChat() {
    setError("");

    setSuccess("");

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      return;
    }

    if (
      !selectedDocumentId &&
      !repositoryId
    ) {
      setError(
        "Please select a document or repository first."
      );

      return;
    }

    const confirmed =
      window.confirm(
        isRepositoryChat
          ? "Clear chat history for this repository?"
          : "Clear chat history for this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      // ===============================================
      // REPOSITORY CHAT
      // ===============================================

      if (
        isRepositoryChat
      ) {
        await clearChatHistory(
          agentId,
          null,
          repositoryId
        );

        setMessages([]);

        setSuccess(
          "Repository chat history cleared."
        );

        return;
      }

      // ===============================================
      // DOCUMENT CHAT
      // ===============================================

      await clearChatHistory(
        agentId,
        selectedDocumentId,
        null
      );

      setMessages([]);

      setSuccess(
        "Document chat history cleared."
      );
    } catch (
      err: unknown
    ) {
      console.error(
        "CLEAR CHAT ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to clear chat."
        )
      );
    }
  }

  // =====================================================
  // PAGE LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F8FC]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[140px]" />

          <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-300/10 blur-[130px]" />
        </div>

        <div className="relative text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
            <Loader2 className="h-7 w-7 animate-spin text-white" />
          </div>

          <p className="mt-5 text-sm font-bold text-slate-800">
            Opening Enterprise AI
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Loading knowledge and chat history...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
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

            {/* WORKSPACE */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                Current Workspace
              </p>

              <div className="mt-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                {/* AGENT */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                    <Bot className="h-4 w-4 text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      Active Agent
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-200">
                      {shortenId(
                        agentId
                      )}
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-white/[0.06]" />

                {/* SOURCE */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isRepositoryChat
                        ? "bg-violet-500/10"
                        : "bg-cyan-500/10"
                    }`}
                  >
                    {isRepositoryChat ? (
                      <Code2 className="h-4 w-4 text-violet-400" />
                    ) : (
                      <FileText className="h-4 w-4 text-cyan-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      Knowledge Source
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-slate-200">
                      {isRepositoryChat
                        ? "GitHub Repository"
                        : selectedDocument?.name ||
                          "Select document"}
                    </p>
                  </div>
                </div>
              </div>

              {/* RAG PIPELINE */}
              <div className="mt-7">
                <p className="px-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  AI Pipeline
                </p>

                <div className="mt-3 space-y-1">
                  <PipelineItem
                    icon={
                      Search
                    }
                    title="Semantic Retrieval"
                    active={
                      canChat
                    }
                  />

                  <PipelineItem
                    icon={
                      Database
                    }
                    title="Vector Context"
                    active={
                      canChat
                    }
                  />

                  <PipelineItem
                    icon={
                      Sparkles
                    }
                    title="AI Generation"
                    active={
                      canChat
                    }
                  />

                  <PipelineItem
                    icon={
                      ShieldCheck
                    }
                    title="Source Grounding"
                    active={
                      canChat
                    }
                  />
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <p className="text-[11px] font-bold text-slate-200">
                    RAG Services Online
                  </p>
                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                  Answers are generated using retrieved enterprise context.
                </p>
              </div>
            </div>

            {/* NAVIGATION */}
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

              {isRepositoryChat && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/github"
                    )
                  }
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <GitBranch className="h-4 w-4" />

                  GitHub Agent
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN CHAT
        ================================================== */}

        <main className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[252px]">
          {/* HEADER */}
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-[72px] flex-col justify-center gap-4 px-5 py-3 md:flex-row md:items-center md:justify-between lg:px-7">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      isRepositoryChat
                        ? "/github"
                        : "/dashboard"
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-md shadow-blue-500/20">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-black tracking-tight text-slate-950">
                      Enterprise AI Chat
                    </h1>

                    <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 sm:flex">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      GROUNDED
                    </span>
                  </div>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {isRepositoryChat
                      ? "Repository intelligence conversation"
                      : "Enterprise document intelligence"}
                  </p>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-wrap items-center gap-2">
                {!isRepositoryChat && (
                  <select
                    value={
                      selectedDocumentId
                    }
                    onChange={
                      handleDocumentChange
                    }
                    disabled={
                      loading
                    }
                    className="max-w-[280px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50 disabled:opacity-50"
                  >
                    <option value="">
                      Select document...
                    </option>

                    {indexedDocuments.map(
                      (
                        document
                      ) => (
                        <option
                          key={
                            document.document_id
                          }
                          value={
                            document.document_id
                          }
                        >
                          {
                            document.name
                          }
                        </option>
                      )
                    )}
                  </select>
                )}

                {isRepositoryChat && (
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/github"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                  >
                    <Code2 className="h-3.5 w-3.5" />

                    GitHub Agent
                  </button>
                )}

                <button
                  type="button"
                  onClick={
                    handleClearChat
                  }
                  disabled={
                    isRepositoryChat
                      ? !repositoryId
                      : !selectedDocumentId
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />

                  Clear
                </button>
              </div>
            </div>
          </header>

          {/* CONTEXT BAR */}
          <div className="border-b border-slate-200/70 bg-white/60 px-5 py-2.5 lg:px-7">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
              <ContextPill
                icon={
                  Bot
                }
                label="Agent"
                value={
                  shortenId(
                    agentId
                  )
                }
              />

              <ChevronRight className="h-3 w-3 text-slate-300" />

              <ContextPill
                icon={
                  isRepositoryChat
                    ? GitBranch
                    : FileText
                }
                label={
                  isRepositoryChat
                    ? "Repository"
                    : "Document"
                }
                value={
                  isRepositoryChat
                    ? "Indexed codebase"
                    : selectedDocument?.name ||
                      "Not selected"
                }
              />

              {canChat && (
                <>
                  <ChevronRight className="h-3 w-3 text-slate-300" />

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />

                    Ready
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mx-auto mt-4 w-full max-w-5xl px-5">
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mx-auto mt-4 w-full max-w-5xl px-5">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  {success}
                </span>
              </div>
            </div>
          )}

          {/* =================================================
              CHAT AREA
          ================================================== */}

          <div className="relative flex flex-1 flex-col overflow-hidden">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[10%] top-[8%] h-[420px] w-[420px] rounded-full bg-blue-300/[0.08] blur-[140px]" />

              <div className="absolute bottom-[5%] right-[8%] h-[420px] w-[420px] rounded-full bg-violet-300/[0.08] blur-[140px]" />

              <div className="absolute left-[40%] top-[35%] h-[280px] w-[280px] rounded-full bg-cyan-200/[0.05] blur-[120px]" />
            </div>

            {/* MESSAGES */}
            <div className="relative flex-1 overflow-y-auto px-5 py-7 lg:px-7">
              <div className="mx-auto max-w-5xl space-y-6">
                {/* EMPTY */}
                {messages.length ===
                  0 &&
                  !loading && (
                    <EmptyChatState
                      isRepositoryChat={
                        isRepositoryChat
                      }
                      selectedDocument={
                        selectedDocument
                      }
                      canChat={
                        canChat
                      }
                      onSuggestion={
                        setQuestion
                      }
                    />
                  )}

                {/* MESSAGES */}
                {messages.map(
                  (
                    message
                  ) => (
                    <ChatMessage
                      key={
                        message.id
                      }
                      message={
                        message
                      }
                    />
                  )
                )}

                {/* THINKING */}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-md shadow-blue-500/15">
                      <Bot className="h-4 w-4 text-white" />
                    </div>

                    <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-violet-600" />

                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Searching enterprise knowledge
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            Retrieving relevant context before answering...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  ref={
                    bottomRef
                  }
                />
              </div>
            </div>

            {/* =================================================
                INPUT
            ================================================== */}

            <div className="relative border-t border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur-xl lg:px-7">
              <form
                onSubmit={
                  handleSubmit
                }
                className="mx-auto max-w-5xl"
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                    </div>

                    <input
                      value={
                        question
                      }
                      onChange={(
                        event
                      ) =>
                        setQuestion(
                          event
                            .target
                            .value
                        )
                      }
                      disabled={
                        !canChat ||
                        loading
                      }
                      placeholder={
                        isRepositoryChat
                          ? "Ask about architecture, APIs, functions, files..."
                          : selectedDocument
                            ? `Ask anything about ${selectedDocument.name}...`
                            : "Select an indexed document first..."
                      }
                      className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                    />

                    <button
                      type="submit"
                      disabled={
                        !canChat ||
                        loading ||
                        !question.trim()
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between px-2">
                  <p className="text-[9px] text-slate-400">
                    AI responses may contain mistakes. Verify important information.
                  </p>

                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600">
                    <ShieldCheck className="h-3 w-3" />

                    Source-grounded
                  </span>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

function ChatMessage({
  message,
}: {
  message: Message;
}) {
  const isUser =
    message.role ===
    "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-br-md bg-[#182234] px-5 py-3.5 text-white shadow-md">
            <p className="whitespace-pre-wrap text-sm leading-7">
              {
                message.content
              }
            </p>
          </div>

          <p className="mt-1.5 text-right text-[9px] font-medium text-slate-400">
            You
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-md shadow-blue-500/15">
        <Bot className="h-4 w-4 text-white" />
      </div>

      <div className="max-w-[88%]">
        <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-5 py-4 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
          <div className="mb-3 flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">
              Enterprise AI
            </p>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-600">
              <CheckCircle2 className="h-2.5 w-2.5" />

              GROUNDED
            </span>
          </div>

          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {
              message.content
            }
          </p>

          {message.sources &&
            message.sources.length >
              0 && (
              <SourceList
                sources={
                  message.sources
                }
              />
            )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SOURCE LIST
========================================================= */

function SourceList({
  sources,
}: {
  sources:
    ChatSource[];
}) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-blue-600" />

          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
            Sources Used
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
          {
            sources.length
          }{" "}
          verified
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {sources.map(
          (
            source,
            index
          ) => (
            <div
              key={`source-${index}`}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-blue-100 hover:bg-blue-50/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  {source.source_type ===
                  "github" ? (
                    <FileCode2 className="h-4 w-4 text-violet-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-all text-xs font-bold text-slate-800">
                    {source.file_path ||
                      source.filename ||
                      "Knowledge Source"}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {source.language && (
                      <SourceTag
                        value={
                          source.language
                        }
                      />
                    )}

                    {source.chunk_index !==
                      undefined && (
                      <SourceTag
                        value={`Chunk ${source.chunk_index}`}
                      />
                    )}

                    {source.source_type && (
                      <SourceTag
                        value={
                          source.source_type
                        }
                      />
                    )}
                  </div>

                  {source.score !==
                    undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[9px] text-slate-400">
                        <span>
                          Relevance
                        </span>

                        <span className="font-bold text-slate-600">
                          {(
                            source.score *
                            100
                          ).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>

                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-blue-600 via-violet-600 to-cyan-500"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                source.score *
                                  100,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY CHAT STATE
========================================================= */

function EmptyChatState({
  isRepositoryChat,
  selectedDocument,
  canChat,
  onSuggestion,
}: {
  isRepositoryChat:
    boolean;

  selectedDocument:
    DocumentItem |
    undefined;

  canChat:
    boolean;

  onSuggestion:
    (
      value:
        string
    ) => void;
}) {
  const suggestions =
    isRepositoryChat
      ? [
          {
            title:
              "Explain architecture",

            text:
              "Explain the architecture of this repository.",

            icon:
              Code2,
          },

          {
            title:
              "Find authentication",

            text:
              "Where is authentication implemented?",

            icon:
              ShieldCheck,
          },

          {
            title:
              "Explore APIs",

            text:
              "What are the main API routes?",

            icon:
              FileCode2,
          },

          {
            title:
              "Understand data flow",

            text:
              "Explain the data flow in this project.",

            icon:
              Database,
          },
        ]
      : [
          {
            title:
              "Summarize",

            text:
              "Summarize this document.",

            icon:
              FileText,
          },

          {
            title:
              "Key concepts",

            text:
              "What are the key concepts?",

            icon:
              Sparkles,
          },

          {
            title:
              "Important sections",

            text:
              "Explain the most important section.",

            icon:
              Search,
          },

          {
            title:
              "Conclusions",

            text:
              "What conclusions does this document contain?",

            icon:
              CheckCircle2,
          },
        ];

  return (
    <div className="flex min-h-[430px] items-center justify-center py-8">
      <div className="w-full max-w-2xl">
        {/* ICON */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-xl shadow-blue-500/20">
          {isRepositoryChat ? (
            <Code2 className="h-6 w-6 text-white" />
          ) : (
            <FileText className="h-6 w-6 text-white" />
          )}
        </div>

        {/* TITLE */}
        <div className="text-center">
          <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
            {isRepositoryChat
              ? "Ask your codebase"
              : selectedDocument
                ? "Ask your document"
                : "Choose a knowledge source"}
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {isRepositoryChat
              ? "Enterprise AI retrieves relevant source code before generating an answer."
              : selectedDocument
                ? "Questions are answered using retrieved context from the selected document."
                : "Select an indexed document above to begin."}
          </p>
        </div>

        {/* SUGGESTIONS */}
        {canChat && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {suggestions.map(
              (
                suggestion
              ) => {
                const Icon =
                  suggestion.icon;

                return (
                  <button
                    key={
                      suggestion.text
                    }
                    type="button"
                    onClick={() =>
                      onSuggestion(
                        suggestion.text
                      )
                    }
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        {
                          suggestion.title
                        }
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-400">
                        {
                          suggestion.text
                        }
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" />
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PIPELINE ITEM
========================================================= */

function PipelineItem({
  icon: Icon,
  title,
  active,
}: {
  icon:
    ElementType;

  title:
    string;

  active:
    boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
        active
          ? "bg-white/[0.025]"
          : ""
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          active
            ? "bg-blue-500/10 text-blue-400"
            : "bg-white/[0.03] text-slate-600"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <span
        className={`text-[11px] font-medium ${
          active
            ? "text-slate-300"
            : "text-slate-600"
        }`}
      >
        {title}
      </span>

      {active && (
        <CheckCircle2 className="ml-auto h-3 w-3 text-emerald-400" />
      )}
    </div>
  );
}

/* =========================================================
   CONTEXT PILL
========================================================= */

function ContextPill({
  icon: Icon,
  label,
  value,
}: {
  icon:
    ElementType;

  label:
    string;

  value:
    string;
}) {
  return (
    <div className="inline-flex max-w-[300px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-500 shadow-sm">
      <Icon className="h-3 w-3 shrink-0 text-blue-600" />

      <span className="font-bold">
        {label}
      </span>

      <span className="truncate text-slate-600">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   SOURCE TAG
========================================================= */

function SourceTag({
  value,
}: {
  value:
    string;
}) {
  return (
    <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-slate-500">
      {value}
    </span>
  );
}

/* =========================================================
   SHORTEN ID
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

/* =========================================================
   ERROR HELPER
========================================================= */

function getErrorMessage(
  error:
    unknown,

  fallback:
    string
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}

/* =========================================================
   PAGE
========================================================= */

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F6F8FC]">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 via-violet-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading Enterprise AI Chat...
            </p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}