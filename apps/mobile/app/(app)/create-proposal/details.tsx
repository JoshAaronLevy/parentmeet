import { router, type Href } from "expo-router";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppText,
  AppTextarea,
  Screen
} from "../../../components/ui";
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const privacyHref = "/(app)/create-proposal/privacy" as Href;

export default function ProposalDetailsScreen() {
  const draft = useCreateProposalStore();

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Details
        </AppText>
        <AppText variant="title">Add helpful notes.</AppText>
        <AppText variant="subtitle">
          Keep notes practical so interested families can respond clearly.
        </AppText>
      </YStack>

      <AppCard>
        <YStack gap="$4">
          <AppTextarea
            onChangeText={(foodNotes) => draft.setDetails({ foodNotes })}
            placeholder="Food notes, optional"
            value={draft.foodNotes}
          />
          <AppCheckbox
            checked={draft.flexibleFood}
            label="Flexible on food plans"
            onCheckedChange={(checked) =>
              draft.setDetails({ flexibleFood: checked === true })
            }
          />
          <AppTextarea
            onChangeText={(activityNotes) => draft.setDetails({ activityNotes })}
            placeholder="Activity notes, optional"
            value={draft.activityNotes}
          />

          <XStack gap="$3">
            <AppButton flex={1} onPress={() => router.back()} tone="secondary">
              Back
            </AppButton>
            <AppButton flex={1} onPress={() => router.push(privacyHref)}>
              Continue
            </AppButton>
          </XStack>
        </YStack>
      </AppCard>
    </Screen>
  );
}
