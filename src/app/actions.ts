"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { addLink, deleteLink, linkExists, updateLinkSummary } from "@/lib/store";
import { summarizeUrl } from "@/lib/gemini";
import { SavedLink, SaveLinkResult } from "@/types/link";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function saveLinkAction(
  url: string,
  tags: string[]
): Promise<SaveLinkResult> {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return { success: false, error: "Please enter a URL." };
  }
  if (!isValidUrl(trimmedUrl)) {
    return {
      success: false,
      error: "Invalid URL. Please include http:// or https://",
    };
  }

  const exists = await linkExists(trimmedUrl);
  if (exists) {
    return {
      success: false,
      error: "This URL has already been saved.",
      isDuplicate: true,
    };
  }

  const link: SavedLink = {
    id: randomUUID(),
    url: trimmedUrl,
    domain: extractDomain(trimmedUrl),
    summary: "",
    tags: tags.filter((t) => t.trim().length > 0).map((t) => t.trim().toLowerCase()),
    savedAt: new Date().toISOString(),
    summaryError: false,
  };

  try {
    const summary = await summarizeUrl(trimmedUrl);
    link.summary = summary;
  } catch {
    link.summary = "Could not generate a summary for this URL.";
    link.summaryError = true;
  }

  await addLink(link);
  revalidatePath("/");

  return { success: true, link };
}

export async function deleteLinkAction(id: string): Promise<{ success: boolean }> {
  const ok = await deleteLink(id);
  revalidatePath("/");
  return { success: ok };
}

export async function resummarizeLinkAction(
  id: string,
  url: string
): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    const summary = await summarizeUrl(url);
    await updateLinkSummary(id, summary, false);
    revalidatePath("/");
    return { success: true, summary };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gemini API error.";
    await updateLinkSummary(id, "Could not generate a summary for this URL.", true);
    revalidatePath("/");
    return { success: false, error: msg };
  }
}