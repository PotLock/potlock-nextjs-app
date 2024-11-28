import { useCallback, useEffect, useState } from "react";

import { validateNearAddress } from "@wpdas/naxios";

import { Button, Dialog, DialogContent, Input } from "@/common/ui/components";
import { dispatch, useGlobalStoreSelector } from "@/store";

import { AccountItems, GroupIcon } from "./components";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  onMembersChange?: (members: string[]) => void;
};

const AddTeamMembersModal = ({ open, onCloseClick, onMembersChange }: Props) => {
  const members = useGlobalStoreSelector((state) => state.projectEditor.teamMembers);
  const [account, setAccount] = useState("");
  const [invalidNearAcc, setInvalidNearAcc] = useState(false);

  const addMemberHandler = useCallback(() => {
    if (!validateNearAddress(account)) {
      setInvalidNearAcc(true);
      return;
    }

    dispatch.projectEditor.addTeamMember(account);
    setAccount("");
  }, [account]);

  useEffect(() => {
    if (onMembersChange) {
      onMembersChange(members);
    }
  }, [members, onMembersChange]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130 p-4" contrastActions onCloseClick={onCloseClick}>
        <div className="flex flex-row items-center justify-start">
          <div className="mr-4 flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#f0f0f0]">
            <GroupIcon />
          </div>
          <h4 className="color-[#2e2e2e] font-600 text-[16px]">Add team members</h4>
        </div>

        {/* Description */}
        <div className="my-4 flex flex-col">
          <p className="color-[#2e2e2e] font-400 text-[16px]">
            Add NEAR account IDs for your team members.
          </p>
          <div className="my-4 flex">
            <Input
              value={account}
              onChange={(e) => {
                if (invalidNearAcc) {
                  setInvalidNearAcc(false);
                }
                setAccount(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  addMemberHandler();
                }
              }}
              placeholder="NEAR account ID"
              className="focus-visible:ring-none rounded-r-[0] focus-visible:ring-opacity-0"
              error={invalidNearAcc ? "Invalid NEAR Account ID" : ""}
            />
            <Button
              variant="brand-filled"
              className="mt-[2px] h-[37px] rounded-l-[0]"
              onClick={addMemberHandler}
            >
              Add
            </Button>
          </div>
          <p className="color-[#2e2e2e] font-600 mb-4 flex gap-2 text-[12px]">
            {members.length}
            <span className="text-[#7b7b7b]">{members.length > 1 ? "members" : "member"}</span>
          </p>
          <AccountItems accountIds={members} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMembersModal;
