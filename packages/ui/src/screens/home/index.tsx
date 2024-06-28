"use client";

import { View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "../../components/button";
import { Text } from "../../components/text";

export function HomeScreen() {
  return (
    <ScrollView className="mx-auto">
      <Text className="text-2xl font-bold mb-4">
        👀 Spiking on something, pls leave, kthxbai
      </Text>

      <Text className="mb-8">
        Goal: Working on something to help me read and write better.
      </Text>

      <Section title="Infra">
        <List>
          <ListItem text="✅ DNS" />
          <ListItem text="✅ Status Page" />
          <ListItem text="✅ Analytics" />
          <ListItem text="✅ Perf Monitor" />
          <ListItem text="🕛 Logging" />
          <ListItem text="🕛 Metrics" />
        </List>
      </Section>

      <Section title="Design System">
        <List>
          <ListItem text="✅ RN Reusables:">
            <View className="flex-row">
              <Button onPress={() => alert("Normal Pressed")} className="m-2">
                <Text>Normal</Text>
              </Button>
              <Button
                variant="destructive"
                onPress={() => alert("Destructive Pressed")}
                className="m-2"
              >
                <Text>Destructive</Text>
              </Button>
            </View>
          </ListItem>
          <ListItem text="🚩 SSR RN TW: (Wait on NativeWind fixup)" />
          <ListItem text="✅ Share screen in Expo and Next" />
          <ListItem text="✅ Share TW Config" />
          <ListItem text="🕛 Dark Mode Toggle" />
        </List>
      </Section>

      <Section title="Expo">
        <List>
          <ListItem text="Build / Publish" />
          <ListItem text="Show QR Code here" />
        </List>
      </Section>

      <Section title="Mocks">
        <List>
          <ListItem text="My Book Details" />
          <ListItem text="My Books Listing" />
          <ListItem text="Book Details" />
        </List>
      </Section>

      <Section title="Database">
        <List>
          <ListItem text="Db lib" />
          <ListItem text="Db Health Check" />
          <ListItem text="Book model" />
          <ListItem text="Seed Book table" />
          <ListItem text="Book Details backed by Book data" />
        </List>
      </Section>

      <Section title="API">
        <List>
          <ListItem text="Expo get book details" />
          <ListItem text="Expo does health check" />
          <ListItem text="Handle version skew" />
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
  <View className="mb-2">
    <Text>{text}</Text>
    {children}
  </View>
);
