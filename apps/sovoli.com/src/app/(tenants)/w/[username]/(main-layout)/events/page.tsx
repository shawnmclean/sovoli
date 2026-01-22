import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrgInstanceByUsername } from "../../lib/getOrgInstanceByUsername";
import { EventsSection } from "./components/EventsSection";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface EventsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ category?: string; status?: string }>;
}

export async function generateMetadata({
  params,
}: EventsPageProps): Promise<Metadata> {
  const { username } = await params;
  const {
    websiteModule: { website },
  } = await retrieveOrgInstance(username);

  return {
    title: "Events",
    description: `Upcoming events and activities at ${website.siteName}.`,
    keywords: [
      "events",
      "calendar",
      "activities",
      "school events",
      website.siteName,
    ],
    openGraph: {
      title: `Events | ${website.siteName}`,
      description: `Upcoming events and activities at ${website.siteName}.`,
      type: "website",
      url: "/events",
      siteName: website.siteName,
      images: [
        {
          url: `/events/opengraph-image?t=${Date.now()}`,
          width: 1200,
          height: 600,
          alt: "Events",
        },
      ],
    },
  };
}

export default async function EventsPage({ params }: EventsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <>
      <div className="container mx-auto max-w-6xl space-y-14 px-6 py-4">
        <EventsSection orgInstance={orgInstance} />
      </div>
    </>
  );
}
