// components/ScrollReset.tsx
"use client";

import { useEffect } from "react";

export function ScrollReset() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
