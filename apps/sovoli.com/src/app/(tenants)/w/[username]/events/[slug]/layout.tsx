import { notFound } from "next/navigation";
import { Footer } from "../../components/footer/Footer";
import { parseISO } from "date-fns";
import type { Event, WithContext } from "schema-dts";

import { getOrgInstanceWithEvent } from "./lib/getOrgInstanceWithEvent";
import { MobileOnlyAlert } from "~/components/MobileOnlyAlert";
import { EventDetailMobileFooter } from "./components/footer/EventDetailMobileFooter";
import { EventHeroSection } from "./components/EventHeroSection";
import { EventRequirementsSection } from "./components/EventRequirementsSection";
import { GalleryCarousel } from "~/components/GalleryCarousel";
import { EventDetailNavbar } from "./components/navbar/EventDetailMobileNavbar";
const retrieveOrgInstanceWithEvent = async (username: string, slug: string) => {
  const result = await getOrgInstanceWithEvent(username, slug);
  if (!result?.event) return notFound();

  return { orgInstance: result.orgInstance, event: result.event };
};

// Helper function to get current date (start of day in local timezone)
const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Helper function to check if date is in the future (inclusive of today)
const _isDateInFuture = (dateString: string) => {
  const date = parseISO(dateString);
  const currentDate = getCurrentDate();
  return date >= currentDate;
};

// Helper function to get event status
const getEventStatus = (startDate: string, endDate?: string) => {
  const now = getCurrentDate();
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : start;

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "current";
  return "completed";
};

interface Props {
  children: React.ReactNode;
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username, slug } = await params;
  const result = await retrieveOrgInstanceWithEvent(username, slug);

  const { orgInstance, event } = result;
  const {
    websiteModule: { website },
  } = orgInstance;

  const title = event.name;
  const description = event.description ?? event.tagline ?? "";

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | ${website.siteName}`,
      description: description,
      type: "website",
      images: [
        {
          url: event.media?.[0]?.url ?? "",
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  };
}

export default async function Layout({ children, params }: Props) {
  const { username, slug } = await params;
  const result = await retrieveOrgInstanceWithEvent(username, slug);

  const { orgInstance, event } = result;

  // Get event status
  const _eventStatus = getEventStatus(event.startDate, event.endDate);

  // Build structured data for the event
  const eventSchema: WithContext<Event> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.location && { location: event.location }),
    organizer: {
      "@id": `${orgInstance.websiteModule.website.url}#org`,
    },
    ...(event.media?.[0]?.url && {
      image: event.media[0].url,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema, null, 0),
        }}
      />
      <MobileOnlyAlert />
      <EventDetailNavbar orgInstance={orgInstance} event={event} />
      <GalleryCarousel
        media={event.media ?? []}
        title={event.name}
        type="event"
        username={username}
        id={event.id}
      />

      <div className="container mx-auto max-w-7xl px-4">
        <EventHeroSection orgInstance={orgInstance} event={event} />

        <EventRequirementsSection event={event} />
      </div>

      <EventDetailMobileFooter orgInstance={orgInstance} event={event} />
      {children}

      <Footer orgInstance={orgInstance} />
    </div>
  );
}
