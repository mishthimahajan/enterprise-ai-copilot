"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getDocuments,
  uploadDocument,
  DocumentItem,
} from "@/lib/documents";

import {useRouter} from "next/navigation";

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function loadDocuments() {
    const agentId =
      localStorage.getItem(
        "selected_agent_id"
      );

    if (!agentId) {
      setError(
        "Please select an agent first."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getDocuments(
          agentId
        );

      setDocuments(
        data.documents || []
      );

    } catch (error: any) {
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

  function openFilePicker() {
    if (uploading) {
      return;
    }

    fileInputRef.current?.click();
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    await handleUpload(file);

    event.target.value = "";
  }

  async function handleUpload(
    file: File
  ) {
    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const agentId =
        localStorage.getItem(
          "selected_agent_id"
        );

      if (!agentId) {
        throw new Error(
          "Please select an agent first."
        );
      }

      await uploadDocument(
        agentId,
        file
      );

      const data =
        await getDocuments(
          agentId
        );

      setDocuments(
        data.documents || []
      );

      setSuccess(
        "Document uploaded and indexed successfully."
      );

    } catch (error: any) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="mx-auto max-w-7xl">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Documents
            </h1>

            <p className="mt-2 text-gray-600">
              Documents available to the selected agent.
            </p>
          </div>

          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading..."
              : "Upload Document"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />

        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-8 rounded-xl bg-white p-6 shadow">

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading documents...
            </div>

          ) : documents.length === 0 ? (
            <div className="py-10 text-center">

              <p className="text-gray-500">
                No documents available.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Upload a PDF, DOCX, TXT or Markdown file.
              </p>

            </div>

          ) : (
            <div className="space-y-3">

              {documents.map(
                (document) => (
                  <div
                    key={
                      document.document_id ||
                      document.id
                    }
                    className="flex items-center justify-between rounded-lg border p-5"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {document.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

                        <span>
                          {document.type}
                        </span>

                        <span>
                          {document.chunks} chunks
                        </span>

                        <span>
                          {formatSize(
                            document.size
                          )}
                        </span>

                        <span>
                          {document.progress}%
                        </span>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

  <span
    className={
      document.status === "Indexed"
        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
        : document.status === "Failed"
        ? "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
        : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
    }
  >
    {document.status}
  </span>

  {document.status ===
    "Indexed" && (
    <button
      type="button"
      onClick={() => {
        localStorage.setItem(
          "selected_document_id",
          document.document_id
        );

        router.push(
          `/chat?document_id=${encodeURIComponent(
            document.document_id
          )}`
        );
      }}
      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
    >
      Chat with Document
    </button>
  )}

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