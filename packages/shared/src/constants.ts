export const APP_NAME = "ParentMeet";

export const LOCAL_AREAS = [
  {
    id: "denver-central",
    label: "Central Denver",
    region: "Denver, CO"
  },
  {
    id: "denver-northwest",
    label: "Northwest Denver",
    region: "Denver, CO"
  },
  {
    id: "aurora-west",
    label: "West Aurora",
    region: "Aurora, CO"
  }
] as const;

export type LocalAreaId = (typeof LOCAL_AREAS)[number]["id"];
