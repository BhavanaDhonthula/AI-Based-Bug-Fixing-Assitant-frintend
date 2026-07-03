import {
  Braces,
  Brain,
  AlertTriangle,
  ShieldAlert,
  Gauge,
  Sparkles,
  CheckCircle2,
  ScanLine,
} from "lucide-react";

const TYPE_META = {
  "Syntax Error": { icon: Braces, color: "text-danger", ring: "border-danger/40" },
  "Logical Error": { icon: Brain, color: "text-warning", ring: "border-warning/40" },
  "Runtime Risk": { icon: AlertTriangle, color: "text-warning", ring: "border-warning/40" },
  "Security Issue": { icon: ShieldAlert, color: "text-danger", ring: "border-danger/40" },
  Performance: { icon: Gauge, color: "text-info", ring: "border-info/40" },
  "Best Practice": { icon: Sparkles, color: "text-accent", ring: "border-accent/40" },
};

const SEVERITY_DOT = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-info",
};

export default function ErrorList({ errors, loading, summary, activeLine, onSelectLine }) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-muted">
        <ScanLine className="animate-pulse text-accent" size={28} />
        <p className="font-body text-sm">Scanning your code with Gemini…</p>
      </div>
    );
  }

  if (errors === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-muted">
        <ScanLine size={28} />
        <p className="font-body text-sm">
          Run <span className="text-text">Analyze Code</span> to see issues here.
        </p>
      </div>
    );
  }

  if (errors.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <CheckCircle2 className="text-success" size={30} />
        <p className="font-display text-sm font-medium text-text">No issues found</p>
        {summary && <p className="max-w-[220px] text-xs text-muted">{summary}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {summary && (
        <p className="border-b border-border px-4 py-3 text-xs leading-relaxed text-muted">
          {summary}
        </p>
      )}
      <ul className="flex flex-col gap-2 p-3">
        {errors.map((err) => {
          const meta = TYPE_META[err.type] || TYPE_META["Best Practice"];
          const Icon = meta.icon;
          const isActive = activeLine === err.line;
          return (
            <li key={err.id}>
              <button
                onClick={() => onSelectLine(err.line)}
                className={`w-full rounded-lg border bg-surface-raised px-3 py-2.5 text-left transition hover:border-accent/40 cursor-pointer ${
                  isActive ? "border-accent/60 ring-1 ring-accent/30" : "border-border"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
                    <Icon size={13} />
                    {err.type}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[err.severity]}`} />
                    {err.severity}
                  </span>
                </div>
                <p className="text-xs leading-snug text-text/90">{err.message}</p>
                <p className="mt-1.5 font-mono text-[11px] text-muted">Line {err.line}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
