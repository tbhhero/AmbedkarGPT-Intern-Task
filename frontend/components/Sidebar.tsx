"use client";
import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-white/80 dark:bg-slate-900/60 border-r px-3 py-4">
      <div className="mb-4">
        <div className="text-sm text-slate-400">New Chat</div>
        <button className="mt-2 w-full text-left px-3 py-2 rounded bg-indigo-600 text-white">+ New chat</button>
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="space-y-2">
          <li>
            <Link href="/about" className="block px-3 py-2 rounded hover:bg-slate-800">About AmbedkarGPT</Link>
          </li>
          <li>
            <Link href="/how-it-works" className="block px-3 py-2 rounded hover:bg-slate-800">How it works</Link>
          </li>
        </ul>
      </nav>

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">Local-only. Uses Ollama + ChromaDB.</div>
    </aside>
  );
}
