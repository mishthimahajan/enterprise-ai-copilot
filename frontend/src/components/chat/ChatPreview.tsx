"use client";

import { Bot, UserRound, Send, FileText } from "lucide-react";

export default function ChatPreview() {
  return (
    <div className="rounded-3xl border bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            AI Assistant
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ask questions about your connected GitHub repository.
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          ● Online
        </div>

      </div>

      {/* Chat Messages */}
      <div className="space-y-6 p-6">

        {/* AI Welcome */}
        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <Bot className="h-5 w-5 text-white" />
          </div>

          <div className="max-w-md rounded-2xl bg-slate-100 p-4">

            <p className="text-sm text-slate-700">
              Hello 👋 I'm your Enterprise AI Assistant.
              Ask me anything about your GitHub repository,
              project architecture, APIs or source code.
            </p>

          </div>

        </div>

        {/* User Message */}
        <div className="flex justify-end gap-3">

          <div className="max-w-md rounded-2xl bg-blue-600 p-4 text-white">

            <p className="text-sm">
              Where is the authentication implemented?
            </p>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300">
            <UserRound className="h-5 w-5" />
          </div>

        </div>

        {/* AI Response */}
        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
            <Bot className="h-5 w-5 text-white" />
          </div>

          <div className="max-w-lg rounded-2xl bg-slate-100 p-4">

            <p className="text-sm leading-7 text-slate-700">
              Authentication is implemented in the
              <span className="font-semibold text-blue-600">
                {" "}backend/auth{" "}
              </span>
              module using JWT middleware. The login endpoint validates
              the Agent ID and password before generating an access token.
            </p>

            {/* Source Reference */}

            <div className="mt-4 rounded-xl border bg-white p-4">

              <div className="flex items-center gap-2">

                <FileText className="h-5 w-5 text-blue-600" />

                <span className="font-semibold text-slate-700">
                  Source Reference
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                backend/auth/jwt.py
              </p>

              <p className="text-sm text-slate-500">
                backend/routes/login.py
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Chat Input */}

      <div className="border-t p-6">

        <div className="flex items-center gap-4">

          <input
            type="text"
            placeholder="Ask anything about your repository..."
            className="flex-1 rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-500"
          />

          <button className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700">

            <Send className="h-5 w-5" />

          </button>

        </div>

      </div>

    </div>
  );
}