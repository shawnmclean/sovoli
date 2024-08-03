"use client";

import type { contract } from "@sovoli/api/rest";
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
        </View>
      </View>
      <View className="border-border my-5 grid gap-8 border-t pt-5">
        <View className="grid gap-2">
          {shelf.books?.map(
            (myBook) =>
              myBook.book && (
                <View
                  key={myBook.id}
                  className="border-border flex items-start gap-2 border-b py-3"
                >
                  <View className="w-full flex-row justify-between gap-2">
                    <View className="flex-1 flex-row gap-2">
                      <View>
                        {/* <BookHoverCard book={myBook.book}>
                          <Image
                            src={book.image}
                            alt="Book cover"
                            width={100}
                            height={150}
                            className="aspect-[2/3] rounded-lg object-cover"
                          />
                        </BookHoverCard> */}
                      </View>
                      <View className="flex shrink">
                        {/* <BookHoverCard book={book}>*/}
                        <Text className="text-lg font-semibold">
                          {myBook.book.title}
                        </Text>
                        {/* </BookHoverCard>  */}
                        <Text className="text-muted-foreground text-sm leading-relaxed">
                          by {myBook.book.publisher}
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
                      <Text className="text-muted-foreground text-sm">
                        Recommended by
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted-foreground text-sm">
                        Updated last week
                      </Text>
                    </View>
                  </View>
                </View>
              ),
          )}
        </View>
      </View>
    </ScrollView>
  );
}
