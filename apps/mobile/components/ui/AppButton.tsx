import { Button, type ButtonProps } from "tamagui";

type AppButtonTone = "primary" | "secondary";

type AppButtonProps = ButtonProps & {
  tone?: AppButtonTone;
};

export function AppButton({
  borderRadius = "$3",
  fontWeight = "700",
  size = "$5",
  tone = "primary",
  ...props
}: AppButtonProps) {
  const isPrimary = tone === "primary";

  return (
    <Button
      backgroundColor={isPrimary ? "$accent" : "$surfaceWarm"}
      borderColor={isPrimary ? "$accent" : "$borderColor"}
      borderWidth={1}
      color={isPrimary ? "$accentText" : "$color"}
      pressStyle={{
        backgroundColor: isPrimary ? "$accentHover" : "$backgroundPress"
      }}
      hoverStyle={{
        backgroundColor: isPrimary ? "$accentHover" : "$backgroundHover"
      }}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      size={size}
      {...props}
    />
  );
}
