declare global {
  interface Window {
    __analyticsEvents: Record<string, unknown>[];
  }
}

export {};
