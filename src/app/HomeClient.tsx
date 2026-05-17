"use client";

import { useState, useCallback } from "react";
import { SavedLink } from "@/types/link";
import AddLinkForm from "@/components/AddLinkForm";
import LinkCard from "@/components/LinkCard";
import DarkModeToggle from "@/components/DarkModeToggle";

interface HomeClientProps {
  initialLinks: SavedLink[];
}

export default function HomeClient({ initialLinks }: HomeClientProps) {
  const [links, setLinks] = useState<SavedLink[]>(initialLinks);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" | "warning" = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  const handleSuccess = useCallback(
    (link: SavedLink) => {
      setLinks((prev) => [link, ...prev]);
      showToast("Link saved and summarised! ✦", "success");
    },
    [showToast]
  );

  const handleError = useCallback(
    (msg: string, isDuplicate?: boolean) => {
      showToast(msg, isDuplicate ? "warning" : "error");
    },
    [showToast]
  );

  const handleDelete = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleResummarize = useCallback((id: string, summary: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, summary, summaryError: false } : l))
    );
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }, []);

  const allTags = Array.from(new Set(links.flatMap((l) => l.tags))).sort();

  const filtered = links.filter((l) => {
    const matchTag = !activeTag || l.tags.includes(activeTag);
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      l.url.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.domain.toLowerCase().includes(q);
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[var(--accent)] text-lg font-bold font-display">✦</span>
            <span className="font-display text-lg text-[var(--ink)] tracking-tight">LinkSave</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--ink-faint)] hidden sm:block">
              {links.length} link{links.length !== 1 ? "s" : ""} saved
            </span>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--ink)] leading-tight tracking-tight">
            Save links,{" "}
            <em className="text-[var(--accent)] not-italic">understand them.</em>
          </h1>
          <p className="text-[var(--ink-muted)] text-base max-w-xl leading-relaxed">
            Paste any URL and Gemini AI will summarise it instantly. Tag, search, and filter your saved links.
          </p>
        </div>

        <AddLinkForm onSuccess={handleSuccess} onError={handleError} />

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] text-sm pointer-events-none select-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by URL or summary…"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-[var(--ink-faint)] font-medium uppercase tracking-widest">Filter:</span>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`tag ${activeTag === tag ? "active" : ""}`}
                  >
                    #{tag}
                  </button>
                ))}
                {activeTag && (
                  <button
                    onClick={() => setActiveTag(null)}
                    className="text-xs text-[var(--ink-faint)] hover:text-[var(--accent)] underline transition-colors"
                  >
                    clear
                  </button>
                )}
              </div>
            )}

            <p className="text-xs text-[var(--ink-faint)] font-medium">
              {filtered.length === 0
                ? "No links found"
                : `${filtered.length} link${filtered.length !== 1 ? "s" : ""}${
                    activeTag ? ` tagged #${activeTag}` : ""
                  }${search ? ` matching "${search}"` : ""}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3 border border-dashed border-[var(--border)] rounded-2xl">
              <span className="text-5xl opacity-10 font-display">◎</span>
              <p className="text-[var(--ink-muted)] text-sm max-w-xs">
                {links.length === 0
                  ? "No links yet. Paste a URL above and let AI summarise it."
                  : "No links match your current search or filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                  onResummarize={handleResummarize}
                  onError={(msg: string) => showToast(msg, "error")}
                  activeTag={activeTag}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--border)] mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <span className="text-xs text-[var(--ink-faint)]">LinkSave · CyncTech Technical Assessment</span>
          <span className="text-xs text-[var(--ink-faint)]">Powered by Gemini Flash</span>
        </div>
      </footer>

      {toast && (
        <div
          className={`toast fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-sm ${
            toast.type === "error"
              ? "bg-[var(--accent)] text-white"
              : toast.type === "warning"
              ? "bg-amber-500 text-white"
              : "bg-[#6b8f71] text-white"
          }`}
        >
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">×</button>
        </div>
      )}
    </div>
  );
}