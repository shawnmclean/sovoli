"use client";

import { View, Image, ScrollView } from "react-native";
import { Text } from "@sovoli/ui/components/text";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sovoli/ui/components/card";
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
          <View className="flex flex-col items-center">
            <Image
              source={{ uri: "/placeholder.svg" }}
              style={{
                width: 300,
                height: 450,
                borderRadius: 8,
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
              }}
            />
            <Text className="text-2xl font-bold mt-4">{myBook.book?.title}</Text>
            <Text className="text-muted-foreground">by {myBook.book?.inferredAuthor}</Text>
          </View>
          <View className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>My Thoughts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-muted-foreground mt-2">
                  Lorem Ipsum 
                </Text>
                <Text className="text-muted-foreground mt-4">
                  Sit Delores
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>My Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <Image
                    source={{ uri: "/placeholder.svg" }}
                    style={{
                      width: 200,
                      height: 150,
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.3,
                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                    }}
                  />
                  <Image
                    source={{ uri: "/placeholder.svg" }}
                    style={{
                      width: 200,
                      height: 150,
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.3,
                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                    }}
                  />
                  <Image
                    source={{ uri: "/placeholder.svg" }}
                    style={{
                      width: 200,
                      height: 150,
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOpacity: 0.3,
                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                    }}
                  />
                </View>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Book Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-muted-foreground mt-2">
                  {myBook.book?.description}
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="flex flex-row items-center gap-4 mt-4">
                  <Image
                    source={{ uri: "/placeholder.svg" }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                  <View>
                    <Text className="font-bold">{myBook.book?.inferredAuthor}</Text>
                    <Text className="text-muted-foreground">
                      {myBook.book?.authors && "No authors found"}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
