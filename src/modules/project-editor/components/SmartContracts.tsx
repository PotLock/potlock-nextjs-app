import { useCallback, useState } from "react";

import { validateNearAddress } from "@wpdas/naxios";
import { CircleAlert } from "lucide-react";

import Delete from "@/common/assets/svgs/Delete";
import Edit from "@/common/assets/svgs/Edit";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/components";
import { dispatch, useTypedSelector } from "@/store";

import { CustomInput, Label } from "./CreateForm/components";
import validateEVMAddress from "../utils/validateEVMAddress";

type AddChainSelectorProps = {
  onChange: (value: string) => void;
  defaultValue?: string;
  items?: string;
  disabled?: boolean;
  chainLabel?: string;
};

export const CHAIN_OPTIONS: Record<string, { isEVM: boolean }> = {
  NEAR: { isEVM: false },
  Solana: { isEVM: false },
  Ethereum: { isEVM: true },
  Polygon: { isEVM: true },
  Avalanche: { isEVM: true },
  Optimism: { isEVM: true },
  Arbitrum: { isEVM: true },
  BNB: { isEVM: true },
  Sui: { isEVM: false },
  Aptos: { isEVM: false },
  Polkadot: { isEVM: false },
  Stellar: { isEVM: false },
  ZkSync: { isEVM: false }, // Note: ZkSync aims for EVM compatibility but might not fully be considered as traditional EVM at the time of writing.
  Celo: { isEVM: true },
  Aurora: { isEVM: true },
  Injective: { isEVM: true },
  Base: { isEVM: false },
  Manta: { isEVM: false }, // Listed twice in the original list; included once here.
  Fantom: { isEVM: true },
  ZkEVM: { isEVM: true }, // Considering the name, assuming it aims for EVM compatibility.
  Flow: { isEVM: false },
  Tron: { isEVM: true },
  MultiverseX: { isEVM: false }, // Formerly known as Elrond, not traditionally EVM but has some level of compatibility.
  Scroll: { isEVM: true }, // Assuming EVM compatibility based on the context of ZkEVM.
  Linea: { isEVM: true }, // Assuming non-EVM due to lack of information.
  Metis: { isEVM: true },
};

export const AddChainSelector = ({
  onChange,
  defaultValue,
  disabled,
  chainLabel,
}: AddChainSelectorProps) => {
  return (
    <div>
      <Label className="m-0" style={{ marginBottom: 7 }}>
        {chainLabel ? chainLabel : disabled ? "Chain" : "Add Chain"}
      </Label>
      <Select onValueChange={onChange} value={defaultValue} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select a chain" />
        </SelectTrigger>

        <SelectContent>
          {Object.keys(CHAIN_OPTIONS).map((chain) => (
            <SelectItem key={chain} value={chain}>
              {chain}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

type SmartContractProps = {
  contractInfo: string[];
  index: number;
  isPreview?: boolean;
  onEditClickHandler?: (contractIndex: number) => void;
};

const SmartContract = ({
  contractInfo,
  index,
  isPreview,
  onEditClickHandler,
}: SmartContractProps) => {
  const [chain, setChain] = useState(contractInfo[0]);
  const [address, setAddress] = useState(contractInfo[1]);
  const [error, setError] = useState("");

  const onAddHandler = useCallback(() => {
    if (!chain) {
      setError("You must select a chain");
      return;
    }

    if (!address) {
      setError("You must type an address");
      return;
    }

    if (chain && address) {
      // validate
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

      dispatch.projectEditor.addSmartContract([chain, address], index);
      setChain("");
      setAddress("");
    }
  }, [chain, address, index]);

  const onRemoveHandler = useCallback(() => {
    dispatch.projectEditor.removeSmartContract(index);
  }, [index]);

  return (
    <>
      <div className="bg-neutral-3 md:hidden h-[1px] w-full" />
      <AddChainSelector
        defaultValue={chain}
        disabled={isPreview}
        onChange={(value) => {
          setChain(value);
          setError("");
        }}
      />
      <div className="flex flex-col">
        <div className="flex">
          <CustomInput
            label="Contract address"
            inputProps={{
              value: address,
              disabled: isPreview,
              placeholder: "Enter address",
              onChange: (e) => {
                setAddress(e.target.value);
                setError("");
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  onAddHandler();
                }
              },
            }}
          />
          {isPreview ? (
            <>
              <div className="ml-4 self-end">
                <button
                  onClick={() => {
                    if (onEditClickHandler) {
                      onEditClickHandler(index);
                    }
                  }}
                >
                  <Edit />
                </button>
              </div>
              <div className="ml-4 self-end">
                <button onClick={onRemoveHandler}>
                  <Delete />
                </button>
              </div>
            </>
          ) : (
            <div className="ml-4 self-end">
              <Button
                onClick={onAddHandler}
                variant="standard-filled"
                disabled={!!error}
              >
                Add
              </Button>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="color-[#ED464F] text-xs">{error}</div>
            <div>
              <CircleAlert color="#ffffff" fill="#ED464F" size={18} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

type SmartContractsProps = {
  onEditClickHandler: (contractIndex: number) => void;
};

export const SmartContracts = ({ onEditClickHandler }: SmartContractsProps) => {
  const smartContracts = useTypedSelector(
    (state) => state.projectEditor.smartContracts,
  );

  if (smartContracts && smartContracts.length > 0) {
    return (
      <>
        {smartContracts.map((contractInfo, index) => (
          <SmartContract
            key={`${contractInfo[0]}_${contractInfo[1]}`}
            onEditClickHandler={onEditClickHandler}
            contractInfo={contractInfo}
            index={index}
            isPreview
          />
        ))}
        <SmartContract contractInfo={["", ""]} index={smartContracts.length} />
      </>
    );
  }

  return <SmartContract contractInfo={["", ""]} index={0} />;
};
