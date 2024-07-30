"use client";

import { ScrollView } from "react-native";
import Categories from "./categories";
import { Link } from "solito/link";
import { Text } from "@sovoli/ui/components/text";

export function MyBooksScreen() {
  return (
    <ScrollView className="mx-auto">
      <Categories />

      <Link href="/johndoe/books/going-somewhere-andrew-marino">
        <Text className="underline">My Book Details</Text>
      </Link>
    </ScrollView>
  );
}
