"use client";

import { ScrollView } from "react-native";
import { Text } from "../../components/text";

import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { Link } from "@sovoli/ui/components/link";

type Profile = z.infer<(typeof contract.getUser.responses)[200]>;

interface Props {
  profile: Profile;
}

export function UserScreen({ profile }: Props) {
  return (
    <ScrollView className="mx-auto">
      <Text className="text-2xl font-bold mb-4">
        👀 User Screen: {profile.name}
      </Text>
      <Link href={`/${profile.username}/mybooks`}>
        <Text>My Books</Text>
      </Link>
    </ScrollView>
  );
}
