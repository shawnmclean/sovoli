import { notFound } from "next/navigation";
import { Card, CardBody } from "@sovoli/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";

import { GetAllWebsiteUsernamesQuery } from "~/modules/websites/services/queries/GetAllWebsiteUsernames";
import { bus } from "~/services/core/bus";

import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { ContactMethods } from "../../(tenants)/w/[username]/components/ContactMethods";
import { ApplyDialogButton } from "~/app/(directory)/components/ApplyDialogButton";
import { WhatsAppButton } from "~/components/WhatsAppButton";

const retreiveOrgInstance = async (username: string) => {
  const result = await bus.queryProcessor.execute(
    new GetOrgInstanceByUsernameQuery(username),
  );
  if (!result.orgInstance) return notFound();
  return result.orgInstance;
};

export async function generateStaticParams() {
  //TODO: change query to get all org usernames
  const result = await bus.queryProcessor.execute(
    new GetAllWebsiteUsernamesQuery(),
  );
  return result.usernames.map((username) => ({
    username,
  }));
}

export default async function OrgProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { org, academicModule } = await retreiveOrgInstance(username);

  return (
    <div className="space-y-8">
      {/* Contact Information Section */}
      <section className="flex flex-col gap-4">
        <ApplyDialogButton orgName={org.name} />
        {!org.isVerified ? (
          <WhatsAppButton
            phoneNumber="+5926082743"
            message={`Hello, I'd like to claim and edit the profile for ${org.name}.`}
          >
            Claim and Edit
          </WhatsAppButton>
        ) : null}
      </section>

      {/* Programs Section */}
      {academicModule?.programs && academicModule.programs.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="mb-6 text-2xl font-bold">Programs</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {academicModule.programs.slice(0, 4).map((program, index) => (
              <Card key={index} className="border-none" shadow="sm">
                <CardBody className="p-0">
                  <Image
                    alt={program.name}
                    src={program.image}
                    width={800}
                    height={400}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3
                      className="mb-2 text-xl font-semibold line-clamp-2"
                      title={program.title ?? program.name}
                    >
                      {program.title ?? program.name}
                    </h3>
                    <p className="text-default-600 line-clamp-3">
                      {program.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
