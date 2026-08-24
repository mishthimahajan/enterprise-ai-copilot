"use client";

import {
  useRef,
  useState,
} from "react";

interface UploadCardProps {
  onUpload: (
    file: File
  ) => Promise<void>;

  uploading?: boolean;
}

export default function UploadCard({
  onUpload,
  uploading = false,
}: UploadCardProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(null);

  function handleFileChange(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
  }

  async function handleUploadClick() {
    if (!selectedFile) {
      return;
    }

    await onUpload(
      selectedFile
    );

    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6">

      <h2 className="text-xl font-semibold">
        Upload Documentation
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Upload documents to the currently selected agent.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-6 block w-full rounded-lg border p-3"
      />

      {selectedFile && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">

          <p className="font-medium">
            {selectedFile.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {(
              selectedFile.size /
              1024
            ).toFixed(1)}
            {" KB"}
          </p>

        </div>
      )}

      <button
        type="button"
        onClick={
          handleUploadClick
        }
        disabled={
          !selectedFile ||
          uploading
        }
        className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? "Uploading..."
          : "Upload Document"}
      </button>

    </div>
  );
}