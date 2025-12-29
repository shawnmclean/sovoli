"use client";

import { useTheme } from "next-themes";
import { Link } from "@sovoli/ui/components/link";
import { Badge } from "./Badge";

interface AppStoreDownloadProps {
  appName: string;
  appStoreUrl: string;
  className?: string;
}

export function AppStoreDownload({
  appName,
  appStoreUrl,
  className,
}: AppStoreDownloadProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={className} suppressHydrationWarning>
      <Link
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-opacity hover:opacity-80"
        aria-label={`Download ${appName} on the App Store`}
      >
        <Badge platform="appstore" isDark={isDark} />
      </Link>
    </div>
  );
}
