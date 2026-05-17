"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { saveLinkAction } from "@/app/actions";
import { SavedLink } from "@/types/link";

interface AddLinkFormProps {
  onSuccess: (link: SavedLink) => void;
  onError: (msg: string, isDuplicate?: boolean) => void;
}

export default function AddLinkForm({ onSuccess, onError }: AddLinkFormProps) {
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        urlRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const addTag = (value: string) => {
    const trimmed = value.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    startTransition(async () => {
      const finalTags = tagInput.trim()
        ? [...tags, tagInput.trim().toLowerCase().replace(/^#/, "")]
        : tags;

      const result = await saveLinkAction(url.trim(), finalTags);

      if (result.success && result.link) {
        setUrl("");
        setTags([]);
        setTagInput("");
        onSuccess(result.link);
      } else {
        onError(result.error ?? "Failed to save link.", result.isDuplicate);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6 flex flex-col gap-4 shadow-sm"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="url-input" className="text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-widest">
          URL
        </label>
        <div className="flex items-center gap-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
          <input
            id="url-input"
            ref={urlRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isPending}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none disabled:opacity-50"
            autoComplete="url"
          />
          <div className="px-3 text-[var(--ink-faint)] text-xs hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--bg-warm)] text-xs font-mono">⌘K</kbd>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-widest">
          Tags <span className="font-normal normal-case tracking-normal opacity-60">(optional — press Enter or comma to add)</span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 opacity-60 hover:opacity-100 transition-opacity leading-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => tagInput.trim() && addTag(tagInput)}
            placeholder={tags.length === 0 ? "research, tutorial, design…" : ""}
            disabled={isPending}
            className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none min-w-24 disabled:opacity-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || !url.trim()}
        className="relative flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm tracking-wide hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Summarising with Gemini…
          </>
        ) : (
          <>
            <span>✦</span>
            Save &amp; Summarise
          </>
        )}
      </button>
    </form>
  );
}