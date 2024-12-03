import { NEARSocialUserProfile } from "@/common/contracts/social";

const getProfileSmartContracts = (profile?: NEARSocialUserProfile) => {
  const smartContracts = profile?.plSmartContracts
    ? Object.entries(JSON.parse(profile.plSmartContracts)).reduce(
        (accumulator, [chain, contracts]: any) => {
          // Iterate over each contract address in the current chain
          const contractsForChain: any = Object.keys(contracts).map((contractAddress) => {
            return [chain, contractAddress]; // Create an array with the chain and contract address
          });

          return accumulator.concat(contractsForChain); // Add the arrays for this chain to the accumulator
        },
        [],
      )
    : [];

  return smartContracts as [string, string][];
};

export default getProfileSmartContracts;
