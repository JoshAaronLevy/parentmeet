import { AgeBand, LOCAL_AREAS, type AgeBand as AgeBandType } from "@parentmeet/shared";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { XStack, YStack } from "tamagui";

import {
  AppButton,
  AppCard,
  AppCheckbox,
  AppInput,
  AppSelect,
  AppText,
  AppTextarea,
  ErrorState,
  Screen
} from "../../../components/ui";
import { useCreateProposalStore } from "../../../src/stores/createProposalStore";

const optionsHref = "/(app)/create-proposal/options" as Href;
const areaOptions = LOCAL_AREAS.map((area) => ({
  label: area.label,
  value: area.id
}));
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

export default function ProposalBasicsScreen() {
  const draft = useCreateProposalStore();
  const [error, setError] = useState<string | null>(null);

  function toggleAgeBand(ageBand: AgeBandType, checked: boolean) {
    draft.setBasics({
      targetAgeBands: checked
        ? Array.from(new Set([...draft.targetAgeBands, ageBand]))
        : draft.targetAgeBands.filter((value) => value !== ageBand)
    });
  }

  function handleNext() {
    if (!draft.title.trim()) {
      setError("Add a title for the proposal.");
      return;
    }

    if (!draft.description.trim()) {
      setError("Add a short description for interested households.");
      return;
    }

    setError(null);
    router.push(optionsHref);
  }

  return (
    <Screen>
      <YStack gap="$2">
        <AppText color="$accent" fontWeight="700" variant="label">
          Basics
        </AppText>
        <AppText variant="title">Describe the meetup.</AppText>
        <AppText variant="subtitle">
          Keep it concrete enough for families to know whether they are
          interested.
        </AppText>
      </YStack>

      {error ? <ErrorState body={error} title="Check this step" /> : null}

      <AppCard>
        <YStack gap="$4">
          <AppInput
            onChangeText={(title) => draft.setBasics({ title })}
            placeholder="Proposal title"
            value={draft.title}
          />
          <AppTextarea
            onChangeText={(description) => draft.setBasics({ description })}
            placeholder="What are you proposing?"
            value={draft.description}
          />
          <AppSelect
            label="Area"
            onValueChange={(areaId) => draft.setBasics({ areaId: areaId as typeof draft.areaId })}
            options={areaOptions}
            value={draft.areaId}
          />
          <YStack gap="$3">
            <AppText variant="label">Target child age bands</AppText>
            {ageBandOptions.map((ageBand) => (
              <AppCheckbox
                checked={draft.targetAgeBands.includes(ageBand.value)}
                key={ageBand.value}
                label={ageBand.label}
                onCheckedChange={(checked) =>
                  toggleAgeBand(ageBand.value, checked === true)
                }
              />
            ))}
          </YStack>
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
