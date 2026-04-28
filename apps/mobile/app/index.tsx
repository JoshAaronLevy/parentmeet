import { APP_NAME, LOCAL_AREAS } from "@parentmeet/shared";
import { useState } from "react";
import { Separator, XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppInput,
  AppSelect,
  AppTag,
  AppText,
  AppTextarea,
  EmptyState,
  ErrorState,
  LoadingState,
  Screen
} from "../components/ui";

const areaOptions = LOCAL_AREAS.map((area) => ({
  label: area.label,
  value: area.id
}));

export default function HomeScreen() {
  const [selectedArea, setSelectedArea] = useState<string | undefined>(
    areaOptions[0]?.value
  );
  const [isFlexible, setIsFlexible] = useState(true);

  return (
    <Screen justifyContent="center">
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          {APP_NAME}
        </AppText>
        <AppText variant="title">Meet local families offline.</AppText>
        <AppText variant="subtitle">
          A quiet starting point for host-created parent meetups in nearby
          neighborhoods.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <YStack gap="$2">
            <AppText fontWeight="700">Start a proposal</AppText>
            <AppText color="$muted">
              These controls are design primitives only. Business logic comes in
              later stages.
            </AppText>
          </YStack>

          <AppInput placeholder="Meetup title" />
          <AppTextarea placeholder="A short note for interested households" />
          <AppSelect
            label="Local area"
            onValueChange={setSelectedArea}
            options={areaOptions}
            value={selectedArea}
          />
          <AppCheckbox
            checked={isFlexible}
            label="Flexible on exact time"
            onCheckedChange={(checked) => setIsFlexible(checked === true)}
          />

          <XStack flexWrap="wrap" gap="$2">
            <AppTag label="Manual review" tone="success" />
            <AppTag label="Private address hidden" />
            <AppTag label="Host approved" />
          </XStack>

          <AppButton>Start a meetup proposal</AppButton>
        </YStack>
      </AppCard>

      <AppCard>
        <YStack gap="$3">
          <AppText fontWeight="700">Pilot areas</AppText>
          <Separator borderColor="$borderColor" />
          {LOCAL_AREAS.map((area) => (
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
          body="When approved proposals are available, they will appear here."
          title="No public proposals yet"
        />
        <ErrorState body="This is the reusable error state style for later server-backed screens." />
      </YStack>
    </Screen>
  );
}
