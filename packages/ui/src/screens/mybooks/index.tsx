"use client";

import { ScrollView,  View } from "react-native";
// import Categories from "./categories";
import { Text } from "@sovoli/ui/components/text";
import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { Link } from "@sovoli/ui/components/link";
import { Button } from "@sovoli/ui/components/button";

type MyBooksProfile = z.infer<(typeof contract.getUserMyBooksProfile.responses)[200]>;

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
function MyBookItem({username,myBook}: MyBookItemProps) {

  if(!myBook.book) {
    return <Text>id: {myBook.id}, query: {myBook.query}</Text>
  } else {
  return (
    <Link href={`/${username}/mybooks/${myBook.book.slug}`}>
      <Text className="underline">{myBook.book.title}</Text>
    </Link>
  );}
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  baseUrl: string; // e.g., "/mybooks" or any other base URL for the pagination
}

export function Pagination({  page, pageSize, total, baseUrl }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <View>
      <Text>Page {page} of {totalPages}</Text>

      {page > 1 ? (
        <Link href={`${baseUrl}?page=${page - 1}`}>
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