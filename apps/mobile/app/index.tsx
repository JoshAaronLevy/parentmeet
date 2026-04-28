import { APP_NAME, LOCAL_AREAS } from "@parentmeet/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, H1, Paragraph, Separator, Text, XStack, YStack } from "tamagui";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffaf2" }}>
      <YStack flex={1} padding="$5" gap="$5" justifyContent="center">
        <YStack gap="$2">
          <Text color="$orange10" fontWeight="700">
            {APP_NAME}
          </Text>
          <H1 size="$9">Meet local families offline.</H1>
          <Paragraph size="$5" color="$gray11">
            A quiet starting point for host-created parent meetups in nearby
            neighborhoods.
          </Paragraph>
        </YStack>

        <Card bordered elevate size="$4" padding="$4" backgroundColor="white">
          <YStack gap="$3">
            <Text fontWeight="700">Pilot areas</Text>
            <Separator />
            {LOCAL_AREAS.map((area) => (
              <XStack key={area.id} justifyContent="space-between" gap="$3">
                <Text>{area.label}</Text>
                <Text color="$gray10">{area.region}</Text>
              </XStack>
            ))}
          </YStack>
        </Card>

        <Button theme="orange" size="$5">
          Start a meetup proposal
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
