import { Redirect, type Href } from "expo-router";

const discoverHref = "/(app)/(tabs)/discover" as Href;

export default function AppIndex() {
  return <Redirect href={discoverHref} />;
}
