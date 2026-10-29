# Architecture

```text
Phone camera + optional listing data
                    |
 Guided capture + image quality checks
                    |
 Image preprocessing + OCR/model adapters
                    |
 Field extraction, reconciliation, and evidence
                    |
     Approved rule selection by scope/date
                    |
        Deterministic compliance engine
                    |
 Report, discrepancy detection, human review
```

The compliance engine is the authority for `passed`, `flagged`, and
`needs_human_review`. AI and OCR components produce candidate fields and
evidence; they do not independently decide legal compliance.

## Mobile capture flow

The phone is the primary camera. The frontend creates a scan session and
collects labeled package panels rather than relying on one image. Before
uploading each image, the client checks basic quality signals such as blur,
glare, darkness, cropping, orientation, and whether the requested panel is
present. A failed quality check produces a clear retake instruction.

The backend stores the ordered panel images and their capture metadata. Every
extracted field links back to a panel and image region, so a reviewer can
reproduce the result.

## Backend responsibilities

- Validate uploads and product context.
- Run preprocessing, OCR, vision, and reporting providers behind stable
  interfaces.
- Normalize fields, preserve image regions and confidence, and reconcile
  independent extraction results.
- Select applicable rule versions.
- Execute checks without delegating the decision to an LLM.
- Persist source, evidence, result, and reviewer history.
- Compare package declarations with optional listing data and report
  discrepancies separately from violations.
- Compare old and revised inspection results for change-impact simulation.
- Provide guided mobile capture, image-quality feedback, panel completeness,
  and retake instructions.

## Frontend responsibilities

- Guided food-label scan workflow.
- Evidence workspace with image regions and extracted fields.
- Rule and source references for every finding.
- Review queue for uncertain cases.
- Change-impact comparison between rule versions.

## Model roles

The first baseline should use deterministic image preprocessing with PaddleOCR
or Tesseract and a Python rules engine. A second OCR provider can expose
disagreement. Optional vision, rule-drafting, and report-generation adapters
may be added behind stable interfaces, but generated text must be grounded in
stored extraction evidence and engine results.

Custom CNN/ViT or field-extraction training is an evaluation-driven
optimization, not a prerequisite for the first end-to-end workflow.

## Evidence and review states

Each extracted field should retain its source image, region coordinates,
recognized text/value, provider, confidence, and any disagreement. A field
that is missing because the image is unreadable must not be treated as proof
that the declaration is absent. Such cases become `needs_human_review` and
should identify the missing evidence or request a clearer image.

## Impact-oriented design

The system should optimize for a useful action after scanning:

- request a better image when evidence is weak;
- prioritize high-risk or required fields;
- show the exact rule and evidence behind a finding;
- suggest a concrete label or listing correction;
- measure whether a second scan resolves the issue.

This makes the phone camera part of an evidence-quality workflow, not merely
an input device for generic OCR.

## Adaptive Evidence Recovery Loop

The live dashboard acts as an evidence-acquisition controller. It observes
image quality, OCR confidence, field disagreements, and the evidence required
by applicable approved rules. It then selects the next best capture:

- request a retake when the current panel is blurred, cropped, dark, or
  reflective;
- request a specific panel when a required declaration has no usable evidence;
- ask for a close-up when text exists but is too small to verify;
- move to rule execution only when the evidence threshold is met;
- send the case to human review when the system cannot safely resolve it.

This controller does not decide compliance. The deterministic rule engine
still evaluates only approved rules. Firebase Firestore can stream the scan
state and event timeline to the dashboard, while Firebase Storage holds the
original images and evidence crops.
