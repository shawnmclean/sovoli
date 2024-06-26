import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Button } from "@sovoli/ui/components/button";
import { RNTextTW } from "@sovoli/ui/components/text-rn-tw";
import { RNText } from "@sovoli/ui/components/text-rn";
import { RNTextTWComponent } from "../components/text-rn-tw";

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <Button onPress={() => Alert.alert("Hello!")}>
          <Text>Click me now!</Text>
        </Button>
        <RNTextTW />
        <RNText />
        <RNTextTWComponent />
        <View className="rounded-lg border border-border bg-card shadow-sm shadow-foreground/10">
          <Text className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-red-600">
            Gradient Text
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
