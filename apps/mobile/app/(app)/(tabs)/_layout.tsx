import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#9a4f1e",
        tabBarInactiveTintColor: "#8a8075",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#eadfce",
          minHeight: 64,
          paddingBottom: 10,
          paddingTop: 8
        }
      }}
    >
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="my-meetups" options={{ title: "My Meetups" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
