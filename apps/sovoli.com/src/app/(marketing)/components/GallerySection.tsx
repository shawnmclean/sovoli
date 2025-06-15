"use client";

import type { StaticImageData } from "next/image";
import React from "react";
import Image from "next/image";

import mockupAttendance from "./mockup-attendance.png";
import mockupDashboard from "./mockup-dashboard.png";
import mockupStudentList from "./mockup-student-list.png";
import mockupStudentProfile from "./mockup-student-profile.png";

const mockups: { src: StaticImageData; alt: string }[] = [
  {
    src: mockupDashboard,
    alt: "School Dashboard View",
  },
  {
    src: mockupStudentList,
    alt: "Student List View",
  },
  {
    src: mockupAttendance,
    alt: "Attendance Tracking View",
  },
  {
    src: mockupStudentProfile,
    alt: "Student Profile View",
  },
];

export function GallerySection() {
  return (
    <section className="w-full pt-12">
      <div className="mx-auto max-w-5xl px-2 text-center">
        <h2 className="mb-2 text-xl font-semibold text-default-900">
          What used to take hours now takes seconds.
        </h2>
        <p className="mb-8 text-default-500">
          Pulling records from different books, registers, and binders? Sovoli
          keeps everything in one place — updated as you go.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {mockups.map((mockup, i) => (
            <a
              key={i}
              href={mockup.src.src}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-default-200 p-2 shadow-sm transition-shadow hover:shadow-md"
            >
              <Image
                src={mockup.src}
                alt={mockup.alt}
                className="h-auto w-full rounded-md object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
