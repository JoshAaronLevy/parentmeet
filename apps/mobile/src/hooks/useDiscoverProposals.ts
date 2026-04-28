import { useQuery } from "@tanstack/react-query";

import { getDiscoverProposals } from "../services/proposals";

export function useDiscoverProposals() {
  return useQuery({
    queryFn: getDiscoverProposals,
    queryKey: ["discover-proposals"]
  });
}
