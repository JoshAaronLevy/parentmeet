import { AgeBand } from "@parentmeet/shared";
import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppInput,
  AppText,
  Screen
} from "../../../components/ui";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const areasHref = "/(app)/onboarding/areas" as Href;

const ageBandOptions = [
  { label: "Newborn", value: AgeBand.Newborn },
  { label: "Infant", value: AgeBand.Infant },
  { label: "Toddler", value: AgeBand.Toddler },
  { label: "Preschool", value: AgeBand.Preschool },
  { label: "Early elementary", value: AgeBand.EarlyElementary },
  { label: "Elementary", value: AgeBand.Elementary },
  { label: "Middle school", value: AgeBand.MiddleSchool },
  { label: "Teen", value: AgeBand.Teen }
] as const;

export default function OnboardingChildrenScreen() {
  const {
    childAgeBands,
    expectedDueWindow,
    isExpectantParent,
    setChildAgeBands,
    setExpectedDueWindow
  } = useOnboardingStore();

  function toggleAgeBand(ageBand: AgeBand, checked: boolean) {
    setChildAgeBands(
      checked
        ? Array.from(new Set([...childAgeBands, ageBand]))
        : childAgeBands.filter((value) => value !== ageBand)
    );
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Children
        </AppText>
        <AppText variant="title">Share age bands only.</AppText>
        <AppText variant="subtitle">
          No child names or exact birthdates needed. Pick the age bands that
          help other families understand fit.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          {ageBandOptions.map((ageBand) => (
            <AppCheckbox
              checked={childAgeBands.includes(ageBand.value)}
              key={ageBand.value}
              label={ageBand.label}
              onCheckedChange={(checked) =>
                toggleAgeBand(ageBand.value, checked === true)
              }
            />
          ))}

          {isExpectantParent ? (
            <YStack gap="$2">
              <AppText variant="label">Expected child due window</AppText>
              <AppInput
                onChangeText={setExpectedDueWindow}
                placeholder="Example: Summer 2026"
                value={expectedDueWindow}
              />
            </YStack>
          ) : null}

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={() => router.push(areasHref)}>
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
