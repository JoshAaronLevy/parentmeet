import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppTag,
  AppText,
  EmptyState,
  Screen
} from "../../../components/ui";

const createProposalHref = "/(app)/create-proposal" as Href;

export default function CreateScreen() {
  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Create
        </AppText>
        <AppText variant="title">Host a meetup proposal.</AppText>
        <AppText variant="subtitle">
          Draft a proposal, choose flexible options, and submit it for manual
          review before it can appear in Discover.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <YStack gap="$2">
            <AppText fontWeight="700">Create a new proposal</AppText>
            <AppText color="$muted">
              The review flow collects location privacy, candidate options,
              capacity, and host notes.
            </AppText>
          </YStack>
          <XStack flexWrap="wrap" gap="$2">
            <AppTag label="Manual review" tone="success" />
            <AppTag label="Structured interest" />
            <AppTag label="Private address protected" />
          </XStack>
          <AppButton onPress={() => router.push(createProposalHref)}>
            Start proposal
          </AppButton>
        </YStack>
      </AppCard>

      <EmptyState
        body="Submitted proposals stay pending until an admin approves them."
        title="Manual review protects discovery"
      />
    </Screen>
  );
}
