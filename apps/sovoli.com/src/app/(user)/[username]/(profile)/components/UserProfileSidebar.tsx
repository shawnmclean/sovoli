import type { SelectUserSchema } from "@sovoli/db/schema";
import Link from "next/link";
import { Avatar } from "@sovoli/ui/components/ui/avatar";
import { Badge } from "@sovoli/ui/components/ui/badge";
import { Button } from "@sovoli/ui/components/ui/button";

export interface UserProfileSidebarProps {
  user: SelectUserSchema;
}

export function UserProfileSidebar({ user }: UserProfileSidebarProps) {
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
            <Avatar
              isBordered
              color="warning"
              radius="sm"
              className="h-20 w-20 text-large"
              src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp"
            />
          </Badge>
        </div>
        <div className="inline-flex flex-col items-start">
          <h1 className="text-2xl font-bold leading-none">{user.name}</h1>
          <p className="text-sm text-gray-400">{user.username}</p>
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
