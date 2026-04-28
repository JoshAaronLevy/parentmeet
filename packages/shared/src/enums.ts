export const HouseholdStage = {
  Expecting: "expecting",
  Newborn: "newborn",
  Toddler: "toddler",
  Preschool: "preschool",
  SchoolAge: "school_age"
} as const;

export type HouseholdStage =
  (typeof HouseholdStage)[keyof typeof HouseholdStage];

export const HouseholdType = {
  Caregiver: "caregiver",
  Expecting: "expecting",
  ExpectingAndParent: "expecting_and_parent",
  Parent: "parent"
} as const;

export type HouseholdType = (typeof HouseholdType)[keyof typeof HouseholdType];

export const HouseholdMemberType = {
  Adult: "adult",
  Child: "child",
  ExpectedChild: "expected_child"
} as const;

export type HouseholdMemberType =
  (typeof HouseholdMemberType)[keyof typeof HouseholdMemberType];

export const AgeBand = {
  EarlyElementary: "early_elementary",
  Elementary: "elementary",
  Expecting: "expecting",
  Infant: "infant",
  MiddleSchool: "middle_school",
  Newborn: "newborn",
  Preschool: "preschool",
  Teen: "teen",
  Toddler: "toddler"
} as const;

export type AgeBand = (typeof AgeBand)[keyof typeof AgeBand];

export const MeetupProposalStatus = {
  Canceled: "canceled",
  Completed: "completed",
  Confirmed: "confirmed",
  Draft: "draft",
  Finalizing: "finalizing",
  InterestOpen: "interest_open",
  PendingReview: "pending_review",
  RsvpOpen: "rsvp_open"
} as const;

export type MeetupProposalStatus =
  (typeof MeetupProposalStatus)[keyof typeof MeetupProposalStatus];

export const ManualReviewStatus = {
  Approved: "approved",
  NeedsChanges: "needs_changes",
  Pending: "pending",
  Rejected: "rejected"
} as const;

export type ManualReviewStatus =
  (typeof ManualReviewStatus)[keyof typeof ManualReviewStatus];

export const ProposalVisibility = {
  LocalPublic: "local_public",
  Private: "private"
} as const;

export type ProposalVisibility =
  (typeof ProposalVisibility)[keyof typeof ProposalVisibility];

export const VenuePrivacy = {
  PrivateAddressAfterApproval: "private_address_after_approval",
  PublicLocation: "public_location"
} as const;

export type VenuePrivacy = (typeof VenuePrivacy)[keyof typeof VenuePrivacy];

export const VenueType = {
  Business: "business",
  CommunitySpace: "community_space",
  Home: "home",
  Library: "library",
  Other: "other",
  Park: "park"
} as const;

export type VenueType = (typeof VenueType)[keyof typeof VenueType];

export const ProposalOptionType = {
  Format: "format",
  Location: "location",
  Time: "time"
} as const;

export type ProposalOptionType =
  (typeof ProposalOptionType)[keyof typeof ProposalOptionType];

export const InterestResponseStatus = {
  Interested: "interested",
  Invited: "invited",
  NotSelected: "not_selected",
  Withdrawn: "withdrawn"
} as const;

export type InterestResponseStatus =
  (typeof InterestResponseStatus)[keyof typeof InterestResponseStatus];

export const RsvpStatus = {
  Approved: "approved",
  Attended: "attended",
  Canceled: "canceled",
  Declined: "declined",
  LateCancel: "late_cancel",
  NoShow: "no_show",
  Requested: "requested"
} as const;

export type RsvpStatus = (typeof RsvpStatus)[keyof typeof RsvpStatus];

export const EventMessageType = {
  ApprovedAttendeeMessage: "approved_attendee_message",
  HostAnnouncement: "host_announcement",
  System: "system"
} as const;

export type EventMessageType =
  (typeof EventMessageType)[keyof typeof EventMessageType];

export const ReportStatus = {
  Dismissed: "dismissed",
  Open: "open",
  Resolved: "resolved",
  Reviewing: "reviewing"
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const AppRole = {
  Admin: "admin",
  Member: "member",
  Moderator: "moderator"
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];

export function valuesOf<T extends Record<string, string>>(value: T) {
  return Object.values(value) as [T[keyof T], ...T[keyof T][]];
}
