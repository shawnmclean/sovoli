"use client";

import { ScrollView, View } from "react-native";
import { Text } from "@sovoli/ui/components/text";
import { Image } from "@sovoli/ui/components/image";
import { Button } from "@sovoli/ui/components/button";
import { BookHoverCard } from "@sovoli/ui/components/BookHoverCard";
import { Gallery } from "@sovoli/ui/components/Gallery";

import type { RouterOutputs } from "@sovoli/api/trpc";

type Shelf = NonNullable<RouterOutputs["shelf"]["bySlug"]>;

export function ShelfScreen({ shelf }: { shelf: Shelf }) {
  return (
    <ScrollView className="mx-auto">
      <Gallery images={shelf.images} />

      <View className="container mx-auto grid gap-4">
        <View className="grid gap-2">
          <Text className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            {shelf.title}
          </Text>
          <Text className="text-muted-foreground sm:text-lg">
            {shelf.description}
          </Text>
        </View>
      </View>
      <View className="grid gap-8 border-border border-t my-5 pt-5">
        <View className="grid gap-2">
          {shelf.books.map((book) => (
            <View
              key={book.isbn}
              className="flex items-start border-border border-b py-3 gap-2"
            >
              <View className="flex-row w-full justify-between gap-2">
                <View className="flex-1 flex-row gap-2">
                  <View>
                    <BookHoverCard book={book}>
                      <Image
                        src={book.image}
                        alt="Book cover"
                        width={100}
                        height={150}
                        className="aspect-[2/3] rounded-lg object-cover"
                      />
                    </BookHoverCard>
                  </View>
                  <View className="flex shrink">
                    <BookHoverCard book={book}>
                      <Text className="text-lg font-semibold">
                        {book.title}
                      </Text>
                    </BookHoverCard>
                    <Text className="text-sm leading-relaxed text-muted-foreground">
                      by {book.author}
                    </Text>
                  </View>
                </View>

                <View className="flex">
                  <Button variant="outline">
                    <Text>Save</Text>
                  </Button>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View>
                  <Text className="text-sm text-muted-foreground">
                    Recommended by {book.recommendedBy}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-muted-foreground">
                    Updated last week
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
