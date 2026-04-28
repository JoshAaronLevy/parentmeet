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
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const capacityHref = "/(app)/create-proposal/capacity" as Href;

export default function ProposalOptionsScreen() {
  const draft = useCreateProposalStore();

  function updateTimeOption(index: number, value: string) {
    draft.setOptions({
      candidateTimeOptions: draft.candidateTimeOptions.map((option, itemIndex) =>
        itemIndex === index ? value : option
      )
    });
  }

  function updateLocationOption(index: number, value: string) {
    draft.setOptions({
      candidateLocationOptions: draft.candidateLocationOptions.map(
        (option, itemIndex) => (itemIndex === index ? value : option)
      )
    });
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Options
        </AppText>
        <AppText variant="title">Add candidate options.</AppText>
        <AppText variant="subtitle">
          Use plain labels for now. Exact scheduling and finalization come later.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <AppCheckbox
            checked={draft.flexibleTime}
            label="Flexible on time"
            onCheckedChange={(checked) =>
              draft.setOptions({ flexibleTime: checked === true })
            }
          />
          <YStack gap="$2">
            <AppText variant="label">Candidate time options</AppText>
            {draft.candidateTimeOptions.map((option, index) => (
              <XStack alignItems="center" gap="$2" key={index}>
                <AppInput
                  flex={1}
                  onChangeText={(value) => updateTimeOption(index, value)}
                  placeholder={`Time option ${index + 1}`}
                  value={option}
                />
                {draft.candidateTimeOptions.length > 1 ? (
                  <AppButton
                    onPress={() =>
                      draft.setOptions({
                        candidateTimeOptions: draft.candidateTimeOptions.filter(
                          (_item, itemIndex) => itemIndex !== index
                        )
                      })
                    }
                    size="$3"
                    tone="secondary"
                  >
                    Remove
                  </AppButton>
                ) : null}
              </XStack>
            ))}
            <AppButton
              onPress={() =>
                draft.setOptions({
                  candidateTimeOptions: [...draft.candidateTimeOptions, ""]
                })
              }
              tone="secondary"
            >
              Add time option
            </AppButton>
          </YStack>

          <AppCheckbox
            checked={draft.flexibleLocation}
            label="Flexible on location"
            onCheckedChange={(checked) =>
              draft.setOptions({ flexibleLocation: checked === true })
            }
          />
          <YStack gap="$2">
            <AppText variant="label">Candidate location options</AppText>
            {draft.candidateLocationOptions.map((option, index) => (
              <XStack alignItems="center" gap="$2" key={index}>
                <AppInput
                  flex={1}
                  onChangeText={(value) => updateLocationOption(index, value)}
                  placeholder={`Location option ${index + 1}`}
                  value={option}
                />
                {draft.candidateLocationOptions.length > 1 ? (
                  <AppButton
                    onPress={() =>
                      draft.setOptions({
                        candidateLocationOptions:
                          draft.candidateLocationOptions.filter(
                            (_item, itemIndex) => itemIndex !== index
                          )
                      })
                    }
                    size="$3"
                    tone="secondary"
                  >
                    Remove
                  </AppButton>
                ) : null}
              </XStack>
            ))}
            <AppButton
              onPress={() =>
                draft.setOptions({
                  candidateLocationOptions: [
                    ...draft.candidateLocationOptions,
                    ""
                  ]
                })
              }
              tone="secondary"
            >
              Add location option
            </AppButton>
          </YStack>

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={() => router.push(capacityHref)}>
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
