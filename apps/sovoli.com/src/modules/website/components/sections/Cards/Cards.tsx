import { Card, CardBody } from "@sovoli/ui/components/card";
import {
  AwardIcon,
  BookOpenIcon,
  EyeIcon,
  HeartIcon,
  LightbulbIcon,
  ShieldIcon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";

import type { PageSection } from "~/modules/website/types";

export interface CardsProps {
  section: PageSection;
}
export function Cards({ section }: CardsProps) {
  const { title, subtitle } = section;
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-6 text-center text-3xl font-bold">{title}</h2>
          <p className="mx-auto max-w-2xl text-foreground-500">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card
            className="h-full border-none shadow-md transition-shadow duration-300 hover:shadow-lg"
            disableRipple
          >
            <CardBody className="flex flex-col items-center p-8 text-center">
              <div className="mb-6 rounded-full bg-primary-100 p-4">
                <TargetIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Mission</h3>
              <p className="leading-relaxed text-default-600">
                To provide a nurturing environment that fosters academic
                excellence, character development, and lifelong learning.
              </p>
            </CardBody>
          </Card>
          <Card
            className="h-full border-none shadow-md transition-shadow duration-300 hover:shadow-lg"
            disableRipple
          >
            <CardBody className="flex flex-col items-center p-8 text-center">
              <div className="mb-6 rounded-full bg-primary-100 p-4">
                <EyeIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Vision</h3>
              <p className="leading-relaxed text-default-600">
                To be a leader in transformative education, empowering students
                to achieve their highest potential and make meaningful
                contributions.
              </p>
            </CardBody>
          </Card>
          <Card
            className="h-full border-none shadow-md transition-shadow duration-300 hover:shadow-lg"
            disableRipple
          >
            <CardBody className="flex flex-col items-center p-8 text-center">
              <div className="mb-6 rounded-full bg-primary-100 p-4">
                <HeartIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Core Values</h3>
              <ul className="w-full space-y-4 text-left text-default-600">
                <li className="flex items-center">
                  <div className="mr-3 rounded-md bg-primary-50 p-2">
                    <ShieldIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Integrity and Respect</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 rounded-md bg-primary-50 p-2">
                    <AwardIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Academic Excellence</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 rounded-md bg-primary-50 p-2">
                    <LightbulbIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Creativity and Innovation</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 rounded-md bg-primary-50 p-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Community Engagement</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 rounded-md bg-primary-50 p-2">
                    <BookOpenIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span>Lifelong Learning</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
