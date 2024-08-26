"use client";

import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { ScrollView } from "react-native";
import { Link } from "@sovoli/ui/components/ui/link";

import { Text } from "../../components/ui/text";

type Profile = z.infer<(typeof contract.getUserMyBooksProfile.responses)[200]>;

interface Props {
  profile: Profile;
}

export function UserScreen({ profile }: Props) {
  return (
    <ScrollView className="mx-auto">
      <Text className="mb-4 text-2xl font-bold">
        👀 User Screen: {profile.name}
      </Text>
      <Link href={`/${profile.username}/mybooks`}>
        <Text>My Books</Text>
      </Link>
    </ScrollView>
  );
}
