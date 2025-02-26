import { SelectProps, Trigger } from "@radix-ui/react-select";
import Image from "next/image";

import { Button } from "../atoms/button";
import { Select, SelectContent, SelectItem } from "../atoms/select";

export const SortSelect = ({
  options,
  onValueChange,
  ...selectProps
}: {
  options: { label: string; value: string }[];
  onValueChange?: SelectProps["onValueChange"];
  selectProps?: SelectProps;
}) => {
  return (
    <Select
      onValueChange={(value) => {
        onValueChange ? onValueChange(value) : {};
      }}
      {...(selectProps || {})}
    >
      <Trigger asChild className="w-fit">
        <Button variant="standard-outline">
          <Image src={"/assets/icons/sort-icon.svg"} alt="sort" width={18} height={18} />
          <p className="hidden md:block">Sort</p>
        </Button>
      </Trigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} className="pr-6" value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
