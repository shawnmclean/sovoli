import type { Metadata } from "next";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
import { Link } from "@sovoli/ui/components/link";
import { GlobeIcon, MapPinIcon, PhoneIcon, SearchIcon } from "lucide-react";

import { pluralize } from "~/utils/pluralize";

interface Org {
  id: string;
  name: string;
  categories: string[]; // e.g., 'private-school', 'nursery-school'
  location: {
    country: string; // e.g., 'guyana'
    state?: string; // optional, e.g., 'florida'
    city?: string; // optional, e.g., 'georgetown'
  };
  phone?: string | null;
  website?: string | null;
}
export const ORGS: Org[] = [
  {
    id: "modern-academy",
    name: "Modern Academy",
    categories: [
      "private-school",
      "nursery-school",
      "secondary-school",
      "pre-school",
    ],
    location: { country: "guyana" },
    phone: "+592 627-1915",
    website: "https://ma.edu.gy",
  },
  {
    id: "academic-training-centre",
    name: "Academic Training Centre",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "academy-of-excellence",
    name: "Academy of Excellence",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "academy-of-professional-studies---aps",
    name: "Academy of Professional Studies - APS",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "apex-education",
    name: "Apex Education",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "camilles-academy",
    name: "Camille's Academy",
    categories: ["private-school"],
    location: { country: "guyana", city: "diamond" },
    phone: "+592-261-5027",
    website: "https://www.camillesacademy.com",
  },
  {
    id: "canadian-school-of-arts-and-science",
    name: "Canadian School of Arts & Science",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "concord-academy",
    name: "Concord Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "ebascol-education-centre",
    name: "Ebascol Education Centre",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "edenhaven",
    name: "Edenhaven",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "garden-city-academy",
    name: "Garden City Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "genesis-early-childhood-centre",
    name: "Genesis Early Childhood Centre",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "georgetown-international-academy-gia",
    name: "Georgetown International Academy (GIA)",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-225-8347",
    website: "https://giagy.com",
  },
  {
    id: "georgetown-international-learning-centre---playgroup-and-nursery",
    name: "Georgetown International Learning Centre - Playgroup and Nursery",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "global-technology-inc",
    name: "Global Technology Inc.",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "green-acres-primary-school",
    name: "Green Acres Primary School",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "green-acres-school",
    name: "Green Acres School",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-225-3583",
    website: null,
  },
  {
    id: "isa-islamic-school",
    name: "ISA Islamic School",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-226-0973",
    website: "https://isaislamicschool.com",
  },
  {
    id: "international-business-college",
    name: "International Business College",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "josel-education-institute",
    name: "Josel Education Institute",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "la-première-academy",
    name: "La Première Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "laser-edge-academic-college",
    name: "Laser Edge Academic College",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "leslyns-academy",
    name: "Leslyn's Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "maes-schools",
    name: "Mae’s Schools",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "marian-academy",
    name: "Marian Academy",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-226-9045",
    website: "https://marianacademy.edu.gy",
  },
  {
    id: "monar-educational-institute",
    name: "Monar Educational Institute",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "new-life-ministries-school",
    name: "New Life Ministries School",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "qayyim-academy",
    name: "Qayyim Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "sapodilla-school-of-excellence",
    name: "Sapodilla School of Excellence",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "school-of-brilliant-beginnings",
    name: "School of Brilliant Beginnings",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "school-of-the-nations",
    name: "School of the Nations",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-225-4516",
    website: "https://school.nations.gy",
  },
  {
    id: "standard-christian-academy",
    name: "Standard Christian Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "success-elementary-school",
    name: "Success Elementary School",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "the-business-school",
    name: "The Business School",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "the-guyana-education-trust-college",
    name: "The Guyana Education Trust College",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "the-new-guyana-school",
    name: "The New Guyana School",
    categories: ["private-school"],
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-227-2733",
    website: "https://www.newguyanaschool.com",
  },
  {
    id: "valmiki-vidyalaya",
    name: "Valmiki Vidyalaya",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
  {
    id: "xenon-academy",
    name: "Xenon Academy",
    categories: ["private-school"],
    location: { country: "guyana" },
    phone: null,
    website: null,
  },
];

const CATEGORY_MAP: Record<string, string> = {
  "private-school": "Private School",
  "nursery-school": "Nursery School",
  "secondary-school": "Secondary School",
  "pre-school": "Pre-School",
};

interface Props {
  params: Promise<{ category: string; locations: string[] }>;
}

export function generateStaticParams() {
  const paths: { category: string; locations: string[] }[] = [];

  for (const org of ORGS) {
    for (const category of org.categories) {
      const locations: string[] = [org.location.country];
      if (org.location.state) locations.push(org.location.state);
      if (org.location.city) locations.push(org.location.city);
      paths.push({ category, locations });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, locations } = await params;
  const readableCategory = CATEGORY_MAP[category] ?? category;
  const formattedLocations = locations
    .map((loc) => loc.charAt(0).toUpperCase() + loc.slice(1))
    .join(", ");
  return {
    title: `${pluralize(2, readableCategory)} in ${formattedLocations}`,
    description: `Explore ${pluralize(2, readableCategory)} located in ${formattedLocations}.`,
  };
}

function matches(org: Org, category: string, locations: string[]): boolean {
  if (!org.categories.includes(category)) return false;

  const { country, state, city } = org.location;

  if (locations.length === 1) {
    return locations[0] === country;
  }

  if (locations.length === 2) {
    return (
      locations[0] === country &&
      (state === locations[1] || city === locations[1])
    );
  }

  if (locations.length === 3) {
    return (
      locations[0] === country &&
      locations[1] === state &&
      locations[2] === city
    );
  }

  return false;
}

export default async function DirectoryCategoryPage({ params }: Props) {
  const { category, locations } = await params;
  const matching = ORGS.filter((org) => matches(org, category, locations));
  const readableCategory = CATEGORY_MAP[category] ?? category;
  const formattedLocations = locations
    .map((loc) => loc.charAt(0).toUpperCase() + loc.slice(1))
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-semibold">
          {pluralize(2, readableCategory)} in {formattedLocations}
        </h1>
        <p className="text-default-500">
          Found {matching.length} organization{matching.length !== 1 ? "s" : ""}
        </p>
      </div>

      {matching.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="mb-4 h-12 w-12 text-default-400" />
            <p className="text-lg text-default-600">No organizations found.</p>
            <p className="mt-2 max-w-md text-center text-default-500">
              We couldn't find any {readableCategory.toLowerCase()} in{" "}
              {formattedLocations}. Try expanding your search to other
              locations.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {matching.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatLocation(org: Org): string {
  const parts = [];
  if (org.location.city) parts.push(org.location.city);
  if (org.location.state) parts.push(org.location.state);
  parts.push(org.location.country);

  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ");
}

function OrganizationCard({ org }: { org: Org }) {
  return (
    <Card className="overflow-visible">
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold">{org.name}</h2>
          </div>
          <div className="flex gap-1">
            {org.categories.map((cat) => (
              <Chip key={cat} size="sm" variant="flat">
                {CATEGORY_MAP[cat] ?? cat}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-2 text-default-500">
            <MapPinIcon className="h-4 w-4" />
            <span>{formatLocation(org)}</span>
          </div>

          <div className="mt-1 flex flex-col gap-2">
            {org.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-default-500" />
                <Link href={`tel:${org.phone}`} color="foreground">
                  {org.phone}
                </Link>
              </div>
            )}

            {org.website && (
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-4 w-4 text-default-500" />
                <Link href={org.website} isExternal showAnchorIcon>
                  Visit Website
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}
