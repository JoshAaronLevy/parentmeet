import { z } from "zod";

import { LOCAL_AREAS } from "./constants";
import { HouseholdStage } from "./enums";

const localAreaIds = LOCAL_AREAS.map((area) => area.id) as [
  (typeof LOCAL_AREAS)[number]["id"],
  ...(typeof LOCAL_AREAS)[number]["id"][]
];

export const householdStageSchema = z.enum([
  HouseholdStage.Expecting,
  HouseholdStage.Newborn,
  HouseholdStage.Toddler,
  HouseholdStage.Preschool,
  HouseholdStage.SchoolAge
]);

export const localAreaIdSchema = z.enum(localAreaIds);

export const profilePreviewSchema = z.object({
  displayName: z.string().min(1),
  localAreaId: localAreaIdSchema,
  householdStages: z.array(householdStageSchema).min(1)
});

export type ProfilePreview = z.infer<typeof profilePreviewSchema>;
