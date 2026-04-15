const CONSENT_KEY = "analytics_consent";

/** Returns true if the user has explicitly accepted analytics tracking. */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

/** Persist the user's consent decision. */
export function setConsent(accepted: boolean): void {
  try {
    localStorage.setItem(CONSENT_KEY, accepted ? "true" : "false");
  } catch {
    // localStorage unavailable (private browsing, etc.) — silently ignore
  }
}
