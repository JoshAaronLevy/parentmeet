import { Redirect, Stack } from "expo-router";

import { LoadingState, Screen } from "../../components/ui";
import { useAuth } from "../../src/providers/AuthProvider";

export default function AuthLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <Screen justifyContent="center" scroll={false}>
        <LoadingState label="Restoring your session" />
      </Screen>
    );
  }

  if (session) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
