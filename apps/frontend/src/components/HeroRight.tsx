import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { motion } from "motion/react";
import ProfileCard from "./ProfileCard";
import { trackEvent } from "../utils/analytics";

interface ProfileConfig {
  avatar: string;
  name: string;
  title: string;
  funFacts: string[];
}

const HeroRight: React.FC = () => {
  const [profile, setProfile] = useState<ProfileConfig | null>(null);

  useEffect(() => {
    import("../config/profile.json").then((d) => setProfile(d.default));
    trackEvent(EVENTS.HERO_PROFILE_CARD_VIEW);
  }, []);

  if (!profile)
    return (
      <div className="animate-pulse rounded-2xl bg-gray-100 p-6 space-y-4 w-72" data-testid="profile-skeleton">
        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
        <div className="h-5 w-2/3 mx-auto rounded bg-gray-200" />
        <div className="h-4 w-1/2 mx-auto rounded bg-gray-200" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-brand-primary/5 blur-3xl" />

      <ProfileCard />
    </motion.div>
  );
};

export default HeroRight;
