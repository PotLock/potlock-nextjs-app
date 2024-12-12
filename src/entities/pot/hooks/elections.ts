import { ByPotId } from "@/common/api/indexer";
import { votingHooks } from "@/common/contracts/core/voting";

export const usePotElections = ({ potId }: ByPotId) => {
  const { data: elections } = votingHooks.useElections();

  return {
    potElections: elections?.filter(
      ({ election_type }) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};

export const usePotActiveElections = ({ potId }: ByPotId) => {
  const { data: activeElections } = votingHooks.useActiveElections();

  return {
    potActiveElections: activeElections?.filter(
      ([_electionId, { election_type }]) =>
        typeof election_type === "object" && "Pot" in election_type && election_type.Pot === potId,
    ),
  };
};
