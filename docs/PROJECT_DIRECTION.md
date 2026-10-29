# Project direction

## Proposed research direction

**MetriCheck AI: An Evidence-Driven, User-Defined Rule Verification and
Change-Impact Simulator for Packaged Food Labels**

The original product idea remains a complete packaged-food label verification
system for India. It receives package images and optional listing data,
extracts and validates declarations, applies applicable approved rules,
connects findings to evidence, handles uncertainty through human review, and
compares results across rule or label revisions. The User-defined Rule Studio
is the first distinctive implementation module inside that larger workflow,
not a replacement for it.

## Contribution

The project is not positioned as the first label scanner. Its contribution is
the combination of:

1. AI-assisted rule authoring from official documents.
2. Deterministic execution of approved rules.
3. Traceability from each finding to label evidence and a source provision.
4. Before-and-after auditing when a rule version changes.
5. Evaluation on manually verified packaged-food images.

The project should describe these as implemented and measured capabilities,
not as claims that no other system has ever attempted them. The strongest
research gap is the reliability of the verification step after extraction:
whether the extracted value is trustworthy, which rule version applies, how
the result is justified, and what happens when the evidence is insufficient.

### Problems this project addresses

- Reading a label is not the same as checking it against an applicable rule.
- OCR errors caused by glare, curved packaging, blur, shadows, or small text can
  create false alarms.
- A requirement may depend on product category, exceptions, or effective date.
- A pass/fail result without its image region, extracted value, and rule
  provision is difficult to audit.
- An unreadable or missing OCR result does not prove that a declaration is
  absent.

### Defensible differentiators

1. **User-defined Rule Studio (first implementation module):** users provide rule text
   or approved source material; AI proposes structured conditions, exceptions,
   evidence requirements, and test cases; a human approves the rule before
   execution.
2. **Evidence-linked compliance:** every finding links to the source image
   region, extracted text/value, applicable rule version, and comparison reason.
3. **Package-to-listing discrepancy detection:** package declarations can be
   compared with seller listing data, while discrepancies remain separate from
   legal violations.
4. **Time-aware and uncertainty-aware review:** rule effective dates and
   amendments are preserved, and disagreement or unreadable evidence goes to
   human review rather than becoming an unsupported violation.

The before-and-after simulator and robustness benchmark make these capabilities
measurable: the simulator compares resolved, remaining, and newly introduced
findings, while the benchmark evaluates clear, blurred, rotated, shadowed,
reflective, and low-resolution package images.

## Mobile-first impact

The phone camera is not just an image upload mechanism. It creates a realistic
constraint: users capture labels in uncontrolled environments with blur, glare,
curvature, shadows, poor lighting, and incomplete panels. MetriCheck should
actively improve evidence quality by guiding panel-by-panel capture, detecting
weak images before processing, requesting retakes, and measuring whether the
next scan resolves the uncertainty.

The system's practical impact is therefore the reduction of unsupported
compliance decisions and the conversion of findings into concrete actions:
capture a missing panel, correct a label declaration, verify a listing value,
or send a case to a reviewer.

## Original implementation commitment

MetriCheck AI must be implemented as an independently designed research
prototype. We may compare against existing systems and cite prior work, but we
must not copy their code, interfaces, rule libraries, or datasets. Originality
will be demonstrated through the Rule Studio workflow, source-linked rule
testing, provenance-preserving data, and measured results rather than through a
claim that no similar feature exists elsewhere.

Every implementation change must be recorded in the root README with its
date, reason, affected files, and verification result.

## System boundary

AI may extract candidate fields, locate evidence, draft rules, and explain
verified findings. It must not invent legal requirements or make the final
compliance decision. The rule engine evaluates only approved rules.

## AI and model strategy

MetriCheck uses a staged, multi-component architecture rather than treating a
single model as the compliance authority:

| Component | Role | Initial approach |
| --- | --- | --- |
| Image preprocessing | Improve crop, rotation, contrast, and readability | OpenCV-style deterministic preprocessing |
| OCR engine | Read printed declarations | PaddleOCR or Tesseract baseline |
| Field extraction | Map text to fields such as MRP, net quantity, dates, and manufacturer | Structured extraction model/rules; fine-tune only if evaluation justifies it |
| Visual region detection | Locate relevant label regions when required | Pretrained CNN/YOLO-style detector; optional fine-tuning |
| Vision reasoning | Help interpret layout or reconcile candidate fields | Optional Gemini Vision adapter, with outputs treated as evidence candidates |
| Independent verification | Compare extraction results and expose disagreement | Second OCR/model pass such as Tesseract plus PaddleOCR |
| Rule drafting | Convert user/source instructions into a proposed rule | Optional LLM adapter; always human approval |
| Compliance evaluation | Execute approved conditions and return outcomes | Deterministic Python rules engine; no ML training |
| Report generation | Explain verified results in readable language | Optional GPT-style reporting adapter constrained to engine results |

CNN or ViT models learn visual patterns; they do not learn legal requirements
merely because a rule document is supplied. The first working version should
establish an OCR plus deterministic-rule baseline before training a custom
vision model. Training is justified only by measured baseline errors and a
sufficiently annotated dataset.

## Dataset purpose

The dataset remains valuable even when pretrained models are used. It supports:

- **Testing:** compare extracted fields against manually verified values.
- **Training/fine-tuning:** learn package-region or field-extraction patterns
  if the baseline requires improvement.
- **Compliance validation:** test false positives, false negatives, reviewer
  rate, and rule-engine outcomes against human ground truth.

Dataset records should contain real or permissioned packaged-food images,
annotated label regions, verified text/field values, image-condition labels,
and human-reviewed expected outcomes. Keep legal-rule verification separate
from model annotations.

## Supported outcomes

- `passed`: all applicable checks have sufficient evidence and pass.
- `flagged`: a verified applicable check fails with sufficient evidence.
- `needs_human_review`: evidence, applicability, or model outputs are
  uncertain.
- `discrepancy`: package and listing values differ; this is not automatically a
  legal violation.

## Research measurements

The evaluation should report field-level exact-value accuracy, precision and
recall for checks, model disagreement rate, false-positive rate, human-review
rate, processing time, and cost per scan.
