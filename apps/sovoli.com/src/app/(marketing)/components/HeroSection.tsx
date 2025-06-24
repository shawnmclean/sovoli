export interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="z-20 w-full max-w-screen-lg py-2 text-center">
      {/* Headline */}
      <h1 className="text-[clamp(32px,8vw,38px)] font-bold leading-tight tracking-tight sm:text-[64px]">
        <span className="bg-hero-section-title bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      {subtitle && (
        <p className="text-lg text-center text-default-600 my-4">{subtitle}</p>
      )}
    </section>
  );
}
