import { useState } from "react";
import { PicCard, CardContent, CardHeader, CardTitle } from "./PicCard";
import profileData from "../config/profile.json";
import { motion } from "motion/react";

// Derives "GA" from "Godfred Awudi" — no initials field needed in JSON
const getInitials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

export default function ProfileCard() {
  const [imgErr, setImgErr] = useState(false); // ← boolean toggle
  const initials = getInitials(profileData.name); // "GA"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <PicCard
        className="overflow-hidden border-2 border-brand-primary shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] bg-white max-w-sm mx-auto"
        data-testid="profile-card"
      >
        <div className="aspect-square overflow-hidden border-b-2 border-brand-primary flex items-center justify-center">
          {imgErr ? (
            // ← initials fallback when image fails
            <div
              className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-display font-bold text-brand-primary"
              data-testid="avatar-initials"
            >
              {initials}
            </div>
          ) : (
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
              onError={() => setImgErr(true)}
              data-testid="avatar-img"
            />
          )}
        </div>

        <CardHeader className="p-6">
          <CardTitle
            className="text-2xl font-display uppercase tracking-tight"
            data-testid="profile-name"
          >
            {profileData.name}
          </CardTitle>
          <p
            className="text-sm font-mono text-brand-accent uppercase font-semibold"
            data-testid="profile-title"
          >
            {profileData.title}
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <p
            className="text-sm leading-relaxed text-gray-600 mb-4"
            data-testid="profile-bio"
          >
            {profileData.bio}
          </p>
          <div className="space-y-2" data-testid="fun-facts">
            {profileData.funFacts.map((fact, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
                data-testid={`fact-${index}`}
              >
                <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                <span className="text-xs font-mono uppercase tracking-wider">
                  {fact}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </PicCard>
    </motion.div>
  );
}
