import { Card, type CardProps } from "tamagui";

export function AppCard({
  backgroundColor = "$surface",
  borderColor = "$borderColor",
  borderRadius = "$3",
  borderWidth = 1,
  padding = "$4",
  shadowColor = "$shadowColor",
  shadowOffset = { height: 8, width: 0 },
  shadowOpacity = 0.08,
  shadowRadius = 20,
  ...props
}: CardProps) {
  return (
    <Card
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      padding={padding}
      shadowColor={shadowColor}
      shadowOffset={shadowOffset}
      shadowOpacity={shadowOpacity}
      shadowRadius={shadowRadius}
      {...props}
    />
  );
}
