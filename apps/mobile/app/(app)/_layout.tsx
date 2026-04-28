import { Redirect, Stack, type Href } from "expo-router";

import { LoadingState, Screen } from "../../components/ui";
import { useAuth } from "../../src/providers/AuthProvider";

const signInHref = "/(auth)/sign-in" as Href;

export default function AppLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <Screen justifyContent="center" scroll={false}>
        <LoadingState label="Restoring your session" />
      </Screen>
    );
  }

  if (!session) {
    return <Redirect href={signInHref} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
