import { ByAccountId, potlock } from "@/common/api/potlock";
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  TextField,
} from "@/common/ui/components";

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
          <DialogHeader className="flex w-full items-center justify-between gap-4 rounded-t-lg bg-red-500 pb-4 text-white">
            <DialogTitle className="text-lg font-semibold">
              Donate to projects in [Pot Name]
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 p-6">
            <div className="font-medium">
              How do you want to allocate funds?
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <RadioGroup>
                  <RadioGroupItem value="direct" id="direct-donation" checked />
                  <Label htmlFor="direct-donation">Direct donation</Label>
                </RadioGroup>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroup>
                  <RadioGroupItem value="matched" id="matched-donation" />
                  <Label htmlFor="matched-donation">
                    Quadratically matched donation (no pots available)
                  </Label>
                </RadioGroup>
              </div>
            </div>
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
          <DialogFooter className="flex items-center justify-between gap-4 p-6 pt-4">
            <Button variant="brand-outline">Add to cart</Button>
            <Button variant="brand-plain" color="primary">
              Proceed to donate
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
};
