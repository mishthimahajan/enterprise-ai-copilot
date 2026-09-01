"use client";

import Link from "next/link";
import { FolderGit2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function openGitHubAgent() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login?redirect=/repositories");
      return;
    }

    router.push("/repositories");
  }

  function connectRepository() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login?redirect=/repositories");
      return;
    }

    router.push("/repositories");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FolderGit2 className="h-7 w-7 text-blue-600" />

          <span className="text-lg font-bold text-slate-800">
            Enterprise AI Copilot
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/documents"
            className="transition hover:text-blue-600"
          >
            Documents
          </Link>

          <button
            type="button"
            onClick={openGitHubAgent}
            className="transition hover:text-blue-600"
          >
            GitHub Agent
          </button>

          <Link
            href="/about"
            className="transition hover:text-blue-600"
          >
            About
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="outline">
              Sign In
            </Button>
          </Link>

          <Button
            onClick={connectRepository}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Connect Repository
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="flex flex-col gap-4 p-6">

            <Link
              href="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/documents"
              onClick={() => setOpen(false)}
            >
              Documents
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openGitHubAgent();
              }}
              className="text-left"
            >
              GitHub Agent
            </button>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
            >
              <Button
                variant="outline"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>

            <Button
              onClick={() => {
                setOpen(false);
                connectRepository();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Connect Repository
            </Button>

          </div>
        </div>
      )}
    </nav>
  );
}