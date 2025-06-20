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
      title: "Transparency",
      description:
        "How well this school shares information about pricing, staff, and curriculum",
      icon: ShieldIcon,
      items: [
        {
          label: "Verified Organization",
          score: orgInstance.org.isVerified ? 10 : 0,
          maxScore: 10,
          description: "Organization has been verified by Sovoli",
          achieved: !!orgInstance.org.isVerified,
        },
        {
          label: "Has Website",
          score: websiteUrl ? 5 : 0,
          maxScore: 5,
          description: "School has an online presence",
          achieved: !!websiteUrl,
          link: websiteUrl,
        },
        {
          label: "Website Managed by Sovoli",
          score: orgInstance.websiteModule ? 5 : 0,
          maxScore: 5,
          description: "Professional website management",
          achieved: !!orgInstance.websiteModule,
        },
      ],
    },
    {
      title: "Findability",
      description: "How easy it is to find this school online",
      icon: SearchIcon,
      items: [
        {
          label: "Facebook Page Linked",
          score: orgInstance.org.socialLinks?.some(
            (l) => l.platform === "facebook",
          )
            ? 5
            : 0,
          maxScore: 5,
          description: "Active social media presence",
          achieved: !!orgInstance.org.socialLinks?.some(
            (l) => l.platform === "facebook",
          ),
        },
        {
          label: "Valid Email Address",
          score: email ? 5 : 0,
          maxScore: 5,
          description: "Professional email communication",
          achieved: !!email,
          link: email ? `mailto:${email}` : null,
        },
        {
          label: "Phone Number Present",
          score: phone ? 5 : 0,
          maxScore: 5,
          description: "Direct contact available",
          achieved: !!phone,
          link: phone ? `tel:${phone}` : null,
        },
        {
          label: "WhatsApp Available",
          score: whatsapp ? 5 : 0,
          maxScore: 5,
          description: "Modern messaging option",
          achieved: !!whatsapp,
          link: whatsapp
            ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
            : null,
        },
      ],
    },
    {
      title: "Seriousness",
      description:
        "Professional indicators like educational domains and emails",
      icon: GraduationCapIcon,
      items: [
        {
          label: "Has .edu.gy Domain (Private School)",
          score: hasEduDomain ? 10 : 0,
          maxScore: 10,
          description: "Official educational domain",
          achieved: !!hasEduDomain,
          note: "Only applies to private schools",
        },
        {
          label: "Has Educational Email Domain",
          score: hasEduEmail ? 5 : 0,
          maxScore: 5,
          description: "Professional educational email",
          achieved: !!hasEduEmail,
        },
      ],
    },
    {
      title: "Enrollment",
      description: "Online enrollment and application capabilities",
      icon: UsersIcon,
      items: [
        {
          label: "Has Academic Programs",
          score: hasPrograms ? 10 : 0,
          maxScore: 10,
          description: "Clear program offerings",
          achieved: !!hasPrograms,
          count: orgInstance.academicModule?.programs.length ?? 0,
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
