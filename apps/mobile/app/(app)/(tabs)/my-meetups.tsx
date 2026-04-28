import { YStack } from "tamagui";

import { AppCard, AppTag, AppText, EmptyState, Screen } from "../../../components/ui";

export default function MyMeetupsScreen() {
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

      <AppCard>
        <YStack gap="$3">
          <AppText fontWeight="700">Current state</AppText>
          <AppText color="$muted">
            You do not have proposal or RSVP records yet. Those flows arrive in
            later MVP stages.
          </AppText>
          <YStack alignItems="flex-start" gap="$2">
            <AppTag label="Hosted proposals" />
            <AppTag label="Interested" />
            <AppTag label="Approved RSVPs" tone="success" />
          </YStack>
        </YStack>
      </AppCard>

      <EmptyState
        body="Once your household expresses interest or hosts a meetup, those items will be listed here."
        title="No meetups yet"
      />
    </Screen>
  );
}
