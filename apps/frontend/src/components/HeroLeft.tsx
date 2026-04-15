import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { motion } from "motion/react";
import WorkWithMeCTA from "./WorkWithMeCTA";
import HelpMeFreeCTA from "./HelpMeFreeCTA";
import { trackEvent } from "../utils/analytics";
interface HeroConfig {
  heading: string;
  subheading: string;
  paragraph: string;
}

const HeroLeft: React.FC = () => {
  const [cfg, setCfg] = useState<HeroConfig | null>(null);

  useEffect(() => {
    import("../config/hero.json").then((d) => setCfg(d.default));
    trackEvent(EVENTS.PAGE_VIEW, {
      page_name: "home",
      referrer: document.referrer,
    });
  }, []);

  if (!cfg)
    return (
      <div className="space-y-8 animate-pulse" data-testid="hero-skeleton">
        <div className="space-y-4">
          <div className="h-20 w-3/4 rounded bg-gray-200" />
          <div className="h-6 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-36 rounded bg-gray-200" />
          <div className="h-10 w-36 rounded bg-gray-200" />
        </div>
      </div>
    );

  return (
    <>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="mb-4 text-6xl font-display uppercase leading-[0.9] md:text-8xl"
            data-testid="hero-heading"
          >
            {cfg.heading}
          </h1>

          <h2
            className="text-xl font-mono font-medium uppercase tracking-tight text-brand-accent md:text-2xl"
            data-testid="hero-subheading"
          >
            {cfg.subheading}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-xl text-lg leading-relaxed text-gray-600 md:text-xl"
          data-testid="hero-paragraph"
        >
          {cfg.paragraph}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4"
          data-testid="hero-ctas"
        >
          <WorkWithMeCTA />
          <HelpMeFreeCTA />
        </motion.div>
      </div>
    </>
  );
};

export default HeroLeft;
