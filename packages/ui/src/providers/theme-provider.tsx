import type { Theme } from "@react-navigation/native";
import { ThemeProvider as RNThemeProvider } from "@react-navigation/native";

import { useColorScheme } from "../hooks/useColorScheme/useColorScheme";
import { NAV_THEME } from "../lib/constants";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <RNThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      {children}
    </RNThemeProvider>
  );
}
