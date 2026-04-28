export const APP_NAME = "ParentMeet";

export const LOCAL_AREAS = [
  {
    city: "Highlands Ranch",
    id: "westridge",
    label: "Westridge",
    region: "Highlands Ranch, CO"
  },
  {
    city: "Highlands Ranch",
    id: "highlands_ranch_central",
    label: "Highlands Ranch Central",
    region: "Highlands Ranch, CO"
  },
  {
    city: "Highlands Ranch",
    id: "highlands_ranch_eastridge",
    label: "Eastridge",
    region: "Highlands Ranch, CO"
  },
  {
    city: "Highlands Ranch",
    id: "highlands_ranch_southridge",
    label: "Southridge",
    region: "Highlands Ranch, CO"
  },
  {
    city: "Lone Tree",
    id: "lone_tree",
    label: "Lone Tree",
    region: "Douglas County, CO"
  },
  {
    city: "Littleton",
    id: "littleton",
    label: "Littleton",
    region: "Arapahoe/Douglas/Jefferson County, CO"
  },
  {
    city: "Parker",
    id: "parker",
    label: "Parker",
    region: "Douglas County, CO"
  },
  {
    city: "Centennial",
    id: "centennial",
    label: "Centennial",
    region: "Arapahoe County, CO"
  }
] as const;

export type LocalAreaId = (typeof LOCAL_AREAS)[number]["id"];

export const HOUSEHOLD_INTERESTS = [
  "playgrounds",
  "stroller_walks",
  "library_storytime",
  "weekend_mornings",
  "after_school",
  "expecting_parents",
  "new_parents",
  "outdoor_play",
  "coffee_meetups",
  "sensory_friendly"
] as const;

export type HouseholdInterestId = (typeof HOUSEHOLD_INTERESTS)[number];

export const HOUSEHOLD_INTEREST_LABELS: Record<HouseholdInterestId, string> = {
  after_school: "After school",
  coffee_meetups: "Coffee meetups",
  expecting_parents: "Expecting parents",
  library_storytime: "Library storytime",
  new_parents: "New parents",
  outdoor_play: "Outdoor play",
  playgrounds: "Playgrounds",
  sensory_friendly: "Sensory-friendly",
  stroller_walks: "Stroller walks",
  weekend_mornings: "Weekend mornings"
};
