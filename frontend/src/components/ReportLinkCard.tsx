import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { SharedReport, subscribeToSharedReport } from "../lib/scanStore";

export interface ReportLinkCardProps {
  readonly onOpenScan: () => void;
}

export function ReportLinkCard({ onOpenScan }: ReportLinkCardProps) {
  const [code, setCode] = useState("");
  const [report, setReport] = useState<SharedReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code.trim()) {
      setReport(null);
      return;
    }
    return subscribeToSharedReport(code.trim(), setReport, (reason: Error) => setError(reason.message));
  }, [code]);

  return <section className="panel-card report-link-card">
    <div className="section-heading"><div><p className="eyebrow">Phone report bridge</p><h2>Bring in a mobile analysis</h2></div><Icon name="compare" size={18} /></div>
    <p>Open <b>?mode=phone</b> on your phone. After analysis, enter the six-character report code here.</p>
    <div className="report-code-input"><input aria-label="Phone report code" maxLength={6} onChange={(event) => setCode(event.target.value)} placeholder="e.g. 7K2P9Q" value={code} /><span>LIVE</span></div>
    {error && <small className="report-error">{error}</small>}
    {report ? <div className="shared-report"><div><span className="live-pill"><i /> Report synced</span><strong>{report.panel} · {report.status.replaceAll("_", " ")}</strong><small>Image quality: {report.qualityStatus.replaceAll("_", " ")} · OCR: {report.ocrStatus}</small>{report.qualityIssues[0] && <small className="report-action">{report.qualityIssues[0]}</small>}</div>{report.ocrPreview && <pre>{report.ocrPreview}</pre>}</div> : <button className="text-button" onClick={onOpenScan} type="button">Start a desktop scan instead <Icon name="chevron" size={14} /></button>}
  </section>;
}
