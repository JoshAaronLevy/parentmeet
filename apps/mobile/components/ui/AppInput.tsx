import { Input, type InputProps } from "tamagui";

export function AppInput({
  backgroundColor = "$surface",
  borderColor = "$borderColor",
  borderRadius = "$3",
  color = "$color",
  height = "$9",
  paddingHorizontal = "$3",
  placeholderTextColor = "$placeholderColor",
  ...props
}: InputProps) {
  return (
    <Input
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
      color={color}
      height={height}
      paddingHorizontal={paddingHorizontal}
      placeholderTextColor={placeholderTextColor}
      focusStyle={{ borderColor: "$accent" }}
      {...props}
    />
  );
}
