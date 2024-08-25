"use client";

import { View } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Button, ButtonIcon } from "../button";
import { SunIcon, MoonIcon } from "../icon";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  return (
    <View className="flex-row">
      <Button className="rounded-full p-3.5" variant="solid"
        onPress={() => {
          const newTheme = isDarkColorScheme ? "light" : "dark";
          setColorScheme(newTheme);
        }}
      >
        {isDarkColorScheme ? <ButtonIcon as={MoonIcon} /> : <ButtonIcon as={SunIcon} />}
      </Button>
    </View>
  );
}
