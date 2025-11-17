import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="container py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-4">AmbedkarGPT <span className="accent">— Local RAG</span></h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">A privacy-first retrieval-augmented assistant built from Dr. B. R. Ambedkar's writing. Ask focused questions grounded only in the provided text.</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/chat" className="inline-block px-6 py-3 rounded bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-lg">Start Chat</Link>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-300">How it works</a>
        </div>
      </section>
    </main>
  )
}
