import Link from "next/link";
import Image from "next/image";
import { DynamicHeadline } from "./DynamicHeadline";

interface BusinessHeroSectionProps {
  headlineLabels: string[];
}

export function BusinessHeroSection({
  headlineLabels,
}: BusinessHeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-background to-background dark:from-primary-950/20" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-12 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-start md:gap-8 lg:gap-12">
          {/* Text content */}
          <div className="md:flex-[1.5] lg:flex-[1.7] min-w-0">
            <DynamicHeadline headlineLabels={headlineLabels} />

            {/* Subheadline */}
            <p className="text-lg text-default-600 md:text-xl md:max-w-md lg:max-w-lg mb-6 sm:mb-8">
              We set up ads and pages that filter inquiries, show you what’s
              working, and send only serious people to WhatsApp.
            </p>

            {/* CTA Button */}
            <Link
              href="/signup/business"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>

          {/* Hero image - mobile app screenshot (top half) */}
          <div className="mt-10 md:mt-0 md:flex-[1.2] flex-shrink-0">
            <div className="relative aspect-[9/8] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl ring-1 ring-black/5">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Sovoli mobile app"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
