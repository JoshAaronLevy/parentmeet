import { router, type Href } from "expo-router";
import { useState } from "react";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
  ErrorState,
  Screen
} from "../../../components/ui";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const childrenHref = "/(app)/onboarding/children" as Href;

export default function OnboardingAdultsScreen() {
  const { adultNames, setAdultNames } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  function updateName(index: number, value: string) {
    setAdultNames(adultNames.map((name, itemIndex) => (itemIndex === index ? value : name)));
  }

  function addAdult() {
    setAdultNames([...adultNames, ""]);
  }

  function removeAdult(index: number) {
    setAdultNames(adultNames.filter((_name, itemIndex) => itemIndex !== index));
  }

  function handleNext() {
    if (!adultNames.some((name) => name.trim())) {
      setError("Add at least one adult display name.");
      return;
    }

    setError(null);
    router.push(childrenHref);
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Adults
        </AppText>
        <AppText variant="title">Add adult display names.</AppText>
        <AppText variant="subtitle">
          First names are enough. These are for review and introductions, not a
          public profile feed.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Check this step" /> : null}

      <AppCard>
        <YStack gap="$4">
          {adultNames.map((name, index) => (
            <XStack alignItems="center" gap="$2" key={index}>
              <AppInput
                flex={1}
                onChangeText={(value) => updateName(index, value)}
                placeholder={`Adult ${index + 1}`}
                value={name}
              />
              {adultNames.length > 1 ? (
                <AppButton onPress={() => removeAdult(index)} size="$3" tone="secondary">
                  Remove
                </AppButton>
              ) : null}
            </XStack>
          ))}
          <AppButton onPress={addAdult} tone="secondary">
            Add another adult
          </AppButton>
          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={handleNext}>
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
