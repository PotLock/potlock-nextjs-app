import { useCallback, useEffect, useState } from "react";

import { validateNearAddress } from "@wpdas/naxios";
import { CircleAlert } from "lucide-react";

import { CHAIN_OPTIONS } from "@/common/constants";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/layout/components";

import { AddChainSelector } from "./contracts-section";
import { CustomInput } from "./form-elements";
import type { ProfileSetupInputs } from "../models/types";
import validateEVMAddress from "../utils/validateEVMAddress";

export type ProfileSetupSmartContractModalProps = {
  data: ProfileSetupInputs["smartContracts"];
  open?: boolean;
  onCloseClick?: () => void;
  contractIndex: number;
};

export const ProfileSetupSmartContractModal: React.FC<ProfileSetupSmartContractModalProps> = ({
  data = [],
  open,
  onCloseClick,
  contractIndex,
}) => {
  const [chain, setChain] = useState(
    data[contractIndex] && data[contractIndex][0] ? data[contractIndex][0] : "",
  );

  const [address, setAddress] = useState(
    data[contractIndex] && data[contractIndex][1] ? data[contractIndex][1] : "",
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setChain(data[contractIndex] && data[contractIndex][0] ? data[contractIndex][0] : "");

    setAddress(data[contractIndex] && data[contractIndex][0] ? data[contractIndex][1] : "");
  }, [contractIndex, data]);

  const saveHandler = useCallback(() => {
    const isEVM = CHAIN_OPTIONS[chain].isEVM;
    const isNEAR = chain === "NEAR";

    const isValid = isNEAR
      ? validateNearAddress(address)
      : isEVM
        ? validateEVMAddress(address)
        : true;

    if (!isValid) {
      setError("Invalid address");
      return;
    }

    // TODO: Don't forget to rewrite
    // Update contract info in the store
    // dispatch.projectEditor.editSmartContract({
    //   data: [chain, address],
    //   contractIndex,
    // });

    if (onCloseClick) {
      onCloseClick();
    }
  }, [chain, address, onCloseClick]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-130" onCloseClick={onCloseClick}>
        <DialogHeader>
          <DialogTitle>Edit Smart Contract</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col p-6">
          <AddChainSelector
            chainLabel="Select Chain"
            defaultValue={chain}
            onChange={(value) => {
              setChain(value);
              setError("");
            }}
          />

          <div className="mt-6">
            <CustomInput
              label="Contract address"
              inputProps={{
                value: address,
                placeholder: "Enter address",
                onChange: (e) => {
                  setAddress(e.target.value);
                  setError("");
                },
              }}
            />
          </div>
          {error && (
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="color-[#ED464F] text-xs">{error}</div>
              <div>
                <CircleAlert color="#ffffff" fill="#ED464F" size={18} />
              </div>
            </div>
          )}

          <Button
            className="mt-6 self-end"
            variant="standard-filled"
            onClick={saveHandler}
            disabled={!!error}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
