import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";
import { HeroSection } from "./components/HeroSection";
import { ChevronDownIcon } from "lucide-react";
import { ProgramsSection } from "./components/ProgramsSection";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProgramsPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Programs",
    description: `Explore our academic programs at ${website.siteName}.`,
    keywords: ["academic programs", "courses", "education", website.siteName],
    openGraph: {
      title: `Programs | ${website.siteName}`,
      description: `Explore our academic programs at ${website.siteName}.`,
      type: "website",
      url: `${website.url}/programs`,
      siteName: website.siteName,
    },
  };
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <div className="container mx-auto max-w-6xl space-y-14 px-6 py-4">
      <HeroSection orgInstance={orgInstance} />
      <div className="flex justify-center mt-[-2rem] md:mt-[-1rem]">
        <p className="text-sm text-white/70 animate-bounce flex items-center gap-2">
          <ChevronDownIcon className="w-4 h-4" />
          View Programs Below
        </p>
      </div>

      {/* Programs Listing */}
      <ProgramsSection orgInstance={orgInstance} />
    </div>
  );
}
