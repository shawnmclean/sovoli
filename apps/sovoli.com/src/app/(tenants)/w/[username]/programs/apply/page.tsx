import { notFound } from "next/navigation";
import { Divider } from "@sovoli/ui/components/divider";
import { ArrowDownIcon } from "lucide-react";

import { ApplyCard } from "./components/ApplyCard";
import { Requirements } from "./components/Requirements";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { Link } from "@sovoli/ui/components/link";
import type { Metadata } from "next";
import { Alert } from "@sovoli/ui/components/alert";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsApplyPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProgramsApplyPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: `Apply to Programs | ${website.siteName}`,
    description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
    keywords: [
      "apply",
      "application",
      "program requirements",
      "academic programs",
      "education",
      website.siteName,
    ],
    openGraph: {
      title: `Apply to Programs | ${website.siteName}`,
      description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
      type: "website",
      url: `${website.url}/programs`,
      siteName: website.siteName,
      images: website.images,
    },
    twitter: {
      card: "summary_large_image",
      title: `Apply to Programs | ${website.siteName}`,
      description: `Apply to our academic programs at ${website.siteName}. View program requirements and start your application process today.`,
      images: website.images.map((img) => img.url),
    },
  };
}

export default async function ProgramsApplyPage({
  params,
}: ProgramsApplyPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <section className="my-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Alert color="warning">Work in Progress</Alert>
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          Apply to Our Programs
        </h2>
        <div className="mb-8 text-center">
          <Link
            href="#requirements"
            color="primary"
            underline="hover"
            className="flex items-center justify-center gap-2"
          >
            View Requirements <ArrowDownIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="mb-8 space-y-6">
          <ApplyCard orgInstance={orgInstance} />
        </div>

        <Divider className="my-5" />

        <Requirements />
      </div>
    </section>
  );
}
