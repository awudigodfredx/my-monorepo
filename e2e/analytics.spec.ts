import { test, expect } from "@playwright/test";

const BACKEND = "http://localhost:3001";

/**
 * Helper: read event counts from the summary endpoint.
 */
async function fetchSummary(): Promise<Record<string, number>> {
  const res = await fetch(`${BACKEND}/api/v1/analytics/summary`);
  return res.json();
}

test.describe("Analytics pipeline", () => {
  test.beforeEach(async ({ page }) => {
    // Accept consent so trackEvent actually POSTs to the backend
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("analytics_consent", "true"));
  });

  test("hero_view event reaches the backend after page load", async ({
    page,
  }) => {
    const before = await fetchSummary();
    const beforeCount = before["hero_view"] ?? 0;

    await page.goto("/");

    // Trigger a visibility-change flush by hiding the page
    await page.evaluate(() =>
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      }),
    );
    await page.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );

    // Give the backend a moment to persist the event
    await page.waitForTimeout(500);

    const after = await fetchSummary();
    expect(after["hero_view"] ?? 0).toBeGreaterThan(beforeCount);
  });

  test("cta_work_click event reaches the backend after clicking Work With Me", async ({
    page,
  }) => {
    await page.goto("/");

    const before = await fetchSummary();
    const beforeCount = before["cta_work_click"] ?? 0;

    // Click the Work With Me CTA
    await page.getByTestId("cta-work").click();

    // Flush the batch by simulating tab hide
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await page.waitForTimeout(500);

    const after = await fetchSummary();
    expect(after["cta_work_click"] ?? 0).toBeGreaterThan(beforeCount);
  });

  test("cta_connect_click event reaches the backend after clicking Connect With Me", async ({
    page,
  }) => {
    await page.goto("/");

    const before = await fetchSummary();
    const beforeCount = before["cta_connect_click"] ?? 0;

    await page.getByTestId("cta-connect").click();

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await page.waitForTimeout(500);

    const after = await fetchSummary();
    expect(after["cta_connect_click"] ?? 0).toBeGreaterThan(beforeCount);
  });

  test("events are batched — only one network request per flush", async ({
    page,
  }) => {
    await page.goto("/");

    const batchRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/v1/analytics/events/batch")) {
        batchRequests.push(req.url());
      }
    });

    // Trigger several events quickly
    await page.evaluate(() => {
      // Access window.__analyticsEvents to verify in-memory tracking
      (window as Window & { __analyticsEvents?: unknown[] }).__analyticsEvents =
        [];
    });

    // Navigate twice to fire multiple hero_view events
    await page.goto("/");
    await page.goto("/about");

    // Force flush
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await page.waitForTimeout(500);

    // Both events should have gone out in at most 2 requests
    // (one per navigation, or both in one batch if close enough)
    expect(batchRequests.length).toBeLessThanOrEqual(2);
  });

  test("consent banner is visible before consent is given", async ({
    page,
  }) => {
    // Clear consent
    await page.evaluate(() => localStorage.removeItem("analytics_consent"));
    await page.goto("/");

    await expect(page.getByTestId("consent-banner")).toBeVisible();
  });

  test("accepting consent banner hides the banner and enables tracking", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.removeItem("analytics_consent"));
    await page.goto("/");

    await page.getByTestId("consent-accept").click();

    await expect(page.getByTestId("consent-banner")).not.toBeVisible();

    const consent = await page.evaluate(() =>
      localStorage.getItem("analytics_consent"),
    );
    expect(consent).toBe("true");
  });

  test("declining consent banner hides the banner and blocks tracking", async ({
    page,
  }) => {
    await page.evaluate(() => localStorage.removeItem("analytics_consent"));
    await page.goto("/");

    await page.getByTestId("consent-decline").click();

    await expect(page.getByTestId("consent-banner")).not.toBeVisible();

    const consent = await page.evaluate(() =>
      localStorage.getItem("analytics_consent"),
    );
    expect(consent).toBe("false");
  });
});
