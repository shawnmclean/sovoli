import { Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "@sovoli/ui/components/button";

import "./styles.css";

export default function Native() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl">Native</Text>
      <Button
        onClick={() => {
          console.log("Pressed!");
          Alert.alert("Pressed!");
        }}
        text="Boop"
      />
      <StatusBar style="auto" />
    </View>
  );
}
