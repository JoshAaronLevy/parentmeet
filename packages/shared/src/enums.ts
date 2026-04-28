export const HouseholdStage = {
  Expecting: "expecting",
  Newborn: "newborn",
  Toddler: "toddler",
  Preschool: "preschool",
  SchoolAge: "school_age"
} as const;

export type HouseholdStage =
  (typeof HouseholdStage)[keyof typeof HouseholdStage];
