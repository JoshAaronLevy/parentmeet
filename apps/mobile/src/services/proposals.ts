import {
  LOCAL_AREAS,
  ManualReviewStatus,
  MeetupProposalStatus,
  ProposalOptionType,
  ProposalVisibility,
  VenuePrivacy,
  VenueType
} from "@parentmeet/shared";

import { supabase } from "../lib/supabase";
import type { HouseholdSummary } from "./onboarding";
import type { ProposalDraft } from "../stores/createProposalStore";

type ProposalRow = {
  id: string;
};

export type MyProposalSummary = {
  areaLabel: string;
  createdAt: string;
  id: string;
  manualReviewStatus: string;
  status: string;
  title: string;
};

export type DiscoverProposalSummary = {
  areaLabel: string;
  id: string;
  publicLocationName: string | null;
  status: string;
  title: string;
  venuePrivacy: string;
  venueType: string;
};

export async function submitProposalForReview({
  draft,
  household
}: {
  draft: ProposalDraft;
  household: HouseholdSummary;
}) {
  const area = LOCAL_AREAS.find((item) => item.id === draft.areaId);

  if (!area) {
    throw new Error("Select a valid area.");
  }

  const title = draft.title.trim();
  const description = draft.description.trim();
  const isPrivateVenue =
    draft.venuePrivacy === VenuePrivacy.PrivateAddressAfterApproval;
  const publicLocationName = draft.publicLocationName.trim();
  const privateAddress = draft.privateAddress.trim();

  if (!title) {
    throw new Error("Add a proposal title.");
  }

  if (!description) {
    throw new Error("Add a short proposal description.");
  }

  if (isPrivateVenue && !privateAddress) {
    throw new Error("Add the private address for host approval records.");
  }

  if (!isPrivateVenue && !publicLocationName) {
    throw new Error("Add the public location name.");
  }

  const { data: proposal, error: proposalError } = await supabase
    .from("meetup_proposals")
    .insert({
      activity_notes: cleanNullable(draft.activityNotes),
      area_id: area.id,
      area_label: area.label,
      desired_family_count_max: parseOptionalInt(draft.desiredFamilyCountMax),
      desired_family_count_min: parseOptionalInt(draft.desiredFamilyCountMin),
      description,
      flexible_food: draft.flexibleFood,
      flexible_location: draft.flexibleLocation,
      flexible_time: draft.flexibleTime,
      food_notes: cleanNullable(draft.foodNotes),
      host_household_id: household.id,
      interest_limit: parseOptionalInt(draft.interestLimit),
      manual_review_status: ManualReviewStatus.Pending,
      max_adults: parseOptionalInt(draft.maxAdults),
      max_children: parseOptionalInt(draft.maxChildren),
      private_address: isPrivateVenue ? privateAddress : null,
      public_location_name: isPrivateVenue ? null : publicLocationName,
      status: MeetupProposalStatus.PendingReview,
      target_age_bands: draft.targetAgeBands,
      title,
      venue_privacy: draft.venuePrivacy,
      venue_type: draft.venueType,
      visibility: draft.visibility
    })
    .select("id")
    .single<ProposalRow>();

  if (proposalError) {
    throw proposalError;
  }

  const optionRows = buildOptionRows(proposal.id, draft);

  if (optionRows.length > 0) {
    const { error: optionsError } = await supabase
      .from("proposal_options")
      .insert(optionRows);

    if (optionsError) {
      throw optionsError;
    }
  }

  return proposal;
}

export async function getMyProposals(householdId: string) {
  const { data, error } = await supabase
    .from("meetup_proposals")
    .select("id, title, status, manual_review_status, area_label, created_at")
    .eq("host_household_id", householdId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    areaLabel: row.area_label,
    createdAt: row.created_at,
    id: row.id,
    manualReviewStatus: row.manual_review_status,
    status: row.status,
    title: row.title
  })) satisfies MyProposalSummary[];
}

export async function getDiscoverProposals() {
  const { data, error } = await supabase
    .from("meetup_proposals_public")
    .select(
      "id, title, status, area_label, venue_privacy, venue_type, public_location_name"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    areaLabel: row.area_label,
    id: row.id,
    publicLocationName: row.public_location_name,
    status: row.status,
    title: row.title,
    venuePrivacy: row.venue_privacy,
    venueType: row.venue_type
  })) satisfies DiscoverProposalSummary[];
}

function buildOptionRows(proposalId: string, draft: ProposalDraft) {
  const timeRows = draft.candidateTimeOptions
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label, index) => ({
      label,
      option_type: ProposalOptionType.Time,
      proposal_id: proposalId,
      sort_order: index
    }));

  const locationRows = draft.candidateLocationOptions
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label, index) => ({
      label,
      location_label: label,
      option_type: ProposalOptionType.Location,
      proposal_id: proposalId,
      sort_order: index
    }));

  return [...timeRows, ...locationRows];
}

function cleanNullable(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function parseOptionalInt(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  if (Number.isNaN(parsed)) {
    throw new Error("Use whole numbers for capacity and limits.");
  }

  return parsed;
}

export const proposalVisibilityOptions = [
  {
    label: "Local public after approval",
    value: ProposalVisibility.LocalPublic
  },
  {
    label: "Private invitation only",
    value: ProposalVisibility.Private
  }
];

export const venuePrivacyOptions = [
  {
    label: "Public location",
    value: VenuePrivacy.PublicLocation
  },
  {
    label: "Private address after approval",
    value: VenuePrivacy.PrivateAddressAfterApproval
  }
];

export const venueTypeOptions = [
  { label: "Home", value: VenueType.Home },
  { label: "Park", value: VenueType.Park },
  { label: "Library", value: VenueType.Library },
  { label: "Community space", value: VenueType.CommunitySpace },
  { label: "Business", value: VenueType.Business },
  { label: "Other", value: VenueType.Other }
];
