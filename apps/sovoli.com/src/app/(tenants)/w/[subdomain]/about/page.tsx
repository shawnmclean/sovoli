import type { Metadata } from "next";
import React from "react";
import { Card } from "@sovoli/ui/components/card";
import { Image } from "@sovoli/ui/components/image";
import {
  AwardIcon,
  EyeIcon,
  LightbulbIcon,
  ShieldIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";

import { PageAssembler } from "~/modules/website/components/PageAssembler";
import { orgWebConfig } from "../data";
import { Timeline } from "./components/Timeline";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div>
      <PageAssembler page={orgWebConfig.about} editable={false} />

      {/* Main Content Section - Centered and Narrowed */}

      <div className="container mx-auto max-w-5xl px-6 py-16">
        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <TargetIcon className="text-primary" width={24} />
              </div>
              <h2 className="text-2xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-lg text-foreground-600">
              Our mission is to provide a nurturing and inclusive environment
              where every student is empowered to excel academically, grow
              personally, and develop into compassionate global citizens.
            </p>
          </Card>

          <Card className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <EyeIcon className="text-primary" width={24} />
              </div>
              <h2 className="text-2xl font-semibold">Our Vision</h2>
            </div>
            <p className="text-lg text-foreground-600">
              We envision a world where education is a transformative journey
              that cultivates lifelong learners, fosters critical thinking, and
              empowers individuals to make a positive impact on their
              communities and the world.
            </p>
          </Card>
        </div>

        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold">Our Core Values</h2>
            <p className="mt-2 text-foreground-500">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldIcon className="text-primary" width={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Integrity</h3>
              <p className="text-foreground-600">
                We uphold the highest ethical standards in all our actions and
                decisions.
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <AwardIcon className="text-primary" width={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Excellence</h3>
              <p className="text-foreground-600">
                We uphold the highest ethical standards in all our actions and
                decisions.
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <UsersIcon className="text-primary" width={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Respect</h3>
              <p className="text-foreground-600">
                We uphold the highest ethical standards in all our actions and
                decisions.
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <LightbulbIcon className="text-primary" width={32} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Innovation</h3>
              <p className="text-foreground-600">
                We uphold the highest ethical standards in all our actions and
                decisions.
              </p>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold">Our History</h2>
            <p className="mt-2 text-foreground-500">
              A journey of growth and excellence since our founding
            </p>
          </div>
          <Card className="p-8">
            <p className="mb-8 text-lg text-foreground-600">
              Our institution was founded with the vision of creating a safe,
              nurturing, and intellectually stimulating environment for
              students. Over the years, we have grown, embracing new educational
              methodologies, while staying true to our core values.
            </p>
            <Timeline />
          </Card>
        </div>
      </div>
    </div>
  );
}
