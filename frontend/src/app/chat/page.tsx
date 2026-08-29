"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

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
  // SCROLL
  // =====================================================

  useEffect(() => {
    bottomRef.current
      ?.scrollIntoView({
        behavior: "smooth",
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


        // -----------------------------------------------
        // CHECK REPOSITORY
        // -----------------------------------------------

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


        if (currentRepositoryId) {
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


        // -----------------------------------------------
        // DOCUMENT MODE
        // -----------------------------------------------

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

      } catch (err: unknown) {
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
  // LOAD DOCUMENT HISTORY
  // =====================================================

  async function loadHistory(
    currentAgentId: string,
    documentId: string | null = null,
    currentRepositoryId: string | null = null
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


      let rawMessages: any[] =
        [];


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
              item.role === "user"
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

    } catch (err: unknown) {
      console.error(
        "HISTORY ERROR:",
        err
      );

      setMessages([]);
      setError(
        getErrorMessage(
          err,
          "failed to load chat history."
        )
      );
    }
  }


  // =====================================================
  // DOCUMENT CHANGE
  // =====================================================

  async function handleDocumentChange(
    event:
      React.ChangeEvent<HTMLSelectElement>
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
  // SEND
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
      (previous) => [
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
        (previous) => [
          ...previous,
          assistantMessage,
        ]
      );

    } catch (err: unknown) {
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

    if (isRepositoryChat) {
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

  } catch (err: unknown) {
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
  // LOADING SCREEN
  // =====================================================

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-slate-500">
            Loading chat...
          </p>

        </div>
      </div>
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">


        {/* HEADER */}

        <div className="border-b p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-2xl font-bold">
                Enterprise AI Chat
              </h1>


              <p className="mt-2 text-sm text-slate-500">
                {isRepositoryChat
                  ? "Ask questions about the selected GitHub repository."
                  : "Ask questions about an indexed document."}
              </p>


              {agentId && (
                <p className="mt-2 text-xs text-slate-400">
                  Active Agent:{" "}
                  {agentId}
                </p>
              )}

            </div>


            {/* DOCUMENT SELECTOR */}

            {!isRepositoryChat && (

              <div className="flex gap-3">

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
                  className="min-w-72 rounded-xl border px-4 py-3"
                >

                  <option value="">
                    Select document...
                  </option>


                  {indexedDocuments.map(
                    (document) => (

                      <option
                        key={
                          document.document_id
                        }
                        value={
                          document.document_id
                        }
                      >
                        {document.name}
                      </option>

                    )
                  )}

                </select>


                <button
                  type="button"
                  onClick={
                    handleClearChat
                  }
                  disabled={
                    !selectedDocumentId
                  }
                  className="rounded-xl border border-red-200 px-4 py-3 text-red-600 disabled:opacity-40"
                >
                  Clear Chat
                </button>

              </div>

            )}


            {/* REPOSITORY CONTROLS */}

            {isRepositoryChat && (

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/github"
                    )
                  }
                  className="rounded-xl border px-4 py-3"
                >
                  ← GitHub Agent
                </button>


                <button
                  type="button"
                  onClick={
                    handleClearChat
                  }
                  className="rounded-xl border border-red-200 px-4 py-3 text-red-600"
                >
                  Clear Chat
                </button>

              </div>

            )}

          </div>


          {/* REPOSITORY BANNER */}

          {isRepositoryChat && (

            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

              <p className="text-xs font-semibold uppercase text-indigo-500">
                GitHub Repository Chat
              </p>


              <p className="mt-1 font-semibold text-indigo-900">
                Repository Indexed
              </p>


              <p className="mt-1 break-all text-xs text-indigo-600">
                {repositoryId}
              </p>

            </div>

          )}


          {/* DOCUMENT BANNER */}

          {!isRepositoryChat &&
            selectedDocument && (

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="text-xs font-semibold uppercase text-blue-500">
                  Current Document
                </p>

                <p className="mt-1 font-semibold text-blue-900">
                  {selectedDocument.name}
                </p>

              </div>

            )}

        </div>


        {/* ERROR */}

        {error && (

          <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

        )}


        {/* SUCCESS */}

        {success && (

          <div className="mx-6 mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>

        )}


        {/* CHAT AREA */}

        <div className="flex-1 space-y-5 overflow-y-auto p-6">


          {messages.length === 0 &&
            !loading && (

              <div className="flex min-h-80 items-center justify-center">

                <div className="text-center">

                  <div className="text-4xl">
                    {isRepositoryChat
                      ? "💻"
                      : "💬"}
                  </div>


                  <h2 className="mt-4 text-xl font-semibold">
                    {isRepositoryChat
                      ? "Repository ready"
                      : selectedDocument
                        ? "Document ready"
                        : "Select a document"}
                  </h2>


                  <p className="mt-2 text-sm text-slate-500">
                    {isRepositoryChat
                      ? "Ask anything about this codebase."
                      : selectedDocument
                        ? "Ask anything about this document."
                        : "Select an indexed document first."}
                  </p>

                </div>

              </div>

            )}


          {messages.map(
            (message) => (

              <div
                key={
                  message.id
                }
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >

                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-blue-600 px-5 py-4 text-white"
                      : "max-w-[85%] rounded-2xl border bg-slate-50 px-5 py-4"
                  }
                >

                  <p className="mb-2 text-xs font-semibold opacity-70">
                    {message.role === "user"
                      ? "You"
                      : "Enterprise AI"}
                  </p>


                  <p className="whitespace-pre-wrap">
                    {message.content}
                  </p>


                  {message.sources &&
                    message.sources.length >
                      0 && (

                      <div className="mt-4 border-t pt-4">

                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Sources
                        </p>


                        <div className="mt-2 space-y-2">

                          {message.sources.map(
                            (
                              source,
                              index
                            ) => (

                              <div
                                key={
                                  `source-${index}`
                                }
                                className="rounded-lg border bg-white p-3 text-xs"
                              >

                                <div
  key={`source-${index}`}
  className="rounded-lg border bg-white p-3 text-xs"
>
  <p className="break-all font-semibold text-slate-800">
    {source.file_path ||
      source.filename ||
      "Source"}
  </p>

  <div className="mt-2 flex flex-wrap gap-2 text-slate-500">

    {source.language && (
      <span className="rounded-md bg-slate-100 px-2 py-1">
        {source.language}
      </span>
    )}

    {source.chunk_index !== undefined && (
      <span className="rounded-md bg-slate-100 px-2 py-1">
        Chunk {source.chunk_index}
      </span>
    )}

    {source.source_type && (
      <span className="rounded-md bg-slate-100 px-2 py-1">
        {source.source_type}
      </span>
    )}

  </div>

  {source.score !== undefined && (
    <p className="mt-2 text-slate-500">
      Relevance:{" "}
      {(source.score * 100).toFixed(1)}
      %
    </p>
  )}
</div>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    )}

                </div>

              </div>

            )
          )}


          {loading && (

            <div className="flex justify-start">

              <div className="rounded-2xl border bg-slate-50 px-5 py-4 text-slate-500">
                Searching knowledge and generating answer...
              </div>

            </div>

          )}


          <div
            ref={
              bottomRef
            }
          />

        </div>


        {/* INPUT */}

        <form
          onSubmit={
            handleSubmit
          }
          className="border-t p-5"
        >

          <div className="flex gap-3">

            <input
              value={
                question
              }
              onChange={(event) =>
                setQuestion(
                  event.target.value
                )
              }
              disabled={
                !canChat ||
                loading
              }
              placeholder={
                isRepositoryChat
                  ? "Ask about this repository..."
                  : selectedDocument
                    ? `Ask about ${selectedDocument.name}...`
                    : "Select a document first..."
              }
              className="flex-1 rounded-xl border px-4 py-3 outline-none disabled:bg-slate-100"
            />


            <button
              type="submit"
              disabled={
                !canChat ||
                loading ||
                !question.trim()
              }
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Send"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


// =========================================================
// ERROR HELPER
// =========================================================

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}


// =========================================================
// PAGE
// =========================================================

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading chat...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}