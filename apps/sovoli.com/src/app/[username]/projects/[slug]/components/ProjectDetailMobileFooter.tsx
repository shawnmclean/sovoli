"use client";

import { Button } from "@sovoli/ui/components/button";
import { gradientBorderButton } from "~/components/GradientBorderButton";
import type { Project } from "~/modules/projects/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { MessageSquareShareIcon } from "lucide-react";
import { WhatsAppLink } from "~/components/WhatsAppLink";
import { config } from "~/utils/config";

export interface ProjectDetailMobileFooterProps {
  orgInstance: OrgInstance;
  project: Project;
  username: string;
}

export function ProjectDetailMobileFooter({
  orgInstance,
  project,
  username,
}: ProjectDetailMobileFooterProps) {
  const whatsappMessage = `Hi Sovoli team, I'd like to pledge supplies for ${project.title} at ${orgInstance.org.name}.`;

  return (
    <footer className="fixed left-0 right-0 bg-background border-t border-divider shadow-lg pb-safe-area-inset-bottom px-4 md:hidden z-40 [bottom:max(0px,calc(100dvh-100vh))]">
      <div className="flex w-full items-center justify-between py-3 gap-4">
        <div className="flex flex-1 items-center min-w-0">
          <p className="text-sm font-medium text-foreground truncate"></p>
        </div>
        <div className="shrink-0">
          <Button
            as={WhatsAppLink}
            phoneNumber={config.contact.whatsapp}
            message={whatsappMessage}
            variant="shadow"
            color="primary"
            radius="lg"
            size="md"
            startContent={<MessageSquareShareIcon size={16} />}
            className={gradientBorderButton()}
            event="Contact"
            eventProperties={{
              source: "project-details-mobile-footer",
              project_id: project.id,
              org_username: username,
              cta_type: "contribute",
            }}
          >
            Contribute
          </Button>
        </div>
      </div>
    </footer>
  );
}
