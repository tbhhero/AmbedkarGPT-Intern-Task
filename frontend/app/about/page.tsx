import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="container py-12">
        <div className="card max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">About AmbedkarGPT</h1>
          <p className="text-slate-300 mb-4">AmbedkarGPT is a local, privacy-first retrieval-augmented generator (RAG) built from an excerpt of Dr. B. R. Ambedkar's writing. It runs entirely on your machine using a local LLM (via Ollama) and a local vector database (ChromaDB) for retrieval. No cloud APIs or keys are required.</p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Why this project</h2>
          <p className="text-slate-300">The goal is to create an assistant that answers questions grounded only in the provided text. AmbedkarGPT retrieves relevant chunks from the source and generates answers using the local model, minimizing the risk of exposing data to third-party services.</p>

          <div className="mt-6 flex gap-3">
            <Link href="/chat" className="px-4 py-2 rounded send-btn">Open Chat</Link>
            <Link href="/how-it-works" className="px-4 py-2 rounded border">How it works</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
