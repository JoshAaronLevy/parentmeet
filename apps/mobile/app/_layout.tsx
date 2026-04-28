import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider, Theme } from "tamagui";

import { queryClient } from "../lib/query-client";
import { AuthProvider } from "../src/providers/AuthProvider";
import tamaguiConfig from "../tamagui.config";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name="light">
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
