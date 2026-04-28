import {
  LOCAL_AREAS,
  ManualReviewStatus,
  MeetupProposalStatus,
  VenuePrivacy
} from "@parentmeet/shared";
import { useQueryClient } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
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
import { useOnboardingStatus } from "../../../src/hooks/useOnboardingStatus";
import { submitProposalForReview } from "../../../src/services/proposals";
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const myMeetupsHref = "/(app)/(tabs)/my-meetups" as Href;

export default function ProposalReviewScreen() {
  const draft = useCreateProposalStore();
  const { data: onboardingStatus } = useOnboardingStatus();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const area = LOCAL_AREAS.find((item) => item.id === draft.areaId);
  const isPrivateVenue =
    draft.venuePrivacy === VenuePrivacy.PrivateAddressAfterApproval;

  async function handleSubmit() {
    if (!onboardingStatus?.household) {
      setError("Complete household onboarding before creating a proposal.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await submitProposalForReview({
        draft,
        household: onboardingStatus.household
      });
      draft.reset();
      await queryClient.invalidateQueries({ queryKey: ["my-proposals"] });
      router.replace(myMeetupsHref);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit proposal."
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
        <AppText variant="title">Submit for manual review.</AppText>
        <AppText variant="subtitle">
          This proposal will not appear in public discovery until an admin
          approves it.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Could not submit proposal" /> : null}

      <AppCard>
        <YStack gap="$4">
          <ReviewRow label="Title" value={draft.title || "Not provided"} />
          <ReviewRow
            label="Description"
            value={draft.description || "Not provided"}
          />
          <ReviewRow label="Area" value={area?.label ?? "Not selected"} />
          <ReviewRow
            label="Venue"
            value={`${formatValue(draft.venueType)} · ${formatValue(
              draft.venuePrivacy
            )}`}
          />
          <ReviewRow
            label={isPrivateVenue ? "Private address" : "Public location"}
            value={
              isPrivateVenue
                ? "Stored privately for approved attendees only"
                : draft.publicLocationName || "Not provided"
            }
          />
          <Separator borderColor="$borderColor" />
          <YStack gap="$2">
            <AppText variant="label">Review status after submit</AppText>
            <XStack flexWrap="wrap" gap="$2">
              <AppTag label={MeetupProposalStatus.PendingReview} tone="success" />
              <AppTag label={ManualReviewStatus.Pending} />
            </XStack>
          </YStack>
          <ReviewRow
            label="Time options"
            value={
              draft.candidateTimeOptions.filter(Boolean).join(", ") ||
              "No time options"
            }
          />
          <ReviewRow
            label="Location options"
            value={
              draft.candidateLocationOptions.filter(Boolean).join(", ") ||
              "No location options"
            }
          />
          <ReviewRow
            label="Capacity"
            value={[
              draft.desiredFamilyCountMin || draft.desiredFamilyCountMax
                ? `${draft.desiredFamilyCountMin || "?"}-${
                    draft.desiredFamilyCountMax || "?"
                  } families`
                : null,
              draft.maxAdults ? `${draft.maxAdults} adults` : null,
              draft.maxChildren ? `${draft.maxChildren} children` : null,
              draft.interestLimit ? `${draft.interestLimit} interest limit` : null
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <ReviewRow
            label="Food/activity"
            value={
              [draft.foodNotes, draft.activityNotes].filter(Boolean).join(" · ") ||
              "No extra notes"
            }
          />

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} disabled={isSubmitting} onPress={handleSubmit}>
              {isSubmitting ? "Submitting" : "Submit"}
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
      <AppText>{value || "Not provided"}</AppText>
    </YStack>
  );
}

function formatValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
