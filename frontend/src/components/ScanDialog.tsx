import { useState } from "react";
import { Icon } from "./Icon";
import { addScanStage, createScanSession } from "../lib/scanStore";

export interface ScanDialogProps {
  readonly onClose: () => void;
}

export function ScanDialog({ onClose }: ScanDialogProps) {
  const [panel, setPanel] = useState("Front panel");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function analyse() {
    if (!image) return;
    setIsSubmitting(true);
    setStatus("Uploading evidence...");
    try {
      const scanId = await createScanSession(image, panel);
      setStatus("Checking image quality...");
      await addScanStage(scanId, "quality_check", "Image quality checks are queued.");
      setStatus("Scan saved. OCR and evidence reconciliation are next.");
      onClose();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The scan could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="scan-dialog" role="dialog" aria-modal="true" aria-labelledby="scan-title">
        <button className="icon-button dialog-close" onClick={onClose} type="button" aria-label="Close scan dialog"><Icon name="x" /></button>
        <div className="dialog-kicker"><Icon name="camera" size={14} /> PHONE SCAN / INDIA</div>
        <h2 id="scan-title">Start a new product scan</h2>
        <p className="dialog-copy">Capture each label panel clearly. MetriCheck checks evidence quality before it applies approved government rules.</p>
        <label className="field-label" htmlFor="panel">Panel being captured</label>
        <select id="panel" value={panel} onChange={(event) => setPanel(event.target.value)}>
          <option>Front panel</option>
          <option>Back panel</option>
          <option>Ingredients and nutrition</option>
          <option>Side or bottom panel</option>
        </select>
        <label className="mobile-drop">
          <Icon name="camera" size={25} />
          <strong>{image?.name || "Take a photo or choose an image"}</strong>
          <span>Keep the label flat, bright, and inside the frame.</span>
          <input accept="image/*" capture="environment" onChange={(event) => setImage(event.target.files?.[0] ?? null)} type="file" />
        </label>
        <div className="quality-note"><Icon name="shield" size={16} /><span>Unreadable evidence becomes <b>Needs human review</b>, never an automatic violation.</span></div>
        {status && <p className="dialog-status">{status}</p>}
        <button className="button primary-button" disabled={!image || isSubmitting} onClick={analyse} type="button"><Icon name="sparkles" size={16} /> {isSubmitting ? "Saving scan..." : "Analyse evidence"}</button>
      </section>
    </div>
  );
}
