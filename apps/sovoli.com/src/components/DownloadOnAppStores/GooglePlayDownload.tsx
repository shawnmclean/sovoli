"use client";

import { useTheme } from "next-themes";
import { Link } from "@sovoli/ui/components/link";
import { Badge } from "./Badge";

interface GooglePlayDownloadProps {
  appName: string;
  googlePlayUrl: string;
  className?: string;
}

export function GooglePlayDownload({
  appName,
  googlePlayUrl,
  className,
}: GooglePlayDownloadProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={className} suppressHydrationWarning>
      <Link
        href={googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-80"
        aria-label={`Get ${appName} on Google Play`}
      >
        <Badge platform="playstore" isDark={isDark} />
      </Link>
    </div>
  );
}
