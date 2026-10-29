# Backend

The backend will expose the FastAPI service, model adapters, field
normalization, deterministic rule evaluation, source tracking, and review
workflow.

The Python rules engine is the final compliance authority. OCR, vision, and
language models may propose fields, rule drafts, or explanations, but they
must not independently return a legal compliance verdict.

Planned modules:

```text
app/
  api/          HTTP routes
  models/       request and domain schemas
  extraction/   OCR and vision adapters
  compliance/   rule selection and deterministic checks
  sources/      government-document metadata
  review/       reviewer decisions and audit history
```

Planned provider roles:

- OCR: PaddleOCR and/or Tesseract for printed package text.
- Vision: optional region detection or layout interpretation.
- Rule drafting: optional AI-assisted conversion of user/source instructions
  into human-reviewable drafts.
- Reporting: optional explanation generation constrained by stored findings.

The first end-to-end milestone should work without requiring paid AI APIs:
image preprocessing, OCR, normalized fields, approved rule evaluation,
evidence-linked findings, and human review.

The backend should expose scan-session events for the Adaptive Evidence
Recovery Loop. Each event records the stage, timestamp, panel, evidence
quality, unresolved fields, and next recommended capture. Firebase listeners
can stream these events to the dashboard, but server-side validation must
remain authoritative for uploads and state transitions.
