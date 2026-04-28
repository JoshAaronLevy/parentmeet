import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
  Screen
} from "../../../components/ui";
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const detailsHref = "/(app)/create-proposal/details" as Href;

export default function ProposalCapacityScreen() {
  const draft = useCreateProposalStore();

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Capacity
        </AppText>
        <AppText variant="title">Set a comfortable size.</AppText>
        <AppText variant="subtitle">
          These can be estimates. Hosts make the final attendance decisions.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <XStack gap="$3">
            <AppInput
              flex={1}
              keyboardType="number-pad"
              onChangeText={(desiredFamilyCountMin) =>
                draft.setCapacity({ desiredFamilyCountMin })
              }
              placeholder="Min families"
              value={draft.desiredFamilyCountMin}
            />
            <AppInput
              flex={1}
              keyboardType="number-pad"
              onChangeText={(desiredFamilyCountMax) =>
                draft.setCapacity({ desiredFamilyCountMax })
              }
              placeholder="Max families"
              value={draft.desiredFamilyCountMax}
            />
          </XStack>
          <XStack gap="$3">
            <AppInput
              flex={1}
              keyboardType="number-pad"
              onChangeText={(maxAdults) => draft.setCapacity({ maxAdults })}
              placeholder="Max adults"
              value={draft.maxAdults}
            />
            <AppInput
              flex={1}
              keyboardType="number-pad"
              onChangeText={(maxChildren) => draft.setCapacity({ maxChildren })}
              placeholder="Max children"
              value={draft.maxChildren}
            />
          </XStack>
          <AppInput
            keyboardType="number-pad"
            onChangeText={(interestLimit) => draft.setCapacity({ interestLimit })}
            placeholder="Interest limit, optional"
            value={draft.interestLimit}
          />

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={() => router.push(detailsHref)}>
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
