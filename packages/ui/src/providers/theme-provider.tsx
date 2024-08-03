import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNThemeProvider,
  Theme,
} from "@react-navigation/native";

export function ThemeProvider({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: "light" | "dark";
}) {
  return (
    <RNThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
      {children}
    </RNThemeProvider>
  );
}
