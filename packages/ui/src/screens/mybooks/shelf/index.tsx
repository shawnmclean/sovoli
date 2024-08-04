"use client";

import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { ScrollView, View } from "react-native";
// import { BookHoverCard } from "@sovoli/ui/components/BookHoverCard";
import { Button } from "@sovoli/ui/components/button";
// import { Gallery } from "@sovoli/ui/components/Gallery";
// import { Image } from "@sovoli/ui/components/image";
import { Text } from "@sovoli/ui/components/text";

//type Shelf = NonNullable<RouterOutputs["shelf"]["bySlug"]>;
type Shelf = z.infer<(typeof contract.getShelf.responses)[200]>;

export function ShelfScreen({ shelf }: { shelf: Shelf }) {
  return (
    <ScrollView className="mx-auto">
      {/* <Gallery images={shelf.images} /> */}

      <View className="container mx-auto grid gap-4">
        <View className="grid gap-2">
          <Text className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {shelf.name}
          </Text>
          <Text className="text-muted-foreground sm:text-lg">
            {shelf.description}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {shelf.totalBooks} books
          </Text>
        </View>
      </View>
      <View className="border-border my-5 grid gap-8 border-t pt-5">
        
      </View>
    </ScrollView>
  );
}
