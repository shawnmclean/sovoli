"use client";

import { ScrollView } from "react-native";
import { Text } from "../../components/text";

export function UserScreen({ username }: { username: string }) {
  return (
    <ScrollView className="mx-auto">
      <Text className="text-2xl font-bold mb-4">
        👀 User Screen: {username}
      </Text>
    </ScrollView>
  );
}
