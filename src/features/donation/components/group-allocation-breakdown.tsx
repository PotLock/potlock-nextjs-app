import { LabeledIcon } from "@/common/ui/layout/components";
import { AccountListItem } from "@/entities/_shared/account";
import { TokenIcon } from "@/entities/_shared/token";

import { WithDonationFormAPI } from "../models/schemas";

export type DonationGroupAllocationBreakdownProps = WithDonationFormAPI & {};

export const DonationGroupAllocationBreakdown: React.FC<DonationGroupAllocationBreakdownProps> = ({
  form,
}) => {
  const [tokenId, groupAllocationPlan] = form.watch(["tokenId", "groupAllocationPlan"]);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-neutral-50 p-4">
      {groupAllocationPlan?.map(({ account_id, amount }) => (
        <AccountListItem
          key={account_id + amount}
          accountId={account_id}
          secondarySlot={
            <LabeledIcon caption={amount ?? 0} classNames={{ caption: "font-600 text-4" }}>
              <TokenIcon {...{ tokenId }} />
            </LabeledIcon>
          }
          classNames={{ root: "p-0", avatar: "border-1 border-neutral-200" }}
        />
      ))}
    </div>
  );
};
