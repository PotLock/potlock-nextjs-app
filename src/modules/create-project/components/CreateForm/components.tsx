"use client";

import { CSSProperties, useEffect, useState } from "react";

import { Input, InputProps, Textarea } from "@/common/ui/components";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/common/ui/components/multi-select";

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
  children: JSX.Element | string;
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
};
export const CustomInput = ({ label, inputProps }: CustomInputProps) => (
  <InputContainer>
    <Label className="m-0">{label}</Label>
    <Input {...inputProps} />
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
            <MultiSelectorItem key={option} value={option}>
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
};

export const CustomTextForm = ({
  error,
  placeholder,
  label,
  field,
  currentText,
  maxCharacters = 500,
}: CustomTextFormProps) => {
  return (
    <div>
      <Label style={{ marginBottom: 6 }}>{label}</Label>
      <Textarea
        className="resize-none"
        placeholder={placeholder}
        error={error}
        currentText={currentText}
        maxCharacters={maxCharacters}
        showHint
        {...field}
      />
    </div>
  );
};
