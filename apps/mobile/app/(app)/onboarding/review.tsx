import {
  HOUSEHOLD_INTEREST_LABELS,
  LOCAL_AREAS,
  type AgeBand,
  type HouseholdInterestId
} from "@parentmeet/shared";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Separator, XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppTag,
  AppText,
  ErrorState,
  Screen
} from "../../../components/ui";
import { useAuth } from "../../../src/providers/AuthProvider";
import { completeOnboarding } from "../../../src/services/onboarding";
import { useOnboardingStore } from "../../../src/stores/onboardingStore";

const ageBandLabels: Record<AgeBand, string> = {
  early_elementary: "Early elementary",
  elementary: "Elementary",
  expecting: "Expecting",
  infant: "Infant",
  middle_school: "Middle school",
  newborn: "Newborn",
  preschool: "Preschool",
  teen: "Teen",
  toddler: "Toddler"
};

export default function OnboardingReviewScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const onboarding = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryArea = LOCAL_AREAS.find(
    (area) => area.id === onboarding.primaryAreaId
  );
  const additionalAreas = LOCAL_AREAS.filter((area) =>
    onboarding.additionalAreaIds.includes(area.id)
  );

  async function handleSubmit() {
    if (!user) {
      setError("Sign in again before completing onboarding.");
      return;
    }

    const adultNames = onboarding.adultNames
      .map((name) => name.trim())
      .filter(Boolean);

    if (!onboarding.householdName.trim()) {
      setError("Add a household name before finishing.");
      return;
    }

    if (adultNames.length === 0) {
      setError("Add at least one adult display name before finishing.");
      return;
    }

    if (!onboarding.isParentHousehold && !onboarding.isExpectantParent) {
      setError("Confirm parent or expecting parent eligibility before finishing.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding({
        ...onboarding,
        adultNames,
        user
      });
      onboarding.reset();
      await queryClient.invalidateQueries({
        queryKey: ["onboarding-status", user.id]
      });
      router.replace("/");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save your household."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Review
        </AppText>
        <AppText variant="title">Check your household setup.</AppText>
        <AppText variant="subtitle">
          You can edit details later. This gives hosts enough context to review
          meetup interest.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Could not finish onboarding" /> : null}

      <AppCard>
        <YStack gap="$4">
          <ReviewRow label="Household" value={onboarding.householdName} />
          <ReviewRow
            label="Adults"
            value={
              onboarding.adultNames
                .map((name) => name.trim())
                .filter(Boolean)
                .join(", ") || "None added"
            }
          />
          <ReviewRow
            label="Eligibility"
            value={[
              onboarding.isParentHousehold ? "Parent household" : null,
              onboarding.isExpectantParent ? "Expecting parent" : null
            ]
              .filter(Boolean)
              .join(", ")}
          />
          <ReviewRow
            label="Children"
            value={
              onboarding.childAgeBands.map((band) => ageBandLabels[band]).join(", ") ||
              "No child age bands selected"
            }
          />
          {onboarding.isExpectantParent ? (
            <ReviewRow
              label="Due window"
              value={onboarding.expectedDueWindow || "Not provided"}
            />
          ) : null}
          <ReviewRow label="Primary area" value={primaryArea?.label ?? "Not selected"} />
          <ReviewRow
            label="Nearby areas"
            value={
              additionalAreas.map((area) => area.label).join(", ") ||
              "No additional areas"
            }
          />
          <Separator borderColor="$borderColor" />
          <YStack gap="$2">
            <AppText variant="label">Interests</AppText>
            <XStack flexWrap="wrap" gap="$2">
              {onboarding.interests.length > 0 ? (
                onboarding.interests.map((interest) => (
                  <AppTag
                    key={interest}
                    label={
                      HOUSEHOLD_INTEREST_LABELS[
                        interest as HouseholdInterestId
                      ]
                    }
                  />
                ))
              ) : (
                <AppText color="$muted">No interests selected</AppText>
              )}
            </XStack>
          </YStack>
          <ReviewRow label="Bio" value={onboarding.bio || "No bio yet"} />

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} disabled={isSubmitting} onPress={handleSubmit}>
              {isSubmitting ? "Saving" : "Finish"}
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <YStack gap="$1">
      <AppText variant="label">{label}</AppText>
      <AppText>{value}</AppText>
    </YStack>
  );
}
