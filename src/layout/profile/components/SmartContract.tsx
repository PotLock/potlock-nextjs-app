import { NEARSocialUserProfile } from "@/common/contracts/social";
import { ClipboardCopyButton } from "@/common/ui/components";

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

const SmartContract = ({ profile }: { profile?: NEARSocialUserProfile }) => {
  const smartContracts = getProfileSmartContracts(profile);

  return (
    <div className="flex w-full flex-col gap-4">
      {smartContracts.map(([chain, contract]: any) => {
        return (
          <div className="flex items-center gap-4" key={contract}>
            <ClipboardCopyButton text={contract} />
            <div className="flex flex-col">
              <p className="">{contract}</p>
              <p className="text-sm text-[#7b7b7b]">{chain}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SmartContract;
