import {
  HouseholdMemberType,
  HouseholdType,
  LOCAL_AREAS,
  type AgeBand,
  type HouseholdInterestId,
  type LocalAreaId
} from "@parentmeet/shared";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type HouseholdSummary = {
  areaIds: string[];
  bio: string | null;
  city: string;
  householdName: string;
  householdType: string;
  id: string;
  interests: string[];
  isExpectantParent: boolean;
  isParentHousehold: boolean;
  primaryAreaId: string;
};

export type ProfileSummary = {
  displayName: string;
  firstName: string;
  id: string;
};

export type OnboardingStatus = {
  household: HouseholdSummary | null;
  isComplete: boolean;
  profile: ProfileSummary | null;
};

export type CompleteOnboardingInput = {
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
  user: User;
};

type ProfileRow = {
  display_name: string;
  first_name: string;
  id: string;
};

type HouseholdRow = {
  area_ids: string[];
  bio: string | null;
  city: string;
  household_name: string;
  household_type: string;
  id: string;
  interests: string[];
  is_expectant_parent: boolean;
  is_parent_household: boolean;
  primary_area_id: string;
};

export async function getOnboardingStatus(user: User): Promise<OnboardingStatus> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, first_name, display_name")
    .eq("auth_user_id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    return {
      household: null,
      isComplete: false,
      profile: null
    };
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .select(
      "id, household_name, household_type, bio, city, primary_area_id, area_ids, is_expectant_parent, is_parent_household, interests"
    )
    .eq("created_by_profile_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<HouseholdRow>();

  if (householdError) {
    throw householdError;
  }

  return {
    household: household ? mapHousehold(household) : null,
    isComplete: Boolean(household),
    profile: {
      displayName: profile.display_name,
      firstName: profile.first_name,
      id: profile.id
    }
  };
}

export async function completeOnboarding(input: CompleteOnboardingInput) {
  const adultNames = input.adultNames
    .map((name) => name.trim())
    .filter(Boolean);
  const firstAdultName = adultNames[0] ?? input.user.email ?? "Parent";
  const firstName = firstAdultName.split(/\s+/)[0] ?? "Parent";
  const primaryArea = LOCAL_AREAS.find((area) => area.id === input.primaryAreaId);

  if (!primaryArea) {
    throw new Error("Select a valid primary area.");
  }

  const areaIds = uniqueValues([
    input.primaryAreaId,
    ...input.additionalAreaIds
  ]);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        auth_user_id: input.user.id,
        display_name: firstAdultName,
        first_name: firstName
      },
      { onConflict: "auth_user_id" }
    )
    .select("id, first_name, display_name")
    .single<ProfileRow>();

  if (profileError) {
    throw profileError;
  }

  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({
      area_ids: areaIds,
      bio: input.bio.trim() || null,
      city: primaryArea.city,
      created_by_profile_id: profile.id,
      household_name: input.householdName.trim(),
      household_type: getHouseholdType(input),
      interests: input.interests,
      is_expectant_parent: input.isExpectantParent,
      is_parent_household: input.isParentHousehold,
      primary_area_id: input.primaryAreaId
    })
    .select(
      "id, household_name, household_type, bio, city, primary_area_id, area_ids, is_expectant_parent, is_parent_household, interests"
    )
    .single<HouseholdRow>();

  if (householdError) {
    throw householdError;
  }

  const memberRows = [
    ...adultNames.map((name) => ({
      display_name: name,
      household_id: household.id,
      member_type: HouseholdMemberType.Adult
    })),
    ...input.childAgeBands.map((ageBand) => ({
      age_band: ageBand,
      household_id: household.id,
      member_type: HouseholdMemberType.Child
    })),
    ...(input.isExpectantParent
      ? [
          {
            due_window: input.expectedDueWindow.trim() || null,
            household_id: household.id,
            member_type: HouseholdMemberType.ExpectedChild
          }
        ]
      : [])
  ];

  if (memberRows.length > 0) {
    const { error: membersError } = await supabase
      .from("household_members")
      .insert(memberRows);

    if (membersError) {
      throw membersError;
    }
  }

  return {
    household: mapHousehold(household),
    profile: {
      displayName: profile.display_name,
      firstName: profile.first_name,
      id: profile.id
    }
  };
}

function getHouseholdType(input: CompleteOnboardingInput) {
  if (input.isExpectantParent && input.isParentHousehold) {
    return HouseholdType.ExpectingAndParent;
  }

  if (input.isExpectantParent) {
    return HouseholdType.Expecting;
  }

  if (input.isParentHousehold) {
    return HouseholdType.Parent;
  }

  return HouseholdType.Caregiver;
}

function mapHousehold(row: HouseholdRow): HouseholdSummary {
  return {
    areaIds: row.area_ids,
    bio: row.bio,
    city: row.city,
    householdName: row.household_name,
    householdType: row.household_type,
    id: row.id,
    interests: row.interests,
    isExpectantParent: row.is_expectant_parent,
    isParentHousehold: row.is_parent_household,
    primaryAreaId: row.primary_area_id
  };
}

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values));
}
