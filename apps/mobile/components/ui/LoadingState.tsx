import { Spinner, XStack, type XStackProps } from "tamagui";

import { AppText } from "./AppText";

type LoadingStateProps = XStackProps & {
  label?: string;
};

export function LoadingState({ label = "Loading", ...props }: LoadingStateProps) {
  return (
    <XStack
      alignItems="center"
      backgroundColor="$surfaceWarm"
      borderColor="$borderColor"
      borderRadius="$3"
      borderWidth={1}
      gap="$3"
      padding="$4"
      {...props}
    >
      <Spinner color="$accent" size="small" />
      <AppText color="$muted">{label}</AppText>
    </XStack>
  );
}
