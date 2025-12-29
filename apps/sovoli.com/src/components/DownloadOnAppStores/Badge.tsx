import Image from "next/image";
import type { StaticImageData } from "next/image";
import appStoreBadgeLight from "./app-store-badge-light.svg";
import appStoreBadgeDark from "./app-store-badge-dark.svg";
import googlePlayBadgeLight from "./google-play-badge-light.svg";

interface BadgeProps {
  platform: "appstore" | "playstore";
  isDark?: boolean;
}

// Standard dimensions for all badges
const STANDARD_WIDTH = 180;
const STANDARD_HEIGHT = 60;

export function Badge({ platform, isDark = false }: BadgeProps) {
  // Select the correct badge based on platform and theme
  let badge: StaticImageData;
  let alt: string;

  if (platform === "appstore") {
    badge = (
      isDark ? appStoreBadgeDark : appStoreBadgeLight
    ) as StaticImageData;
    alt = "Download on the App Store";
  } else {
    // playstore
    badge = googlePlayBadgeLight as StaticImageData;
    alt = "Get it on Google Play";
  }

  return (
    <Image
      src={badge}
      alt={alt}
      width={STANDARD_WIDTH}
      height={STANDARD_HEIGHT}
      className="h-[60px]"
    />
  );
}
