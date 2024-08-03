"use client";

import { View } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Text } from "../text";
import { Button } from "../button";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <View className="flex-row">
      <Button
        onPress={() => {
          const newTheme = isDarkColorScheme ? "light" : "dark";
          setColorScheme(newTheme);
        }}
      >
        <Text>Toggle Theme</Text>
      </Button>
    </View>
  );
}
