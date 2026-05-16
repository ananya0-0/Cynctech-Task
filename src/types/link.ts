export interface SavedLink {
  id: string;
  url: string;
  domain: string;
  summary: string;
  tags: string[];
  savedAt: string;
  summaryError?: boolean;
}

export interface SaveLinkResult {
  success: boolean;
  link?: SavedLink;
  error?: string;
  isDuplicate?: boolean;
}