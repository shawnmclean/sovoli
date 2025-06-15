import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { Button } from "@sovoli/ui/components/button";
import { Link } from "@sovoli/ui/components/link";
import { GlobeIcon, MapPinIcon, PhoneIcon } from "lucide-react";

interface Org {
  id: string;
  name: string;
  location: { country: string; state?: string; city?: string };
  phone?: string | null;
  website?: string | null;
}

const SAMPLE_ORGS: Org[] = [
  {
    id: "modern-academy",
    name: "Modern Academy",
    location: {
      country: "guyana",
      city: "mon-repos",
      state: "mahaica-demerara",
    },
    phone: "+592 627-1915",
    website: "https://ma.edu.gy",
  },
  {
    id: "camilles-academy",
    name: "Camille's Academy",
    location: { country: "guyana", city: "diamond" },
    phone: "+592-261-5027",
    website: "https://www.camillesacademy.com",
  },
  {
    id: "georgetown-international-academy-gia",
    name: "Georgetown International Academy (GIA)",
    location: { country: "guyana", city: "georgetown" },
    phone: "+592-225-8347",
    website: "https://giagy.com",
  },
];

function formatLocation(org: Org): string {
  const parts = [] as string[];
  if (org.location.city) parts.push(org.location.city);
  if (org.location.state) parts.push(org.location.state);
  parts.push(org.location.country);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
}

function OrganizationCard({ org }: { org: Org }) {
  return (
    <Card className="overflow-visible">
      <CardBody>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">{org.name}</h2>
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
            <div className="flex items-center gap-2 text-default-500">
              <MapPinIcon className="h-4 w-4" />
              <span>{formatLocation(org)}</span>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold">
        Compare Guyana’s Private Schools
      </h1>
      <p className="mb-6 max-w-2xl text-default-500">
        We’re building Guyana’s most trusted school directory. View details,
        compare offerings, and soon, apply directly.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SAMPLE_ORGS.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button
          as="a"
          href="https://wa.me/5926082743"
          target="_blank"
          rel="noopener noreferrer"
          color="success"
        >
          Suggest a School
        </Button>
      </div>
    </div>
  );
}
