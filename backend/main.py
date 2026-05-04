import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from markitdown import MarkItDown

app = FastAPI(title="MarkItDown Web API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

_md = MarkItDown(enable_plugins=False)


@app.post("/api/convert")
async def convert_file(file: UploadFile = File(...)):
    original_name = file.filename or "upload"
    suffix = Path(original_name).suffix  # preserve extension for markitdown type detection

    content = await file.read()

    # Write to a named temp file so markitdown can detect the format
    tmp_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(content)
            tmp_path = tmp.name

        result = _md.convert(tmp_path)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    output_filename = Path(original_name).stem + ".md"
    return JSONResponse({"filename": output_filename, "content": result.text_content})


@app.get("/health")
async def health():
    return {"status": "ok"}
