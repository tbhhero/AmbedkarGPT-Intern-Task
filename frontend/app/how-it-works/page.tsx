import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function HowItWorks() {
  return (
    <main>
      <Navbar />
      <section className="container py-12">
        <div className="card max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">How AmbedkarGPT Works</h1>

          <h2 className="text-lg font-semibold mt-4">1. Source text</h2>
          <p className="text-slate-300">The app uses a local `speech.txt` containing an excerpt of Dr. B. R. Ambedkar. This text is split into chunks for retrieval.</p>

          <h2 className="text-lg font-semibold mt-4">2. Embeddings & Vector Store</h2>
          <p className="text-slate-300">Chunks are converted to vector embeddings using a local HuggingFace embedding model (`all-MiniLM-L6-v2`). The vectors are stored in ChromaDB on disk so retrieval is fast and local.</p>

          <h2 className="text-lg font-semibold mt-4">3. Retrieval</h2>
          <p className="text-slate-300">When you ask a question, the system retrieves the most relevant chunks from ChromaDB and provides them as context to the LLM.</p>

          <h2 className="text-lg font-semibold mt-4">4. Local LLM</h2>
          <p className="text-slate-300">A local LLM (via Ollama's `mistral`) generates answers using only the retrieved context. This ensures responses are grounded in the provided text.</p>

          <h2 className="text-lg font-semibold mt-4">5. Safety & Privacy</h2>
          <p className="text-slate-300">Everything runs locally: embeddings, vector store, and the LLM. No API keys or cloud services are used.</p>

          <div className="mt-6 flex gap-3">
            <Link href="/chat" className="px-4 py-2 rounded send-btn">Open Chat</Link>
            <Link href="/about" className="px-4 py-2 rounded border">About</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
