"use client";

import { View, Image, ScrollView } from "react-native";
import { Text } from "@sovoli/ui/components/text";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sovoli/ui/components/card";

export default function MyBookDetailsScreen() {
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
            <Text className="text-2xl font-bold mt-4">The Alchemist</Text>
            <Text className="text-muted-foreground">by Paulo Coelho</Text>
          </View>
          <View className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>My Thoughts</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-muted-foreground mt-2">
                  I first read The Alchemist a few years ago and it has become
                  one of my all-time favorite books. The story of Santiago's
                  journey to find his personal legend is both inspiring and
                  thought-provoking. Coelho's writing is beautiful and poetic,
                  and the book is full of profound insights about life, dreams,
                  and following your heart.
                </Text>
                <Text className="text-muted-foreground mt-4">
                  One of the things I love most about this book is how it
                  encourages the reader to embrace the unknown and trust the
                  journey. Santiago's willingness to take risks and face his
                  fears is something I aspire to in my own life. The book has
                  also helped me to appreciate the importance of being present
                  and paying attention to the signs and omens that the universe
                  sends our way.
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
                  The Alchemist follows the journey of a young shepherd named
                  Santiago who travels from his home in Spain to the Egyptian
                  desert in search of a treasure buried near the Pyramids. Along
                  the way, he meets a Gypsy woman, a man who calls himself king,
                  and an alchemist, all of whom point Santiago in the direction
                  of his quest. No one knows what the treasure is, or if
                  Santiago will be able to surmount the obstacles in his path.
                  But what starts out as a journey to find worldly goods turns
                  into a discovery of the treasures found within.
                </Text>
                <Text className="text-muted-foreground mt-4">
                  The Alchemist is a transformative novel about the essential
                  wisdom of listening to our hearts, recognizing opportunity,
                  and following our dreams. It is a story about the journey of
                  self-discovery and the profound lessons we can learn from the
                  world around us.
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
                    <Text className="font-bold">Paulo Coelho</Text>
                    <Text className="text-muted-foreground">
                      Paulo Coelho is a Brazilian lyricist and novelist. He is
                      best known for his novel The Alchemist.
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
