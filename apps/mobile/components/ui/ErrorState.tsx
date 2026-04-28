import { YStack, type YStackProps } from "tamagui";

import { AppButton } from "./AppButton";
import { AppText } from "./AppText";

type ErrorStateProps = YStackProps & {
  body: string;
  onRetry?: () => void;
  retryLabel?: string;
  title?: string;
};

export function ErrorState({
  body,
  onRetry,
  retryLabel = "Try again",
  title = "Something went wrong",
  ...props
}: ErrorStateProps) {
  return (
    <YStack
      backgroundColor="$criticalSurface"
      borderColor="$critical"
      borderRadius="$3"
      borderWidth={1}
      gap="$3"
      padding="$4"
      {...props}
    >
      <AppText color="$critical" fontWeight="700">
        {title}
      </AppText>
      <AppText color="$color">{body}</AppText>
      {onRetry ? (
        <AppButton onPress={onRetry} size="$4" tone="secondary">
          {retryLabel}
        </AppButton>
      ) : null}
    </YStack>
  );
}
