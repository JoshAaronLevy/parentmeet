import { Redirect, Stack, usePathname, type Href } from "expo-router";

import { ErrorState, LoadingState, Screen } from "../../components/ui";
import { useOnboardingStatus } from "../../src/hooks/useOnboardingStatus";
import { useAuth } from "../../src/providers/AuthProvider";

const signInHref = "/(auth)/sign-in" as Href;
const onboardingHref = "/(app)/onboarding" as Href;

export default function AppLayout() {
  const { isLoading, session } = useAuth();
  const pathname = usePathname();
  const isOnboardingRoute = pathname.includes("/onboarding");
  const onboardingStatus = useOnboardingStatus();

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

  if (onboardingStatus.isLoading) {
    return (
      <Screen justifyContent="center" scroll={false}>
        <LoadingState label="Checking your household setup" />
      </Screen>
    );
  }

  if (onboardingStatus.error) {
    return (
      <Screen justifyContent="center" scroll={false}>
        <ErrorState
          body={
            onboardingStatus.error instanceof Error
              ? onboardingStatus.error.message
              : "Unable to load onboarding status."
          }
          title="Could not load your household"
        />
      </Screen>
    );
  }

  if (!onboardingStatus.data?.isComplete && !isOnboardingRoute) {
    return <Redirect href={onboardingHref} />;
  }

  if (onboardingStatus.data?.isComplete && isOnboardingRoute) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
