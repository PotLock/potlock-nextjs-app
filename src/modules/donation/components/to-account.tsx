import { useMemo, useState } from "react";

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

export type DonationToAccountProps = ByAccountId & {
  closeDialog: VoidFunction;
};

export const DonationToAccount: React.FC<DonationToAccountProps> = ({
  accountId,
  closeDialog: _,
}) => {
  const { isLoading, data: account, error } = potlock.useAccount({ accountId });

  const [currentScreenIndex, setCurrentScreenIndex] = useState<
    "start" | "allocation" | "confirmation" | "done"
  >("start");

  const currentScreen = useMemo(() => {
    switch (currentScreenIndex) {
      case "start":
        return (
          <>
            <div un-flex="~ col" un-gap="3">
              <div className="prose" un-font="600" un-text="neutral-950">
                How do you want to allocate funds?
              </div>

              <RadioGroup>
                <RadioGroupItem
                  id="donation-options-direct"
                  label="Direct donation"
                  value="direct"
                  checked
                />

                <RadioGroupItem
                  id="donation-options-matched"
                  label="Quadratically matched donation"
                  hint="(no pots available)"
                  value="matched"
                  //disabled
                />
              </RadioGroup>
            </div>

            <TextField
              label="Amount"
              labelExtension={
                <div un-flex="~" un-gap="1">
                  <span
                    className="prose"
                    un-text="sm neutral-950"
                    un-font="600"
                  >
                    200 NEAR
                  </span>

                  <span className="prose" un-text="sm  neutral-600">
                    available
                  </span>
                </div>
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
          </>
        );
      case "allocation":
        return <></>;
      case "confirmation":
        return <></>;
      case "done":
        return <></>;
      default:
        return "Error: Unable to proceed with the next step";
    }
  }, [currentScreenIndex]);

  return isLoading ? (
    <span
      un-flex="~"
      un-justify="center"
      un-items="center"
      un-w="full"
      un-h="40"
      un-text="2xl"
    >
      Loading...
    </span>
  ) : (
    <>
      {error && error.message}

      {account !== undefined && (
        <>
          <DialogHeader>
            <DialogTitle>
              {`Donation to ${account.near_social_profile_data?.name}`}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>{currentScreen}</DialogDescription>

          <DialogFooter>
            <Button
              type="button"
              variant="brand-outline"
              color="black"
              disabled
            >
              Add to cart
            </Button>

            <Button type="button" variant="brand-filled" color="primary">
              Proceed to donate
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
};
