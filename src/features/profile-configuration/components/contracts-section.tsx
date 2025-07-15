import { type CSSProperties, useCallback, useState } from "react";

import { validateNearAddress } from "@wpdas/naxios";
import { CircleAlert } from "lucide-react";

import { CHAIN_OPTIONS } from "@/common/constants";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/layout/components";
import Delete from "@/common/ui/layout/svg/Delete";
import Edit from "@/common/ui/layout/svg/Edit";
import { cn } from "@/common/ui/layout/utils";

import { CustomInput } from "./editor-elements";
import type { ProfileConfigurationInputs } from "../models/types";
import validateEVMAddress from "../utils/validateEVMAddress";

const Label = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <p
    className={cn(className, "font-500 line-height-[16px] color-neutral-900 break-words")}
    style={{ marginTop: 0, marginBottom: 0, ...style }}
  >
    {children}
  </p>
);

type AddChainSelectorProps = {
  onChange: (value: string) => void;
  defaultValue?: string;
  items?: string;
  disabled?: boolean;
  chainLabel?: string;
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
  onRemoveHandler?: (contractIndex: number) => void;
  onAddHandler?: (contract: [string, string]) => void;
};

const SmartContract = ({
  contractInfo,
  index,
  isPreview,
  onRemoveHandler,
  onAddHandler,
}: SmartContractProps) => {
  const [chain, setChain] = useState(contractInfo[0]);
  const [address, setAddress] = useState(contractInfo[1]);
  const [error, setError] = useState("");

  const onAddHandlerClick = useCallback(() => {
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

      // dispatch.projectEditor.addSmartContract([chain, address], index);
      setChain("");
      setAddress("");

      if (onAddHandler) {
        onAddHandler([chain, address]);
      }
    }
  }, [chain, address, index, onAddHandler]);

  const onRemoveHandlerClick = useCallback(() => {
    if (onRemoveHandler) {
      onRemoveHandler(index);
    }
  }, [index, onRemoveHandler]);

  return (
    <>
      <div className="bg-neutral-3 h-[1px] w-full md:hidden" />
      <AddChainSelector
        defaultValue={chain}
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
              placeholder: "Enter address",
              onChange: (e) => {
                setAddress(e.target.value);
                setError("");
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  onAddHandlerClick();
                }
              },
            }}
          />
          {isPreview ? (
            <>
              <div className="ml-4 self-end">
                <button onClick={onRemoveHandlerClick}>
                  <Delete />
                </button>
              </div>
            </>
          ) : (
            <div className="ml-4 self-end">
              <Button onClick={onAddHandlerClick} variant="standard-filled" disabled={!!error}>
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

export type ProfileConfigurationSmartContractsSectionProps = {
  values: ProfileConfigurationInputs["smartContracts"];
  onAddContract?: (contract: [string, string]) => void;
  onRemoveContract?: (contractIndex: number) => void;
};

export const ProfileConfigurationSmartContractsSection = ({
  values,
  onAddContract,
  onRemoveContract,
}: ProfileConfigurationSmartContractsSectionProps) => {
  if (values && values.length > 0) {
    return (
      <>
        {values.map((contractInfo, index) => (
          <SmartContract
            key={`${contractInfo[0]}_${contractInfo[1]}_${index}`}
            onRemoveHandler={onRemoveContract}
            contractInfo={contractInfo}
            index={index}
            isPreview
          />
        ))}

        <SmartContract contractInfo={["", ""]} index={values.length} onAddHandler={onAddContract} />
      </>
    );
  } else return <SmartContract contractInfo={["", ""]} index={0} onAddHandler={onAddContract} />;
};
