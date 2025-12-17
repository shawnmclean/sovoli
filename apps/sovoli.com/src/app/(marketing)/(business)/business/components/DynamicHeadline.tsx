"use client";

import { useState, useEffect, useMemo } from "react";

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
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [headlineLabels.length]);

  return (
    <div className="mb-8">
      <h1 className="text-left font-bold leading-tight tracking-tight">
        <span className="block text-foreground text-3xl md:text-5xl lg:text-6xl">
          Get more enrollments for your programs
        </span>
        <span className="block text-foreground/80 text-3xl sm:text-3xl md:text-5xl lg:text-5xl mt-2">
          For{" "}
          <span className="relative inline-block overflow-hidden align-bottom">
            {/* Hidden longest word to set width */}
            <span className="invisible">{longestType}.</span>
            {headlineLabels.map((type, index) => (
              <span
                key={type}
                className={`absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-[#800080] via-[#ff00ff] to-[#800080] bg-clip-text text-transparent transition-all duration-500 ease-out ${
                  index === currentIndex
                    ? isAnimating
                      ? "-translate-y-full opacity-0"
                      : "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
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
