"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  ChatSource,
  clearChatHistory,
  getChatHistory,
  sendChatMessage,
} from "@/services/chat";

import {
  DocumentItem,
  getDocuments,
} from "@/lib/documents";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

function normalizeHistoryResponse(
  response: unknown
): Message[] {
  const data = response as any;

  const rawMessages = Array.isArray(response)
    ? response
    : Array.isArray(data?.messages)
      ? data.messages
      : Array.isArray(data?.history)
        ? data.history
        : Array.isArray(data?.chats)
          ? data.chats
          : [];

  return rawMessages.map(
    (message: any, index: number) => ({
      id:
        message?.id ||
        message?.message_id ||
        `history-${index}-${Date.now()}`,
      role:
        message?.role === "user"
          ? "user"
          : "assistant",
      content:
        message?.content ||
        message?.message ||
        "",
      sources: Array.isArray(message?.sources)
        ? message.sources
        : [],
    })
  );
}

function ChatPageContent() {
  const searchParams =
    useSearchParams();

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    clearing,
    setClearing,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [agentId, setAgentId] =
    useState<string | null>(null);

  const [
    documents,
    setDocuments,
  ] = useState<DocumentItem[]>([]);

  const [
    selectedDocumentId,
    setSelectedDocumentId,
  ] = useState("");

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function loadHistory(
    currentAgentId: string,
    documentId: string
  ) {
    if (!documentId) {
      setMessages([]);
      return;
    }

    try {
      setHistoryLoading(true);
      setError("");

      const response =
        await getChatHistory(
          currentAgentId,
          documentId
        );

      console.log(
        "CHAT HISTORY RESPONSE:",
        response
      );

      const restored =
        normalizeHistoryResponse(
          response
        );

      setMessages(restored);
    } catch (error: any) {
      console.error(
        "LOAD HISTORY ERROR:",
        error
      );

      setMessages([]);

      setError(
        error.message ||
          "Failed to load chat history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    async function initializeChat() {
      try {
        setHistoryLoading(true);
        setError("");
        setSuccess("");

        const storedAgentId =
          localStorage.getItem(
            "selected_agent_id"
          );

        if (!storedAgentId) {
          setAgentId(null);
          setDocuments([]);
          setMessages([]);

          setError(
            "Please select an agent before using chat."
          );

          return;
        }

        setAgentId(
          storedAgentId
        );

        const documentResponse =
          await getDocuments(
            storedAgentId
          );

        const availableDocuments: DocumentItem[] =
          Array.isArray(documentResponse)
            ? documentResponse
            : Array.isArray(
                (documentResponse as any)?.documents
              )
              ? (documentResponse as any).documents
              : [];

        setDocuments(
          availableDocuments
        );

        const urlDocumentId =
          searchParams.get(
            "document_id"
          );

        const storedDocumentId =
          localStorage.getItem(
            "selected_document_id"
          );

        let initialDocumentId =
          urlDocumentId ||
          storedDocumentId ||
          "";

        if (initialDocumentId) {
          const validDocument =
            availableDocuments.some(
              (document) =>
                document.document_id ===
                  initialDocumentId &&
                document.status ===
                  "Indexed"
            );

          if (!validDocument) {
            initialDocumentId = "";

            localStorage.removeItem(
              "selected_document_id"
            );
          }
        }

        setSelectedDocumentId(
          initialDocumentId
        );

        if (initialDocumentId) {
          localStorage.setItem(
            "selected_document_id",
            initialDocumentId
          );

          const historyResponse =
            await getChatHistory(
              storedAgentId,
              initialDocumentId
            );

          console.log(
            "INITIAL CHAT HISTORY RESPONSE:",
            historyResponse
          );

          const restoredMessages =
            normalizeHistoryResponse(
              historyResponse
            );

          setMessages(
            restoredMessages
          );
        } else {
          setMessages([]);
        }
      } catch (error: any) {
        console.error(
          "INITIALIZE CHAT ERROR:",
          error
        );

        setError(
          error.message ||
            "Failed to initialize chat."
        );
      } finally {
        setHistoryLoading(false);
      }
    }

    initializeChat();
  }, [searchParams]);

  async function handleDocumentChange(
    event:
      React.ChangeEvent<HTMLSelectElement>
  ) {
    const documentId =
      event.target.value;

    setSelectedDocumentId(
      documentId
    );

    setMessages([]);
    setQuestion("");
    setError("");
    setSuccess("");

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

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      return;
    }

    await loadHistory(
      agentId,
      documentId
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (!trimmedQuestion) {
      return;
    }

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      return;
    }

    if (!selectedDocumentId) {
      setError(
        "Please select a document first."
      );

      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedQuestion,
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
          trimmedQuestion,
          agentId,
          selectedDocumentId
        );

      const assistantMessage:
        Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        sources:
          response.sources || [],
      };

      setMessages(
        (previous) => [
          ...previous,
          assistantMessage,
        ]
      );
    } catch (error: any) {
      console.error(
        "CHAT ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to get AI response."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleClearChat() {
    if (
      !agentId ||
      !selectedDocumentId
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all chat history for this document?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);
      setError("");
      setSuccess("");

      await clearChatHistory(
        agentId,
        selectedDocumentId
      );

      setMessages([]);

      setSuccess(
        "Chat history cleared successfully."
      );
    } catch (error: any) {
      console.error(
        "CLEAR CHAT ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to clear chat history."
      );
    } finally {
      setClearing(false);
    }
  }

  const selectedDocument =
    documents.find(
      (document) =>
        document.document_id ===
        selectedDocumentId
    );

  const indexedDocuments =
    documents.filter(
      (document) =>
        document.status ===
        "Indexed"
    );

    

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto flex min-h-[85vh] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="border-b bg-white p-6">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Enterprise AI Chat
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Select an indexed document and ask questions about it.
              </p>

              {agentId && (
                <p className="mt-2 text-xs text-slate-400">
                  Active Agent: {agentId}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              <div className="w-full sm:w-80">

                <label
                  htmlFor="document-select"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Document
                </label>

                <select
                  id="document-select"
                  value={selectedDocumentId}
                  onChange={
                    handleDocumentChange
                  }
                  disabled={
                    historyLoading ||
                    loading ||
                    clearing ||
                    !agentId
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
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
              </div>

              <div className="flex items-end">

                <button
                  type="button"
                  onClick={
                    handleClearChat
                  }
                  disabled={
                    !selectedDocumentId ||
                    loading ||
                    historyLoading ||
                    clearing
                  }
                  className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  {clearing
                    ? "Clearing..."
                    : "Clear Chat"}
                </button>
              </div>

            </div>

          </div>

          {selectedDocument && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                  Currently chatting with
                </p>

                <p className="mt-1 font-semibold text-blue-900">
                  {selectedDocument.name}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Indexed
                </span>

                <span className="text-xs text-blue-600">
                  {selectedDocument.chunks} chunks
                </span>

              </div>

            </div>
          )}

        </div>

        {error && (
          <div className="mx-6 mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-6 mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="flex-1 space-y-5 overflow-y-auto p-6">

          {historyLoading && (
            <div className="flex min-h-80 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading conversation...
                </p>

              </div>

            </div>
          )}

          {!historyLoading &&
            messages.length === 0 && (
              <div className="flex min-h-80 items-center justify-center">

                <div className="max-w-lg text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    💬
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-slate-800">
                    {selectedDocument
                      ? "Ask your document"
                      : "Select a document"}
                  </h2>

                  {selectedDocument ? (
                    <>
                      <p className="mt-2 text-sm text-slate-500">
                        You are chatting with{" "}
                        <span className="font-medium text-slate-700">
                          {selectedDocument.name}
                        </span>
                      </p>

                      <p className="mt-3 text-sm text-slate-400">
                        Example: What are the main technical skills mentioned in this document?
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      Choose an indexed document above to start chatting.
                    </p>
                  )}

                </div>

              </div>
            )}

          {!historyLoading &&
            messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={
                    message.role ===
                    "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.role ===
                      "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-md bg-blue-600 px-5 py-4 text-white shadow-sm"
                        : "max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800"
                    }
                  >
                    <p
                      className={
                        message.role ===
                        "user"
                          ? "mb-2 text-xs font-semibold text-blue-100"
                          : "mb-2 text-xs font-semibold text-slate-500"
                      }
                    >
                      {message.role ===
                      "user"
                        ? "You"
                        : "Enterprise AI"}
                    </p>

                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>

                    {message.role ===
                      "assistant" &&
                      message.sources &&
                      message.sources.length >
                        0 && (
                        <div className="mt-5 border-t border-slate-200 pt-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Sources
                          </p>

                          <div className="mt-3 space-y-2">

                            {message.sources.map(
                              (
                                source,
                                index
                              ) => (
                                <div
                                  key={`${source.document_id}-${source.chunk_index}-${index}`}
                                  className="rounded-xl border border-slate-200 bg-white p-3 text-xs"
                                >
                                  <p className="font-semibold text-slate-700">
                                    {source.filename ||
                                      "Document"}
                                  </p>

                                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-slate-500">

                                    {source.chunk_index !==
                                      undefined && (
                                      <span>
                                        Chunk{" "}
                                        {source.chunk_index +
                                          1}
                                      </span>
                                    )}

                                    {source.score !==
                                      undefined && (
                                      <span>
                                        Relevance:{" "}
                                        {(
                                          source.score *
                                          100
                                        ).toFixed(
                                          1
                                        )}
                                        %
                                      </span>
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

              <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-5 py-4">

                <p className="mb-2 text-xs font-semibold text-slate-500">
                  Enterprise AI
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />

                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />

                  <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />

                  <span className="ml-2">
                    Searching document and generating answer...
                  </span>

                </div>

              </div>

            </div>
          )}

          <div
            ref={messagesEndRef}
          />

        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="border-t bg-white p-5"
        >

          <div className="flex gap-3">

            <input
              type="text"
              value={question}
              onChange={(event) => {
                setQuestion(
                  event.target.value
                );

                if (error) {
                  setError("");
                }

                if (success) {
                  setSuccess("");
                }
              }}
              placeholder={
                selectedDocument
                  ? `Ask about ${selectedDocument.name}...`
                  : "Select a document first..."
              }
              disabled={
                loading ||
                historyLoading ||
                clearing ||
                !agentId ||
                !selectedDocumentId
              }
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={
                loading ||
                historyLoading ||
                clearing ||
                !question.trim() ||
                !agentId ||
                !selectedDocumentId
              }
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Send"}
            </button>

          </div>

          {selectedDocument && (
            <p className="mt-2 text-xs text-slate-400">
              Responses are restricted to{" "}
              <span className="font-medium text-slate-600">
                {selectedDocument.name}
              </span>
              .
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center rounded-2xl border bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <h2 className="mt-5 text-lg font-semibold text-slate-800">
                Loading Enterprise AI Chat
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Preparing your documents and chat history...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}