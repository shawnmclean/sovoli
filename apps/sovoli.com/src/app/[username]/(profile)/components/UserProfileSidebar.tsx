"use client";

import Link from "next/link";
import { Badge } from "@sovoli/ui/components/badge";
import { Button } from "@sovoli/ui/components/button";
import { Chip } from "@sovoli/ui/components/chip";

import { MediaAssetAvatar } from "~/modules/mediaAssets/components/MediaAssetAvatar";
import { useUserProfile } from "../../context/UserProfileContext";

export function UserProfileSidebar() {
  const user = useUserProfile();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="p-1">
          <Badge
            placement="bottom-right"
            color="warning"
            content="1"
            shape="rectangle"
            showOutline
            title="Level 1"
          >
            <MediaAssetAvatar
              mediaAsset={user.image}
              isBordered
              color="warning"
              radius="sm"
              className="h-20 w-20 text-large"
            />
          </Badge>
        </div>
        <div className="inline-flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold leading-none">{user.name}</h1>
          <div className="flex items-center gap-1">
            <Chip size="sm" variant="dot" title="2 biology, 8 psychology">
              Mindweaver
            </Chip>
          </div>
          <span className="text-sm">Researching: Ego, Belief Systems</span>
        </div>
      </div>
      <div className="flex w-full justify-between gap-2">
        <Button color="primary" className="flex-grow">
          Observe
        </Button>
        <Button variant="ghost" className="flex-grow">
          Contact
        </Button>
        <Button isIconOnly variant="ghost" className="w-auto">
          ...
        </Button>
      </div>
      <div className="flex gap-5 text-sm">
        <Link href="/shawn/observers" color="foreground" className="gap-1">
          <span className="font-bold">0</span>
          <span className="text-gray-500">observers</span>
        </Link>
        <Link href="/shawn/observations" color="foreground" className="gap-1">
          <span className="font-bold">0</span>
          <span className="text-gray-500">observing</span>
        </Link>
      </div>
    </div>
  );
}
