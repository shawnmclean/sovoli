"use client";

import { useEffect, useMemo, useState } from "react";

interface DynamicHeadlineProps {
  headlineLabels: string[];
}

export function DynamicHeadline({ headlineLabels }: DynamicHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get the longest business type for sizing the container
  const longestType = useMemo(
    () => headlineLabels.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [headlineLabels],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlineLabels.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [headlineLabels.length]);

  return (
    <div className="mb-8">
      <h1 className="text-left font-semibold leading-tight tracking-tight">
        <span className="block text-foreground text-3xl md:text-5xl lg:text-6xl font-medium">
          Bring the right people to your programs:{" "}
          <span className="relative inline-block overflow-hidden align-bottom">
            {/* Hidden longest word to set width */}
            <span className="invisible font-medium whitespace-nowrap">
              {longestType}.
            </span>
            {headlineLabels.map((type, index) => (
              <span
                key={type}
                className={`absolute left-0 top-0 whitespace-nowrap font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  index === currentIndex
                    ? isAnimating
                      ? "-translate-y-full opacity-0 blur-sm"
                      : "translate-y-0 opacity-100 blur-0"
                    : "translate-y-full opacity-0 blur-sm"
                }`}
                style={{
                  filter:
                    index === currentIndex && !isAnimating
                      ? "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))"
                      : "none",
                }}
              >
                {type}.
              </span>
            ))}
          </span>
        </span>
      </h1>
    </div>
  );
}
