import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, YStack, type YStackProps } from "tamagui";

type ScreenProps = YStackProps & {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true, ...stackProps }: ScreenProps) {
  const content = (
    <YStack flex={1} gap="$5" padding="$5" width="100%" {...stackProps}>
      {children}
    </YStack>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#fffaf2", flex: 1 }}>
      {scroll ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{content}</ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
