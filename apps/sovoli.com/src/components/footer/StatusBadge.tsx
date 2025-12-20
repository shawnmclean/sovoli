"use client";

import { useEffect, useState, startTransition } from "react";
import { useTheme } from "next-themes";

export const StatusBadge = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-6">
      <iframe
        src={`https://status.sovoli.com/badge?theme=${resolvedTheme ?? "light"}`}
        width="250"
        height="30"
        frameBorder="0"
        scrolling="no"
        className="[color-scheme:none]"
        title="Sovoli Status"
      />
    </div>
  );
};
