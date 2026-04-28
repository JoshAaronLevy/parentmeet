import { APP_NAME, LOCAL_AREAS } from "@parentmeet/shared";
import { Separator, XStack, YStack } from "tamagui";

import {
  AppCard,
  AppTag,
  AppText,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen
} from "../../../components/ui";
import { useDiscoverProposals } from "../../../src/hooks/useDiscoverProposals";
import { useOnboardingStatus } from "../../../src/hooks/useOnboardingStatus";

export default function DiscoverScreen() {
  const { data: onboardingStatus } = useOnboardingStatus();
  const discoverProposals = useDiscoverProposals();
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
        {discoverProposals.isLoading ? (
          <LoadingState label="Checking nearby proposals" />
        ) : null}
        {discoverProposals.error ? (
          <ErrorState
            body={
              discoverProposals.error instanceof Error
                ? discoverProposals.error.message
                : "Unable to load approved proposals."
            }
            title="Could not load Discover"
          />
        ) : null}
        {discoverProposals.data?.map((proposal) => (
          <AppCard key={proposal.id}>
            <YStack gap="$3">
              <XStack alignItems="center" justifyContent="space-between" gap="$3">
                <AppText fontWeight="700">{proposal.title}</AppText>
                <AppTag label={proposal.status} tone="success" />
              </XStack>
              <AppText color="$muted">
                {proposal.areaLabel} · {formatValue(proposal.venueType)}
              </AppText>
              <AppText color="$muted">
                {proposal.venuePrivacy === "private_address_after_approval"
                  ? "Private address hidden until approval"
                  : proposal.publicLocationName ?? "Public location"}
              </AppText>
            </YStack>
          </AppCard>
        ))}
        {!discoverProposals.isLoading && discoverProposals.data?.length === 0 ? (
          <EmptyState
            body="Approved proposals from nearby host households will appear here."
            title="No public proposals yet"
          />
        ) : null}
      </YStack>
    </Screen>
  );
}

function formatValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
