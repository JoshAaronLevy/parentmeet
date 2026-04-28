import { XStack, type XStackProps } from "tamagui";

import { AppText } from "./AppText";

type AppTagProps = XStackProps & {
  label: string;
  tone?: "neutral" | "success";
};

export function AppTag({ label, tone = "neutral", ...props }: AppTagProps) {
  return (
    <XStack
      alignItems="center"
      alignSelf="flex-start"
      backgroundColor={tone === "success" ? "$tagBackground" : "$surfaceWarm"}
      borderColor={tone === "success" ? "$tagText" : "$borderColor"}
      borderRadius="$2"
      borderWidth={1}
      paddingHorizontal="$2"
      paddingVertical="$1"
      {...props}
    >
      <AppText color={tone === "success" ? "$tagText" : "$muted"} variant="caption">
        {label}
      </AppText>
    </XStack>
  );
}
