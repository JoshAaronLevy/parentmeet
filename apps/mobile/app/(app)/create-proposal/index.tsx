import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import { AppButton, AppCard, AppTag, AppText, Screen } from "../../../components/ui";

const basicsHref = "/(app)/create-proposal/basics" as Href;

export default function CreateProposalStartScreen() {
  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Create proposal
        </AppText>
        <AppText variant="title">Start with a meetup proposal.</AppText>
        <AppText variant="subtitle">
          Hosts set the starting shape. Interested households can respond with
          structured availability and preferences.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <AppText fontWeight="700">Before it appears in Discover</AppText>
          <AppText color="$muted">
            Your proposal is submitted for manual review. Private addresses stay
            hidden and are never shown in public proposal cards.
          </AppText>
          <XStack flexWrap="wrap" gap="$2">
            <AppTag label="Pending review" tone="success" />
            <AppTag label="Host controlled" />
            <AppTag label="No public feed" />
          </XStack>
          <AppButton onPress={() => router.push(basicsHref)}>
            Start proposal
          </AppButton>
        </YStack>
      </AppCard>
    </Screen>
  );
}
