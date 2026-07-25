import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/", status_code=status.HTTP_201_CREATED)
def upload_image(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo inválido")

    extension = Path(file.filename).suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(status_code=400, detail="Formato não suportado")

    saved_name = f"{uuid.uuid4().hex}{extension}"
    saved_path = UPLOAD_DIR / saved_name
    with saved_path.open("wb") as buffer:
        content = file.file.read()
        buffer.write(content)

    return {"filename": saved_name, "url": f"/uploads/{saved_name}"}
