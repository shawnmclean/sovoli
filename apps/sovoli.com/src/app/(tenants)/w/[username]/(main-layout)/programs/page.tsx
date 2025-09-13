import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { ProgramsSection } from "./components/ProgramsSection";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ProgramsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ age?: string; ageGroup?: string }>;
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
      url: "/programs",
      siteName: website.siteName,
      images: [
        {
          url: `/programs/opengraph-image?t=${Date.now()}`,
          width: 1200,
          height: 600,
          alt: "Programs",
        },
      ],
    },
  };
}

export default async function ProgramsPage({ params }: ProgramsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <>
      <div className="container mx-auto max-w-6xl space-y-14 px-6 py-4">
        <ProgramsSection orgInstance={orgInstance} />
      </div>
    </>
  );
}
