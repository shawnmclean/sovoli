"use client";

import React from "react";
import { Image } from "@sovoli/ui/components/image";

export default function AboutPage() {
  return (
    <div>
      <section className="relative z-0 h-[300px] w-full">
        <Image
          removeWrapper
          alt="Modern Academy Campus"
          className="h-full w-full object-cover brightness-50"
          src="https://img.heroui.chat/image/places?w=1920&h=600&u=2"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-white">
          <h1 className="mb-4 max-w-4xl text-center text-4xl font-bold md:text-5xl">
            About Us
          </h1>
          <p className="mb-8 max-w-2xl text-center text-lg md:text-xl">
            Join a community dedicated to academic excellence and personal
            growth
          </p>
        </div>
      </section>

      {/* Main Content Section - Centered and Narrowed */}
      <div className="container mx-auto my-10 max-w-5xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="mt-4 text-lg">
            Our mission is to provide a nurturing and inclusive environment
            where every student is empowered to excel academically, grow
            personally, and develop into compassionate global citizens.
          </p>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">Our Vision</h2>
          <p className="mt-4 text-lg">
            We envision a world where education is a transformative journey that
            cultivates lifelong learners, fosters critical thinking, and
            empowers individuals to make a positive impact on their communities
            and the world.
          </p>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">Our Core Values</h2>
          <ul className="mt-4 list-inside list-disc text-lg">
            <li>Integrity</li>
            <li>Excellence</li>
            <li>Respect</li>
            <li>Innovation</li>
            <li>Collaboration</li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold">Our History</h2>
          <p className="mt-4 text-lg">
            Our institution was founded with the vision of creating a safe,
            nurturing, and intellectually stimulating environment for students.
            Over the years, we have grown, embracing new educational
            methodologies, while staying true to our core values.
          </p>
        </div>
      </div>
    </div>
  );
}
