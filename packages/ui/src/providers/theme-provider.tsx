import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
} from "@react-navigation/native";

import { useColorScheme } from "../hooks/useColorScheme";
import { GluestackProvider } from "./gluestack-provider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  return (
    <RNThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GluestackProvider>{children}</GluestackProvider>
    </RNThemeProvider>
  );
}
