import { CSSProperties, useEffect, useState } from "react";

import {
  Input,
  InputProps,
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  Textarea,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountProfilePicture } from "@/entities/_shared/account";
import { ProjectCategoryVariant } from "@/entities/project";
import { useGlobalStoreSelector } from "@/store";

export const Row = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <div className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-[100%]">{children}</div>
);

export const InputContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <div className="flex w-full flex-col items-start justify-start gap-[0.45em] p-0 text-[14px]">
    {children}
  </div>
);

export const Label = ({
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

type CustomInputProps = {
  label: string;
  inputProps: InputProps;
  className?: string;
  optional?: boolean;
  prefix?: string;
  prefixMinWidth?: number;
};

export const CustomInput = ({
  label,
  inputProps,
  className,
  optional,
  prefix,
  prefixMinWidth,
}: CustomInputProps) => (
  <InputContainer>
    <Label className={`m-0 ${className}`}>
      {label}
      {optional && <span className="font-400 ml-1 text-[14px] text-[#292929]">(optional)</span>}
    </Label>

    {prefix ? (
      <div className="flex w-full items-center">
        <p
          className={cn(
            "color-neutral-600 flex h-[38px] items-center",
            "rounded-[0.5rem_0_0_0.5rem] bg-neutral-50 px-4 text-center",
          )}
          style={{
            boxShadow: "rgba(0, 0, 0, 0.22) 0px 0px 0px 1px inset",
            ...(prefixMinWidth ? { minWidth: prefixMinWidth } : {}),
          }}
        >
          {prefix}
        </p>

        <Input
          {...inputProps}
          className={cn(
            "b-l-none rounded-l-0",
            "focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-1",
          )}
        />
      </div>
    ) : (
      <Input {...inputProps} />
    )}
  </InputContainer>
);

const options: ProjectCategoryVariant[] = [
  "Social Impact",
  "Non Profit",
  "Climate",
  "Public Good",
  "DeSci",
  "Open Source",
  "Community",
  "Education",
];

export const ProjectCategoryPicker = ({
  onValuesChange,
  defaultValues,
}: {
  onValuesChange: (value: string[]) => void;
  defaultValues?: string[];
}) => {
  const [value, setValue] = useState<string[]>(defaultValues || []);

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange(value);
    }
  }, [value, onValuesChange]);

  return (
    <MultiSelector values={value} onValuesChange={setValue} loop={false} className="w-full">
      <Label>Select categories *</Label>

      <MultiSelectorTrigger className="mt-[0.4rem] py-[.53rem]">
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

const MAX_DISPLAYED_MEMBERS = 5;

export const AccountStack = () => {
  const members = useGlobalStoreSelector((state) => state.projectEditor.teamMembers);
  const displayedMembers = members.slice(0, MAX_DISPLAYED_MEMBERS);
  const hiddenItemsCount = Math.max(members.length - MAX_DISPLAYED_MEMBERS, 0);

  return (
    <div className="flex">
      {hiddenItemsCount > 0 && (
        <div
          className={
            "z-10 flex h-[28px] w-[28px] items-center justify-center rounded-[50%] bg-[#dd3345]"
          }
        >
          <span className="font-600 text-align-center text-foreground text-[12px]">
            {`+${hiddenItemsCount}`}
          </span>
        </div>
      )}

      {displayedMembers.map((memberAccountId, index) => (
        <AccountProfilePicture
          key={memberAccountId}
          accountId={memberAccountId}
          className={cn("h-7 w-7", {
            "ml-[-8px]": index > 0 || (index === 0 && hiddenItemsCount > 0),
          })}
        />
      ))}
    </div>
  );
};
