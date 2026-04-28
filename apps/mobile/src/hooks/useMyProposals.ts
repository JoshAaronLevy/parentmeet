import { useQuery } from "@tanstack/react-query";

import { useOnboardingStatus } from "./useOnboardingStatus";
import { getMyProposals } from "../services/proposals";

export function useMyProposals() {
  const { data: onboardingStatus } = useOnboardingStatus();
  const householdId = onboardingStatus?.household?.id;

  return useQuery({
    enabled: Boolean(householdId),
    queryFn: () => {
      if (!householdId) {
        throw new Error("No household found.");
      }

      return getMyProposals(householdId);
    },
    queryKey: ["my-proposals", householdId]
  });
}
