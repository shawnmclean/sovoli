import { useTheme } from "next-themes";

export function useColorScheme() {
  const { theme, setTheme } = useTheme();
  return {
    colorScheme: theme ?? "dark",
    isDarkColorScheme: theme === "dark",
    setColorScheme: setTheme,
    toggleColorScheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
