"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-3`}> 
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-700 to-purple-600 flex items-center justify-center text-white mr-3 shadow-md">A</div>
      )}
      <div className={`${isUser ? 'bg-gradient-to-br from-indigo-600 to-pink-500 text-white' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-slate-100'} rounded-2xl p-4 max-w-full sm:max-w-[80%] shadow-xl`}>
        {children}
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white ml-3 shadow-md">U</div>
      )}
    </motion.div>
  );
}
