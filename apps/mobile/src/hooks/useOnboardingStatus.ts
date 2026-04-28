import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../providers/AuthProvider";
import { getOnboardingStatus } from "../services/onboarding";

export function useOnboardingStatus() {
  const { user } = useAuth();

  return useQuery({
    enabled: Boolean(user),
    queryFn: () => {
      if (!user) {
        throw new Error("No authenticated user.");
      }

      return getOnboardingStatus(user);
    },
    queryKey: ["onboarding-status", user?.id]
  });
}
