import { trackEvent } from "../utils/analytics";

export default function AnalyticsButton() {
  return (
    <button
      onClick={() => trackEvent("button_click", { label: "Test Button" })}
      style={{ padding: "10px 20px", cursor: "pointer" }}
    >
      Click me
    </button>
  );
}
