"use client";

import { View } from "react-native";

import { useColorScheme } from "../../hooks/useColorScheme";
import { Button, ButtonText } from "../button";

export function ThemeToggle() {
  const { isDarkColorScheme, colorScheme, setColorScheme } = useColorScheme();
  console.log("theme-toggle", colorScheme);
  return (
    <View className="flex-row">
      <Button
        onPress={() => {
          const newTheme = isDarkColorScheme ? "light" : "dark";
          setColorScheme(newTheme);
        }}
      >
        <ButtonText>{colorScheme}</ButtonText>
      </Button>
    </View>
  );
}
