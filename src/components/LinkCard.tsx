"use client";

import { useState, useTransition } from "react";
import { SavedLink } from "@/types/link";
import { deleteLinkAction, resummarizeLinkAction } from "@/app/actions";

interface LinkCardProps {
  link: SavedLink;
  onDelete: (id: string) => void;
  onResummarize: (id: string, summary: string) => void;
  onError: (msg: string) => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateUrl(url: string, max = 48): string {
  return url.length > max ? url.slice(0, max) + "..." : url;
}

export default function LinkCard({
  link,
  onDelete,
  onResummarize,
  onError,
  activeTag,
  onTagClick,
}: LinkCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResummarizing, setIsResummarizing] = useState(false);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${link.domain}&sz=32`;

  const handleDelete = () => {
    setIsDeleting(true);
    startTransition(async () => {
      const res = await deleteLinkAction(link.id);
      if (res.success) {
        onDelete(link.id);
      } else {
        onError("Failed to delete link.");
        setIsDeleting(false);
      }
    });
  };

  const handleResummarize = () => {
    setIsResummarizing(true);
    startTransition(async () => {
      const res = await resummarizeLinkAction(link.id, link.url);
      setIsResummarizing(false);
      if (res.success && res.summary) {
        onResummarize(link.id, res.summary);
      } else {
        onError(res.error ?? "Could not re-summarise.");
      }
    });
  };

  if (isDeleting) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 opacity-40 transition-opacity animate-pulse">
        <div className="h-4 shimmer rounded mb-3 w-2/3" />
        <div className="h-3 shimmer rounded mb-2 w-full" />
        <div className="h-3 shimmer rounded w-3/4" />
      </div>
    );
  }

  return (
    <article className="group rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 flex flex-col gap-3 hover:border-[var(--accent)] transition-all duration-200 hover:shadow-lg hover:shadow-[var(--accent)]/5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[var(--border)] flex-shrink-0 bg-[var(--bg-warm)] flex items-center justify-center mt-0.5">
          <img
            src={faviconUrl}
            alt={link.domain}
            width={16}
            height={16}
            className="w-4 h-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink)] font-medium text-sm hover:text-[var(--accent)] transition-colors break-all leading-tight"
            title={link.url}
          >
            {truncateUrl(link.url)}
          </a>
          <p className="text-[var(--ink-faint)] text-xs mt-0.5">{link.domain}</p>
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {link.summaryError && (
            <button
              onClick={handleResummarize}
              disabled={isResummarizing || isPending}
              title="Re-summarise"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--ink-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-warm)] transition-all text-xs disabled:opacity-40"
            >
              {isResummarizing ? "o" : "r"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isPending}
            title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--ink-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-warm)] transition-all text-sm disabled:opacity-40"
          >
            x
          </button>
        </div>
      </div>

      <div className="text-[var(--ink-muted)] text-sm leading-relaxed">
        {isResummarizing ? (
          <div className="space-y-1.5">
            <div className="h-3 shimmer rounded w-full" />
            <div className="h-3 shimmer rounded w-4/5" />
          </div>
        ) : link.summaryError ? (
          <span className="text-[var(--accent)] text-xs italic flex items-center gap-1.5">
            <span>Could not generate summary.</span>
            <button
              onClick={handleResummarize}
              className="underline hover:no-underline"
              disabled={isResummarizing}
            >
              Retry
            </button>
          </span>
        ) : (
          link.summary
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-1 border-t border-[var(--border)]">
        <div className="flex flex-wrap gap-1.5">
          {link.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`tag ${activeTag === tag ? "active" : ""}`}
            >
              #{tag}
            </button>
          ))}
        </div>
        <time className="text-[var(--ink-faint)] text-xs flex-shrink-0">
          {formatDate(link.savedAt)}
        </time>
      </div>
    </article>
  );
}
