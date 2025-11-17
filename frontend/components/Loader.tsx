"use client";

export default function Loader({ text = "Thinking..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-4 border-slate-700 border-t-indigo-400 rounded-full animate-spin" />
      <div className="text-sm text-slate-300">{text}</div>
    </div>
  );
}
