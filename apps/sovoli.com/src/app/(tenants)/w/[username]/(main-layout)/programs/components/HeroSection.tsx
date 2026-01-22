import { ChevronDownIcon } from "lucide-react";

import type { OrgInstance } from "~/modules/organisations/types";

export interface HeroSectionProps {
  orgInstance: OrgInstance;
}

export function HeroSection({ orgInstance }: HeroSectionProps) {
  const notices = [
    {
      icon: "📅",
      text: "Limited Spots Available",
      className: "bg-warning text-warning-foreground animate-pulse",
    },
    {
      icon: "💸",
      text: "Discounts Available",
      className: "bg-success-300 text-success-900",
    },
  ];

  const hero = orgInstance.websiteModule?.programsPageHero;
  const socialProof = hero?.socialProof;

  const formatSocialProof = () => {
    if (!socialProof) return null;
    const location = socialProof.locationContext
      ? ` ${socialProof.locationContext}`
      : "";
    return `✅ Trusted by ${socialProof.count} ${socialProof.audienceLabel}${location}`;
  };

  return (
    <section className="w-full bg-background text-foreground px-4 py-10 md:py-16 text-center">
      {/* Headline & Subtext */}
      <div className="max-w-xl mx-auto space-y-4 mb-8">
        {hero?.headline && (
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {hero.headline}
          </h1>
        )}
        {hero?.subtext && (
          <p className="text-base md:text-lg text-muted-foreground">
            {hero.subtext}
          </p>
        )}
        {socialProof && (
          <p className="text-sm text-muted-foreground">{formatSocialProof()}</p>
        )}
      </div>

      {/* Notices */}
      <div className="flex flex-col items-center gap-2 mb-10">
        {notices.map(({ icon, text, className }, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm shadow-xs ${className}`}
            aria-label={text}
          >
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1 animate-bounce">
          <ChevronDownIcon className="w-4 h-4" />
          View Programs Below
        </p>
      </div>
    </section>
  );
}
