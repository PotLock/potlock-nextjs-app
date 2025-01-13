import { useCallback, useEffect, useState } from "react";

import { validateNearAddress } from "@wpdas/naxios";
import { CircleAlert } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/components";
import { dispatch, useGlobalStoreSelector } from "@/store";

import { CustomInput } from "./form-elements";
import { AddChainSelector, CHAIN_OPTIONS } from "./SmartContracts";
import validateEVMAddress from "../utils/validateEVMAddress";

type Props = {
  open?: boolean;
  onCloseClick?: () => void;
  contractIndex: number;
};

const EditSmartContractModal = ({ open, onCloseClick, contractIndex }: Props) => {
  const contracts = useGlobalStoreSelector(
    (state) => state.projectEditor.smartContracts || [["", ""]],
  );

  const [chain, setChain] = useState(
    contracts[contractIndex] && contracts[contractIndex][0] ? contracts[contractIndex][0] : "",
  );

  const [address, setAddress] = useState(
    contracts[contractIndex] && contracts[contractIndex][1] ? contracts[contractIndex][1] : "",
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setChain(
      contracts[contractIndex] && contracts[contractIndex][0] ? contracts[contractIndex][0] : "",
    );

    setAddress(
      contracts[contractIndex] && contracts[contractIndex][0] ? contracts[contractIndex][1] : "",
    );
  }, [contractIndex, contracts]);

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

    // Update contract info in the store
    dispatch.projectEditor.editSmartContract({
      data: [chain, address],
      contractIndex,
    });

    if (onCloseClick) {
      onCloseClick();
    }
  }, [chain, address, contractIndex, onCloseClick]);

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

export default EditSmartContractModal;
