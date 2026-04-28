import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppTag,
  AppText,
  EmptyState,
  Screen
} from "../../../components/ui";

export default function CreateScreen() {
  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Create
        </AppText>
        <AppText variant="title">Host a meetup proposal.</AppText>
        <AppText variant="subtitle">
          Proposal creation starts in Stage 7. This shell shows where hosts will
          begin.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <YStack gap="$2">
            <AppText fontWeight="700">Coming next</AppText>
            <AppText color="$muted">
              Hosts will be able to draft a proposal, choose flexible options,
              and submit it for manual review before it becomes discoverable.
            </AppText>
          </YStack>
          <XStack flexWrap="wrap" gap="$2">
            <AppTag label="Manual review" tone="success" />
            <AppTag label="Structured interest" />
            <AppTag label="Private address protected" />
          </XStack>
          <AppButton disabled>Start proposal</AppButton>
        </YStack>
      </AppCard>

      <EmptyState
        body="No draft proposal flow exists yet. Stage 7 adds the real create screens."
        title="Proposal creation is not active"
      />
    </Screen>
  );
}
