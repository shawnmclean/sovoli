import * as React from "react";
import { View } from "react-native";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import { Image } from "../image";
import { Text } from "../text";

interface Book {
  title: string;
  author: string;
  isbn: string;
  recommendedBy: string;
  notes: string;
  description: string;
  image: string;
}

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

  // 10 ms close delay so we can have time to move the cursor into the card and interact with it.
  return (
    <HoverCard openDelay={100} closeDelay={10}>
      <HoverCardTrigger className="group web:focus:outline-none">
        {children}
      </HoverCardTrigger>
      <HoverCardContent insets={contentInsets} className="native:w-96 w-80">
        <View className="flex flex-row justify-between gap-4">
          <Image
            src={book.image}
            alt="Book cover"
            width={100}
            height={150}
            className="aspect-[2/3] rounded-lg object-cover"
          />
          <View className="flex-1 gap-1">
            <Text className="native:text-base text-sm font-semibold">
              {book.title}
            </Text>
            <Text className="native:text-base text-sm">
              Wishes they were part of the triangle company.
            </Text>
            <View className="flex flex-row items-center gap-2 pt-2">
              <Text className="native:text-sm text-muted-foreground text-xs">
                Fingers crossed since December 2021
              </Text>
            </View>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}
