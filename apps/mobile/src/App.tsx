import { Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "@sovoli/ui/components/button";
import { Card } from "@sovoli/ui/components/card";

import "./styles.css";

export default function Native() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl ">Native Wind</Text>
      <Button className="bg-white" onPress={() => Alert.alert("Hello!")}>
        <Text>Click me now!</Text>
      </Button>
      <Card />
      <Text className="py-2 text-3xl font-bold text-primary">Title</Text>
      <Text className="py-4 text-foreground">Content</Text>

      <StatusBar style="auto" />
    </View>
  );
}
