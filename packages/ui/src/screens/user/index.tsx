"use client";

import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { Link } from "@sovoli/ui/components/ui/link";


type Profile = z.infer<
  (typeof contract.users.getUserMyBooksProfile.responses)[200]
>;

interface Props {
  profile: Profile;
}

export function UserScreen({ profile }: Props) {
  return (
    <div className="mx-auto">
      <h1 className="mb-4 text-2xl font-bold">
        👀 User Screen: {profile.name}
      </h1>
      <Link href={`/${profile.username}/collections`}>
        My Collections
      </Link>
    </div>
  );
}
