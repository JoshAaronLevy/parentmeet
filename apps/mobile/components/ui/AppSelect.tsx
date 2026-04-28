import type { ReactNode } from "react";
import { Adapt, Select, Sheet, YStack, type SelectProps } from "tamagui";

import { AppText } from "./AppText";

export type AppSelectOption = {
  label: string;
  value: string;
};

type AppSelectProps = SelectProps & {
  label?: string;
  options: AppSelectOption[];
  placeholder?: string;
};

export function AppSelect({
  label,
  options,
  placeholder = "Select an option",
  value,
  ...props
}: AppSelectProps) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? placeholder;

  return (
    <YStack gap="$2">
      {label ? <AppText variant="label">{label}</AppText> : null}
      <Select value={value} {...props}>
        <Select.Trigger
          backgroundColor="$surface"
          borderColor="$borderColor"
          borderRadius="$3"
          height="$9"
          paddingHorizontal="$3"
        >
          <Select.Value>{selectedLabel}</Select.Value>
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame padding="$3">
              <Adapt.Contents />
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport
            backgroundColor="$surface"
            borderColor="$borderColor"
            borderRadius="$3"
            borderWidth={1}
            minWidth={220}
            padding="$2"
          >
            {options.map((option, index) => (
              <AppSelectItem index={index} key={option.value} value={option.value}>
                {option.label}
              </AppSelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select>
    </YStack>
  );
}

function AppSelectItem({
  children,
  index,
  value
}: {
  children: ReactNode;
  index: number;
  value: string;
}) {
  return (
    <Select.Item
      borderRadius="$2"
      index={index}
      paddingHorizontal="$3"
      paddingVertical="$2"
      value={value}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
