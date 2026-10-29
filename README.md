# MetriCheck AI

Evidence-driven rule verification and change-impact simulation for packaged
food labels in India.

> **Important:** MetriCheck AI is a compliance-screening aid. It is not
> official certification, legal advice, or a substitute for review by a
> qualified person.

## Project rule: keep everything here

This directory is the complete project workspace. Source code, documentation,
official source documents, extracted research material, rule definitions,
tests, and evaluation metadata must stay inside this directory.

Do not create project files in the parent directory, a personal home
directory, or an external temporary location. Do not commit credentials,
private product images, personal information, or unreviewed legal
interpretations.

The root `README.md` is the project index and maintenance guide. Update it
when a directory, workflow, supported outcome, or development status changes.
Detailed information belongs in the relevant linked document below.

## Original idea and originality policy

The original idea remains the foundation of this project:

> **MetriCheck AI is an evidence-driven system for verifying packaged-food
> labels against applicable Indian food-labelling and Legal Metrology rules,
> showing the evidence behind every result, handling uncertainty through human
> review, and simulating the impact of rule or label changes.**

We are not replacing this idea with a generic rule editor. The User-defined
Rule Studio is the first original workflow that makes the larger idea
practical: it gives users a controlled way to create, test, approve, version,
and apply the rules that the compliance system uses.

MetriCheck AI must be designed and implemented as an original research
prototype. We will not copy another product's interface, implementation,
training data, rule files, or unsupported claims of novelty. Existing tools and
research may be studied for comparison, but their ideas must be attributed and
our implementation must be independently designed and evaluated.

The first original implementation module is the **User-defined Rule Studio**:

1. A user provides a rule or links it to an official source provision.
2. AI may propose a structured rule, applicability conditions, exceptions,
   evidence requirements, and test cases.
3. The user reviews the source mapping and edits the draft.
4. The system runs pass, fail, exception, and uncertainty test cases.
5. Only a human-approved and tested rule can be activated.
6. The compliance engine applies the activated rule to product evidence.

The complete product still includes the connected workflows described in this
README: package-image extraction, evidence linking, deterministic checking,
package-to-listing discrepancy detection, human review, and before-and-after
change-impact simulation.

## Mobile-first product workflow

The phone camera is the primary input. A user opens the web application on a
phone, grants camera permission, and captures the package panel-by-panel. The
system should guide the user instead of accepting one uncontrolled photograph:

1. Select the product category and start a scan.
2. Capture front, back, ingredients/nutrition, and side or bottom panels.
3. Check blur, glare, darkness, cropping, and text size immediately on the
   device.
4. Ask for a retake when an important panel is unreadable.
5. Upload the accepted images to the backend for OCR and field extraction.
6. Show highlighted evidence and let the user confirm important fields.
7. Apply approved rules and return an evidence-linked result.

The scan session must preserve image order, panel type, capture time, quality
checks, extracted fields, and user corrections. This creates a traceable
inspection rather than an unexplained camera-to-verdict shortcut.

## How the project creates real impact

The project should be useful for sellers, manufacturers, auditors, and
consumers by answering what to do next, not only by displaying a score:

- **Adaptive Evidence Recovery Loop:** the live dashboard identifies the
  highest-value missing or unreliable evidence and asks the phone user for the
  next specific panel or retake instead of making the user guess what to scan.
- **Guided capture:** reduce false findings by directing the user to capture
  the exact panel required by a rule.
- **Risk-prioritized review:** show the most important missing or uncertain
  declarations first, with a reason and suggested retake.
- **Actionable corrections:** explain the field, rule, evidence, and correction
  needed to prepare a better label or listing.
- **Package/listing protection:** identify differences between the physical
  package and online listing before publication.
- **Change simulation:** compare an old and revised label and show resolved,
  remaining, and newly introduced issues.
- **Learning from reviewed scans:** use permissioned reviewer corrections to
  measure and improve extraction quality without allowing the model to invent
  legal rules.

The project impact must be measured using scan completion rate, retake rate,
field accuracy, false-positive rate, human-review rate, time to actionable
result, and the percentage of issues resolved after a recommended correction.

## Major original feature: Adaptive Evidence Recovery Loop

This is the main difference we are adding to the original product. Existing
scan workflows commonly process one image and return a result. MetriCheck will
keep an active evidence session:

```text
Phone capture
    -> quality check
    -> OCR/model candidates
    -> required-evidence map
    -> next-best capture instruction
    -> user retake or new panel
    -> updated finding
```

### Why we are doing this

A legal declaration may be present but hidden by glare, blur, a curved surface,
small text, or an incomplete camera angle. Treating one failed OCR attempt as a
missing declaration creates false alarms and makes the result difficult to
trust. Asking the user for every possible photo is also slow and wasteful.

The loop uses the selected product context, approved rule requirements,
current OCR confidence, image quality, and unresolved fields to request only
the next most useful piece of evidence. It is an evidence-acquisition
controller, not an AI legal decision-maker.

### What the user will see

The dashboard updates live through Firebase listeners:

1. `Captured` — the phone uploaded a panel.
2. `Checking image quality` — blur, glare, crop, orientation, and readability
   are being evaluated.
3. `Reading label` — OCR providers are producing candidate text.
4. `Reconciling evidence` — fields and disagreements are being mapped to image
   regions.
5. `Action needed` — the dashboard requests a specific panel or retake.
6. `Ready for rules` — enough evidence exists for approved rule execution.
7. `Needs human review` or `Verified result` — the final state is explicit.

### What this is useful for

- Reduces false violations caused by poor phone photographs.
- Reduces unnecessary retakes by asking for the most valuable next image.
- Helps small manufacturers and sellers complete a scan without knowing label
  regulations in advance.
- Gives reviewers a complete timeline of what was captured and why.
- Produces a measurable research result: evidence completion, time to reliable
  result, retake efficiency, and reduction in unsupported findings.

This feature is an original design direction for this project, not a claim that
no other product has ever used adaptive capture. We will demonstrate its value
through implementation and measured comparison with a one-shot scan baseline.

Every project change must be recorded in the `Change record` section below.
Each entry must state what changed, why it changed, which files were affected,
and how it was verified. No feature is considered complete until its README
documentation and change record are updated.

## Original data policy

Use only data that is original, permissioned, officially published, or clearly
licensed for this project. Preserve the provenance of every source. Do not
silently scrape, copy, or reuse another system's dataset.

For each packaged-food example, store or document:

- Image provenance, permission, license, and collection date.
- Product category and package context.
- Annotated label regions and verified field values.
- Annotation method, annotator, verification date, and disagreements.
- Image conditions such as blur, glare, rotation, shadow, reflection, and
  resolution where applicable.
- Expected rule outcomes separately verified by a human.

Private images, personal information, credentials, and unreviewed legal
interpretations must remain local and must not be committed. If a source
cannot be legally or ethically used, do not add it to the dataset.

## What we are building

The first release supports packaged food products sold in India. It combines:

- FSSAI food-labelling requirements.
- Legal Metrology requirements for packaged commodities.
- OCR and vision-assisted label extraction.
- Field normalization with image and source evidence.
- Deterministic, versioned rule execution.
- Human review for uncertain evidence or applicability.
- Before-and-after auditing when a rule version changes.

AI may extract candidate fields, locate evidence, draft rules, and explain
verified findings. It must not invent legal requirements or make the final
compliance decision. Only approved, human-verified rules may be executed.

## Supported outcomes

| Outcome | Meaning |
| --- | --- |
| `passed` | All applicable checks have sufficient evidence and pass. |
| `flagged` | A verified applicable check fails with sufficient evidence. |
| `needs_human_review` | Evidence, applicability, or model output is uncertain. |
| `discrepancy` | Package and listing values differ; this is not automatically a legal violation. |

## Project layout

```text
backend/                         FastAPI API and compliance services
  README.md                      Backend responsibilities and planned modules
frontend/                        React application
  README.md                      Frontend responsibilities and UX rules
legal-sources/                   Official documents and legal-source workflow
  documents/                     Original, unmodified official PDFs
  extracted-text/                Research-only text extracted from PDFs
  rule-drafts/                   Unapproved AI-assisted or manual interpretations
  rule-tests/                    Source-linked verification test cases
  source-manifest.json           Source URLs, dates, hashes, and statuses
rules/                           Approved executable rules and their tests
  active/                        Human-verified rules allowed in production
  drafts/                        Rules not yet approved for execution
  tests/                         Tests for active and draft rules
data/                            Local metadata and evaluation manifests
  images/                        Local-only evaluation images; never commit them
docs/                            Product direction and system architecture
```

Every directory has its own README where its contents need additional rules.
Placeholder `.gitkeep` files only preserve empty directory structure; they are
not application code.

## Current status

The project is at the foundation and source-verification stage:

- [ ] Backend application and API
- [x] Frontend application foundation and Firebase evidence dashboard
- [x] OCR and image-quality adapter foundation
- [ ] Field normalization and evidence model
- [ ] Deterministic compliance engine
- [ ] Review and audit workflow
- [ ] Executable approved rules
- [ ] Evaluation dataset and metrics
- [ ] Exact official Legal Metrology PDF
- [ ] Human verification of the downloaded FSSAI documents

The current frontend milestone now reads the signed-in user's scan sessions
from Firestore in real time. It shows the latest captured panel, current
evidence stage, and truthful scan counts; it still does not display a legal
pass/fail result before OCR and human-verified rules are available.

The phone upload now also calls the local FastAPI analyzer. It performs basic
image-quality checks and attempts Tesseract OCR when that runtime is installed.
OCR output remains candidate evidence and must be confirmed before any future
rule evaluation.

The three preserved FSSAI PDFs are present under
`legal-sources/documents/`, but all remain
`downloaded_pending_human_verification`. The missing Legal Metrology document
must be downloaded only from an official government or Gazette source. Never
use an unofficial copy or a placeholder PDF.

For the research rationale, system boundary, and evaluation measurements, see
[`docs/PROJECT_DIRECTION.md`](docs/PROJECT_DIRECTION.md). For the data flow
and component responsibilities, see
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Safe source and rule workflow

1. Download the original PDF from an eligible official authority.
2. Save the unmodified PDF under `legal-sources/documents/`.
3. Record the exact URL, authority, dates, retrieval date, and SHA-256 hash in
   `legal-sources/source-manifest.json`.
4. Extract text into `legal-sources/extracted-text/` without editing the PDF.
5. Draft interpretations in `legal-sources/rule-drafts/`.
6. Link every draft to an exact source provision.
7. Human-verify wording, applicability, exceptions, and dates.
8. Add positive, negative, exception, and uncertainty cases.
9. Move only approved, tested rules into `rules/active/`.

An AI-generated draft is never an active legal rule. A source with a pending
status must not be used by the compliance engine.

## Development conventions

- Keep backend, frontend, legal sources, rules, data, and documentation in
  their designated directories.
- Prefer small, verifiable changes and update the relevant README when a
  workflow changes.
- Keep original legal PDFs immutable.
- Keep private uploads and evaluation images local and ignored by Git.
- Preserve source IDs, rule IDs, versions, dates, and hashes once published.
- Distinguish confirmed failures, source discrepancies, and insufficient
  evidence in both the API and UI.
- Do not report accuracy or compliance results from unverified data.

## Key references

- [Architecture](docs/ARCHITECTURE.md)
- [Project direction and research contribution](docs/PROJECT_DIRECTION.md)
- [Backend plan](backend/README.md)
- [Frontend plan](frontend/README.md)
- [Official-source policy](legal-sources/README.md)
- [Source manifest](legal-sources/source-manifest.json)
- [Rule policy](rules/README.md)
- [Data policy](data/README.md)

## Change record

| Date | Change | Reason | Files | Verification |
| --- | --- | --- | --- | --- |
| 2026-10-29 | Removed the private scan-session listener from phone mode so the phone surface only creates the report summary it needs. | Enforce the phone/laptop data boundary in runtime behavior, not only in the visual UI. | `frontend/src/App.tsx` | Frontend build passed; phone route no longer subscribes to the private `scans` collection. |
| 2026-10-29 | Added a dedicated phone capture workspace and a report-only bridge to the laptop dashboard using shared Firestore report records. | Keep phone UX focused on capture while allowing the laptop to receive only generated analysis, quality, and OCR summary data. | `frontend/src/components/PhoneScanApp.tsx`, `frontend/src/components/ReportLinkCard.tsx`, `frontend/src/lib/scanStore.ts`, `firestore.rules`, `frontend/src/styles.css` | Frontend build required; shared reports exclude original image URLs and private scan-session fields. |
| 2026-10-29 | Connected phone uploads to the FastAPI analyzer with image-quality checks and optional Tesseract OCR, then streamed the result as a scan stage. | Make the phone capture perform real evidence processing instead of only storing an image; preserve explicit uncertainty when OCR is unavailable or the image is weak. | `backend/app/main.py`, `backend/requirements.txt`, `frontend/src/components/ScanDialog.tsx`, `frontend/src/lib/scanStore.ts` | Frontend build and backend analyzer checks required; legal decisions remain disabled until source rules are verified. |
| 2026-10-29 | Published the complete project as its own Git repository, including Firebase deployment configuration and security rules while excluding local credentials and generated files. | Make the project portable and versioned without exposing `.env.local`, private uploads, dependencies, or build output. | `.gitignore`, repository history | Repository initialized in the project directory; final staged-file audit performed before push. |
| 2026-10-29 | Connected the dashboard to owner-scoped Firestore listeners and added live scan metrics, latest-evidence status, and Firebase error feedback. | Make the phone upload visible in the dashboard immediately while preserving the distinction between stored evidence and a legal compliance decision. | `frontend/src/App.tsx`, `frontend/src/lib/scanStore.ts`, `frontend/src/styles.css` | TypeScript/Vite production build passed; scans remain evidence-only until OCR and approved rules are connected. |
| 2026-10-29 | Added Firebase Storage/Firestore persistence, anonymous scan sessions, owner-scoped security rules, and deployment configuration. | Store phone evidence and live scan events safely while preserving the original government-rule and deterministic-engine boundary. | `frontend/src/lib/`, `frontend/.env.example`, `firebase.json`, `firestore.rules`, `storage.rules` | Frontend build passed; Firebase Auth, Firestore, and Storage must be enabled in the Firebase console before a live upload. Storage reads and writes use separate security checks. |
| 2026-10-29 | Added Firebase client integration for anonymous scan sessions, Storage image uploads, Firestore scan documents, and event stages from the phone capture dialog. | Persist real scan evidence and stream the Adaptive Evidence Recovery Loop without putting credentials in source code. | `frontend/src/lib/`, `frontend/src/components/ScanDialog.tsx`, `frontend/.env.example`, `frontend/package.json` | Frontend build pending after Firebase dependency installation; Firebase console rules/auth setup still required. |
| 2026-10-29 | Added the Adaptive Evidence Recovery Loop: live scan stages, next-best capture instructions, targeted retakes, and real-time dashboard events. | Make phone scanning useful in imperfect real-world conditions and reduce unsupported findings instead of returning a one-shot OCR verdict. | `README.md`, `docs/ARCHITECTURE.md`, `frontend/README.md`, `backend/README.md` | Documentation reviewed; feature will be validated against a one-shot scan baseline during implementation. |
| 2026-10-29 | Replaced the single capture page with a dashboard shell for scans, results, listing comparison, history, reports, human review, and rule management; added a guided phone-scan dialog and truthful government-source readiness cards. | Make the product useful as a real workflow while preserving the original evidence-first mission and avoiding fabricated compliance data. | `frontend/src/App.tsx`, `frontend/src/styles.css`, `frontend/src/components/`, `frontend/src/data/` | Frontend build pending after dashboard implementation. |
| 2026-10-29 | Added the first phone-scan vertical slice: React capture UI and FastAPI analysis endpoint that returns an explicit review state until approved OCR and government rules are available. | Start the real product without changing the original evidence-driven mission or inventing compliance results. | `frontend/`, `backend/` | Frontend build and backend health/API checks pending after dependency installation. |
| 2026-10-29 | Defined the phone camera as the primary input and added guided panel capture, image-quality checks, retake instructions, action-oriented findings, and impact metrics. | Make the system useful in real scanning conditions and distinguish it from a generic OCR website. | `README.md`, `docs/ARCHITECTURE.md`, `docs/PROJECT_DIRECTION.md`, `frontend/README.md` | Documentation reviewed; `git diff --check` passed. |
| 2026-10-29 | Preserved the original evidence-driven packaged-food compliance idea as the complete product mission; clarified that Rule Studio is the first module within it. | Prevent the original project vision from being narrowed into only a rule editor. | `README.md`, `docs/PROJECT_DIRECTION.md` | Documentation reviewed; `git diff --check` passed. |
| 2026-10-29 | Selected the User-defined Rule Studio as the first original core workflow; added originality, original-data, and mandatory change-record policies. | Make the research contribution concrete and prevent undocumented or copied implementation decisions. | `README.md` | Documentation reviewed; repository remains at the planning stage. |
| 2026-10-29 | Documented the staged multi-model architecture and deterministic Python rule-engine boundary. | Keep AI useful for extraction and drafting without allowing unsupported compliance decisions. | `docs/PROJECT_DIRECTION.md`, `docs/ARCHITECTURE.md`, `backend/README.md`, `frontend/README.md` | Documentation reviewed; `git diff --check` passed. |
| 2026-10-29 | Made the project workspace self-contained and retained official PDFs while ignoring temporary/private files. | Keep all project material in this directory and preserve source provenance. | `.gitignore`, `README.md` | Ignore policy reviewed; official legal-source hashes remain recorded in `legal-sources/source-manifest.json`. |

## Official starting points

- [FSSAI regulations](https://www.fssai.gov.in/cms/food-safety-and-standards-regulations.php)
- [Department of Consumer Affairs](https://consumeraffairs.nic.in/)
- [India Code](https://www.indiacode.nic.in/)
- [Gazette of India](https://egazette.gov.in/)
