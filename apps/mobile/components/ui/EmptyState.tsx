import { YStack, type YStackProps } from "tamagui";

import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

type EmptyStateProps = YStackProps & {
  actionLabel?: string;
  body: string;
  onActionPress?: () => void;
  title: string;
};

export function EmptyState({
  actionLabel,
  body,
  onActionPress,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <YStack
      alignItems="flex-start"
      backgroundColor="$surfaceWarm"
      borderColor="$borderColor"
      borderRadius="$3"
      borderWidth={1}
      gap="$3"
      padding="$4"
      {...props}
    >
      <AppText variant="subtitle">{title}</AppText>
      <AppText color="$muted">{body}</AppText>
      {actionLabel ? (
        <AppButton onPress={onActionPress} size="$4" tone="secondary">
          {actionLabel}
        </AppButton>
      ) : null}
    </YStack>
  );
}
