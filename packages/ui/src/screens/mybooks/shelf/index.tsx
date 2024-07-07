"use client";

import { ScrollView } from "react-native";
import { Text } from "@sovoli/ui/components/text";

export function ShelfScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text>List of books in shelf</Text>
    </ScrollView>
  );
}
