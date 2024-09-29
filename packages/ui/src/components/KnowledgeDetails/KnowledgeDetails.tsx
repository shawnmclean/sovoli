import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { View } from "react-native";
import { KnowledgeType, MediaAssetHost } from "@sovoli/db/schema";
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
import BookDetails from "./BookDetails";
import CollectionDetails from "./CollectionDetails";
import NoteDetails from "./NoteDetails";

interface Props {
  knowledge: SelectKnowledgeSchema;
}
export default function KnowledgeDetails({ knowledge }: Props) {
  const images = knowledge.MediaAssets.map((mediaAsset) => {
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
      <Heading size="2xl" className="font-roboto">
        {knowledge.title}
      </Heading>
      <View className="my-2">
        {images.length > 0 && <Gallery images={images} />}
      </View>
      <KnowledgeComponentSwitcher knowledge={knowledge} />
      <Divider />
      <View>
        <Text>{knowledge.createdAt.toString()}</Text>
      </View>
      <Divider />

      <Accordion
        size="md"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        className="m-5 w-[90%] border border-outline-200"
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
  switch (knowledge.type) {
    case KnowledgeType.Book:
      return <BookDetails knowledge={knowledge} />;
    case KnowledgeType.Collection:
      return <CollectionDetails knowledge={knowledge} />;
    case KnowledgeType.Note:
      return <NoteDetails knowledge={knowledge} />;
  }
}
