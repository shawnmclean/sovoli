"use client";

import { ScrollView } from "react-native";
import Categories from "./categories";
import { Text } from "@sovoli/ui/components/text";
import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";
import { Link } from "@sovoli/ui/components/link";

type MyBooksProfile = z.infer<(typeof contract.getUserMyBooksProfile.responses)[200]>;

interface Props {
  profile: MyBooksProfile;
}

export function MyBooksScreen({ profile }: Props) {
  return (
    <ScrollView className="mx-auto">
      <Categories />
      <Text>Hello {profile.name}</Text>
      {/* <Text>{profile.myBooks.data.length} books</Text> */}
      
      {profile.myBooks.data.map((book) => (
        <MyBookItem key={book.id} myBook={book} />
      ))}
    </ScrollView>
  );
}

interface MyBookItemProps {
  myBook: MyBooksProfile["myBooks"]["data"][0];
}
function MyBookItem({myBook}: MyBookItemProps) {

  if(!myBook.book) {
    return <Text>id: {myBook.id}, query: {myBook.query}</Text>
  } else {
  return (
    <Link href={`/johndoe/mybooks/${myBook.book.slug}`}>
      <Text className="underline">{myBook.book.title}</Text>
    </Link>
  );}
}