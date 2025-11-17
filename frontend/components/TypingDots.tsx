"use client";
export default function TypingDots() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{animationDelay: '0s'}} />
      <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{animationDelay: '0.15s'}} />
      <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{animationDelay: '0.3s'}} />
    </div>
  );
}
