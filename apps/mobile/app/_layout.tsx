import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { TamaguiProvider, Theme } from "tamagui";

import { queryClient } from "../lib/query-client";
import tamaguiConfig from "../tamagui.config";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name="light">
          <Stack screenOptions={{ headerShown: false }} />
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
