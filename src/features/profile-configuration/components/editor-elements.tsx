import { useEffect, useState } from "react";

import {
  FormLabel,
  Input,
  InputProps,
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { ACCOUNT_CATEGORY_VARIANTS } from "@/entities/_shared/account";

import { SubTitle } from "./styles";

export const SubHeader = ({
  title,
  required,
  className,
}: {
  title: string;
  required?: boolean;
  className?: string;
}) => (
  <SubTitle className={className}>
    {title}
    {required ? (
      <span className="required">Required</span>
    ) : (
      <span className="optional">Optional</span>
    )}
  </SubTitle>
);

export const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 grid grid-cols-2 gap-6 max-md:grid-cols-[100%]">{children}</div>
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
  <div className="flex w-full flex-col items-start justify-start gap-[0.45em] p-0 text-[14px]">
    <FormLabel className={cn("m-0", className)}>
      {label}
      {optional && <span className="font-400 ml-1 text-[14px] text-[#292929]">(optional)</span>}
    </FormLabel>

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
  </div>
);

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
    <MultiSelector values={value} onValuesChange={setValue} loop={false} className="w-full gap-2">
      <FormLabel className="inline-flex gap-1">
        <span className="font-500">{"Select categories"}</span>
        <span className="line-height-none text-destructive text-xl">{"*"}</span>
      </FormLabel>

      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Choose category" />
      </MultiSelectorTrigger>

      <MultiSelectorContent>
        <MultiSelectorList>
          {ACCOUNT_CATEGORY_VARIANTS.map((categoryVariant) => (
            <MultiSelectorItem key={categoryVariant} value={categoryVariant}>
              {categoryVariant}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
};
