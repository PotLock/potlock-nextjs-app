import { PopoverProps } from "@radix-ui/react-popover";
import { ToggleGroupMultipleProps, ToggleGroupSingleProps } from "@radix-ui/react-toggle-group";
import Image from "next/image";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Button } from "../atoms/button";
import { Label } from "../atoms/label";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";

export type FilterOption = {
  label: string;
  val: string;
};

export enum GroupType {
  multiple = "multiple",
  single = "single",
}

export type Group<T extends GroupType = GroupType.multiple | GroupType.single> = {
  label: string;
  props?: T extends GroupType.multiple
    ? Omit<ToggleGroupMultipleProps, "type">
    : Omit<ToggleGroupSingleProps, "type">; // Conditional props based on type
  options: FilterOption[];
  type: T;
};

type Props = {
  popoverProps?: PopoverProps;
  groups: (Group<GroupType.multiple> | Group<GroupType.single>)[];
};

export const Filter = ({ groups, popoverProps }: Props) => {
  return (
    <Popover {...(popoverProps || {})}>
      <PopoverTrigger asChild>
        <Button variant="standard-outline">
          <Image src={"/assets/icons/filter-icon.svg"} alt="sort" width={18} height={18} />
          <p className="hidden md:block">Filter</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-6 sm:w-[466px]">
        {groups.map(({ label, options, props, type }) => (
          <div className="flex flex-col gap-3" key={label}>
            <Label className=" w-full text-[#656565] first-of-type:mt-0">Filter by {label}</Label>
            {type === GroupType.multiple ? (
              <ToggleGroup
                className="flex flex-wrap justify-start gap-2"
                variant="outline"
                type="multiple"
                {...props}
              >
                {options.map(({ label, val }) => (
                  <ToggleGroupItem value={val} aria-label="Toggle" key={val}>
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <ToggleGroup
                className="flex flex-wrap justify-start gap-2"
                variant="outline"
                type="single"
                {...props}
              >
                {options.map(({ label, val }) => (
                  <ToggleGroupItem value={val} aria-label="Toggle" key={val}>
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
