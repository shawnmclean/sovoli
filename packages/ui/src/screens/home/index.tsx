"use client";

import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Text } from "@sovoli/ui/components/text";
import RNButtons from "./rn-buttons";
import { ThemeToggle } from "@sovoli/ui/components/ThemeToggle/ThemeToggle";
import { Button } from "@sovoli/ui/components/button";
import { Image } from "@sovoli/ui/components/image";
import { Link } from "@sovoli/ui/components/link";

export function HomeScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text className="text-2xl font-bold mb-4">
        👀 Personal use software, pls leave, kthxbai
      </Text>

      <Text className="mb-8">
        Goal: Working on something to help me read, write and think better.
      </Text>

      <Link href="/shawn">
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
          <ListItem text="✅ Dark Mode Toggle">
            <ThemeToggle />
          </ListItem>
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
                className="rounded-lg aspect-square object-cover"
                src="https://qr.expo.dev/eas-update?slug=exp&projectId=c82a6e08-f764-4f82-abd5-d5361a82df44&groupId=3e304481-e9c3-43f7-85ac-2d5ba4014793"
              />
              <Button
                onPress={() =>
                  Linking.openURL(
                    "https://expo.dev/preview/update?message=init&updateRuntimeVersion=1.0.0&createdAt=2024-07-01T18%3A20%3A25.119Z&slug=exp&projectId=c82a6e08-f764-4f82-abd5-d5361a82df44&group=5496aae0-7639-485d-9842-587fd0dead6b"
                  )
                }
              >
                <Text>Open Expo Go</Text>
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
                    <Link href="/shawn/shelves/wardrobe-bottom-left-shelf">
                      <Text className="ml-4 underline">View Shelf</Text>
                    </Link>
                  </ListItem>
                  <ListItem text="♻️HiFi" />
                  <ListItem text="Social Images" />
                  <ListItem text="SEO" />
                  <ListItem text="Feedback" />
                </List>
              </ListItem>
              <ListItem text="Furniture" />
              <ListItem text="Lists" />
              <ListItem text="Books" />
            </List>
          </ListItem>
        </List>
      </Section>

      <Section title="☁️ API">
        <List>
          <ListItem text="Get shelf " />
          <ListItem text="Expo does health check" />
          <ListItem text="Handle version skew" />
        </List>
      </Section>

      <Section title="🛢️ Database">
        <List>
          <ListItem text="Db lib" />
          <ListItem text="Db Health Check" />
          <ListItem text="Book model" />
          <ListItem text="Seed Book table" />
          <ListItem text="Book Details backed by Book data" />
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
      </Section>

      <Section title="Auth">
        <List>
          <ListItem text="Db: Session model" />
          <ListItem text="Non authenticated sessions" />
          <ListItem text="Session Id: [sessionId]" />
          <ListItem text="Web users: [web sessions count here]" />
          <ListItem text="Mobile users: [mobile sessions count here]" />
        </List>
      </Section>

      <Section title="My Books">
        <List>
          <ListItem text="Db: Account, MyBook models. Connect Session to MyBooks" />
          <ListItem text="Seed Account and MyBook tables" />
          <ListItem text="Back MyBooks listing and details with by database" />
        </List>
      </Section>

      <Section title="Image Upload / Storage">
        {/* <TextInput type="file" className="block mb-2" /> */}
        <List>
          <ListItem text="Persistent storage link here">
            <TouchableOpacity className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
              <Text>Show button for a popup with image data here</Text>
            </TouchableOpacity>
          </ListItem>
          <ListItem text="Explode image data">
            <TouchableOpacity className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
              <Text>RAG</Text>
            </TouchableOpacity>
          </ListItem>
          <ListItem text="Write to books (link to all books here)" />
          <ListItem text="Write to session books (link to current session books here)" />
        </List>
      </Section>

      <Section title="Take Notes">
        <TextInput
          placeholder="Input for notes on book"
          className="block border border-gray-300 p-2 mb-2"
        />
        {/* <TextInput type="file" className="block mb-2" /> */}
        <List>
          <ListItem text="Scan notes (image upload, read highlight and jottings)" />
        </List>
      </Section>

      <Section title="Auth">
        <List>
          <ListItem text="WhatsApp TOTP" />
          <ListItem text="Migrate session data" />
        </List>
      </Section>

      <Section title="Onboard">
        <TextInput
          placeholder="Accept Username"
          className="block border border-gray-300 p-2 mb-2"
        />
        <TouchableOpacity className="bg-blue-500 text-white py-1 px-2 rounded mt-2">
          <Text>View user profile</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Generative UX">
        <List>
          <ListItem text="Reflow the above workflow into generative UX flows" />
          <ListItem text="Spike on generative UI for RN" />
        </List>
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
    <Text className="text-xl font-semibold mb-2">{title}</Text>
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
