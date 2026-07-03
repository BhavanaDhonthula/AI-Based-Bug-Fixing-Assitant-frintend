import { useState } from "react";
import { ScanSearch, Wand2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import ErrorList from "../components/ErrorList.jsx";
import api from "../api/client.js";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "go", label: "Go" },
];

const SAMPLE_CODE = `function calculateAverage(numbers) {
  let total = 0
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i]
  }
  return total / numbers.length
}

function getUser(id) {
  const users = { 1: "Alice", 2: "Bob" }
  return users[id].toUpperCase()
}

console.log(calculateAverage([1, 2, 3, 4]))
console.log(getUser(3))
`;

export default function Dashboard() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(SAMPLE_CODE);
  const [errors, setErrors] = useState(null); // null = not analyzed yet
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [activeLine, setActiveLine] = useState(null);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState("");

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 3500);
  }

  async function runAnalysis() {
    setApiError("");
    const data = await api.post("/analyze", { code, language });
    setErrors(data.errors);
    setSummary(data.summary);
    setActiveLine(null);
    return data;
  }

  async function handleAnalyze() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await runAnalysis();
      showToast(
        data.errors.length > 0
          ? `Found ${data.errors.length} issue${data.errors.length === 1 ? "" : "s"}.`
          : "No issues found — clean code!"
      );
    } catch (err) {
      setApiError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoFix() {
    if (!code.trim()) return;
    setFixing(true);
    setApiError("");
    try {
      const data = await api.post("/analyze", { code, language });
      const issueCount = data.errors.length;
      setCode(data.fixedCode);
      setErrors([]);
      setSummary(
        issueCount > 0
          ? `Auto-fixed ${issueCount} issue${issueCount === 1 ? "" : "s"}.`
          : "No issues found — code was already clean."
      );
      setActiveLine(null);
      showToast(
        issueCount > 0 ? `Auto-fixed ${issueCount} issue${issueCount === 1 ? "" : "s"}.` : "Nothing to fix."
      );
    } catch (err) {
      setApiError(err.message || "Auto-fix failed. Please try again.");
    } finally {
      setFixing(false);
    }
  }

  const counts = (errors || []).reduce(
    (acc, e) => {
      acc[e.severity] = (acc[e.severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  return (
    <div className="flex h-screen flex-col bg-ink font-body text-text">
      <Navbar />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm text-text outline-none focus:border-accent/60 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          {errors !== null && (
            <div className="hidden items-center gap-3 pl-2 text-xs text-muted sm:flex">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" /> {counts.high} high
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {counts.medium} medium
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-info" /> {counts.low} low
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={loading || fixing}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-text transition hover:border-accent/50 disabled:opacity-60 cursor-pointer"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <ScanSearch size={15} />}
            {loading ? "Analyzing…" : "Analyze Code"}
          </button>

          <button
            onClick={handleAutoFix}
            disabled={loading || fixing}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent/90 disabled:opacity-60 cursor-pointer"
          >
            {fixing ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
            {fixing ? "Fixing…" : "Auto Fix All"}
          </button>
        </div>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 border-b border-danger/30 bg-danger/10 px-6 py-2 text-sm text-danger">
          <AlertCircle size={15} />
          {apiError}
        </div>
      )}

      {/* Main split view */}
      <div className="flex flex-1 overflow-hidden">
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          errors={errors}
          loading={loading}
          activeLine={activeLine}
        />

        <aside className="flex w-[340px] shrink-0 flex-col border-l border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <p className="font-display text-sm font-semibold text-text">Diagnostics</p>
            <p className="text-xs text-muted">Issues detected by Gemini</p>
          </div>
          <ErrorList
            errors={errors}
            loading={loading}
            summary={summary}
            activeLine={activeLine}
            onSelectLine={setActiveLine}
          />
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-sm text-text shadow-lg">
          <CheckCircle2 size={15} className="text-success" />
          {toast}
        </div>
      )}
    </div>
  );
}
