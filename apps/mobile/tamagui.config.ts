import { animations, media, shorthands } from "@tamagui/config/v3";
import { createFont, createTamagui, createTokens } from "tamagui";

const size = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 56,
  11: 64,
  12: 80,
  true: 16
};

const tokens = createTokens({
  color: {
    cream1: "#fffaf2",
    cream2: "#f7efe2",
    cream3: "#efe2cf",
    clay1: "#b9652b",
    clay2: "#9a4f1e",
    sage1: "#dce8d2",
    sage2: "#6f855f",
    ink1: "#2f2a24",
    ink2: "#5f574e",
    ink3: "#8a8075",
    white: "#ffffff",
    red1: "#b34132",
    green1: "#427552"
  },
  radius: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 12,
    5: 16,
    true: 8
  },
  size,
  space: {
    ...size,
    true: 16
  },
  zIndex: {
    0: 0,
    1: 10,
    2: 100,
    3: 1000,
    true: 0
  }
});

const bodyFont = createFont({
  family:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    true: 0
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 30,
    5: 38,
    true: 24
  },
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 20,
    5: 28,
    true: 16
  },
  weight: {
    4: "400",
    5: "500",
    6: "600",
    7: "700",
    true: "400"
  }
});

const lightTheme = {
  background: "#fffaf2",
  backgroundHover: "#f7efe2",
  backgroundPress: "#efe2cf",
  borderColor: "#eadfce",
  borderColorHover: "#d8c8b1",
  color: "#2f2a24",
  colorHover: "#2f2a24",
  colorPress: "#2f2a24",
  placeholderColor: "#8a8075",
  shadowColor: "#2f2a24",
  accent: "#b9652b",
  accentHover: "#9a4f1e",
  accentText: "#ffffff",
  critical: "#b34132",
  criticalSurface: "#f7ded8",
  muted: "#5f574e",
  surface: "#ffffff",
  surfaceWarm: "#f7efe2",
  success: "#427552",
  tagBackground: "#dce8d2",
  tagText: "#3f5637"
};

const darkTheme = {
  ...lightTheme,
  background: "#211d19",
  backgroundHover: "#2f2a24",
  backgroundPress: "#3f3831",
  borderColor: "#4c443b",
  borderColorHover: "#64594e",
  color: "#fffaf2",
  colorHover: "#fffaf2",
  colorPress: "#fffaf2",
  placeholderColor: "#c8bba9",
  shadowColor: "#000000",
  muted: "#d8c8b1",
  surface: "#2f2a24",
  surfaceWarm: "#3f3831",
  tagBackground: "#3f5637",
  tagText: "#eef5e9"
};

const tamaguiConfig = createTamagui({
  animations,
  defaultFont: "body",
  fonts: {
    body: bodyFont,
    heading: bodyFont
  },
  media,
  shorthands,
  themes: {
    dark: darkTheme,
    light: lightTheme
  },
  tokens
});

export default tamaguiConfig;

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}
