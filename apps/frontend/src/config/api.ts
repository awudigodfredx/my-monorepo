const rawApiBase = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

/**
 * Normalized API Base URL (no trailing slash)
 */
export const API_BASE = rawApiBase.endsWith("/")
  ? rawApiBase.slice(0, -1)
  : rawApiBase;
