import type { AgeBand, HouseholdInterestId, LocalAreaId } from "@parentmeet/shared";
import { LOCAL_AREAS } from "@parentmeet/shared";
import { create } from "zustand";

type OnboardingState = {
  additionalAreaIds: LocalAreaId[];
  adultNames: string[];
  bio: string;
  childAgeBands: AgeBand[];
  expectedDueWindow: string;
  householdName: string;
  interests: HouseholdInterestId[];
  isExpectantParent: boolean;
  isParentHousehold: boolean;
  primaryAreaId: LocalAreaId;
  reset: () => void;
  setAdditionalAreaIds: (areaIds: LocalAreaId[]) => void;
  setAdultNames: (names: string[]) => void;
  setBio: (bio: string) => void;
  setChildAgeBands: (ageBands: AgeBand[]) => void;
  setEligibility: (value: {
    isExpectantParent?: boolean;
    isParentHousehold?: boolean;
  }) => void;
  setExpectedDueWindow: (dueWindow: string) => void;
  setHouseholdName: (name: string) => void;
  setInterests: (interests: HouseholdInterestId[]) => void;
  setPrimaryAreaId: (areaId: LocalAreaId) => void;
};

const initialState = {
  additionalAreaIds: [] as LocalAreaId[],
  adultNames: [""] as string[],
  bio: "",
  childAgeBands: [] as AgeBand[],
  expectedDueWindow: "",
  householdName: "",
  interests: [] as HouseholdInterestId[],
  isExpectantParent: false,
  isParentHousehold: true,
  primaryAreaId: LOCAL_AREAS[0].id
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setAdditionalAreaIds: (additionalAreaIds) => set({ additionalAreaIds }),
  setAdultNames: (adultNames) => set({ adultNames }),
  setBio: (bio) => set({ bio }),
  setChildAgeBands: (childAgeBands) => set({ childAgeBands }),
  setEligibility: (value) => set(value),
  setExpectedDueWindow: (expectedDueWindow) => set({ expectedDueWindow }),
  setHouseholdName: (householdName) => set({ householdName }),
  setInterests: (interests) => set({ interests }),
  setPrimaryAreaId: (primaryAreaId) => set({ primaryAreaId })
}));
