import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardHeader } from "@sovoli/ui/components/card";
import { User } from "@sovoli/ui/components/user";
import { MessageCircleIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import type { OrgInstance } from "~/modules/organisations/types";
import type { Project } from "~/modules/projects/types";
import { config } from "~/utils/config";

interface ProjectCoordinatorsProps {
  project: Project;
  orgInstance: OrgInstance;
}

export function ProjectCoordinators({
  project,
  orgInstance,
}: ProjectCoordinatorsProps) {
  const coordinatorName = "Sovoli Admin";
  const coordinatorRole = "Project Coordinator";

  return (
    <Card className="rounded-2xl shadow-sm sm:rounded-3xl">
      <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
        <h3 className="font-semibold text-lg">Coordinators</h3>
        <p className="text-sm text-muted-foreground">
          People managing this project
        </p>
      </CardHeader>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <User
            name={coordinatorName}
            description={coordinatorRole}
            avatarProps={{
              name: "SM",
              className: "bg-primary/10 text-primary font-semibold",
            }}
            classNames={{
              name: "font-semibold text-foreground",
              description: "text-xs text-muted-foreground",
            }}
          />

          <Button
            as={WhatsAppLink}
            phoneNumber={config.contact.whatsapp}
            message={`Hi Shawn, I'm inquiring about the project "${project.title}" at ${orgInstance.org.name}.`}
            size="sm"
            variant="flat"
            color="primary"
            isIconOnly
            className="rounded-full"
            event="Contact"
            eventProperties={{
              source: "project-coordinators",
              project_id: project.id,
              org_username: orgInstance.org.username,
              coordinator_name: coordinatorName,
              cta_type: "contact_coordinator",
            }}
          >
            <MessageCircleIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
