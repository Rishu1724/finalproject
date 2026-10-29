# Frontend

The frontend will provide the food-label scan, evidence workspace, compliance
report, review queue, rule explorer, and change-impact simulator.

The current first vertical slice is a phone-first React capture screen. It
captures a selected package panel and sends it to the FastAPI backend. Until
official rules are human-verified and an OCR provider is connected, the UI
must display `needs_human_review` rather than a fabricated compliance result.

The UI must distinguish a confirmed rule failure from a source discrepancy and
from insufficient evidence.

The primary user workflow is:

1. Start a scan on a phone and select the product category.
2. Capture guided front, back, ingredients/nutrition, and side or bottom panels.
3. Receive immediate blur, glare, darkness, crop, and panel-quality feedback.
4. Retake weak images before sending them for processing.
5. Review extracted fields and their image regions.
6. Run only approved, applicable, versioned rules.
7. Inspect passed checks, confirmed failures, discrepancies, and review cases.
8. Correct uncertain evidence or request a clearer image.
9. Compare an original label with a revised label.

Rule Studio must show that AI-generated rules are drafts until a human
approves the source, applicability, exceptions, dates, and test cases.

The interface should prioritize actions over a generic compliance score. Each
uncertain or failed result must show the relevant evidence, rule, reason,
recommended next action, and whether a retake or human review is required.

The dashboard's distinctive interaction is the Adaptive Evidence Recovery
Loop. It should stream the current scan stage and timeline, then show one
specific next action such as “Retake the back panel without glare” or “Capture
a close-up of the net-quantity area.” It should not ask for every panel again
when one targeted capture would resolve the uncertainty.

With Firebase, the dashboard should subscribe to the scan session and event
subcollection so phone uploads, quality checks, OCR progress, reviewer actions,
and final results appear without a manual refresh.

The dashboard currently subscribes to the authenticated owner's `scans`
collection and renders the latest session and evidence-stage counts in real
time. Event-timeline rendering is the next UI increment; no compliance result
is shown until approved rules and verified evidence exist.

Firebase configuration belongs in `.env.local` using `.env.example` as the
template. The client stores images in Firebase Storage and scan metadata/events
in Firestore. Do not commit service-account credentials or private keys.

From the repository root, deploy the checked-in Firebase rules after installing
the Firebase CLI and selecting project `finalyear-25144`:

```bash
firebase use finalyear-25144
firebase deploy --only firestore:rules,storage
```

Enable Anonymous Authentication, Firestore, and Storage in the Firebase
console before testing a phone upload. The frontend configuration alone cannot
enable those services.

### Phone and laptop surfaces

Open `/?mode=phone` on the phone for the focused capture workspace. After
analysis, the phone displays a six-character report code. Enter that code in
the laptop dashboard's **Phone report bridge** card. Only the generated report
summary, image-quality state, OCR status, and recommended action are shared;
the original image and private scan session remain protected.
