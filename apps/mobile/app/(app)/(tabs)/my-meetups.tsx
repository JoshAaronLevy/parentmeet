import { YStack } from "tamagui";

import {
  AppCard,
  AppTag,
  AppText,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen
} from "../../../components/ui";
import { useMyProposals } from "../../../src/hooks/useMyProposals";

export default function MyMeetupsScreen() {
  const myProposals = useMyProposals();

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          My Meetups
        </AppText>
        <AppText variant="title">Track proposals and RSVPs.</AppText>
        <AppText variant="subtitle">
          This will become the hub for hosted proposals, interest responses, and
          approved attendance.
        </AppText>
      </YStack>

      {myProposals.isLoading ? <LoadingState label="Loading your proposals" /> : null}
      {myProposals.error ? (
        <ErrorState
          body={
            myProposals.error instanceof Error
              ? myProposals.error.message
              : "Unable to load proposals."
          }
          title="Could not load meetups"
        />
      ) : null}

      {myProposals.data?.map((proposal) => (
        <AppCard key={proposal.id}>
          <YStack gap="$3">
            <AppText fontWeight="700">{proposal.title}</AppText>
            <AppText color="$muted">{proposal.areaLabel}</AppText>
            <YStack alignItems="flex-start" gap="$2">
              <AppTag label={proposal.status} tone="success" />
              <AppTag label={`review: ${proposal.manualReviewStatus}`} />
            </YStack>
          </YStack>
        </AppCard>
      ))}

      {!myProposals.isLoading && myProposals.data?.length === 0 ? (
        <EmptyState
          body="Once your household hosts a proposal or joins a meetup, those items will be listed here."
          title="No meetups yet"
        />
      ) : null}
    </Screen>
  );
}
