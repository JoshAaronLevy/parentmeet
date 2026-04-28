import {
  HOUSEHOLD_INTEREST_LABELS,
  LOCAL_AREAS,
  type HouseholdInterestId
} from "@parentmeet/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Separator, XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppTag,
  AppText,
  ErrorState,
  Screen
} from "../../../components/ui";
import { useOnboardingStatus } from "../../../src/hooks/useOnboardingStatus";
import { useAuth } from "../../../src/providers/AuthProvider";

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const { data: onboardingStatus } = useOnboardingStatus();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const household = onboardingStatus?.household;
  const profile = onboardingStatus?.profile;
  const areaLabels = household
    ? LOCAL_AREAS.filter((area) => household.areaIds.includes(area.id)).map(
        (area) => area.label
      )
    : [];

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);

    try {
      await signOut();
      queryClient.clear();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to sign out."
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Profile
        </AppText>
        <AppText variant="title">Your household.</AppText>
        <AppText variant="subtitle">
          This summary is read back from Supabase after onboarding.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Sign out failed" /> : null}

      <AppCard>
        <YStack gap="$4">
          <YStack gap="$1">
            <AppText variant="label">Account</AppText>
            <AppText>{user?.email ?? "Signed in"}</AppText>
            {profile ? (
              <AppText color="$muted">Profile: {profile.displayName}</AppText>
            ) : null}
          </YStack>

          <Separator borderColor="$borderColor" />

          {household ? (
            <YStack gap="$4">
              <YStack gap="$1">
                <AppText variant="label">Household</AppText>
                <XStack alignItems="center" justifyContent="space-between" gap="$3">
                  <AppText fontWeight="700">{household.householdName}</AppText>
                  <AppTag label="Complete" tone="success" />
                </XStack>
                <AppText color="$muted">
                  {household.city} · {formatHouseholdType(household.householdType)}
                </AppText>
              </YStack>

              {household.bio ? (
                <YStack gap="$1">
                  <AppText variant="label">Bio</AppText>
                  <AppText>{household.bio}</AppText>
                </YStack>
              ) : null}

              <YStack gap="$2">
                <AppText variant="label">Areas</AppText>
                <XStack flexWrap="wrap" gap="$2">
                  {areaLabels.map((area) => (
                    <AppTag key={area} label={area} />
                  ))}
                </XStack>
              </YStack>

              <YStack gap="$2">
                <AppText variant="label">Interests</AppText>
                <XStack flexWrap="wrap" gap="$2">
                  {household.interests.length > 0 ? (
                    household.interests.map((interest) => (
                      <AppTag
                        key={interest}
                        label={
                          HOUSEHOLD_INTEREST_LABELS[
                            interest as HouseholdInterestId
                          ] ?? interest
                        }
                      />
                    ))
                  ) : (
                    <AppText color="$muted">No interests selected</AppText>
                  )}
                </XStack>
              </YStack>
            </YStack>
          ) : null}

          <AppButton
            disabled={isSigningOut}
            onPress={handleSignOut}
            tone="secondary"
          >
            {isSigningOut ? "Signing out" : "Sign out"}
          </AppButton>
        </YStack>
      </AppCard>
    </Screen>
  );
}

function formatHouseholdType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
