import * as React from "react";
import { View } from "react-native";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../text";
import { Image } from "../image";

type Book = {
  title: string;
  author: string;
  isbn: string;
  recommendedBy: string;
  notes: string;
  description: string;
  image: string;
};

export function BookHoverCard({
  book,
  children,
}: {
  book: Book;
  children: React.ReactNode;
}) {
  const contentInsets = {
    left: 12,
    right: 12,
  };

  return (
    <HoverCard openDelay={0} closeDelay={10}>
      <HoverCardTrigger className="group web:focus:outline-none">
        {children}
      </HoverCardTrigger>
      <HoverCardContent insets={contentInsets} className="w-80 native:w-96">
        <View className="flex flex-row justify-between gap-4">
          <Image
            src={book.image}
            alt="Book cover"
            width={100}
            height={150}
            className="aspect-[2/3] rounded-lg object-cover"
          />
          <View className="gap-1 flex-1">
            <Text className="text-sm native:text-base font-semibold">
              {book.title}
            </Text>
            <Text className="text-sm native:text-base">
              Wishes they were part of the triangle company.
            </Text>
            <View className="flex flex-row items-center pt-2 gap-2">
              <Text className="text-xs native:text-sm text-muted-foreground">
                Fingers crossed since December 2021
              </Text>
            </View>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}
