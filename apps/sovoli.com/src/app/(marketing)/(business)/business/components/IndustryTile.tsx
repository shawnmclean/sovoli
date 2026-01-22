import type { LucideIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export interface Industry {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
}

export function IndustryTile({ industry }: { industry: Industry }) {
  const Icon = industry.icon;

  return (
    <Link
      href={industry.href}
      className="group relative block overflow-hidden rounded-2xl border border-default-200 bg-content1 p-6 transition-all duration-300 hover:border-transparent hover:shadow-xl hover:-translate-y-1"
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${industry.gradient} p-3 text-white shadow-lg`}
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {industry.name}
        </h3>
        <p className="mb-4 text-sm text-default-500 leading-relaxed">
          {industry.description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary-600 transition-colors">
          <span>Explore</span>
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
