"use client";

import { View, ScrollView } from "react-native";
import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";

type MyBook = z.infer<(typeof contract.getMyBook.responses)[200]>;

interface Props {
  myBook: MyBook;
}

export default function MyBookDetailsScreen({ myBook }: Props) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View className="max-w-6xl mx-auto">
        <View className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {myBook.name}
        </View>
      </View>
    </ScrollView>
  );
}
