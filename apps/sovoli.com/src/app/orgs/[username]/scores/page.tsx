import { notFound } from "next/navigation";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Badge } from "@sovoli/ui/components/badge";
import {
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  UsersIcon,
  ShieldIcon,
  SearchIcon,
} from "lucide-react";

import { bus } from "~/services/core/bus";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { computeOrgScore } from "~/modules/organisations/computeScore";

// Define types for better type safety
interface ScoreItem {
  label: string;
  score: number;
  maxScore: number;
  description: string;
  achieved: boolean;
  link?: string | null;
  note?: string;
  count?: number;
}

interface ScoreCategory {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: ScoreItem[];
}

const retrieveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export default async function ScoresPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);
  const scoringModule = computeOrgScore(orgInstance);
  const { digitalScore } = scoringModule;

  const totalScore = digitalScore?.score ?? 0;
  const maxScore = digitalScore?.maxScore ?? 0;
  const percentage =
    maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const websiteUrl =
    orgInstance.websiteModule?.website.url ??
    orgInstance.org.socialLinks?.find((l) => l.platform === "website")?.url ??
    null;

  const primaryLocation = orgInstance.org.locations[0];
  const phone = primaryLocation?.contacts.find(
    (c) => c.type === "phone",
  )?.value;
  const email = primaryLocation?.contacts.find(
    (c) => c.type === "email",
  )?.value;
  const whatsapp = primaryLocation?.contacts.find(
    (c) => c.type === "whatsapp",
  )?.value;

  const hasEduDomain =
    orgInstance.org.categories.includes("private-school") &&
    (orgInstance.org.socialLinks
      ?.find((l) => l.platform === "website")
      ?.url.endsWith(".edu.gy") ??
      orgInstance.websiteModule?.website.domain.endsWith(".edu.gy"));

  const hasEduEmail = orgInstance.org.locations.some((loc) =>
    loc.contacts.some(
      (c) =>
        c.type === "email" &&
        (c.value.endsWith(".edu.gy") || c.value.endsWith(".edu")),
    ),
  );

  const hasPrograms =
    orgInstance.academicModule?.programs &&
    orgInstance.academicModule.programs.length > 0;

  // Define score categories
  const scoreCategories: ScoreCategory[] = [
    {
      title: "Trust & Visibility",
      description:
        "How easily parents can find, trust, and contact this school.",
      icon: ShieldIcon,
      items: [
        {
          label: "Verified Organization",
          score: orgInstance.org.isVerified ? 10 : 0,
          maxScore: 10,
          description:
            "Verified by Sovoli with submitted business registration.",
          achieved: !!orgInstance.org.isVerified,
        },
        {
          label: "Website Present",
          score: websiteUrl ? 10 : 0,
          maxScore: 10,
          description: "Official school website for parents to visit.",
          achieved: !!websiteUrl,
          link: websiteUrl,
        },
        {
          label: "Google Business Profile",
          score: orgInstance.org.locations.some((l) => l.placeId) ? 10 : 0,
          maxScore: 10,
          description: "Found on Google Maps with a verified listing.",
          achieved: !!orgInstance.org.locations.some((l) => l.placeId),
        },
        {
          label: "Facebook Page Linked",
          score: orgInstance.org.socialLinks?.some(
            (l) => l.platform === "facebook",
          )
            ? 5
            : 0,
          maxScore: 5,
          description: "Active Facebook presence for updates and outreach.",
          achieved: !!orgInstance.org.socialLinks?.some(
            (l) => l.platform === "facebook",
          ),
        },
        {
          label: "WhatsApp Available",
          score: whatsapp ? 5 : 0,
          maxScore: 5,
          description: "Direct messaging for fast parent communication.",
          achieved: !!whatsapp,
          link: whatsapp
            ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
            : null,
        },
        {
          label: "Email Contact Present",
          score: email ? 5 : 0,
          maxScore: 5,
          description: "Reachable via professional email.",
          achieved: !!email,
          link: email ? `mailto:${email}` : null,
        },
        {
          label: "Phone Number Present",
          score: phone ? 5 : 0,
          maxScore: 5,
          description: "Reachable via direct phone call.",
          achieved: !!phone,
          link: phone ? `tel:${phone}` : null,
        },
        {
          label: ".edu.gy Domain (Private School)",
          score: hasEduDomain ? 5 : 0,
          maxScore: 5,
          description: "Trusted educational domain name.",
          achieved: !!hasEduDomain,
          note: "Only applies to private schools",
        },
        {
          label: "Educational Email Domain",
          score: hasEduEmail ? 5 : 0,
          maxScore: 5,
          description: "Email uses .edu or .edu.gy for professional contact.",
          achieved: !!hasEduEmail,
        },
      ],
    },
    {
      title: "Programs & Parent Experience",
      description:
        "Clarity of academic offerings and readiness to support parents digitally.",
      icon: UsersIcon,
      items: [
        {
          label: "Academic Programs Listed",
          score: hasPrograms ? 10 : 0,
          maxScore: 10,
          description: "Shows available programs by grade level or subject.",
          achieved: !!hasPrograms,
          count: orgInstance.academicModule?.programs.length ?? 0,
        },
        {
          label: "Mobile-Friendly Website",
          score: websiteUrl ? 10 : 0, // for now just double-score if website exists
          maxScore: 10,
          description: "Website is accessible and usable on mobile devices.",
          achieved: !!websiteUrl,
        },
        {
          label: "Basic Contact on Homepage",
          score: email || phone || whatsapp ? 5 : 0,
          maxScore: 5,
          description: "Essential contacts are easy to find.",
          achieved: !!(email ?? phone ?? whatsapp),
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 p-2 sm:p-4 max-w-4xl mx-auto">
      {/* Overall Score Section */}
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-default-900">
                Digital Readiness Score
              </h1>
              <p className="text-sm sm:text-base text-default-600 mt-1">
                How well this school has modern infrastructure and digital
                presence
              </p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {totalScore}/{maxScore}
              </div>
              <div className="text-xs sm:text-sm text-default-500">
                {percentage}% Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-4 sm:px-6 pt-0">
          {/* Progress Bar */}
          <div className="w-full bg-default-200 rounded-full h-2 sm:h-3 mb-4">
            <div
              className="bg-primary h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Score Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {scoreCategories.map((category) => {
              const categoryScore = category.items.reduce(
                (sum, item) => sum + item.score,
                0,
              );
              const categoryMax = category.items.reduce(
                (sum, item) => sum + item.maxScore,
                0,
              );
              const categoryPercentage =
                categoryMax > 0
                  ? Math.round((categoryScore / categoryMax) * 100)
                  : 0;

              return (
                <div key={category.title} className="text-center">
                  <div className="flex items-center justify-center mb-1 sm:mb-2">
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="text-sm sm:text-lg font-semibold">
                    {categoryScore}/{categoryMax}
                  </div>
                  <div className="text-xs sm:text-sm text-default-500">
                    {category.title}
                  </div>
                  <div className="text-xs text-default-400">
                    {categoryPercentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Detailed Categories */}
      <div className="space-y-4">
        {scoreCategories.map((category) => (
          <Card key={category.title} className="border-none shadow-md">
            <CardHeader className="pb-3 px-4 sm:px-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {category.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-default-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-4 sm:px-6 pt-0">
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-default-50 rounded-lg gap-3"
                  >
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {item.achieved ? (
                          <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-default-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-medium text-sm sm:text-base truncate">
                            {item.label}
                          </span>
                          {item.count && (
                            <Badge color="primary" variant="flat" size="sm">
                              {item.count} programs
                            </Badge>
                          )}
                          {item.note && (
                            <Chip size="sm" variant="flat" color="warning">
                              {item.note}
                            </Chip>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-default-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-sm sm:text-base">
                          {item.score}/{item.maxScore}
                        </div>
                        <div className="text-xs text-default-500">
                          {item.maxScore > 0
                            ? Math.round((item.score / item.maxScore) * 100)
                            : 0}
                          %
                        </div>
                      </div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 sm:p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <ExternalLinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="border-none shadow-md bg-warning-50">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
            <h2 className="text-lg sm:text-xl font-semibold">
              Recommendations
            </h2>
          </div>
        </CardHeader>
        <CardBody className="px-4 sm:px-6 pt-0">
          <div className="space-y-3">
            {!orgInstance.org.isVerified && (
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">
                    Claim and verify your organization
                  </p>
                  <p className="text-xs sm:text-sm text-default-600">
                    Get verified to improve your score and build trust with
                    parents
                  </p>
                </div>
              </div>
            )}
            {!websiteUrl && (
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">
                    Create a professional website
                  </p>
                  <p className="text-xs sm:text-sm text-default-600">
                    A website helps parents find and learn about your school
                  </p>
                </div>
              </div>
            )}
            {!hasEduDomain &&
              orgInstance.org.categories.includes("private-school") && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      Consider a .edu.gy domain
                    </p>
                    <p className="text-xs sm:text-sm text-default-600">
                      Educational domains show professionalism and credibility
                    </p>
                  </div>
                </div>
              )}
            {!hasPrograms && (
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base">
                    Add your academic programs
                  </p>
                  <p className="text-xs sm:text-sm text-default-600">
                    Show parents what programs you offer and their requirements
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
