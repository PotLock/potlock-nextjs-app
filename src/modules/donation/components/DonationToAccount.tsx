import { ByAccountId, potlock } from "@/common/api/potlock";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/components/select";
import { TextField } from "@/common/ui/components/text-field";

export type DonationToAccountProps = ByAccountId & {};

export const DonationToAccount: React.FC<DonationToAccountProps> = ({
  accountId,
}) => {
  const { isLoading, data: account, error } = potlock.useAccount({ accountId });

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      {error && error.message}

      {account !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>{`Donation to ${account.near_social_profile_data.name}`}</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <TextField
              label="Amount"
              labelExtension={
                <span className="prose" un-text="sm gray-500">
                  200 NEAR available
                </span>
              }
              fieldExtension={
                <Select defaultValue="near">
                  <SelectTrigger className="h-full w-min rounded-r-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available tokens</SelectLabel>
                      <SelectItem value="near">NEAR</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              }
              type="number"
              placeholder="0.00"
              min={0}
              step={0.01}
              appendix="$ 0.00"
            />
          </DialogDescription>
        </>
      )}
    </>
  );
};
