import { Text, type TextProps } from "tamagui";

type AppTextVariant = "body" | "caption" | "label" | "subtitle" | "title";

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
};

const variantProps: Record<AppTextVariant, TextProps> = {
  body: {
    color: "$color",
    fontSize: "$3",
    lineHeight: "$3"
  },
  caption: {
    color: "$muted",
    fontSize: "$1",
    lineHeight: "$1"
  },
  label: {
    color: "$muted",
    fontSize: "$1",
    fontWeight: "700",
    lineHeight: "$1",
    textTransform: "uppercase"
  },
  subtitle: {
    color: "$muted",
    fontSize: "$3",
    lineHeight: "$3"
  },
  title: {
    color: "$color",
    fontSize: "$5",
    fontWeight: "700",
    lineHeight: "$5"
  }
};

export function AppText({ variant = "body", ...props }: AppTextProps) {
  return <Text {...variantProps[variant]} {...props} />;
}
