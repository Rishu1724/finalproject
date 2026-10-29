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
