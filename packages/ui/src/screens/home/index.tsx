"use client";

import { ScrollView } from "react-native";
import { AddIcon, Icon } from "@sovoli/ui/components/ui/icon";
import { Link } from "@sovoli/ui/components/ui/link";

import { Text } from "../../components/ui/text";

export function HomeScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text className="mb-4 text-2xl font-bold">
        Hello <Icon className="ml-2" size="lg" as={AddIcon} />
      </Text>
      <Link href={`/roadmap`}>
        <Text>View Roadmap</Text>
      </Link>
    </ScrollView>
  );
}
