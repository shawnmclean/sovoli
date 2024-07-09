"use client";

import { ScrollView, View } from "react-native";
import { Text } from "@sovoli/ui/components/text";
import { Image } from "@sovoli/ui/components/image";
import { Button } from "@sovoli/ui/components/button";
import { BookHoverCard } from "@sovoli/ui/components/BookHoverCard";

export function ShelfScreen() {
  return (
    <ScrollView className="mx-auto">
      <View className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
        {/* <Image
          src="https://lh3.googleusercontent.com/pw/AP1GczMv1vU0JdhJfQRwj6c6apKAc_ZB19xCvVgspvuoWYRGQjkjR--rFI1driymF0Lm0hR-EvX9_ZRfGiydtWaFvSVzdv2HgXApdXvVTcYEe2L9_S4M_D8pMDgKhhKegONSv_IWgTTl7Yi4DYzSyncBwaRupg=w1670-h1253-s-no-gm?authuser=0"
          alt="Bookshelf banner"
          className="h-full w-full object-cover"
          width={1920}
          height={500}
        /> */}
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 px-4 py-8 sm:px-6 lg:px-8">
          <View className="container mx-auto grid gap-4">
            <View className="grid gap-2">
              <Text className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Wardrobe Bottom Left Shelf
              </Text>
              <Text className="text-muted-foreground sm:text-lg">
                The psychology and self help shelf.
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="grid gap-8 border-border border-t my-5 pt-5">
        <View className="grid gap-2">
          {bookData.map((book) => (
            <View
              key={book.isbn}
              className="flex items-start border-border border-b py-3 gap-2"
            >
              <View className="flex-row w-full justify-between gap-2">
                <View className="flex-1 flex-row gap-2">
                  <View>
                    <Image
                      src={book.image}
                      alt="Book cover"
                      width={100}
                      height={150}
                      className="aspect-[2/3] rounded-lg object-cover"
                    />
                  </View>
                  <View className="flex shrink">
                    <BookHoverCard book={book}>
                      <Text className="text-lg font-semibold">
                        {book.title}
                      </Text>
                    </BookHoverCard>
                    <Text className="text-sm leading-relaxed text-muted-foreground">
                      by {book.author}
                    </Text>
                  </View>
                </View>

                <View className="flex">
                  <Button variant="outline">
                    <Text>Save</Text>
                  </Button>
                </View>
              </View>

              <View className="flex-row gap-4">
                <View>
                  <Text className="text-sm text-muted-foreground">
                    Recommended by {book.recommendedBy}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-muted-foreground">
                    Updated last week
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const bookData = [
  {
    title:
      "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    isbn: "978-0735211292",
    recommendedBy: "Jane Doe",
    notes: "Great book for personal growth!",
    description:
      "Atomic Habits will reshape the way you think about progress and success, and give you the tools and strategies you need to transform your habits.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=lFhbDwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70iQojrj2WZikhqYf3rGo2CQLp6m8DY940NiHqo0vnoB-CUwmnOGHzX7w_InI4l3AA4zbVvjLLj6XIBNEftmnvpRe0ryc8E0qvB4HzSjENauhUVdr2jqilFPibk3h3pZUk2F5HL",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    recommendedBy: "John Smith",
    notes: "In-depth look at human thinking.",
    description:
      "Thinking, Fast and Slow offers insights into how we make choices in business and personal lives.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=pmHCuFHXKuUC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE719YlB_d45jB9er00sA5yNy2PTZlIMyyPN0VbU6VJACDgO1GdB9hYH18TY6VfE7rfdsifGJknSY0yBNEvzmFd15ADtUJ-ZMOAH5IexNCayZR5BzBI8FeUvoNDm6_mRo_wNqQcdq",
  },
  {
    title: "Predictably Irrational",
    author: "Dan Ariely",
    isbn: "978-0061353246",
    recommendedBy: "Sarah Johnson",
    notes: "A must-read for understanding irrational behavior.",
    description:
      "Predictably Irrational explores the hidden forces that shape our decisions.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=v8MVEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70kU11MR5BzS4Bx5MztM9t4US_ykuyEBcfyy-JoEM2JFTGkR2ZTeR3IE4_Btw2WoaQOaS19vSo8gqxR5mxOHd0O0mZTTN44yI4xFx8U_zLFgC0Iz3Cq72ROFX45K4ff3uNEvVu0",
  },
  {
    title: "Man and His Symbols",
    author: "Carl G. Jung",
    isbn: "978-0440351832",
    recommendedBy: "Michael Brown",
    notes: "Essential Jungian psychology.",
    description:
      "Man and His Symbols is Jung's last work, focusing on the importance of symbols in human life.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=BbbNB2H4yngC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70tZzR_g3lPt-A7UPurEKc3K2t2tW9SK3edx17NcaPxBBRSsOnCTkmn12uwj_Y_7VgnDbJ50FiVG_TTndI8XP3Naq0OgDZvNn0kPpsymjf2gqaQhEsR7nBGMSdtx2e69HET8XgD",
  },
  {
    title: "The Interpretation of Dreams",
    author: "Sigmund Freud",
    isbn: "978-0465019779",
    recommendedBy: "Emily Davis",
    notes: "Classic text in psychoanalysis.",
    description:
      "The Interpretation of Dreams introduces Freud's theory of the unconscious with respect to dream interpretation.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=mEUPDAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70ckLPSvH0at5gD-g7jU_HM3vAUIJ5DErf3ZDp-NJ1x2NUIE7U1pAMF1EKP9nzhmdglNjXv4A-v0v6OcE1xg5HhbZpv9T8QhTgUn5AOQah91CxnciTgDzizbcmQsMGgJKFv8vH4",
  },
  {
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    isbn: "978-1878424310",
    recommendedBy: "Olivia Martinez",
    notes: "Life-changing wisdom.",
    description:
      "The Four Agreements offers a powerful code of conduct that can transform our lives to a new experience of freedom.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=1c6bAAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72Sx9E8mRGMYB4szdZ5ZUJUXrNVrd_PCKOt0nMxrngF_Ftl6kzH4o8NB9gQ4yhbSbw4S-GXIVkB6D1NrBQ8O0MEy2KtFktR_h9mpyDHjSAKq8MxNCBPdlBQp_DRe1Ic4Hlq3PKCc",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    isbn: "978-0143127741",
    recommendedBy: "William Taylor",
    notes: "Important for understanding trauma.",
    description:
      "The Body Keeps the Score explains how trauma reshapes the body and brain and offers new paths to recovery.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=nfYwCgAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE736Vo6Z2_1s8PTQ2U9SndCEOpHFN89ZT2yBCIbyDGttU1T7ozmV5MynFTaEG_N13JoWa4_y9MTlm3WCI_0XhXNzR-ZZ_UFbyAoEvazfXK4Q2LOVZcNybjEh2yUs2LP9UJ8PKDlz",
  },
  {
    title: "Emotional Intelligence",
    author: "Daniel Goleman",
    isbn: "978-0553383713",
    recommendedBy: "Sophia Lee",
    notes: "Must-read for personal and professional growth.",
    description:
      "Emotional Intelligence explains why EQ may be more important than IQ for success in life and how you can develop your own.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=a2AUCgAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73oLk2ITnRWB8eA35f5SCXb45HcOg5ZTFnsKQgX3IkF9dYYlDf_-eq5UMOcT9TX9PHGiYx5LXNLWL_TDeT14H7OBD-O1irKYMCqVO6Q5AfBfUaiW2WztkxFlKT0FYUqgYPdfZmW",
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    isbn: "978-0807014271",
    recommendedBy: "Henry Moore",
    notes: "Profound and inspiring.",
    description:
      "Man's Search for Meaning is a powerful testament to the human spirit, showing how we can find meaning even in the most challenging circumstances.",
    image:
      "https://books.google.com.jm/books/publisher/content?id=8rLAzgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73rIkc4kISJDSCuGgf-c3XZpP7YFzIjk_AH2AD6ncf-Du8Ej8l_rHvRR1BuzGlkbApEolP-OVj2uTwQa_jrniD7UzIkP-1zhhRYirMxrVJwJJ4Xc6ccNqyx93PPtmUOqXYIm84q",
  },
];
