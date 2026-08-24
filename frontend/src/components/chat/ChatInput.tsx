"use client";

import { useState, KeyboardEvent } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Loader2,
} from "lucide-react";

interface ChatInputProps {
  onSend?: (message: string) => void;
  loading?: boolean;
}

export default function ChatInput({
  onSend,
  loading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend?.(message);

    setMessage("");
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">

      <div className="flex items-end gap-3">

        {/* Attachment */}

        <button
          className="rounded-xl border p-3 transition hover:bg-slate-100"
          title="Attach File"
        >
          <Paperclip size={20} />
        </button>

        {/* Message Box */}

        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your repository..."
          className="max-h-40 min-h-[52px] flex-1 resize-none rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
        />

        {/* Voice */}

        <button
          className="rounded-xl border p-3 transition hover:bg-slate-100"
          title="Voice Input"
        >
          <Mic size={20} />
        </button>

        {/* Send */}

        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? (
            <Loader2
              size={20}
              className="animate-spin"
            />
          ) : (
            <Send size={20} />
          )}
        </button>

      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">

        <p>
          Press <span className="font-semibold">Enter</span> to send,
          <span className="font-semibold"> Shift + Enter</span> for a new line.
        </p>

        <p>Enterprise AI Copilot</p>

      </div>

    </div>
  );
}