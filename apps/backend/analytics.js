// my-monorepo/apps/backend/analytics.js

// Step 1: Read environment
const isProd = process.env.NODE_ENV === "production";

function emitEvent(name, payload = {}) {
  // Step 2: Guard emission
  if (!isProd) {
    console.log("DEV EVENT:", {
      event: name,
      ...payload,
    });
    return; // Stop here in dev/staging
  }

  // Production path
  console.log("ANALYTICS EVENT (PROD):", {
    event: name,
    ...payload,
  });
}

module.exports = { emitEvent };
