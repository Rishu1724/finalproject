import { useEffect, useState } from "react";
import { Icon } from "./components/Icon";
import { ScanDialog } from "./components/ScanDialog";
import { navigation, sourceCards } from "./data/dashboardData";
import { ScanRecord, subscribeToUserScans } from "./lib/scanStore";
import { PhoneScanApp } from "./components/PhoneScanApp";
import { ReportLinkCard } from "./components/ReportLinkCard";

function App() {
  const isPhoneMode = new URLSearchParams(window.location.search).get("mode") === "phone";
  const [activePage, setActivePage] = useState("dashboard");
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [firebaseError, setFirebaseError] = useState("");

  useEffect(() => subscribeToUserScans(setScans, (error) => setFirebaseError(error.message)), []);

  const latestScan = scans[0];
  const liveMetrics = [
    { value: scans.length ? String(scans.length) : "—", label: "Products scanned", note: scans.length ? "Stored evidence sessions" : "No scans stored yet" },
    { value: "—", label: "Passed checks", note: "Requires approved rules" },
    { value: "—", label: "Products flagged", note: "No verdicts invented" },
    { value: latestScan?.status === "action_needed" ? "1" : "—", label: "Awaiting human review", note: latestScan?.status === "action_needed" ? "Latest scan needs attention" : "No review queue yet" },
  ];

  if (isPhoneMode) return <PhoneScanApp onDesktopView={() => { window.location.href = window.location.pathname; }} />;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Icon name="shield" size={18} /></span><span>Metri<span>Check</span> <small>AI</small></span></div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => <button className={activePage === item.id ? "nav-item active" : "nav-item"} key={item.id} onClick={() => setActivePage(item.id)} type="button"><Icon name={item.icon} size={16} /><span>{item.label}</span>{item.id === "review" && <em>0</em>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="workspace-label">WORKSPACE</div><button className="nav-item" type="button"><Icon name="settings" size={16} /><span>Settings</span></button><p>Decision-support tool.<br />Not an official legal authority.</p></div>
      </aside>
      <div className="main-shell">
        <header className="topbar"><button className="mobile-menu icon-button" type="button" aria-label="Open menu"><Icon name="menu" /></button><div className="search-box"><Icon name="search" size={16} /><input placeholder="Search scans by product" type="search" /></div><div className="top-actions"><button className="icon-button" aria-label="Notifications" type="button"><Icon name="bell" /></button><button className="icon-button" aria-label="Profile" type="button"><Icon name="user" /></button></div></header>
        <main className="dashboard-main">
          <div className="page-heading"><div><p className="eyebrow">METRICHECK WORKSPACE / INDIA</p><h1>{activePage === "dashboard" ? "Dashboard" : navigation.find((item) => item.id === activePage)?.label}</h1><p className="subheading">Your evidence-first packaged-food verification workspace.</p></div><button className="button primary-button" onClick={() => setIsScanOpen(true)} type="button"><Icon name="camera" size={15} /> Scan new product</button></div>
          {activePage === "dashboard" ? <><section className="metric-grid">{liveMetrics.map((metric) => <article className="metric-card" key={metric.label}><span className="metric-value">{metric.value}</span><strong>{metric.label}</strong><small>{metric.note}</small></article>)}</section>{firebaseError && <div className="inline-warning"><Icon name="alert" size={15} /> {firebaseError}</div>}<ReportLinkCard onOpenScan={() => setIsScanOpen(true)} /><section className="dashboard-grid"><div className="main-column">{latestScan ? <section className="panel-card live-scan-card"><div className="section-heading"><div><p className="eyebrow">Live evidence session</p><h2>Latest scan is {latestScan.status.replaceAll("_", " ")}</h2></div><span className="live-pill"><i /> Live</span></div><div className="scan-summary"><div className="scan-thumbnail">{latestScan.imageUrl ? <img src={latestScan.imageUrl} alt="Latest captured label panel" /> : <Icon name="camera" size={22} />}</div><div><strong>{latestScan.panel}</strong><p>Evidence is stored. Compliance is not decided until OCR, source verification, and human review are complete.</p><span className="scan-stage">{latestScan.status.replaceAll("_", " ")}</span></div></div><button className="button outline-button" onClick={() => setActivePage("history")} type="button">Open scan history <Icon name="chevron" size={15} /></button></section> : <section className="panel-card empty-panel"><div className="empty-illustration"><Icon name="camera" size={23} /></div><div><p className="eyebrow">Your first evidence session</p><h2>Start with a clear package panel</h2><p>Use your phone camera to capture front, back, ingredients, and side panels. We keep every finding linked to its image evidence.</p><button className="button outline-button" onClick={() => setIsScanOpen(true)} type="button">Start guided scan <Icon name="chevron" size={15} /></button></div></section>}<section className="panel-card"><div className="section-heading"><div><p className="eyebrow">Impact loop</p><h2>From scan to improvement</h2></div><span className="section-caption">Original workflow</span></div><div className="impact-steps"><div><span>01</span><strong>Capture</strong><small>Panel-by-panel phone scan</small></div><div><span>02</span><strong>Verify</strong><small>Evidence and approved rules</small></div><div><span>03</span><strong>Improve</strong><small>Fix, rescan, compare</small></div></div></section></div><aside className="right-column"><section className="panel-card source-panel"><div className="section-heading"><div><p className="eyebrow">Rule readiness</p><h2>Government sources</h2></div><Icon name="clipboard" size={18} /></div>{sourceCards.map((source) => <div className="source-row" key={source.title}><div className={`source-icon ${source.tone}`}><Icon name="file" size={15} /></div><div><strong>{source.title}</strong><small>{source.detail}</small><span className={`source-status ${source.tone}`}>{source.status}</span></div></div>)}<button className="text-button" onClick={() => setActivePage("rules")} type="button">Open rule management <Icon name="chevron" size={14} /></button></section><section className="panel-card principle-card"><div className="principle-icon"><Icon name="sparkles" size={17} /></div><p className="eyebrow">Core principle</p><h3>Not detected ≠ not compliant</h3><p>A blurry photo is an evidence problem. We request a clearer capture before calling a rule failed.</p></section></aside></section></> : <section className="panel-card page-placeholder"><div className="empty-illustration"><Icon name={activePage === "scan" ? "camera" : "file"} size={23} /></div><p className="eyebrow">Module ready for the next build step</p><h2>{navigation.find((item) => item.id === activePage)?.label}</h2><p>This module is connected to the original MetriCheck workflow. It will show real scan records only after a phone capture, evidence review, and approved rule execution.</p><button className="button primary-button" onClick={() => setIsScanOpen(true)} type="button"><Icon name="camera" size={15} /> Begin with a scan</button></section>}
        </main>
        <footer><span>MetriCheck AI · Research prototype</span><span>Source-linked · Human-reviewed · India</span></footer>
      </div>
      {isScanOpen && <ScanDialog onClose={() => setIsScanOpen(false)} />}
    </div>
  );
}

export default App;
