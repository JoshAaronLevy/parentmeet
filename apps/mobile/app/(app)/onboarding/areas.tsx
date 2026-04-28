import { LOCAL_AREAS, type LocalAreaId } from "@parentmeet/shared";
import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppSelect,
  AppText,
  Screen
} from "../../../components/ui";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const areaOptions = LOCAL_AREAS.map((area) => ({
  label: area.label,
  value: area.id
}));
const interestsHref = "/(app)/onboarding/interests" as Href;

export default function OnboardingAreasScreen() {
  const {
    additionalAreaIds,
    primaryAreaId,
    setAdditionalAreaIds,
    setPrimaryAreaId
  } = useOnboardingStore();

  function toggleAdditionalArea(areaId: LocalAreaId, checked: boolean) {
    setAdditionalAreaIds(
      checked
        ? Array.from(new Set([...additionalAreaIds, areaId])).filter(
            (value) => value !== primaryAreaId
          )
        : additionalAreaIds.filter((value) => value !== areaId)
    );
  }

  function handlePrimaryAreaChange(areaId: string) {
    const nextAreaId = areaId as LocalAreaId;

    setPrimaryAreaId(nextAreaId);
    setAdditionalAreaIds(
      additionalAreaIds.filter((value) => value !== nextAreaId)
    );
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Local area
        </AppText>
        <AppText variant="title">Choose nearby areas.</AppText>
        <AppText variant="subtitle">
          We use area selections instead of maps or exact location tracking for
          the MVP.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <AppSelect
            label="Primary area"
            onValueChange={handlePrimaryAreaChange}
            options={areaOptions}
            value={primaryAreaId}
          />

          <YStack gap="$3">
            <AppText variant="label">Additional nearby areas</AppText>
            {LOCAL_AREAS.filter((area) => area.id !== primaryAreaId).map((area) => (
              <AppCheckbox
                checked={additionalAreaIds.includes(area.id)}
                key={area.id}
                label={`${area.label} - ${area.region}`}
                onCheckedChange={(checked) =>
                  toggleAdditionalArea(area.id, checked === true)
                }
              />
            ))}
          </YStack>

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton
              flex={1}
              onPress={() => router.push(interestsHref)}
            >
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
