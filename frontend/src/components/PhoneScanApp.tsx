import { useRef, useState, type ChangeEvent } from "react";
import { Icon } from "./Icon";
import { publishSharedReport } from "../lib/scanStore";

export interface PhoneScanAppProps {
  readonly onDesktopView: () => void;
}

export function PhoneScanApp({ onDesktopView }: PhoneScanAppProps) {
  const [image, setImage] = useState<File | null>(null);
  const [panel, setPanel] = useState("Front panel");
  const [reportCode, setReportCode] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("metricheck_display_name") ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function choosePhoto() {
    fileInputRef.current?.click();
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setImage(selected);
    setReportCode("");
    setStatus(selected ? "Photo captured. Review it, then create the analysis report." : "");
  }

  async function publish() {
    if (!image) return;
    if (displayName.trim().length < 2) {
      setStatus("Enter your real name before creating the report.");
      return;
    }
    localStorage.setItem("metricheck_display_name", displayName.trim());
    setBusy(true);
    setStatus("Uploading and preparing your report...");
    try {
      const report = await publishSharedReport(image, panel);
      setReportCode(report.code);
      setStatus("Report ready. Enter this code on the laptop dashboard.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The report could not be created.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="phone-workspace">
      <header className="phone-header">
        <div className="brand"><span className="brand-mark"><Icon name="shield" size={18} /></span><span>Metri<span>Check</span> <small>AI</small></span></div>
        <button className="phone-desktop-link" onClick={onDesktopView} type="button">Laptop dashboard</button>
      </header>
      <section className="phone-hero">
        <p className="eyebrow">MOBILE EVIDENCE CAPTURE</p>
        <h1>Scan a food label<br /><span>with confidence.</span></h1>
        <p>Capture one clear panel. We will check the image, read candidate text, and send only the analysis report to your dashboard.</p>
      </section>
      <section className="phone-card">
        <label className="field-label" htmlFor="phone-name">Your name</label>
        <input className="phone-name-input" id="phone-name" onChange={(event) => setDisplayName(event.target.value)} placeholder="Enter your real name" value={displayName} />
        <small className="phone-field-help">Saved with your scan record so reports have a clear owner.</small>
        <label className="field-label" htmlFor="phone-panel">What are you capturing?</label>
        <select id="phone-panel" value={panel} onChange={(event) => setPanel(event.target.value)}>
          <option>Front panel</option>
          <option>Back panel</option>
          <option>Ingredients and nutrition</option>
          <option>Side or bottom panel</option>
        </select>
        <div className="phone-capture">
          <Icon name="camera" size={30} />
          <strong>{image ? image.name : "Take a label photo"}</strong>
          <span>Use bright, even light and keep all text inside the frame.</span>
          {image && <img className="phone-preview" src={URL.createObjectURL(image)} alt="Selected package label" />}
          <button className="button outline-button capture-button" onClick={choosePhoto} type="button">
            <Icon name="camera" size={16} /> {image ? "Retake photo" : "Open camera"}
          </button>
          <input ref={fileInputRef} accept="image/*" capture="environment" onChange={handlePhoto} type="file" />
          <small>Camera unavailable? The button also lets you choose a photo from your gallery.</small>
        </div>
        <button className="button primary-button phone-submit" disabled={!image || busy} onClick={publish} type="button">
          <Icon name="sparkles" size={16} /> {busy ? "Analysing..." : "Create analysis report"}
        </button>
        {status && <p className="phone-status" role="status">{status}</p>}
        {reportCode && <div className="report-code"><span>REPORT CODE</span><strong>{reportCode}</strong><small>Use this code on the laptop dashboard to view the generated analysis.</small></div>}
      </section>
      <p className="phone-safety"><Icon name="shield" size={14} /> Images stay protected. Only the generated report summary is shared.</p>
    </main>
  );
}
