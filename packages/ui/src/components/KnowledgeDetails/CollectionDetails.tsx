import type {
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { View } from "react-native";

import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Image } from "../ui/image";
import { Link } from "../ui/link";
import { ScrollView } from "../ui/scroll-view";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function CollectionDetails({ knowledge }: Props) {
  return (
    <View>
      <VStack>
        <ScrollView showsVerticalScrollIndicator={false} className="gap-7">
          <VStack space="lg">
            <Heading size="lg">Collections</Heading>
            <VStack className="h-full" space="md">
              {knowledge.Connections.map((connection, index) => {
                return <ConnectionItem item={connection} key={index} />;
              })}
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </View>
  );
}

interface ConnectionItemProps {
  item: SelectKnowledgeConnectionSchema;
}
function ConnectionItem({ item }: ConnectionItemProps) {
  const knowledge = item.TargetKnowledge;
  if (!knowledge) {
    return <View>No target knowledge</View>;
  }
  const owner = knowledge.User;
  if (!owner) {
    return <View>No owner</View>;
  }
  return (
    <Link href={`/${owner.username}/${knowledge.slug}`}>
      <HStack
        className="border-border-300 h-full items-center rounded-xl border p-3"
        space="lg"
      >
        <Box className="relative h-full w-40 rounded">
          <KnowledgeImage knowledge={knowledge} />
        </Box>
        <VStack className="h-full justify-between" space="md">
          <Text className="text-sm">{knowledge.type}</Text>
          <Heading size="md">{knowledge.title}</Heading>
          <Text className="line-clamp-2">{knowledge.description}</Text>
          {knowledge.Book && (
            <Text className="text-sm text-typography-500">
              by {knowledge.Book.inferredAuthor}
            </Text>
          )}
        </VStack>
      </HStack>
    </Link>
  );
}
interface KnowledgeImageProps {
  knowledge: SelectKnowledgeSchema;
}
function KnowledgeImage({ knowledge }: KnowledgeImageProps) {
  // prioritize the first media asset.
  // if there is no media asset, check if the knowledge has a book, then use the book cover

  // use book for now
  const book = knowledge.Book;
  if (!book) {
    return null;
  }

  const bookCover = book.cover;
  if (!bookCover) {
    return null;
  }

  return (
    <Box className="relative h-full w-40 rounded">
      <Image
        src={book.cover?.medium ?? ""}
        alt={book.title}
        fill
        className="h-full w-full"
      />
    </Box>
  );
}
