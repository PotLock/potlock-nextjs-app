/* eslint-disable @next/next/no-img-element */
"use client";

import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { validateNearAddress } from "@wpdas/naxios";
import { CircleAlert } from "lucide-react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { boolean } from "zod";

import { dispatch, useTypedSelector } from "@/app/_store";
import {
  Button,
  Input,
  InputProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/common/ui/components";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/common/ui/components/multi-select";
import useProfileData from "@/modules/profile/hooks/useProfileData";

import validateEVMAddress from "../../utils/validateEVMAddress";

export const Row = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-[100%]">
    {children}
  </div>
);

export const InputContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div className="flex w-full flex-col items-start justify-start gap-[0.45em] p-0 text-[14px]">
    {children}
  </div>
);

export const Label = ({
  children,
  className,
  style,
}: {
  children: any;
  className?: string;
  style?: CSSProperties;
}) => (
  <p
    className={`${className} font-500 line-height-[16px] color-neutral-900 break-words text-[14px]`}
    style={{ marginTop: 0, marginBottom: 0, ...style }}
  >
    {children}
  </p>
);

type CustomInputProps = {
  label: string;
  inputProps: InputProps;
  className?: string;
  optional?: boolean;
  prefix?: string;
};
export const CustomInput = ({
  label,
  inputProps,
  className,
  optional,
  prefix,
}: CustomInputProps) => (
  <InputContainer>
    <Label className={`m-0 ${className}`}>
      {label}
      {optional && (
        <span className="font-400 ml-1 text-[14px] text-[#292929]">
          (optional)
        </span>
      )}
    </Label>
    {prefix ? (
      <div className="flex w-full items-center">
        <p
          className="color-neutral-600 flex h-[38px] items-center rounded-[4px_0_0_4px] bg-neutral-50 px-4 text-[14px]"
          style={{ boxShadow: "rgba(0, 0, 0, 0.22) 0px 0px 0px 1px inset" }}
        >
          {prefix}
        </p>
        <Input
          {...inputProps}
          className="b-l-none rounded-l-[0] focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-1"
        />
      </div>
    ) : (
      <Input {...inputProps} />
    )}
  </InputContainer>
);

const options = [
  "Social Impact",
  "NonProfit",
  "Climate",
  "Public Good",
  "DeSci",
  "Open Source",
  "Community",
  "Education",
];

export const SelectCategory = ({
  onValuesChange,
  defaultValues,
}: {
  onValuesChange: (value: string[]) => void;
  defaultValues?: string[];
}) => {
  // TODO: For some reason this is not working when using the mouse. I need to check the extension and fix it.
  const [value, setValue] = useState<string[]>(defaultValues || []);

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange(value);
    }
  }, [value, onValuesChange]);

  return (
    <MultiSelector
      values={value}
      onValuesChange={setValue}
      loop={false}
      className="w-full"
    >
      <Label>Select category (select multiple) *</Label>
      <MultiSelectorTrigger
        className="py-[.53rem] text-[.875rem] shadow-[0px_0px_0px_1px_#00000038_inset,0px_-1px_1px_0px_#00000038_inset]"
        style={{ marginTop: ".4rem" }}
      >
        <MultiSelectorInput placeholder="Choose category" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {options.map((option, i) => (
            <MultiSelectorItem key={i} value={option}>
              {option}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};

type CustomTextFormProps = {
  error?: string;
  placeholder: string;
  label: string;
  field: {};
  showHint?: boolean;
  currentText?: string;
  maxCharacters?: number;
  className?: string;
};

export const CustomTextForm = ({
  showHint,
  error,
  placeholder,
  label,
  field,
  currentText,
  maxCharacters = 500,
  className,
}: CustomTextFormProps) => {
  return (
    <div>
      <Label style={{ marginBottom: 6 }} className={className}>
        {label}
      </Label>
      <Textarea
        className="resize-none"
        placeholder={placeholder}
        error={error}
        currentText={currentText}
        maxCharacters={maxCharacters}
        showHint={showHint}
        {...field}
      />
    </div>
  );
};

const NO_IMAGE =
  "https://i.near.social/magic/large/https://near.social/magic/img/account/null.near";

const AccountStackItem = ({
  accountId,
  style,
}: {
  accountId: string;
  style?: CSSProperties;
}) => {
  const profileInfo = useProfileData(accountId);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {profileInfo.imagesReady && (
        <img
          alt="profile image"
          className="h-[28px] w-[28px] rounded-[50%] bg-white"
          style={style}
          src={
            hasError
              ? NO_IMAGE
              : profileInfo.profileImages.image
                ? profileInfo.profileImages.image
                : NO_IMAGE
          }
          onError={() => setHasError(true)}
        />
      )}
    </>
  );
};

const MAX_DISPLAY_MEMBERS = 5;

export const AccountStack = () => {
  const members = useTypedSelector((state) => state.createProject.teamMembers);
  const shown = members.slice(0, MAX_DISPLAY_MEMBERS);
  const hidden = Math.max(members.length - MAX_DISPLAY_MEMBERS, 0);

  return (
    <div className="flex">
      {hidden > 0 && (
        <div className="z-10 flex h-[28px] w-[28px] items-center justify-center rounded-[50%] bg-[#dd3345]">
          <p className="font-600 text-align-center text-[12px] text-white">
            {hidden}+
          </p>
        </div>
      )}
      {shown.map((memberAccountId, index) => (
        <AccountStackItem
          key={memberAccountId}
          accountId={memberAccountId}
          style={
            index > 0 || (index === 0 && hidden > 0)
              ? { marginLeft: -8, zIndex: index * -1 }
              : {}
          }
        />
      ))}
    </div>
  );
};

type AddChainSelectorProps = {
  onChange: (value: string) => void;
  defaultValue?: string;
  items?: string;
  disabled?: boolean;
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

const AddChainSelector = ({
  onChange,
  defaultValue,
  disabled,
}: AddChainSelectorProps) => {
  return (
    <div>
      <Label className="m-0" style={{ marginBottom: 7 }}>
        {disabled ? "Chain" : "Add Chain"}
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
};

const SmartContract = ({
  contractInfo,
  index,
  isPreview,
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

      dispatch.createProject.addSmartContract([chain, address], index);
      setChain("");
      setAddress("");
    }
  }, [chain, address, index]);

  const onRemoveHandler = useCallback(() => {
    dispatch.createProject.removeSmartContract(index);
  }, [index]);

  return (
    <>
      <div className="bg-neutral-3 h-[1px] w-full md:hidden" />
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
            <div className="ml-4 self-end">
              <Button
                onClick={onRemoveHandler}
                variant="brand-filled"
                disabled={!!error}
              >
                Remove
              </Button>
            </div>
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

export const SmartContracts = () => {
  const smartContracts = useTypedSelector(
    (state) => state.createProject.smartContracts,
  );

  if (smartContracts.length > 0) {
    return (
      <>
        {smartContracts.map((contractInfo, index) => (
          <SmartContract
            key={`${contractInfo[0]}_${contractInfo[1]}`}
            contractInfo={contractInfo}
            index={index}
            isPreview
          />
        ))}
        <SmartContract contractInfo={["", ""]} index={smartContracts.length} />
      </>
    );
  }

  return (
    <SmartContract contractInfo={["", ""]} index={smartContracts.length} />
  );
};
