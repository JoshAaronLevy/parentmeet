import {
  HOUSEHOLD_INTEREST_LABELS,
  HOUSEHOLD_INTERESTS,
  type HouseholdInterestId
} from "@parentmeet/shared";
import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppText,
  Screen
} from "../../../components/ui";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const reviewHref = "/(app)/onboarding/review" as Href;

export default function OnboardingInterestsScreen() {
  const { interests, setInterests } = useOnboardingStore();

  function toggleInterest(interest: HouseholdInterestId, checked: boolean) {
    setInterests(
      checked
        ? Array.from(new Set([...interests, interest]))
        : interests.filter((value) => value !== interest)
    );
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Interests
        </AppText>
        <AppText variant="title">Pick a few meetup themes.</AppText>
        <AppText variant="subtitle">
          These help hosts understand what might feel natural for your household.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <YStack gap="$3">
            {HOUSEHOLD_INTERESTS.map((interest) => (
              <AppCheckbox
                checked={interests.includes(interest)}
                key={interest}
                label={HOUSEHOLD_INTEREST_LABELS[interest]}
                onCheckedChange={(checked) =>
                  toggleInterest(interest, checked === true)
                }
              />
            ))}
          </YStack>

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={() => router.push(reviewHref)}>
              Review
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
