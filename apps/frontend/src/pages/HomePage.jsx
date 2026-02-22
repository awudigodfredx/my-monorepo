import { useEffect } from "react";
import { trackEvent } from "../utils/analytics";
import pageConfig from "../config/pageConfig.json";
import ConfigRenderer from "../components/ConfigRenderer";

function HomePage() {
  useEffect(() => {
    trackEvent("page_view", {
      page: "home",
    });
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm">
        <ConfigRenderer config={pageConfig} />
      </div>
    </div>
  );
}

export default HomePage;
