"use client";

import type { contract } from "@sovoli/api/tsr";
import type { BookCover } from "@sovoli/db/schema";
import type { z } from "zod";
import { ScrollView, View } from "react-native";
import { Box } from "@sovoli/ui/components/ui/box";
import { Button } from "@sovoli/ui/components/ui/button";
import { HStack } from "@sovoli/ui/components/ui/hstack";
import { Image } from "@sovoli/ui/components/ui/image";
import { Link } from "@sovoli/ui/components/ui/link";
// import Categories from "./categories";
import { Text } from "@sovoli/ui/components/ui/text";

type MyBooksProfile = z.infer<
  (typeof contract.getUserMyBooksProfile.responses)[200]
>;

interface Props {
  profile: MyBooksProfile;
}

export function MyBooksScreen({ profile }: Props) {
  return (
    <ScrollView className="mx-auto">
      {/* <Categories /> */}
      <Text>Hello {profile.name}</Text>
      <Text>{profile.myBooks.meta.total} books</Text>

      {profile.myBooks.data.map((book) => (
        <MyBookItem key={book.id} myBook={book} username={profile.username} />
      ))}

      <Pagination
        page={profile.myBooks.meta.page}
        pageSize={profile.myBooks.meta.pageSize}
        total={profile.myBooks.meta.total}
        baseUrl={`/${profile.username}/mybooks`}
      />
    </ScrollView>
  );
}

interface MyBookItemProps {
  username: string;
  myBook: MyBooksProfile["myBooks"]["data"][0];
}
function MyBookItem({ username, myBook }: MyBookItemProps) {
  if (!myBook.book) {
    return (
      <Text>
        id: {myBook.id}, query: {myBook.query}
      </Text>
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cover = myBook.book.cover as BookCover;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const coverUrl = cover?.medium || "https://via.placeholder.com/100";

    return (
      <HStack
        className="border-border-300 h-full items-center rounded-xl border p-3"
        space="lg"
      >
        {" "}
        <Box className="relative h-full w-40 rounded">
          <Image
            contentFit="cover"
            height={80}
            width={80}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src={coverUrl}
            alt={myBook.book.title}
          />
        </Box>
        <Link href={`/${username}/mybooks/${myBook.book.slug}`}>
          <Text className="underline">{myBook.book.title}</Text>
        </Link>
      </HStack>
    );
  }
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  baseUrl: string; // e.g., "/mybooks" or any other base URL for the pagination
}

export function Pagination({
  page,
  pageSize,
  total,
  baseUrl,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <View>
      <Text>
        Page {page} of {totalPages}
      </Text>

      {page > 1 ? (
        <Link href={`${baseUrl}${page - 1 === 1 ? "" : `?page=${page - 1}`}`}>
          <Button variant="outline">
            <Text>Previous</Text>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          <Text>Previous</Text>
        </Button>
      )}

      {page < totalPages ? (
        <Link href={`${baseUrl}?page=${page + 1}`}>
          <Button variant="outline">
            <Text>Next</Text>
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          <Text>Next</Text>
        </Button>
      )}
    </View>
  );
}
