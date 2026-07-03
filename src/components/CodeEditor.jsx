import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const SEVERITY_TO_MONACO = {
  high: 8, // MarkerSeverity.Error
  medium: 4, // MarkerSeverity.Warning
  low: 2, // MarkerSeverity.Info
};

export default function CodeEditor({
  code,
  language,
  onChange,
  errors,
  loading,
  activeLine,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  function handleMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  // Push AI-detected issues into Monaco as real inline squiggly markers.
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = (errors || []).map((err) => {
      const line = Math.min(Math.max(err.line, 1), model.getLineCount());
      const lastCol = model.getLineMaxColumn(line);
      return {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: 1,
        endColumn: lastCol,
        message: `[${err.type}] ${err.message}`,
        severity: SEVERITY_TO_MONACO[err.severity] || 4,
      };
    });

    monaco.editor.setModelMarkers(model, "debugpilot", markers);
  }, [errors]);

  // Highlight + scroll to the line selected in the issue list.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !activeLine) return;

    editor.revealLineInCenter(activeLine);
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: {
          startLineNumber: activeLine,
          startColumn: 1,
          endLineNumber: activeLine,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "active-issue-line",
        },
      },
    ]);
  }, [activeLine]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={(value) => onChange(value ?? "")}
        onMount={handleMount}
        options={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 13.5,
          minimap: { enabled: false },
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          smoothScrolling: true,
        }}
      />

      {/* Signature "scanning" overlay while Gemini is analyzing */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 -translate-y-full bg-gradient-to-b from-accent/25 to-transparent animate-scan-sweep" />
        </div>
      )}

      <style>{`
        .active-issue-line {
          background: rgba(34, 211, 238, 0.08);
          border-left: 2px solid var(--color-accent);
        }
      `}</style>
    </div>
  );
}
