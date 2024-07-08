"use client";
import { View } from "react-native";
import { Text } from "@sovoli/ui/components/text";

export default function Component() {
  return (
    <View className="m-2 p-4 border-border border-b-2 border-dashed">
      <Text>Should have a border with padding</Text>
    </View>
  );
}
