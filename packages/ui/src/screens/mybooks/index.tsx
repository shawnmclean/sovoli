"use client";

import { ScrollView } from "react-native";
import Categories from "./categories";
import { Link } from "solito/link";
import { Text } from "@sovoli/ui/components/text";
import type { contract } from "@sovoli/api/tsr";
import type { z } from "zod";


type MyBooksProfile = z.infer<(typeof contract.getUserMyBooksProfile.responses)[200]>;

export function MyBooksScreen(profile: MyBooksProfile) {
  return (
    <ScrollView className="mx-auto">
      <Categories />
      <Text>Hello {profile.name}</Text>
      {/* <Text>{profile.myBooks.data.length} books</Text> */}
      
      {/* {profile.myBooks.data.map((book) => (
        <Text>{book.id}</Text>
      ))} */}
    </ScrollView>
  );
}


function MyBookItem(myBook: MyBooksProfile["myBooks"]["data"][0]) {
  return (
    <Link href={`/johndoe/books/${myBook.slug}`}>
      <Text className="underline">{myBook.title}</Text>
    </Link>
  );
}