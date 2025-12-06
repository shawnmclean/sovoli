import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export interface IndustryCardData {
  id: string;
  goal: string;
  description: string;
  href: string;
  image: string;
  gradient: string;
}

export function IndustryCard({ industry }: { industry: IndustryCardData }) {
  return (
    <Link
      href={industry.href}
      className="group relative block overflow-hidden rounded-2xl border border-default-200 bg-content1 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image
          src={industry.image}
          alt={industry.goal}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3
          className={`mb-2 text-xl font-bold bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent`}
        >
          {industry.goal}
        </h3>
        <p className="mb-4 text-sm text-default-500 leading-relaxed">
          {industry.description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-primary-600 transition-colors">
          <span>Learn How</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom gradient line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${industry.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </Link>
  );
}

