export function HeroSection() {
  return (
    <section className="z-20 w-full max-w-screen-lg py-2 text-center">
      {/* Headline */}
      <h1 className="text-[clamp(32px,8vw,38px)] font-bold leading-tight tracking-tight sm:text-[64px]">
        <span className="bg-hero-section-title bg-clip-text text-transparent">
          A lifelong knowledge system <br className="hidden sm:block" />
          is being built.
        </span>
      </h1>

      {/* Description */}
      <div className="mx-auto mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-default-500 sm:text-lg">
        <p>
          Sovoli is being built with{" "}
          <strong className="font-semibold text-default-600">
            private schools
          </strong>{" "}
          in <strong className="font-semibold text-default-600">Guyana</strong>{" "}
          — replacing scattered books and files with one secure system.
        </p>
      </div>
    </section>
  );
}
