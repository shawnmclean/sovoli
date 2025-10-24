import { TrendingUpIcon } from "lucide-react";

export function Overview() {
  return (
    <section className="py-8 px-4 sm:py-16">
      <div className="mx-auto max-w-6xl text-center">
        {/* Product Icon and Name */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <TrendingUpIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-600">
            Growth System
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Grow Your School With Digital Marketing That Actually Works
          </span>
        </h2>

        {/* Description */}
        <p className="text-base sm:text-xl text-default-600 mb-8 max-w-4xl mx-auto leading-relaxed px-4">
          Stop losing parents to competitors. The Sovoli Growth System gives
          your school everything needed to be found online, convert visitors
          into leads, and grow enrollment systematically. Built specifically for
          Caribbean private schools.
        </p>

        {/* Image Placeholder */}
        <div className="bg-background rounded-2xl shadow-lg p-8 border border-default-200 mx-4">
          <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="h-10 w-10 text-background" />
              </div>
              <h3 className="text-xl font-semibold text-default-800 mb-2">
                Growth System Dashboard
              </h3>
              <p className="text-default-600">
                Real-time analytics and lead management
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
