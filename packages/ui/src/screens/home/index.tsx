"use client";

import { ScrollView } from "react-native";

// import { Link } from "@sovoli/ui/components/ui/link";

import { Text } from "../../components/ui/text";

export function HomeScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text className="mb-4 text-2xl font-bold">The Knowledge Platform</Text>
      {/* <Link href="https://chatgpt.com/g/g-IO9cjdNK5-bookshelf-library-manager">
        <Text>ChatGPT Plugin</Text>
      </Link> */}
    </ScrollView>
  );
}
