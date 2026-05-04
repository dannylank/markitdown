import { useState, useRef, useCallback } from "react";

const FORMATS = [
    "PDF", "DOCX", "PPTX", "XLSX", "XLS",
    "HTML", "CSV", "JSON", "XML", "EPUB",
    "MP3", "WAV", "JPG", "PNG", "ZIP",
];

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon() {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12"
        >
            <rect x="8" y="4" width="26" height="34" rx="3" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
            <path d="M34 4l6 6h-6V4z" fill="#3f3f46" stroke="#52525b" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M34 4v6h6" fill="none" stroke="#52525b" strokeWidth="1.5" />
            <rect x="14" y="18" width="14" height="2" rx="1" fill="#71717a" />
            <rect x="14" y="23" width="10" height="2" rx="1" fill="#71717a" />
            <rect x="14" y="28" width="12" height="2" rx="1" fill="#71717a" />
            {/* MD badge */}
            <rect x="26" y="30" width="16" height="14" rx="2" fill="#f59e0b" />
            <text x="34" y="40" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="monospace" fill="#09090b">MD</text>
        </svg>
    );
}

function Spinner() {
    return (
        <span className="inline-block w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
    );
}

export default function App() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | converting | success | error
    const [result, setResult] = useState(null);   // { filename, content }
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const inputRef = useRef(null);

    const selectFile = useCallback((f) => {
        setFile(f);
        setStatus("idle");
        setResult(null);
        setError(null);
        setShowPreview(false);
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) selectFile(dropped);
    };

    const convert = async () => {
        if (!file) return;
        setStatus("converting");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/convert", { method: "POST", body: formData });
            if (!res.ok) {
                const payload = await res.json().catch(() => ({ detail: "Conversion failed" }));
                throw new Error(payload.detail || "Conversion failed");
            }
            const data = await res.json();
            setResult(data);
            setStatus("success");
        } catch (err) {
            setError(err.message);
            setStatus("error");
        }
    };

    const download = () => {
        const blob = new Blob([result.content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setFile(null);
        setStatus("idle");
        setResult(null);
        setError(null);
        setShowPreview(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const isConverting = status === "converting";

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col">
            {/* Background dot grid */}
            <div className="fixed inset-0 dot-grid opacity-[0.18] pointer-events-none select-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* ── Header ── */}
                <header className="border-b border-zinc-800/70 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-zinc-950/60">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center shrink-0">
                            <span className="font-mono font-bold text-sm text-zinc-950 leading-none">M↓</span>
                        </div>
                        <span className="font-semibold text-base tracking-tight">MarkItDown</span>
                        <span className="text-zinc-600 text-sm hidden sm:inline">/ web</span>
                    </div>
                    <a
                        href="https://github.com/microsoft/markitdown"
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors duration-150"
                    >
                        GitHub ↗
                    </a>
                </header>

                {/* ── Main ── */}
                <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 gap-8">
                    <div className="w-full max-w-xl space-y-8">

                        {/* Hero text */}
                        <div className="text-center space-y-3">
                            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-none">
                                Any file to{" "}
                                <span className="text-amber-400 relative">
                                    .md
                                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-amber-400/40" />
                                </span>
                            </h1>
                            <p className="text-zinc-400 text-base leading-relaxed max-w-sm mx-auto">
                                Drop a document, get clean Markdown back — ready to copy or download.
                            </p>
                        </div>

                        {/* ── Drop zone ── */}
                        <div
                            className={[
                                "relative rounded-2xl border-2 border-dashed transition-all duration-200 select-none",
                                isDragging
                                    ? "border-amber-400 bg-amber-400/[0.04] drop-glow scale-[1.01]"
                                    : file
                                        ? "border-zinc-700 bg-zinc-900/60"
                                        : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60 cursor-pointer",
                            ].join(" ")}
                            onClick={() => !file && inputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files[0] && selectFile(e.target.files[0])}
                            />

                            {/* Empty state */}
                            {!file && (
                                <div className="flex flex-col items-center justify-center py-14 px-6 gap-5">
                                    <FileIcon />
                                    <div className="text-center space-y-1">
                                        <p className="text-zinc-200 font-medium text-base">
                                            {isDragging ? "Release to drop" : "Drop your file here"}
                                        </p>
                                        <p className="text-zinc-500 text-sm">
                                            or{" "}
                                            <span className="text-amber-400 underline underline-offset-2 cursor-pointer">
                                                browse files
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                                        {FORMATS.map((fmt) => (
                                            <span
                                                key={fmt}
                                                className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 text-xs font-mono"
                                            >
                                                {fmt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* File selected state */}
                            {file && (
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-xl">
                                        📄
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-zinc-100 font-medium truncate text-sm">{file.name}</p>
                                        <p className="text-zinc-500 text-xs mt-0.5">{formatBytes(file.size)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); reset(); }}
                                        className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded"
                                        aria-label="Remove file"
                                    >
                                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                            <path d="M4.47 4.47a.75.75 0 011.06 0L8 6.94l2.47-2.47a.75.75 0 111.06 1.06L9.06 8l2.47 2.47a.75.75 0 11-1.06 1.06L8 9.06l-2.47 2.47a.75.75 0 01-1.06-1.06L6.94 8 4.47 5.53a.75.75 0 010-1.06z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── Convert button ── */}
                        {file && status !== "success" && (
                            <button
                                onClick={convert}
                                disabled={isConverting}
                                className={[
                                    "w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-150",
                                    isConverting
                                        ? "bg-amber-400/20 text-amber-400/50 cursor-not-allowed"
                                        : "bg-amber-400 text-zinc-950 hover:bg-amber-300 active:scale-[0.985]",
                                ].join(" ")}
                            >
                                {isConverting ? (
                                    <span className="flex items-center justify-center gap-2.5">
                                        <Spinner />
                                        Converting…
                                    </span>
                                ) : (
                                    "Convert to Markdown →"
                                )}
                            </button>
                        )}

                        {/* ── Error ── */}
                        {status === "error" && (
                            <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-400 leading-relaxed">
                                <span className="font-semibold">Error: </span>
                                {error}
                            </div>
                        )}

                        {/* ── Success ── */}
                        {status === "success" && result && (
                            <div className="space-y-3">
                                {/* Status bar */}
                                <div className="flex items-center justify-between rounded-xl border border-green-900/50 bg-green-950/30 px-4 py-3">
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
                                            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 010 1.06l-6.5 6.5a.75.75 0 01-1.06 0l-3-3a.75.75 0 011.06-1.06l2.47 2.47 5.97-5.97a.75.75 0 011.06 0z" />
                                        </svg>
                                        Converted successfully
                                    </div>
                                    <span className="text-zinc-600 text-xs font-mono tabular-nums">
                                        {result.content.length.toLocaleString()} chars
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={download}
                                        className="flex-1 py-3 rounded-xl bg-amber-400 text-zinc-950 font-semibold text-sm hover:bg-amber-300 transition-colors active:scale-[0.985]"
                                    >
                                        ↓ Download {result.filename}
                                    </button>
                                    <button
                                        onClick={() => setShowPreview((v) => !v)}
                                        className="px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors text-sm"
                                    >
                                        {showPreview ? "Hide" : "Preview"}
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors text-sm"
                                        title="Convert another file"
                                    >
                                        New
                                    </button>
                                </div>

                                {/* Markdown preview */}
                                {showPreview && (
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                                        <div className="border-b border-zinc-800 px-4 py-2.5 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-zinc-700" />
                                            <span className="w-3 h-3 rounded-full bg-zinc-700" />
                                            <span className="w-3 h-3 rounded-full bg-zinc-700" />
                                            <span className="text-zinc-600 text-xs font-mono ml-2">{result.filename}</span>
                                        </div>
                                        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-80 whitespace-pre-wrap leading-relaxed break-words">
                                            {result.content.length > 6000
                                                ? result.content.slice(0, 6000) + "\n\n… (preview truncated — download for full content)"
                                                : result.content}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* ── Footer ── */}
                <footer className="border-t border-zinc-800/60 px-6 py-3 text-center text-zinc-600 text-xs">
                    Powered by{" "}
                    <a
                        href="https://github.com/microsoft/markitdown"
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        microsoft/markitdown
                    </a>
                </footer>
            </div>
        </div>
    );
}
