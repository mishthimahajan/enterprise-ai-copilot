"use client";

import { Bot, UserRound, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  message: string;
  time?: string;
  sources?: string[];
}

export default function ChatMessage({
  role,
  message,
  time,
  sources = [],
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const isUser = role === "user";

  return (
    <div
      className={`flex gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
     

      {!isUser && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}

      

      <div
        className={`max-w-3xl rounded-2xl border p-5 shadow-sm ${
          isUser
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">

          <h4 className="font-semibold">
            {isUser ? "You" : "Enterprise AI"}
          </h4>

          <button
            onClick={copyMessage}
            className={`rounded-lg p-2 transition ${
              isUser
                ? "hover:bg-blue-700"
                : "hover:bg-slate-100"
            }`}
          >
            {copied ? (
              <Check
                size={16}
                className={
                  isUser ? "text-white" : "text-green-600"
                }
              />
            ) : (
              <Copy
                size={16}
                className={
                  isUser ? "text-white" : "text-slate-500"
                }
              />
            )}
          </button>

        </div>

        <p
          className={`mt-4 whitespace-pre-wrap leading-7 ${
            isUser ? "text-white" : "text-slate-700"
          }`}
        >
          {message}
        </p>

        

        {!isUser && sources.length > 0 && (

          <div className="mt-6 rounded-xl bg-slate-50 p-4">

            <h5 className="mb-3 font-semibold text-slate-800">
              Source References
            </h5>

            <div className="space-y-2">

              {sources.map((source, index) => (

                <div
                  key={index}
                  className="rounded-lg border bg-white px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                  {source}
                </div>

              ))}

            </div>

          </div>

        )}

        {time && (
          <p
            className={`mt-4 text-xs ${
              isUser
                ? "text-blue-100"
                : "text-slate-400"
            }`}
          >
            {time}
          </p>
        )}

      </div>

      

      {isUser && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-300">
          <UserRound className="h-5 w-5 text-slate-700" />
        </div>
      )}

    </div>
  );
}