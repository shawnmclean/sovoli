import { Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "@sovoli/ui/components/button";

import "./styles.css";

export default function Native() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl">Native Wind</Text>
      <Button variant="destructive" onPress={() => Alert.alert("Hello")}>
        <Text>Click me</Text>
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}
