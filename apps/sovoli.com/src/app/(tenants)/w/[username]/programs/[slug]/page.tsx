import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Badge } from "@sovoli/ui/components/badge";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import {
  ChevronLeft,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  SendIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  StarIcon,
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
} from "lucide-react";
import { differenceInDays, format, startOfDay, parseISO } from "date-fns";

import { displayAgeRange } from "../utils";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import type { Metadata } from "next";
import { ProgramPriceCard } from "../components/ProgramPriceCard";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramDetailsPageProps {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProgramDetailsPageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const {
    websiteModule: { website },
    academicModule,
  } = await retrieveOrgInstance(username);

  const program = academicModule?.programs.find((p) => p.slug === slug);
  if (!program) return notFound();

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";
  const programDescription =
    program.description ??
    program.standardProgramVersion?.program.description ??
    "";

  return {
    title: `${programName} | ${website.siteName}`,
    description: programDescription,
    openGraph: {
      title: `${programName} | ${website.siteName}`,
      description: programDescription,
      type: "website",
      images: [
        {
          url:
            program.image ??
            program.standardProgramVersion?.program.image ??
            "",
          width: 1200,
          height: 630,
          alt: programName,
        },
      ],
    },
  };
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return date.toLocaleDateString("en-GY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get current date
const getCurrentDate = () => new Date();

// Helper function to check if date is in the future
const isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  return date > getCurrentDate();
};

// Helper function to get cycle status
const getCycleStatus = (startDate: string, endDate: string) => {
  const now = getCurrentDate();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "current";
  return "completed";
};

// Helper function to format registration deadline
const formatRegistrationDeadline = (endDate: string) => {
  const end = parseISO(endDate);
  const now = startOfDay(new Date());
  const days = differenceInDays(end, now);
  if (days < 0) return "Registration closed";
  if (days === 0) return "Registration closes today";
  if (days === 1) return "Registration closes tomorrow";
  if (days <= 7) return `Registration closes in ${days} days`;
  return `Registration closes ${format(end, "MMM d, yyyy")}`;
};

export default async function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const { username, slug } = await params;

  const orgInstance = await retrieveOrgInstance(username);
  const program = orgInstance.academicModule?.programs.find(
    (p) => p.slug === slug,
  );

  if (!program) {
    return notFound();
  }

  const programName =
    program.name ?? program.standardProgramVersion?.program.name ?? "";
  const programDescription =
    program.description ??
    program.standardProgramVersion?.program.description ??
    "";
  const programImage =
    program.image ?? program.standardProgramVersion?.program.image ?? "";
  const programTagline = "";

  // Get cycles for this program
  const programCycles =
    orgInstance.academicModule?.programCycles?.filter(
      (cycle) => cycle.orgProgram.slug === program.slug,
    ) ?? [];

  // Get the next upcoming cycle
  const nextCycle = programCycles
    .filter((cycle) => {
      const startDate =
        cycle.academicCycle.startDate ??
        cycle.academicCycle.globalCycle?.startDate;
      return startDate && isDateInFuture(startDate);
    })
    .sort((a, b) => {
      const aStart =
        a.academicCycle.startDate ??
        a.academicCycle.globalCycle?.startDate ??
        "";
      const bStart =
        b.academicCycle.startDate ??
        b.academicCycle.globalCycle?.startDate ??
        "";
      return parseISO(aStart).getTime() - parseISO(bStart).getTime();
    })[0];

  // Get the current cycle
  const currentCycle = programCycles.find((cycle) => {
    const startDate =
      cycle.academicCycle.startDate ??
      cycle.academicCycle.globalCycle?.startDate;
    const endDate =
      cycle.academicCycle.endDate ?? cycle.academicCycle.globalCycle?.endDate;
    if (!startDate || !endDate) return false;
    return getCycleStatus(startDate, endDate) === "current";
  });

  // Get organization contact info
  const primaryLocation = orgInstance.org.locations.find((l) => l.isPrimary);
  const whatsapp = primaryLocation?.contacts.find(
    (c) => c.type === "whatsapp",
  )?.value;
  const phone = primaryLocation?.contacts.find(
    (c) => c.type === "phone",
  )?.value;
  const email = primaryLocation?.contacts.find(
    (c) => c.type === "email",
  )?.value;

  // Format address properly
  const formatAddress = (
    address:
      | {
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          countryCode?: string;
        }
      | null
      | undefined,
  ) => {
    if (!address) return null;
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.countryCode) parts.push(address.countryCode);
    return parts.join(", ");
  };
  const formattedAddress = formatAddress(primaryLocation?.address);

  return (
    <div className="min-h-screen bg-default-50">
      {/* Navigation Header */}
      <div className="bg-background shadow-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Button
            as={Link}
            href="/programs"
            variant="light"
            startContent={<ChevronLeft className="h-4 w-4" />}
            size="sm"
          >
            Back to Programs
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="relative h-64 md:h-80">
              <Image
                src={programImage}
                alt={programName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {program.isPopular && (
                  <Badge color="warning" variant="flat" size="sm">
                    🔥 Popular Choice
                  </Badge>
                )}
                {nextCycle && (
                  <Badge color="success" variant="flat" size="sm">
                    Enrolling Now
                  </Badge>
                )}
                {currentCycle && (
                  <Badge color="primary" variant="flat" size="sm">
                    Currently Running
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {programName}
              </h1>

              <p className="text-lg text-foreground-600 mb-4">
                {programTagline}
              </p>

              <p className="text-foreground-700 leading-relaxed max-w-3xl">
                {programDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Highlights */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <StarIcon className="h-6 w-6 text-primary" />
                  Program Highlights
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <GraduationCapIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Academic Excellence
                      </h3>
                      <p className="text-sm text-foreground-600">
                        Comprehensive curriculum designed to foster critical
                        thinking and creativity
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Small Class Sizes
                      </h3>
                      <p className="text-sm text-foreground-600">
                        Personalized attention with optimal teacher-student
                        ratios
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Modern Resources
                      </h3>
                      <p className="text-sm text-foreground-600">
                        State-of-the-art facilities and learning materials
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Flexible Scheduling
                      </h3>
                      <p className="text-sm text-foreground-600">
                        Multiple cycles and convenient registration periods
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Academic Cycles */}
            {programCycles.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    Academic Cycles
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {nextCycle && (
                    <div className="rounded-lg bg-success-50 border border-success-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="success" variant="flat" size="sm">
                          Next Cycle
                        </Badge>
                        <span className="text-sm font-medium text-success-900">
                          {nextCycle.academicCycle.customLabel ??
                            nextCycle.academicCycle.globalCycle?.label ??
                            "Upcoming Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
                            Start Date
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(
                              nextCycle.academicCycle.startDate ??
                                nextCycle.academicCycle.globalCycle
                                  ?.startDate ??
                                "",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
                            End Date
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(
                              nextCycle.academicCycle.endDate ??
                                nextCycle.academicCycle.globalCycle?.endDate ??
                                "",
                            )}
                          </p>
                        </div>
                      </div>

                      {nextCycle.registrationPeriod && (
                        <div className="mt-4 pt-4 border-t border-success-200">
                          <div className="flex items-center gap-2 mb-2">
                            <ClockIcon className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-success-900">
                              Registration Period
                            </span>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-sm text-foreground-600 mb-1">
                                Opens
                              </p>
                              <p className="font-medium text-foreground">
                                {formatDate(
                                  nextCycle.registrationPeriod.startDate,
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-600 mb-1">
                                Closes
                              </p>
                              <p className="font-medium text-foreground">
                                {formatDate(
                                  nextCycle.registrationPeriod.endDate,
                                )}
                              </p>
                            </div>
                          </div>

                          {nextCycle.registrationPeriod.endDate && (
                            <div className="mt-3 p-3 bg-warning-50 rounded-lg border border-warning-200">
                              <p className="text-sm font-semibold text-warning-700">
                                ⏰{" "}
                                {formatRegistrationDeadline(
                                  nextCycle.registrationPeriod.endDate,
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {currentCycle && (
                    <div className="rounded-lg bg-primary-50 border border-primary-200 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="primary" variant="flat" size="sm">
                          Current Cycle
                        </Badge>
                        <span className="text-sm font-medium text-primary-900">
                          {currentCycle.academicCycle.customLabel ??
                            currentCycle.academicCycle.globalCycle?.label ??
                            "Current Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
                            Start Date
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(
                              currentCycle.academicCycle.startDate ??
                                currentCycle.academicCycle.globalCycle
                                  ?.startDate ??
                                "",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground-600 mb-1">
                            End Date
                          </p>
                          <p className="font-medium text-foreground">
                            {formatDate(
                              currentCycle.academicCycle.endDate ??
                                currentCycle.academicCycle.globalCycle
                                  ?.endDate ??
                                "",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Pricing Information */}
            {programCycles.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Pricing & Fees
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {nextCycle && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="success" variant="flat" size="sm">
                          Next Cycle Pricing
                        </Badge>
                        <span className="text-sm font-medium text-success-900">
                          {nextCycle.academicCycle.customLabel ??
                            nextCycle.academicCycle.globalCycle?.label ??
                            "Upcoming Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {nextCycle.pricingPackage.pricingItems
                          .filter((item) => item.purpose === "registration")
                          .map((item) => (
                            <div key={item.id} className="space-y-2">
                              <h4 className="font-semibold text-foreground">
                                Registration Fee
                              </h4>
                              <ProgramPriceCard
                                pricingPackage={nextCycle.pricingPackage}
                                pricingItemId={item.id}
                              />
                            </div>
                          ))}

                        {nextCycle.pricingPackage.pricingItems
                          .filter((item) => item.purpose === "tuition")
                          .map((item) => (
                            <div key={item.id} className="space-y-2">
                              <h4 className="font-semibold text-foreground">
                                Tuition Fee
                              </h4>
                              <ProgramPriceCard
                                pricingPackage={nextCycle.pricingPackage}
                                pricingItemId={item.id}
                              />
                            </div>
                          ))}
                      </div>

                      <div className="mt-4 p-4 bg-default-50 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">
                          💡 Payment Options
                        </h4>
                        <ul className="text-sm text-foreground-600 space-y-1">
                          <li>• Flexible payment plans available</li>
                          <li>• Family discounts for multiple children</li>
                          <li>• Early bird discounts for early registration</li>
                          <li>• Sibling discounts available</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentCycle && (
                    <div className="space-y-4 pt-6 border-t border-default-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge color="primary" variant="flat" size="sm">
                          Current Cycle Pricing
                        </Badge>
                        <span className="text-sm font-medium text-primary-900">
                          {currentCycle.academicCycle.customLabel ??
                            currentCycle.academicCycle.globalCycle?.label ??
                            "Current Cycle"}
                        </span>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {currentCycle.pricingPackage.pricingItems
                          .filter((item) => item.purpose === "registration")
                          .map((item) => (
                            <div key={item.id} className="space-y-2">
                              <h4 className="font-semibold text-foreground">
                                Registration Fee
                              </h4>
                              <ProgramPriceCard
                                pricingPackage={currentCycle.pricingPackage}
                                pricingItemId={item.id}
                              />
                            </div>
                          ))}

                        {currentCycle.pricingPackage.pricingItems
                          .filter((item) => item.purpose === "tuition")
                          .map((item) => (
                            <div key={item.id} className="space-y-2">
                              <h4 className="font-semibold text-foreground">
                                Tuition Fee
                              </h4>
                              <ProgramPriceCard
                                pricingPackage={currentCycle.pricingPackage}
                                pricingItemId={item.id}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Requirements */}
            {((program.requirements?.length ?? 0) > 0 ||
              (program.standardProgramVersion?.requirements?.length ?? 0) >
                0) && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-primary" />
                    Requirements
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {(
                      program.requirements ??
                      program.standardProgramVersion?.requirements ??
                      []
                    ).map((requirement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-default-50 rounded-lg"
                      >
                        <Chip color="secondary" variant="flat" size="sm">
                          {requirement.type === "age" ? "Age" : "Document"}
                        </Chip>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {requirement.description ?? requirement.name}
                          </p>
                          {requirement.type === "age" &&
                            requirement.ageRange && (
                              <p className="text-xs text-foreground-500">
                                {displayAgeRange(requirement.ageRange)}
                              </p>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Program Description */}
            {programDescription && (
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    About This Program
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="prose prose-sm max-w-none text-foreground-700">
                    <p className="leading-relaxed">{programDescription}</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-foreground">
                  Take Action
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {nextCycle && (
                  <Button
                    as={WhatsAppLink}
                    phoneNumber={whatsapp}
                    message={`Hi, I'm interested in ${programName} (${nextCycle.academicCycle.customLabel ?? nextCycle.academicCycle.globalCycle?.label ?? "upcoming cycle"}). Can you help me with registration and payment options?`}
                    fullWidth
                    color="primary"
                    variant="solid"
                    size="lg"
                    startContent={<SendIcon />}
                  >
                    Start Registration{" "}
                    {program.isPopular && (
                      <span>
                        - 🔥{" "}
                        <strong>
                          {program.slug === "pre-nursery" ? "8" : "12"}
                        </strong>{" "}
                        spots left
                      </span>
                    )}
                  </Button>
                )}

                <Button
                  as={Link}
                  href="/programs"
                  fullWidth
                  color="default"
                  variant="bordered"
                  size="md"
                  startContent={<InfoIcon />}
                >
                  View All Programs
                </Button>

                <div className="text-center">
                  <p className="text-xs text-foreground-500">
                    📸 Real Classrooms &middot; 📚 Books &middot; 📖 Learning
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-foreground">
                  Contact Us
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-700">{phone}</span>
                  </div>
                )}

                {email && (
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground-700">{email}</span>
                  </div>
                )}

                {formattedAddress && (
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm text-foreground-700">
                      {formattedAddress}
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Program Stats */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-foreground">
                  Program Overview
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {programCycles.length}
                    </div>
                    <div className="text-xs text-foreground-600">
                      Available Cycles
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {program.requirements?.length ??
                        program.standardProgramVersion?.requirements?.length ??
                        0}
                    </div>
                    <div className="text-xs text-foreground-600">
                      Requirements
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
