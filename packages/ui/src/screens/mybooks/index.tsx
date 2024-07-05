"use client";

import { ScrollView } from "react-native";
import Categories from "./categories";

export function MyBooksScreen() {
  return (
    <ScrollView className="mx-auto">
      <Categories />
    </ScrollView>
  );
}
