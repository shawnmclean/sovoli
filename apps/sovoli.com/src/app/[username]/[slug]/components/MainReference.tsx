import type { KnowledgeConnection } from "@sovoli/db/schema";
import NextImage from "next/image";
import { Avatar } from "@sovoli/ui/components/ui/avatar";
import { Button } from "@sovoli/ui/components/ui/button";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/ui/card";
import { Chip } from "@sovoli/ui/components/ui/chip";
import { Image } from "@sovoli/ui/components/ui/image";

import supabaseLoader from "~/loaders/supabaseImageLoader";

export interface MainReferenceProps {
  knowledgeConnection: KnowledgeConnection;
}

export function MainReference({ knowledgeConnection }: MainReferenceProps) {
  // TODO: Different views for different knowledge types
  switch (knowledgeConnection.TargetKnowledge?.type) {
    case "book":
      return <BookReference knowledgeConnection={knowledgeConnection} />;
    case "note":
      return <NoteReference knowledgeConnection={knowledgeConnection} />;
    default:
      return null;
  }
}

function BookReference({ knowledgeConnection }: MainReferenceProps) {
  const book = knowledgeConnection.TargetKnowledge?.Book;
  const authors = book?.authors as unknown as string[];

  if (!book) return null;

  return (
    <Card className="border border-default-200">
      <CardBody className="flex flex-row gap-4">
        <Image
          alt={book.title}
          src={book.image ?? ""}
          className="object-cover"
          width={120}
          height={120}
          as={NextImage}
          loader={supabaseLoader}
        />
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-medium">{book.title}</h1>
            <p className="text-sm text-foreground/80">
              By {authors.join(", ")}
            </p>
          </div>
          <div className="inline-flex">
            <Chip
              size="sm"
              variant="faded"
              title="This note is a main reference to this book"
            >
              i
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function NoteReference({ knowledgeConnection }: MainReferenceProps) {
  return (
    <Card
      isFooterBlurred
      className="col-span-12 h-[300px] w-full border border-default-200 sm:col-span-7"
    >
      <CardHeader className="justify-between">
        <div className="flex gap-4">
          <Avatar
            radius="sm"
            size="sm"
            src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button size="sm">...</Button>
      </CardHeader>
      <Image
        alt="Relaxing app background"
        src="https://nextui.org/images/card-example-5.jpeg"
        style={{ width: "100%", height: "auto" }}
        className="z-0 h-full w-full object-cover"
        width={16}
        height={9}
        as={NextImage}
        loader={supabaseLoader}
      />
      <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40 dark:border-default-100">
        <div className="flex flex-grow items-center gap-2">
          <Avatar
            size="sm"
            src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
          />
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">
              {knowledgeConnection.TargetKnowledge?.title}
            </p>
            <p className="text-tiny text-white/60">Get a good night's sleep.</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
