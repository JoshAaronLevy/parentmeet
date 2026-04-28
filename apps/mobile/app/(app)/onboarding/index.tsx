import { router, type Href } from "expo-router";
import { useState } from "react";
import { YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppInput,
  AppText,
  AppTextarea,
  ErrorState,
  Screen
} from "../../../components/ui";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const adultsHref = "/(app)/onboarding/adults" as Href;

export default function OnboardingStartScreen() {
  const {
    bio,
    householdName,
    isExpectantParent,
    isParentHousehold,
    setBio,
    setEligibility,
    setHouseholdName
  } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);

  function handleNext() {
    if (!householdName.trim()) {
      setError("Add a household name so hosts know who they are reviewing.");
      return;
    }

    if (!isParentHousehold && !isExpectantParent) {
      setError("Confirm that your household includes a parent or expecting parent.");
      return;
    }

    setError(null);
    router.push(adultsHref);
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Household setup
        </AppText>
        <AppText variant="title">Tell us the basics.</AppText>
        <AppText variant="subtitle">
          Keep this simple. You can use a family name, first names, or another
          comfortable household label.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Check this step" /> : null}

      <AppCard>
        <YStack gap="$4">
          <AppInput
            onChangeText={setHouseholdName}
            placeholder="Household name"
            value={householdName}
          />
          <AppCheckbox
            checked={isParentHousehold}
            label="We are a parent household"
            onCheckedChange={(checked) =>
              setEligibility({ isParentHousehold: checked === true })
            }
          />
          <AppCheckbox
            checked={isExpectantParent}
            label="We are expecting a child"
            onCheckedChange={(checked) =>
              setEligibility({ isExpectantParent: checked === true })
            }
          />
          <AppTextarea
            onChangeText={setBio}
            placeholder="Short bio, optional"
            value={bio}
          />
          <AppButton onPress={handleNext}>Continue</AppButton>
        </YStack>
      </AppCard>
    </Screen>
  );
}
