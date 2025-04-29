"use client";

const mockups = [
  { src: "/images/mockup-student-profile.webp", alt: "Student Profile View" },
  { src: "/images/mockup-attendance.webp", alt: "Attendance Tracking" },
  { src: "/images/mockup-reports.webp", alt: "Promotion and Reports" },
];

export function GallerySection() {
  return (
    <section className="w-full pt-12">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h2 className="mb-2 text-xl font-semibold text-default-900">
          See how Sovoli transforms school recordkeeping
        </h2>
        <p className="mb-8 text-default-500">
          Simple, secure, and built for your daily flow.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {mockups.map((mockup) => (
            <div
              key={mockup.src}
              className="rounded-xl border border-default-200 p-2 shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={mockup.src}
                alt={mockup.alt}
                className="h-auto w-full rounded-md object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
