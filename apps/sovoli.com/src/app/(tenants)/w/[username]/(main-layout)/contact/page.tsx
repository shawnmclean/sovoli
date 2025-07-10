import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";

import { ContactMethods } from "../components/ContactMethods";
import { getOrgInstanceByUsername } from "../lib/getOrgInstanceByUsername";

const retrieveOrgInstance = async (username: string) => {
  const result = await getOrgInstanceByUsername(username);
  if (!result) return notFound();
  return result;
};

interface ContactUsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ContactUsPage({ params }: ContactUsPageProps) {
  const { username } = await params;
  const orgInstance = await retrieveOrgInstance(username);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-3xl font-bold">Contact Us</h2>
        {orgInstance.org.locations.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {orgInstance.org.locations.map((location, index) => (
              <Card key={location.key} className="p-6">
                <CardBody>
                  <h3 className="mb-4 text-xl font-semibold">
                    {location.label ?? `Location ${index + 1}`}
                  </h3>
                  <ContactMethods location={location} />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-default-600">
            No contact information available.
          </p>
        )}
      </div>
    </section>
  );
}
