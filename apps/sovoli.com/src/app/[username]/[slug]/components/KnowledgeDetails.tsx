"use client";

import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Chip } from "@sovoli/ui/components/chip";
// import { Button } from "../ui/button";
import { Link } from "@sovoli/ui/components/link";
import { TimeAgo } from "@sovoli/ui/components/time-ago";

import { useKnowledge } from "../context/KnowledgeContext";
import { Connections } from "./Connections";
import { KnowledgeContent } from "./KnowledgeContent";
import { KnowledgeGallery } from "./KnowledgeGallry";
import { MainReference } from "./MainReference";
import { KnowledgeTitle } from "./title/KnowledgeTitle";

export function KnowledgeDetails() {
  const knowledge = useKnowledge();

  const mainReference = knowledge.SourceConnections?.find(
    (r) => r.type === "main_reference",
  );

  return (
    <div className="flex w-full flex-col">
      <div className="my-4">
        <KnowledgeGallery />
      </div>
      <div className="flex justify-center border-b border-divider">
        <KnowledgeTitle />
      </div>

      {/* Main Content with 2-Column Layout */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 py-6 lg:grid-cols-3">
          {/* Left Column: Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description Section */}
            <section className="w-full">
              <p className="text-gray-400">{knowledge.description}</p>
            </section>

            {/* Content Section */}
            <section className="w-full">
              {mainReference && (
                <div className="my-4">
                  <MainReference knowledgeConnection={mainReference} />
                </div>
              )}
              <KnowledgeContent knowledge={knowledge} />
            </section>
            <Connections knowledge={knowledge} />
          </div>

          {/* Right Column: User Information and Meta */}
          <div className="space-y-4">
            {/* User Information */}
            <section className="flex items-center gap-4">
              <div className="flex flex-col">
                <TimeAgo
                  datetime={knowledge.createdAt}
                  className="text-sm text-default-500"
                />
                <div className="inline-flex items-center gap-3">
                  <Link href={`/${knowledge.User?.username}`}>
                    <Badge
                      color="secondary"
                      content="1"
                      shape="circle"
                      placement="bottom-right"
                      title="Level 1 Researcher"
                    >
                      <Avatar
                        radius="sm"
                        src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
                      />
                    </Badge>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/${knowledge.User?.username}`}
                      color="foreground"
                    >
                      <span className="text-sm">{knowledge.User?.name}</span>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Chip
                        size="sm"
                        variant="dot"
                        title="2 biology, 8 psychology"
                      >
                        Mindweaver
                      </Chip>
                    </div>
                  </div>
                </div>
                <span className="text-sm">
                  Researching: Ego, Belief Systems
                </span>
              </div>
            </section>

            {/* Additional space for more information */}
            <div className="space-y-4 border-t border-divider pt-4">
              {/* Placeholder for future info */}
              <p className="text-gray-400">Type: {knowledge.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
