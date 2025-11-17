"use client";
import React from "react";

export default function ContextCard({ text }: { text: string }) {
  return (
    <div className="border-l-4 border-indigo-500/40 bg-slate-900/40 p-3 my-2 rounded-lg">
      <div className="text-sm text-slate-300 whitespace-pre-wrap">{text}</div>
    </div>
  );
}
