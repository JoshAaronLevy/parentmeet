import { VenuePrivacy } from "@parentmeet/shared";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppInput,
  AppSelect,
  AppText,
  ErrorState,
  Screen
} from "../../../components/ui";
import {
  proposalVisibilityOptions,
  venuePrivacyOptions,
  venueTypeOptions
} from "../../../src/services/proposals";
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const reviewHref = "/(app)/create-proposal/review" as Href;

export default function ProposalPrivacyScreen() {
  const draft = useCreateProposalStore();
  const [error, setError] = useState<string | null>(null);
  const isPrivateVenue =
    draft.venuePrivacy === VenuePrivacy.PrivateAddressAfterApproval;

  function handleNext() {
    if (isPrivateVenue && !draft.privateAddress.trim()) {
      setError("Add the private address. It will not be shown publicly.");
      return;
    }

    if (!isPrivateVenue && !draft.publicLocationName.trim()) {
      setError("Add the public location name.");
      return;
    }

    setError(null);
    router.push(reviewHref);
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Privacy
        </AppText>
        <AppText variant="title">Choose location visibility.</AppText>
        <AppText variant="subtitle">
          Exact private addresses are stored for host records but stay hidden
          until attendance is approved.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Check location details" /> : null}

      <AppCard>
        <YStack gap="$4">
          <AppSelect
            label="Venue type"
            onValueChange={(venueType) =>
              draft.setPrivacy({ venueType: venueType as typeof draft.venueType })
            }
            options={venueTypeOptions}
            value={draft.venueType}
          />
          <AppSelect
            label="Venue privacy"
            onValueChange={(venuePrivacy) =>
              draft.setPrivacy({
                venuePrivacy: venuePrivacy as typeof draft.venuePrivacy
              })
            }
            options={venuePrivacyOptions}
            value={draft.venuePrivacy}
          />
          {isPrivateVenue ? (
            <AppInput
              onChangeText={(privateAddress) =>
                draft.setPrivacy({ privateAddress })
              }
              placeholder="Private address"
              value={draft.privateAddress}
            />
          ) : (
            <AppInput
              onChangeText={(publicLocationName) =>
                draft.setPrivacy({ publicLocationName })
              }
              placeholder="Public location name"
              value={draft.publicLocationName}
            />
          )}
          <AppSelect
            label="Visibility"
            onValueChange={(visibility) =>
              draft.setPrivacy({ visibility: visibility as typeof draft.visibility })
            }
            options={proposalVisibilityOptions}
            value={draft.visibility}
          />

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={handleNext}>
              Review
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
