"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">A</div>
          <div>
            <div className="text-lg font-extrabold text-white">AmbedkarGPT</div>
            <div className="text-xs text-slate-400">Local RAG — Offline</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <a href="/chat" className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow">Start Chat</a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="p-2 rounded bg-slate-800/60">Menu</button>
        </div>

        {open && (
          <div className="absolute right-4 top-16 bg-slate-900/80 border border-slate-800 rounded-lg shadow-lg p-3 md:hidden">
            <Link href="/chat" className="block px-3 py-2 mb-2 rounded bg-indigo-600 text-white">Start Chat</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
