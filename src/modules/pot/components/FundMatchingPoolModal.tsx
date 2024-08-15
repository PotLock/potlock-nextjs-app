/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import {
  Avatar,
  AvatarImage,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "@/common/ui/components";
import { Badge } from "@/common/ui/components/badge";
import useWallet from "@/modules/auth/hooks/useWallet";
import useProfileData from "@/modules/profile/hooks/useProfileData";
import { dispatch, useTypedSelector } from "@/store";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  errorMessage?: string;
};

const NO_IMAGE =
  "https://ipfs.near.social/ipfs/bafkreiccpup6f2kihv7bhlkfi4omttbjpawnsns667gti7jbhqvdnj4vsm";

const CustomAvatar = ({ accountId }: { accountId: string }) => {
  const profileInfo = useProfileData(accountId);
  const [hasError, setHasError] = useState(false);

  if (!profileInfo.profileReady) {
    return (
      <img
        alt="avatar"
        className="h-[12px] w-[12px] rounded-[50%] bg-white"
        src={NO_IMAGE}
      />
    );
  }

  return (
    <img
      alt="avatar"
      className="h-[12px] w-[12px] rounded-[50%] bg-white"
      src={hasError ? NO_IMAGE : profileInfo.profileImages.image}
      onError={() => setHasError(true)}
    />
  );
};

const FundMatchingPoolModal = ({ open, onCloseClick, errorMessage }: Props) => {
  const { actAsDao, accountId } = useTypedSelector((state) => state.nav);

  // AccountID (Address)
  const accountAddress =
    actAsDao.toggle && actAsDao.defaultAddress
      ? actAsDao.defaultAddress
      : accountId;

  const closeHandler = () => {
    dispatch.createProject.submissionStatus("pending");
    dispatch.createProject.setSubmissionError("");

    if (onCloseClick) {
      onCloseClick();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={closeHandler}>
        <DialogHeader>
          <DialogTitle>Fund Matching Pool</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col p-6">
          {/* Fund as Dao checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="asDao" />
            <label
              htmlFor="asDao"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Fund as DAO
            </label>
          </div>

          <p className="my-2 break-words text-[16px] font-normal leading-[20px] text-[#525252]">
            Enter matching pool contribution amount in NEAR (no minimum)
          </p>

          {/* Amount NEAR input */}
          <Input
            type="number"
            placeholder="Enter amount here in NEAR"
            className="focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-1"
          />

          {/* Optional Message */}
          <Textarea
            placeholder="Enter an optional message"
            rows={5}
            className="mt-2"
          />

          {/* Bypass checkbox */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="bypass" />
              <label
                htmlFor="bypass"
                className="color-[#2e2e2e] break-words text-[12px] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bypass 2% protocol fee to
              </label>
            </div>

            {/* Avatar - Account */}
            <Badge variant="secondary" className="gap-1">
              <CustomAvatar accountId="wendersonpires.near" />{" "}
              wendersonpires.near
            </Badge>
          </div>

          {/* Protocol Fee */}
          <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
            Protocol fee: 0 NEAR
          </p>

          {/* Net Donation */}
          <p className="mt-3 flex flex-row items-center break-words text-[14px] font-normal leading-[20px] text-[#292929]">
            Net donation amount: 0.00 NEAR
          </p>

          <Button className="mt-6 self-end" onClick={closeHandler}>
            Contribute to matching pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FundMatchingPoolModal;
