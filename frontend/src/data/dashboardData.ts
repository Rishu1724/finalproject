export const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "scan", label: "Scan product", icon: "scan" },
  { id: "results", label: "Compliance results", icon: "check" },
  { id: "listing", label: "Listing comparison", icon: "compare" },
  { id: "history", label: "Scan history", icon: "history" },
  { id: "reports", label: "Reports", icon: "report" },
  { id: "review", label: "Human review", icon: "review" },
  { id: "rules", label: "Rule management", icon: "rules" },
] as const;

export const sourceCards = [
  {
    title: "FSSAI Labelling & Display",
    detail: "3 official documents preserved",
    status: "Pending verification",
    tone: "amber",
  },
  {
    title: "Legal Metrology",
    detail: "Exact packaged-commodities PDF required",
    status: "Source required",
    tone: "rose",
  },
] as const;

export const metrics = [
  { value: "—", label: "Products scanned", note: "No scans stored yet" },
  { value: "—", label: "Passed checks", note: "Requires approved rules" },
  { value: "—", label: "Products flagged", note: "No verdicts invented" },
  { value: "—", label: "Awaiting human review", note: "No review queue yet" },
] as const;
