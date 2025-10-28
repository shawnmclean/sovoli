import { TrendingUpIcon } from "lucide-react";
import Image from "next/image";
import overviewImage from "./overview.webp";

export function Overview() {
  return (
    <section className="py-6 px-2 sm:py-16">
      <div className="mx-auto max-w-6xl text-center">
        {/* Product Icon and Name */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
            <TrendingUpIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-primary-600">
            Growth System
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Grow Your School With Digital Marketing Systems
          </span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-xl text-default-600 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
          Sovoli is the only data-driven growth enrollment system built
          specifically for private schools in <strong>Guyana</strong>.
        </p>

        {/* Overview Image */}
        <div className="relative mx-2 sm:mx-4">
          <div className="relative aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="absolute inset-2 sm:inset-4 rounded-lg overflow-hidden">
              <Image
                src={overviewImage}
                alt="Growth System Dashboard Overview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
