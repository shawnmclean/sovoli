import { NAV_THEME } from "../lib/constants";
import { useColorScheme } from "../hooks/useColorScheme";
import {
  Theme,
  ThemeProvider as RNThemeProvider,
} from "@react-navigation/native";

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
