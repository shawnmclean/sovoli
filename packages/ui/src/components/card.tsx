"use client";

import { Text, View, Alert } from "react-native";
function Card() {
  return (
    <>
      <Text className="py-2 text-3xl font-bold text-primary">Card Title</Text>
      <Text className="py-4 text-foreground">Card Content</Text>
    </>
  );
}
Card.displayName = "Card";

export { Card };
