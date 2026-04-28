import { Checkbox, Label, XStack, YStack, type CheckboxProps } from "tamagui";

type AppCheckboxProps = CheckboxProps & {
  label: string;
};

export function AppCheckbox({ id, label, ...props }: AppCheckboxProps) {
  const checkboxId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <XStack alignItems="center" gap="$3">
      <Checkbox
        id={checkboxId}
        backgroundColor="$surface"
        borderColor="$borderColor"
        borderRadius="$2"
        size="$4"
        {...props}
      >
        <Checkbox.Indicator>
          <YStack
            backgroundColor="$accent"
            borderRadius="$1"
            height={10}
            width={10}
          />
        </Checkbox.Indicator>
      </Checkbox>
      <Label color="$color" htmlFor={checkboxId}>
        {label}
      </Label>
    </XStack>
  );
}
