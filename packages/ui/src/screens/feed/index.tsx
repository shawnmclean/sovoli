"use client";

import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { ScrollView } from "react-native";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Box } from "@sovoli/ui/components/ui/box";
import { Heading } from "@sovoli/ui/components/ui/heading";
import { HStack } from "@sovoli/ui/components/ui/hstack";
import { Image } from "@sovoli/ui/components/ui/image";
import { Link } from "@sovoli/ui/components/ui/link";
import { TimeAgo } from "@sovoli/ui/components/ui/time-ago";
import { VStack } from "@sovoli/ui/components/ui/vstack";
import { isWeb } from "@sovoli/ui/lib/utils";

import { Text } from "../../components/ui/text";

export interface FeedScreenProps {
  knowledges: SelectKnowledgeSchema[];
}

export function FeedScreen({ knowledges }: FeedScreenProps) {
  return (
    <VStack
      className="mb-20 h-full w-full max-w-[1500px] self-center p-4 pb-0 md:mb-2 md:px-10 md:pb-0 md:pt-6"
      space="2xl"
    >
      <Heading size="2xl" className="font-roboto">
        What's new?
      </Heading>

      <HStack space="2xl" className="h-full w-full flex-1">
        <ScrollView
          className="max-w-[900px] flex-1 md:mb-2"
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="w-full" space="2xl">
            {knowledges.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={`${item.User?.username}/${item.slug ?? item.id}`}
                >
                  <VStack className="border-border-300 rounded-xl border p-5">
                    <Box className="h-64 w-full rounded">
                      <KnowledgeImage knowledge={item} />
                    </Box>
                    <VStack className="mt-4" space="md">
                      <Text className="text-sm">
                        <TimeAgo
                          datetime={item.createdAt}
                          className="text-typography-500"
                        />
                      </Text>
                      <Heading size="md">{item.title}</Heading>
                      <Text className="line-clamp-2">{item.description}</Text>
                    </VStack>
                  </VStack>
                </Link>
              );
            })}
          </VStack>
        </ScrollView>
      </HStack>
    </VStack>
  );
}

function KnowledgeImage({ knowledge }: { knowledge: SelectKnowledgeSchema }) {
  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  if (images?.[0]) {
    return <Image src={images[0].src} alt={images[0].alt} fill />;
  }
}
