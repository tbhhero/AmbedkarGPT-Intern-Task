import os
from typing import List, Tuple, Optional

from langchain.schema import Document
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter


from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores.chroma import Chroma


from langchain_community.llms import Ollama  



SPEECH_FILE = os.path.join(os.path.dirname(__file__), "speech.txt")
DEFAULT_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")


def db_exists(persist_directory: str = DEFAULT_PERSIST_DIR) -> bool:
    """Return True if the Chroma persist directory appears to exist and contains files."""
    try:
        return os.path.exists(persist_directory) and len(os.listdir(persist_directory)) > 0
    except Exception:
        return False


CUSTOM_PROMPT_TEXT = '''
You are AmbedkarGPT, an expert on the writings of Dr. B. R. Ambedkar.
Use ONLY the provided context. Never use outside knowledge.
Your answer must be:
- detailed
- deeply explained
- structured
- context-grounded
- no hallucinations
'''


def build_db(persist_directory: str = DEFAULT_PERSIST_DIR) -> None:
    """Create embeddings from speech.txt and persist a Chroma DB."""
    if not os.path.exists(SPEECH_FILE):
        raise FileNotFoundError(f"speech file not found at {SPEECH_FILE}")

    with open(SPEECH_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks: List[str] = splitter.split_text(text)

    docs: List[Document] = []
    for i, c in enumerate(chunks):
        docs.append(Document(page_content=c, metadata={"source": "speech.txt", "chunk": i}))

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    db = Chroma.from_documents(documents=docs, embedding=embeddings, persist_directory=persist_directory)
    try:
        db.persist()
    except Exception:
        # Some versions auto-persist
        pass


def load_db(persist_directory: str = DEFAULT_PERSIST_DIR) -> Chroma:
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    if not os.path.exists(persist_directory):
        raise FileNotFoundError("Chroma DB not found. Please build the DB first.")
    db = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    return db


def get_qa_chain(db: Chroma) -> RetrievalQA:
    if Ollama is None:
        raise RuntimeError("Ollama LLM is not available. Ensure Ollama is installed and the Python package is present.")

    retriever = db.as_retriever(search_kwargs={"k": 4})
    llm = Ollama(model="mistral", temperature=0)

    prompt = PromptTemplate(input_variables=["context", "question"], template=CUSTOM_PROMPT_TEXT + "\nCONTEXT:\n{context}\n\nQuestion: {question}\n")

    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )

    return qa


def answer_question(question: str, db: Optional[Chroma] = None, persist_directory: str = DEFAULT_PERSIST_DIR) -> Tuple[str, List[str]]:
    """Run the RAG pipeline to answer a question and return (answer, context_chunks)."""
    if db is None:
        db = load_db(persist_directory=persist_directory)

    qa = get_qa_chain(db)

    res = qa({"query": question})

    # Response structure may vary; handle common formats
    answer = None
    if isinstance(res, dict):
        answer = res.get("result") or res.get("answer") or res.get("output_text")
        source_docs = res.get("source_documents") or res.get("sources") or []
    else:
        # if string
        answer = str(res)
        source_docs = []

    contexts: List[str] = []
    for d in source_docs:
        text = getattr(d, "page_content", None)
        if text:
            contexts.append(text)

    return answer or "", contexts
