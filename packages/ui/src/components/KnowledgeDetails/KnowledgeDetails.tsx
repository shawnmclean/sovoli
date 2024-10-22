import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { View } from "react-native";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Gallery } from "@sovoli/ui/components/Gallery";

import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "../ui/accordion";
import { Divider } from "../ui/divider";
import { Heading } from "../ui/heading";
import { ChevronDownIcon, ChevronUpIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { TimeAgo } from "../ui/time-ago";
// import BookDetails from "./BookDetails";
import { CollectionDetails } from "./CollectionDetails";
import { KnowledgeContent } from "./KnowledgeContent";

// import NoteDetails from "./NoteDetails";=
interface Props {
  knowledge: SelectKnowledgeSchema;
}
export function KnowledgeDetails({ knowledge }: Props) {
  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  return (
    <>
      <Heading size="3xl" className="font-roboto">
        {knowledge.title}
      </Heading>
      <View className="my-2">
        {images && images.length > 0 && <Gallery images={images} />}
      </View>
      <View>
        <Text>{knowledge.description}</Text>
      </View>
      <Divider />
      <View>
        <TimeAgo
          datetime={knowledge.createdAt}
          className="text-typography-500"
        />
      </View>
      <Divider />

      <View>
        <KnowledgeContent knowledge={knowledge} />
      </View>

      <KnowledgeComponentSwitcher knowledge={knowledge} />

      <Accordion
        size="md"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        className="border border-outline-200"
      >
        <AccordionItem value="a">
          <AccordionHeader>
            <AccordionTrigger>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText>
                      Open at your own risk
                    </AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                    )}
                  </>
                );
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <AccordionContentText>
              <pre>{JSON.stringify(knowledge, null, 2)}</pre>
            </AccordionContentText>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function KnowledgeComponentSwitcher({ knowledge }: Props) {
  // switch (knowledge.type) {
  //   case KnowledgeType.Book:
  //     return <BookDetails knowledge={knowledge} />;
  //   case KnowledgeType.Collection:
  return <CollectionDetails knowledge={knowledge} />;
  // case KnowledgeType.Note:
  //   return <NoteDetails knowledge={knowledge} />;
  // }
}
