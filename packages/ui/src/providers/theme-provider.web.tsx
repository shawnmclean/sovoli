import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode?: "light" | "dark";
}) {
  return (
    <NextThemeProvider attribute="class" defaultTheme={mode} enableSystem>
      {children}
    </NextThemeProvider>
  );
}
