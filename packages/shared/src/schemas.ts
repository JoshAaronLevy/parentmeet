import { z } from "zod";

import { LOCAL_AREAS } from "./constants";
import {
  AgeBand,
  AppRole,
  EventMessageType,
  HouseholdMemberType,
  HouseholdStage,
  HouseholdType,
  InterestResponseStatus,
  ManualReviewStatus,
  MeetupProposalStatus,
  ProposalOptionType,
  ProposalVisibility,
  ReportStatus,
  RsvpStatus,
  valuesOf,
  VenuePrivacy,
  VenueType
} from "./enums";

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

export const householdTypeSchema = z.enum(valuesOf(HouseholdType));
export const householdMemberTypeSchema = z.enum(valuesOf(HouseholdMemberType));
export const ageBandSchema = z.enum(valuesOf(AgeBand));
export const meetupProposalStatusSchema = z.enum(valuesOf(MeetupProposalStatus));
export const manualReviewStatusSchema = z.enum(valuesOf(ManualReviewStatus));
export const proposalVisibilitySchema = z.enum(valuesOf(ProposalVisibility));
export const venuePrivacySchema = z.enum(valuesOf(VenuePrivacy));
export const venueTypeSchema = z.enum(valuesOf(VenueType));
export const proposalOptionTypeSchema = z.enum(valuesOf(ProposalOptionType));
export const interestResponseStatusSchema = z.enum(
  valuesOf(InterestResponseStatus)
);
export const rsvpStatusSchema = z.enum(valuesOf(RsvpStatus));
export const eventMessageTypeSchema = z.enum(valuesOf(EventMessageType));
export const reportStatusSchema = z.enum(valuesOf(ReportStatus));
export const appRoleSchema = z.enum(valuesOf(AppRole));
export const localAreaIdSchema = z.enum(localAreaIds);

export const profilePreviewSchema = z.object({
  displayName: z.string().min(1),
  localAreaId: localAreaIdSchema,
  householdStages: z.array(householdStageSchema).min(1)
});

export type ProfilePreview = z.infer<typeof profilePreviewSchema>;
