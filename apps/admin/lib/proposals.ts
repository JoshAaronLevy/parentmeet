import {
  ManualReviewStatus,
  MeetupProposalStatus
} from "@parentmeet/shared";

import { createSupabaseAdminClient } from "./supabase";

export type AdminProposalListItem = {
  areaLabel: string;
  createdAt: string;
  hostHouseholdName: string | null;
  id: string;
  manualReviewStatus: string;
  status: string;
  title: string;
};

export type AdminProposalDetail = AdminProposalListItem & {
  activityNotes: string | null;
  description: string;
  desiredFamilyCountMax: number | null;
  desiredFamilyCountMin: number | null;
  flexibleFood: boolean;
  flexibleLocation: boolean;
  flexibleTime: boolean;
  foodNotes: string | null;
  interestLimit: number | null;
  manualReviewNotes: string | null;
  maxAdults: number | null;
  maxChildren: number | null;
  privateAddress: string | null;
  publicLocationName: string | null;
  targetAgeBands: string[];
  venuePrivacy: string;
  venueType: string;
  visibility: string;
};

type ProposalRow = {
  activity_notes?: string | null;
  area_label: string;
  created_at: string;
  description?: string;
  desired_family_count_max?: number | null;
  desired_family_count_min?: number | null;
  flexible_food?: boolean;
  flexible_location?: boolean;
  flexible_time?: boolean;
  food_notes?: string | null;
  host_household_id?: string;
  households?: { household_name: string } | { household_name: string }[] | null;
  id: string;
  interest_limit?: number | null;
  manual_review_notes?: string | null;
  manual_review_status: string;
  max_adults?: number | null;
  max_children?: number | null;
  private_address?: string | null;
  public_location_name?: string | null;
  status: string;
  target_age_bands?: string[];
  title: string;
  venue_privacy?: string;
  venue_type?: string;
  visibility?: string;
};

export async function getPendingProposals() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("meetup_proposals")
    .select(
      "id, title, status, manual_review_status, area_label, created_at, households:host_household_id(household_name)"
    )
    .in("manual_review_status", [
      ManualReviewStatus.Pending,
      ManualReviewStatus.NeedsChanges
    ])
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as ProposalRow[]).map(mapListItem);
}

export async function getProposalById(id: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("meetup_proposals")
    .select(
      "id, title, description, status, manual_review_status, manual_review_notes, visibility, venue_privacy, venue_type, public_location_name, private_address, area_label, target_age_bands, interest_limit, desired_family_count_min, desired_family_count_max, max_adults, max_children, food_notes, activity_notes, flexible_food, flexible_location, flexible_time, created_at, households:host_household_id(household_name)"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapDetail(data as unknown as ProposalRow);
}

export async function reviewProposal({
  id,
  notes,
  reviewStatus
}: {
  id: string;
  notes: string;
  reviewStatus:
    | typeof ManualReviewStatus.Approved
    | typeof ManualReviewStatus.Rejected
    | typeof ManualReviewStatus.NeedsChanges;
}) {
  const supabase = createSupabaseAdminClient();
  const update =
    reviewStatus === ManualReviewStatus.Approved
      ? {
          manual_review_notes: notes.trim() || null,
          manual_review_status: reviewStatus,
          status: MeetupProposalStatus.InterestOpen
        }
      : {
          manual_review_notes: notes.trim() || null,
          manual_review_status: reviewStatus
        };

  const { error } = await supabase
    .from("meetup_proposals")
    .update(update)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

function mapListItem(row: ProposalRow): AdminProposalListItem {
  return {
    areaLabel: row.area_label,
    createdAt: row.created_at,
    hostHouseholdName: getHostHouseholdName(row.households),
    id: row.id,
    manualReviewStatus: row.manual_review_status,
    status: row.status,
    title: row.title
  };
}

function getHostHouseholdName(
  value: ProposalRow["households"]
): string | null {
  if (Array.isArray(value)) {
    return value[0]?.household_name ?? null;
  }

  return value?.household_name ?? null;
}

function mapDetail(row: ProposalRow): AdminProposalDetail {
  return {
    ...mapListItem(row),
    activityNotes: row.activity_notes ?? null,
    description: row.description ?? "",
    desiredFamilyCountMax: row.desired_family_count_max ?? null,
    desiredFamilyCountMin: row.desired_family_count_min ?? null,
    flexibleFood: Boolean(row.flexible_food),
    flexibleLocation: Boolean(row.flexible_location),
    flexibleTime: Boolean(row.flexible_time),
    foodNotes: row.food_notes ?? null,
    interestLimit: row.interest_limit ?? null,
    manualReviewNotes: row.manual_review_notes ?? null,
    maxAdults: row.max_adults ?? null,
    maxChildren: row.max_children ?? null,
    privateAddress: row.private_address ?? null,
    publicLocationName: row.public_location_name ?? null,
    targetAgeBands: row.target_age_bands ?? [],
    venuePrivacy: row.venue_privacy ?? "",
    venueType: row.venue_type ?? "",
    visibility: row.visibility ?? ""
  };
}
