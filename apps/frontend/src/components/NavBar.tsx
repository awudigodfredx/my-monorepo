import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EVENTS } from "@monorepo/shared";

interface NavConfig {
  logoSrc: string;
  logoAlt: string;
  logoRoute: string;
}

const NavBar: React.FC = () => {
  const [config, setConfig] = useState<NavConfig | null>(null);

  useEffect(() => {
    import("../config/nav.json").then((d) => setConfig(d.default));
  }, []);

  const handleLogoClick = () => {
    // emit analytics only — Link handles the actual navigation
    console.log(EVENTS.NAV_LOGO_CLICK, {
      page: window.location.pathname,
      timestamp: Date.now(),
    });
  };

  if (!config) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b-2 border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to={config.logoRoute}
          onClick={handleLogoClick} // ← analytics fires, Link routes
          className="flex items-center gap-2 group"
          data-testid="nav-logo-link"
        >
          <div className="w-10 h-10 bg-brand-primary flex items-center justify-center group-hover:bg-brand-accent transition-colors">
            <img
              src={config.logoSrc}
              alt={config.logoAlt}
              className="h-8"
              data-testid="nav-logo"
              // ← removed onClick here (Link parent handles it)
            />
          </div>
          <span className="font-display uppercase tracking-widest text-sm font-bold">
            Godfred Awudi
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xs font-mono uppercase tracking-widest hover:text-brand-accent transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
