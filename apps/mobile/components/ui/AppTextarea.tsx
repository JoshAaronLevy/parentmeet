import { TextArea, type TextAreaProps } from "tamagui";

export function AppTextarea({
  backgroundColor = "$surface",
  borderColor = "$borderColor",
  borderRadius = "$3",
  color = "$color",
  minHeight = 112,
  padding = "$3",
  placeholderTextColor = "$placeholderColor",
  ...props
}: TextAreaProps) {
  return (
    <TextArea
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
      color={color}
      minHeight={minHeight}
      padding={padding}
      placeholderTextColor={placeholderTextColor}
      focusStyle={{ borderColor: "$accent" }}
      {...props}
    />
  );
}
