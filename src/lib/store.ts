import fs from "fs/promises";
import path from "path";
import { SavedLink } from "@/types/link";

const DATA_FILE = path.join(process.cwd(), "data", "links.json");

async function ensureDataDir(): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
}

export async function readLinks(): Promise<SavedLink[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as SavedLink[];
  } catch {
    return [];
  }
}

export async function writeLinks(links: SavedLink[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2), "utf-8");
}

export async function addLink(link: SavedLink): Promise<void> {
  const links = await readLinks();
  links.unshift(link);
  await writeLinks(links);
}

export async function deleteLink(id: string): Promise<boolean> {
  const links = await readLinks();
  const filtered = links.filter((l) => l.id !== id);
  if (filtered.length === links.length) return false;
  await writeLinks(filtered);
  return true;
}

export async function updateLinkSummary(
  id: string,
  summary: string,
  summaryError?: boolean
): Promise<boolean> {
  const links = await readLinks();
  const idx = links.findIndex((l) => l.id === id);
  if (idx === -1) return false;
  links[idx].summary = summary;
  links[idx].summaryError = summaryError ?? false;
  await writeLinks(links);
  return true;
}

export async function linkExists(url: string): Promise<boolean> {
  const links = await readLinks();
  return links.some((l) => l.url === url);
}