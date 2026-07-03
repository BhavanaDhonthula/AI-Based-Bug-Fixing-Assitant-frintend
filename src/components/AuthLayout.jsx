import { Bug, ScanLine, ShieldCheck, Wand2 } from "lucide-react";

const FEATURES = [
  { icon: ScanLine, text: "Scans your code line by line for real issues" },
  { icon: ShieldCheck, text: "Flags syntax, logic, security and performance problems" },
  { icon: Wand2, text: "One click auto-fix, powered by Gemini" },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-ink font-body text-text">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-border bg-surface px-12 py-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_45%)]" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Bug size={20} />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">DebugPilot</span>
        </div>

        <div className="relative">
          <p className="font-display text-3xl font-semibold leading-tight text-text">
            Catch the bug before
            <br />
            it catches you.
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Paste any snippet and let Gemini triage it like a diagnostic ticket —
            categorized, prioritized, and one click away from fixed.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-accent">
                  <Icon size={14} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[11px] text-muted/70">
          // status: analyzing... 0 blockers left
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Bug size={18} />
            </div>
            <span className="font-display text-lg font-semibold">DebugPilot</span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-text">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
