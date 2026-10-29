from __future__ import annotations

from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageStat
try:
    import pytesseract
except ImportError:
    pytesseract = None

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = PROJECT_ROOT / "legal-sources" / "source-manifest.json"
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_UPLOAD_BYTES = 12 * 1024 * 1024

app = FastAPI(
    title="MetriCheck AI API",
    version="0.1.0",
    description="Evidence-first packaged-food label inspection API.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+):5173",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "metricheck-api"}


@app.get("/api/v1/rules")
def list_rules() -> dict[str, object]:
    """Return only rules that are safe to execute.

    The repository currently has no human-verified active rules, so the API
    intentionally returns an empty executable catalog instead of inventing law.
    """
    return {
        "rules": [],
        "message": (
            "No executable rules are active until an official source and "
            "human verification record are complete."
        ),
    }


@app.post("/api/v1/scans/analyze")
async def analyze_scan(
    image: UploadFile = File(...),
    panel: str = Form(...),
    product_category: str = Form(...),
) -> dict[str, object]:
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Upload a JPEG, PNG, or WebP package image.",
        )

    content = await image.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 12 MB or smaller.")
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")

    try:
        image_data = Image.open(BytesIO(content)).convert("RGB")
    except Exception as error:
        raise HTTPException(status_code=400, detail="The uploaded file is not a readable image.") from error

    width, height = image_data.size
    brightness = ImageStat.Stat(image_data.convert("L")).mean[0]
    quality_issues: list[str] = []
    if min(width, height) < 720:
        quality_issues.append("Capture a closer image so label text is larger.")
    if brightness < 45:
        quality_issues.append("Retake the panel with more light.")
    elif brightness > 235:
        quality_issues.append("Reduce glare or direct reflection.")

    ocr_text = ""
    ocr_status = "unavailable"
    if pytesseract is not None:
        try:
            ocr_text = pytesseract.image_to_string(image_data).strip()
            ocr_status = "completed" if ocr_text else "completed_no_text"
        except (pytesseract.TesseractNotFoundError, OSError):
            ocr_status = "runtime_not_installed"

    scan_id = f"scan_{uuid4().hex[:12]}"
    return {
        "scan_id": scan_id,
        "captured_at": datetime.now(timezone.utc).isoformat(),
        "panel": panel,
        "product_category": product_category,
        "image": {
            "filename": image.filename or "package-image",
            "content_type": image.content_type,
            "bytes": len(content),
        },
        "status": "needs_human_review",
        "quality": {
            "width": width,
            "height": height,
            "brightness": round(brightness, 1),
            "issues": quality_issues,
            "status": "needs_retake" if quality_issues else "acceptable_candidate",
        },
        "ocr": {
            "status": ocr_status,
            "text": ocr_text,
            "message": "OCR text is candidate evidence and requires confirmation.",
        },
        "fields": [],
        "findings": [
            {
                "type": "insufficient_evidence",
                "message": (
                    "OCR and source-linked rules are not active yet. This "
                    "capture is stored as an evidence candidate, not a legal verdict."
                ),
                "next_action": "Connect an approved OCR provider and verify the source rule set.",
            }
        ],
        "rules_applied": [],
        "source_manifest": str(MANIFEST_PATH.relative_to(PROJECT_ROOT)),
    }
