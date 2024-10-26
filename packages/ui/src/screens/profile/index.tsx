"use client";

import { Avatar } from "../../components/ui/avatar";
import {Badge} from "../../components/ui/badge";



export function ProfileScreen() {
  return (
    <div className="mx-auto p-5">
        <Badge placement="bottom-right" color="warning" content="1" shape="rectangle" showOutline title="Level 1">
        <Avatar isBordered color="warning" radius="sm" className="w-20 h-20 text-large" src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z" />
        </Badge>
    </div>
  );
}
