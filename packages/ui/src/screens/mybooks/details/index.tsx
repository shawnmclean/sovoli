"use client";

import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { ScrollView, View } from "react-native";
import { Text } from "@sovoli/ui/components/ui/text";

type MyBook = z.infer<(typeof contract.myBook.getMyBook.responses)[200]>;

interface Props {
  myBook: MyBook;
}

export default function MyBookDetailsScreen({ myBook }: Props) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View className="mx-auto max-w-6xl">
        <View className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
          <Text>{myBook.name}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
