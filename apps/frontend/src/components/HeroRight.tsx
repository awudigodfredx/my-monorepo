import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { motion } from "motion/react";
import ProfileCard from "./ProfileCard";

interface ProfileConfig {
  avatar: string;
  name: string;
  title: string;
  bio: string;
  funFacts: string[];
}

const HeroRight: React.FC = () => {
  const [profile, setProfile] = useState<ProfileConfig | null>(null);

  useEffect(() => {
    import("../config/profile.json").then((d) => setProfile(d.default));
    console.log(EVENTS.HERO_PROFILE_CARD_VIEW, { timestamp: Date.now() });
  }, []);

  if (!profile) return null;

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
