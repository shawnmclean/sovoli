"use client";

import { ScrollView } from "react-native";
import { Text } from "../../components/ui/text";

import { Link } from "@sovoli/ui/components/ui/link";

export function HomeScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text className="text-2xl font-bold mb-4">
        Hello
      </Text>
      <Link href={`/roadmap`}>
        <Text>View Roadmap</Text>
      </Link>
    </ScrollView>
  );
}
