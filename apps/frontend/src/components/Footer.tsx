// apps/frontend/src/components/Footer.tsx
import React, { useEffect, useState } from "react";

interface SiteConfig {
  name: string;
  year: number;
  tagline: string;
}

const Footer: React.FC = () => {
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    import("../config/site.json").then((d) => setSite(d.default));
  }, []);

  if (!site) return null;

  return (
    <footer
      className="border-t-2 border-brand-primary/10 py-8 px-6"
      data-testid="footer"
    >
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row
                      items-center justify-between gap-4"
      >
        <p
          className="font-mono text-xs uppercase tracking-widest text-gray-800"
          data-testid="footer-copyright"
        >
          © {site.year} {site.name}. All rights reserved.
        </p>
        <p
          className="font-mono text-xs uppercase tracking-widest text-gray-700"
          data-testid="footer-tagline"
        >
          {site.tagline}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
