import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Button } from "@sovoli/ui/components/button";
import { RNTextTW } from "@sovoli/ui/components/text-rn-tw";
import { RNText } from "@sovoli/ui/components/text-rn";

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
      </View>
    </SafeAreaView>
  );
}
