import { SafeAreaProvider as RNSafeAreaProvider } from "react-native-safe-area-context";

export function SafeAreaProvider({ children }: { children: React.ReactNode }) {
  return <RNSafeAreaProvider>{children}</RNSafeAreaProvider>;
}
