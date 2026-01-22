"use client";

import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";

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
