import { signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  firebaseAuth,
  firebaseStorage,
  firestore,
  isFirebaseConfigured,
} from "./firebase";

export type ScanStage =
  | "captured"
  | "quality_check"
  | "reading_label"
  | "reconciling_evidence"
  | "action_needed";

export interface ScanRecord {
  readonly id: string;
  readonly panel: string;
  readonly status: ScanStage;
  readonly imageUrl?: string;
  readonly createdAt?: { toMillis?: () => number };
}

export interface SharedReport {
  readonly id: string;
  readonly code: string;
  readonly panel: string;
  readonly status: string;
  readonly qualityStatus: string;
  readonly qualityIssues: string[];
  readonly ocrStatus: string;
  readonly ocrPreview: string;
  readonly createdAt?: { toMillis?: () => number };
}

async function ensureAnonymousUser() {
  if (!firebaseAuth) throw new Error("Firebase Authentication is not configured.");
  if (!firebaseAuth.currentUser) await signInAnonymously(firebaseAuth);
  if (!firebaseAuth.currentUser) throw new Error("Anonymous Firebase sign-in failed.");
  return firebaseAuth.currentUser.uid;
}

export async function createScanSession(file: File, panel: string) {
  if (!isFirebaseConfigured || !firestore || !firebaseStorage) {
    throw new Error("Firebase is not configured. Copy frontend/.env.example to frontend/.env.local.");
  }

  const uid = await ensureAnonymousUser();
  const scanRef = doc(collection(firestore, "scans"));
  const imageRef = ref(firebaseStorage, `scans/${uid}/${scanRef.id}/${file.name}`);
  const upload = await uploadBytes(imageRef, file, { contentType: file.type });
  const imageUrl = await getDownloadURL(upload.ref);
  await setDoc(scanRef, {
    scanId: scanRef.id,
    ownerUid: uid,
    productCategory: "packaged_food",
    status: "captured",
    currentPanel: panel,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await addDoc(collection(scanRef, "events"), {
    stage: "captured" satisfies ScanStage,
    panel,
    message: "Panel uploaded from phone camera.",
    createdAt: serverTimestamp(),
  });
  return scanRef.id;
}

export async function addScanStage(scanId: string, stage: ScanStage, message: string) {
  if (!firestore) throw new Error("Firestore is not configured.");
  const scanRef = doc(firestore, "scans", scanId);
  await setDoc(scanRef, { status: stage, updatedAt: serverTimestamp() }, { merge: true });
  await addDoc(collection(scanRef, "events"), {
    stage,
    message,
    createdAt: serverTimestamp(),
  });
}

export async function analyseScanWithBackend(file: File, panel: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("panel", panel);
  formData.append("product_category", "packaged_food");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? `http://${window.location.hostname}:8000`;
  const response = await fetch(`${apiBaseUrl}/api/v1/scans/analyze`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Analysis failed (${response.status}): ${detail}`);
  }

  return response.json() as Promise<{
    quality: { status: string; issues: string[] };
    ocr: { status: string; text: string };
  }>;
}

function createReportCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function publishSharedReport(file: File, panel: string) {
  if (!isFirebaseConfigured || !firestore) throw new Error("Firebase is not configured.");
  const uid = await ensureAnonymousUser();
  const analysis = await analyseScanWithBackend(file, panel);
  const code = createReportCode();
  const reportRef = doc(collection(firestore, "sharedReports"));
  await setDoc(reportRef, {
    reportId: reportRef.id,
    code,
    ownerUid: uid,
    panel,
    status: analysis.quality.status === "needs_retake" ? "action_needed" : "needs_human_review",
    qualityStatus: analysis.quality.status,
    qualityIssues: analysis.quality.issues,
    ocrStatus: analysis.ocr.status,
    ocrPreview: analysis.ocr.text.slice(0, 1000),
    createdAt: serverTimestamp(),
  });
  return { id: reportRef.id, code };
}

export function subscribeToSharedReport(
  code: string,
  onChange: (report: SharedReport | null) => void,
  onError: (error: Error) => void,
) {
  if (!firestore) {
    onChange(null);
    return () => undefined;
  }
  const reportsQuery = query(collection(firestore, "sharedReports"), where("code", "==", code.toUpperCase()));
  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const report = snapshot.docs[0];
      onChange(report ? ({ id: report.id, ...report.data() } as SharedReport) : null);
    },
    onError,
  );
}

export function subscribeToUserScans(
  onChange: (scans: ScanRecord[]) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured || !firebaseAuth || !firestore) {
    onChange([]);
    return () => undefined;
  }

  const db = firestore;
  let unsubscribe: () => void = () => undefined;
  let cancelled = false;
  ensureAnonymousUser()
    .then((uid) => {
      if (cancelled) return;
      const scansQuery = query(collection(db, "scans"), where("ownerUid", "==", uid));
      unsubscribe = onSnapshot(
        scansQuery,
        (snapshot) => {
          const scans = snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }) as ScanRecord)
            .sort((left, right) => (right.createdAt?.toMillis?.() ?? 0) - (left.createdAt?.toMillis?.() ?? 0));
          onChange(scans);
        },
        (error) => onError(error),
      );
    })
    .catch((error: unknown) => onError(error instanceof Error ? error : new Error("Could not read scan sessions.")));

  return () => {
    cancelled = true;
    unsubscribe();
  };
}
