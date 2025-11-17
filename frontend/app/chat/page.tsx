"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ChatBubble from "../../components/ChatBubble";
import Loader from "../../components/Loader";
import TypingDots from "../../components/TypingDots";
import ContextCard from "../../components/ContextCard";
import { buildDb, queryQuestion, getDbStatus } from "../../lib/api";

export default function ChatPage() {
  const [built, setBuilt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // On mount: check DB status and auto-build if missing
  useEffect(() => {
    let mounted = true;
    async function checkAndBuild() {
      try {
        const status = await getDbStatus();
        if (!mounted) return;
        if (status?.built) {
          setBuilt(true);
        } else {
          // auto build without prompting
          setBuilding(true);
          try {
            await buildDb();
            if (!mounted) return;
            setBuilt(true);
          } catch (e: any) {
            setError(e?.message || "Failed to build DB automatically");
          } finally {
            setBuilding(false);
          }
        }
      } catch (e: any) {
        setError(e?.message || "Failed to check DB status");
      }
    }
    checkAndBuild();
    return () => { mounted = false; };
  }, []);

  async function handleBuild() {
    setError(null);
    setError(null);
    setBuilding(true);
    try {
      await buildDb();
      setBuilt(true);
    } catch (err: any) {
      setError(err?.message || "Failed to build DB");
    } finally {
      setBuilding(false);
    }
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    setError(null);
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      // add a loading/typing placeholder for the AI
      setMessages((m) => [...m, { role: "ai", loading: true, text: "" }]);
      const res = await queryQuestion(userMsg);
      const answer = res.answer || "";
      const contexts = res.context || [];

      // replace the last placeholder with the real AI message
      setMessages((m) => {
        const copy = [...m];
        // find last message with loading flag
        const idx = copy.map((x) => x.loading ? 1 : 0).lastIndexOf(1);
        // fallback: last index
        let replaceIndex = -1;
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].loading) { replaceIndex = i; break; }
        }
        if (replaceIndex === -1) replaceIndex = copy.length - 1;
        copy[replaceIndex] = { role: "ai", text: answer, contexts };
        return copy;
      });

    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || "Error querying backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Navbar />
      <section className="container py-6 app-shell">
        <Sidebar />
        <div className="px-6">
        {!built ? (
          <div className="card p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Preparing Vector DB</h2>
            <p className="mb-4 text-slate-300">The app builds a local vector DB automatically on first run. This may take a minute.</p>
            {building ? (
              <div className="flex flex-col items-center gap-3">
                <Loader text={"Building vector DB..."} />
                <div className="text-sm text-slate-400">Please keep the app running; the model will be used locally.</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="text-sm text-slate-400">The DB will be built automatically; no action required.</div>
              </div>
            )}
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </div>
        ) : (
          <div className="chat-container">
            <div className="chat-window flex-1 mb-4" id="chat-scroll">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.loading ? (
                    <ChatBubble role="ai"><TypingDots /></ChatBubble>
                  ) : (
                    <ChatBubble role={m.role}>{m.text}</ChatBubble>
                  )}
                  {m.role === "ai" && m.contexts && (
                    <details className="pl-4">
                      <summary className="cursor-pointer text-sm text-slate-500">Show sources</summary>
                      {m.contexts.map((c: string, j: number) => (
                        <ContextCard key={j} text={c} />
                      ))}
                    </details>
                  )}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="sticky-input">
              <form onSubmit={handleSend} className="flex gap-2 items-start">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} className="chat-input flex-1" rows={2} disabled={loading} />
                <div className="flex flex-col gap-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
                </div>
              </form>
            </div>

            <div className="mt-4">
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Controls</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">Build the DB and begin chatting with AmbedkarGPT.</p>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => { setMessages([]); setError(null); }} className="px-3 py-2 rounded border">Reset</button>
                </div>
                {loading && <Loader />}
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
      </section>
    </main>
  );
}
