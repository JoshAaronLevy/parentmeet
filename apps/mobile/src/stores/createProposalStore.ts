import {
  AgeBand,
  ProposalVisibility,
  VenuePrivacy,
  VenueType,
  type LocalAreaId
} from "@parentmeet/shared";
import { LOCAL_AREAS } from "@parentmeet/shared";
import { create } from "zustand";

export type ProposalDraft = {
  activityNotes: string;
  areaId: LocalAreaId;
  candidateLocationOptions: string[];
  candidateTimeOptions: string[];
  description: string;
  desiredFamilyCountMax: string;
  desiredFamilyCountMin: string;
  flexibleFood: boolean;
  flexibleLocation: boolean;
  flexibleTime: boolean;
  foodNotes: string;
  interestLimit: string;
  maxAdults: string;
  maxChildren: string;
  privateAddress: string;
  publicLocationName: string;
  targetAgeBands: AgeBand[];
  title: string;
  venuePrivacy: VenuePrivacy;
  venueType: VenueType;
  visibility: ProposalVisibility;
};

type CreateProposalState = ProposalDraft & {
  reset: () => void;
  setBasics: (value: Partial<Pick<ProposalDraft, "areaId" | "description" | "targetAgeBands" | "title">>) => void;
  setCapacity: (value: Partial<Pick<ProposalDraft, "desiredFamilyCountMax" | "desiredFamilyCountMin" | "interestLimit" | "maxAdults" | "maxChildren">>) => void;
  setDetails: (value: Partial<Pick<ProposalDraft, "activityNotes" | "flexibleFood" | "foodNotes">>) => void;
  setOptions: (value: Partial<Pick<ProposalDraft, "candidateLocationOptions" | "candidateTimeOptions" | "flexibleLocation" | "flexibleTime">>) => void;
  setPrivacy: (value: Partial<Pick<ProposalDraft, "privateAddress" | "publicLocationName" | "venuePrivacy" | "venueType" | "visibility">>) => void;
};

const initialDraft: ProposalDraft = {
  activityNotes: "",
  areaId: LOCAL_AREAS[0].id,
  candidateLocationOptions: [""],
  candidateTimeOptions: [""],
  description: "",
  desiredFamilyCountMax: "",
  desiredFamilyCountMin: "",
  flexibleFood: false,
  flexibleLocation: false,
  flexibleTime: false,
  foodNotes: "",
  interestLimit: "",
  maxAdults: "",
  maxChildren: "",
  privateAddress: "",
  publicLocationName: "",
  targetAgeBands: [],
  title: "",
  venuePrivacy: VenuePrivacy.PublicLocation,
  venueType: VenueType.Park,
  visibility: ProposalVisibility.LocalPublic
};

export const useCreateProposalStore = create<CreateProposalState>((set) => ({
  ...initialDraft,
  reset: () => set(initialDraft),
  setBasics: (value) => set(value),
  setCapacity: (value) => set(value),
  setDetails: (value) => set(value),
  setOptions: (value) => set(value),
  setPrivacy: (value) => set(value)
}));
