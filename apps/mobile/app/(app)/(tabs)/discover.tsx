import { APP_NAME, LOCAL_AREAS } from "@parentmeet/shared";
import { Separator, XStack, YStack } from "tamagui";

import {
  AppCard,
  AppTag,
  AppText,
  EmptyState,
  LoadingState,
  Screen
} from "../../../components/ui";
import { useOnboardingStatus } from "../../../src/hooks/useOnboardingStatus";

export default function DiscoverScreen() {
  const { data: onboardingStatus } = useOnboardingStatus();
  const household = onboardingStatus?.household;

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          {APP_NAME}
        </AppText>
        <AppText variant="title">Discover local proposals.</AppText>
        <AppText variant="subtitle">
          Approved meetup proposals in your selected areas will appear here once
          Stage 7 and discovery are wired.
        </AppText>
      </YStack>

      {household ? (
        <AppCard>
          <YStack gap="$3">
            <XStack alignItems="center" justifyContent="space-between" gap="$3">
              <AppText fontWeight="700">{household.householdName}</AppText>
              <AppTag label="Onboarded" tone="success" />
            </XStack>
            <AppText color="$muted">
              {household.city} ·{" "}
              {household.isExpectantParent ? "Expecting" : "Parent household"}
            </AppText>
            {household.bio ? <AppText>{household.bio}</AppText> : null}
          </YStack>
        </AppCard>
      ) : null}

      <AppCard>
        <YStack gap="$3">
          <AppText fontWeight="700">Your local areas</AppText>
          <Separator borderColor="$borderColor" />
          {LOCAL_AREAS.filter((area) =>
            household ? household.areaIds.includes(area.id) : true
          ).map((area) => (
            <XStack key={area.id} justifyContent="space-between" gap="$3">
              <AppText>{area.label}</AppText>
              <AppText color="$muted">{area.region}</AppText>
            </XStack>
          ))}
        </YStack>
      </AppCard>

      <YStack gap="$3">
        <LoadingState label="Checking nearby proposals" />
        <EmptyState
          body="Approved proposals from nearby host households will appear here."
          title="No public proposals yet"
        />
      </YStack>
    </Screen>
  );
}
