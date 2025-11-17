import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from rag import build_db, load_db, answer_question
from rag import DEFAULT_PERSIST_DIR


app = FastAPI(title="AmbedkarGPT Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.post("/api/build-db")
async def api_build_db():
    try:
        build_db()
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build DB: {e}")
    return {"status": "success"}


@app.get("/api/status")
async def api_status():
    """Return whether the Chroma DB has been built."""
    try:
        exists = os.path.exists(DEFAULT_PERSIST_DIR) and len(os.listdir(DEFAULT_PERSIST_DIR)) > 0
    except Exception:
        exists = False
    return {"built": exists}


@app.post("/api/query")
async def api_query(req: QueryRequest):
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="`question` is required")

    try:
        # load DB and answer
        db = load_db()
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="Vector DB not found. Build it first via /api/build-db")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load DB: {e}")

    try:
        answer, contexts = answer_question(req.question, db=db)
    except RuntimeError as e:
        # Likely Ollama missing
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during inference: {e}")

    return {"answer": answer, "context": contexts}


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})
