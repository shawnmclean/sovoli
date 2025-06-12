import React from "react";
import {
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Link } from "@sovoli/ui/components/link";
import { EarthIcon } from "lucide-react";

import type { SocialLink as SocialLinkType } from "~/modules/core/types";

interface SocialLinkProps {
  socialLink: SocialLinkType;
}

export const SocialLink = ({ socialLink }: SocialLinkProps) => {
  let icon;
  switch (socialLink.platform) {
    case "facebook":
      icon = <SiFacebook className="text-foreground-500 hover:text-primary" />;
      break;
    case "instagram":
      icon = <SiInstagram className="text-foreground-500 hover:text-primary" />;
      break;
    case "youtube":
      icon = <SiYoutube className="text-foreground-500 hover:text-primary" />;
      break;
    case "x":
      icon = <SiX className="text-foreground-500 hover:text-primary" />;
      break;
    case "website":
    case "other":
    default:
      icon = <EarthIcon className="text-foreground-500 hover:text-primary" />;
  }
  return (
    <Link
      href={socialLink.url}
      aria-label={socialLink.label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </Link>
  );
};
