"use client";

import { Linking, ScrollView, View } from "react-native";
import { Button, ButtonText } from "@sovoli/ui/components/ui/button";
import { Image } from "@sovoli/ui/components/ui/image";
import { Link } from "@sovoli/ui/components/ui/link";
import { Text } from "@sovoli/ui/components/ui/text";
import { ThemeToggle } from "@sovoli/ui/components/ThemeToggle/ThemeToggle";
import { Icon, AddIcon } from "@sovoli/ui/components/ui/icon";

import RNButtons from "./rn-buttons";

export function RoadmapScreen() {
  return (
    <ScrollView>
      <Text className="mb-4 text-2xl font-bold">
        Sovoli: Connecting Ideas, Advancing Knowledge
        <Icon className="ml-2" size="lg" as={AddIcon} />
      </Text>

      <Text className="mb-8">
        Our mission is to advance interconnected knowledge and holistic
        understanding of our world.
      </Text>

      <Text className="mb-8">
        We aim to empower individuals to think better by making it easier to
        conduct meaningful research, share insights, and contribute to the
        progress of society.
      </Text>

      <Text className="mb-8">
        This is a very early stage project, and we are still in the process of
        building out the core features. This front-page will be updated as we
        progress.
      </Text>

      <Text className="mb-4 text-2xl font-bold">Roadmap</Text>

      <Link href="/johndoe">
        <Text className="underline">My Profile</Text>
      </Link>

      <Section title="☁️ Infra">
        <List>
          <ListItem text="✅ DNS" />
          <ListItem text="✅ Status Page" />
          <ListItem text="✅ Analytics" />
          <ListItem text="✅ Perf Monitor" />
          <ListItem text="🕛 Logging" />
          <ListItem text="🕛 Metrics" />
        </List>
      </Section>

      <Section title="🎨 Design System">
        <List>
          <ListItem text="🚩 RN Reusables: (fix style errors)">
            <RNButtons />
          </ListItem>
          <ListItem text="🚩 SSR RN TW: (Wait on NativeWind fixup)" />
          <ListItem text="✅ Share screen in Expo and Next" />
          <ListItem text="✅ Share TW Config" />
          <ListItem text="✅ Dark Mode Toggle" />
        </List>
      </Section>

      <Section title="📱 Expo">
        <List>
          <ListItem text="✅ Build" />
          <ListItem text="✅ Publish Preview to Expo Go via Github Action" />
          <ListItem text="✅ Show QR Code here">
            <View className="flex-row">
              <Image
                alt="Expo Go QR Code"
                height={200}
                width={200}
                contentFit={"contain"}
                className="aspect-square rounded-lg object-cover"
                src="https://qr.expo.dev/eas-update?slug=exp&projectId=c82a6e08-f764-4f82-abd5-d5361a82df44&groupId=3e304481-e9c3-43f7-85ac-2d5ba4014793"
              />
              <Button
                onPress={() =>
                  Linking.openURL(
                    "https://expo.dev/preview/update?message=init&updateRuntimeVersion=1.0.0&createdAt=2024-07-01T18%3A20%3A25.119Z&slug=exp&projectId=c82a6e08-f764-4f82-abd5-d5361a82df44&group=5496aae0-7639-485d-9842-587fd0dead6b",
                  )
                }
              >
                <ButtonText>Open Expo Go</ButtonText>
              </Button>
            </View>
          </ListItem>
          <ListItem text="🕛 Publish to TestFlight" />
        </List>
      </Section>

      <Section title="🎨 Mocks">
        <List>
          <ListItem text="My Books">
            <List>
              <ListItem text="Shelves">
                <List>
                  <ListItem text="✅ Routing">
                    <Link href="/johndoe/shelves/wardrobe-bottom-left-shelf">
                      <Text className="ml-4 underline">View Shelf</Text>
                    </Link>
                  </ListItem>
                  <ListItem text="♻️ HiFi">
                    <ListItem text="Shelf Image" />
                    <ListItem text="Book Details (Image, Title, Description, etc)" />
                    <ListItem text="Authors (Image, Name, Description, etc)" />
                    <ListItem text="Paginate" />
                  </ListItem>
                  <ListItem text="Social Images" />
                  <ListItem text="SEO" />
                  <ListItem text="Feedback" />
                </List>
              </ListItem>
              <ListItem text="Furniture" />
              <ListItem text="Lists" />
              <ListItem text="Books" />
              <ListItem text="Authors" />
              <ListItem text="✅ Swap NextJs UI to use ts-rest for API" />
              <ListItem text="Swap Expo UI to use ts-rest for API" />
            </List>
          </ListItem>
        </List>
      </Section>

      <Section title="☁️ API">
        <List>
          <ListItem text="✅ Get user shelf by slug" />
          <ListItem text="✅ Get /api/v1/users/{username}" />
          <ListItem text="⭕️ Generate OpenAPI Spec (3.0.2 instead of 3.1.0)" />
          <ListItem text="🕕 putShelf - Batch Upsert inferred MyBooks on shelf" />
          <ListItem text="✅ /api/v1/users/{username}/shelves/{shelf-slug} - get single shelf with book count" />
          <ListItem text="✅ /api/v1/users/{username}/shelves/ - get list of shelves with book count" />
          <ListItem text="✅ /api/v1/users/{username}/shelves/{shelf-slug}/books - get list of books on shelf" />
          <ListItem text="✅ Paginate shelf books and shelves" />
        </List>
      </Section>

      <Section title="🛢️ Database">
        <List>
          <ListItem text="✅ Db lib" />
          <ListItem text="✅ Db Health Check /api/health" />
          <ListItem text="Local Db Docker Dev" />
        </List>
      </Section>

      <Section title="😈 ChatGPT">
        <List>
          <ListItem text="✅ Sovoli Book Shelf Organizer GPT - Batch Upsert of books on shelf" />
          <ListItem text="Sovoli Book Notes GPT - Add notes to book" />
        </List>
      </Section>

      <Section title="💥 Explosion (Inference population)">
        <List>
          <ListItem text="Populate Books from title/author/isbn inference">
            <ListItem text="✅ Google Books API Enrichment" />
            <ListItem text="OpenLibrary API Enrichment" />
          </ListItem>
          <ListItem text="Author table enrichment">
            <ListItem text="Populate Books table from Author (all books by author must be added)" />
          </ListItem>
          <ListItem text="Offload to Trigger.dev or other background job service" />
        </List>
      </Section>

      <Section title="Passkeys Auth">
        <List>
          <ListItem text="username/passkeys registration" />
          <ListItem text="passkeys login" />
          <ListItem text="ChatGPT auth" />
          <ListItem text="TRPC auth" />
          <ListItem text="TSR auth" />
          <ListItem text="Expo auth" />
        </List>
      </Section>

      <Section title="📖 Notes">
        <List>
          <ListItem text="Proposal: Fleshing out use case">
            <List>
              <ListItem text="TipTap Output Render" />
              <ListItem text="Mermaid Integration" />
              <ListItem text="Video Render" />
              <ListItem text="Image Render with TW styles" />
            </List>
          </ListItem>
          <ListItem text="🕛 Pull from Db" />
        </List>
        
            <ThemeToggle />
      </Section>
    </ScrollView>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="mb-8">
    <Text className="mb-2 text-xl font-semibold">{title}</Text>
    {children}
  </View>
);

const List = ({ children }: { children: React.ReactNode }) => (
  <View>{children}</View>
);

const ListItem = ({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) => (
  <View className="my-1 ml-5">
    <Text>{text}</Text>
    {children}
  </View>
);
