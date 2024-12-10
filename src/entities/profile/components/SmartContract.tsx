import { NEARSocialUserProfile } from "@/common/contracts/social";
import { ClipboardCopyButton } from "@/common/ui/components";

import getProfileSmartContracts from "../utils/getProfileSmartContracts";

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
