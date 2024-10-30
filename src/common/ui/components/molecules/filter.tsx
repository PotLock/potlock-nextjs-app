import { PopoverProps } from "@radix-ui/react-popover";
import {
  ToggleGroupMultipleProps,
  ToggleGroupSingleProps,
} from "@radix-ui/react-toggle-group";
import Image from "next/image";

import { Button } from "../atoms/button";
import { Label } from "../atoms/label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

// Define the item type
type Item = {
  label: string;
  val: string;
};

export enum GroupType {
  multiple = "multiple",
  single = "single",
}

export type Group<T extends GroupType = GroupType.multiple | GroupType.single> =
  {
    label: string;
    props?: T extends GroupType.multiple
      ? Omit<ToggleGroupMultipleProps, "type">
      : Omit<ToggleGroupSingleProps, "type">; // Conditional props based on type
    options: Item[];
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
          <Image
            src={"/assets/icons/filter-icon.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          <p className="md:block hidden">Filter</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:w-[466px] flex w-80 flex-col gap-6">
        {groups.map(({ label, options, props, type }) => (
          <div className="flex flex-col gap-3" key={label}>
            <Label className=" w-full text-[#656565] first-of-type:mt-0">
              Filter by {label}
            </Label>
            {type === GroupType.multiple ? (
              <ToggleGroup
                className="flex flex-wrap justify-start gap-2"
                variant="outline"
                type="multiple"
                {...(props || {})} // Spread multiple props
              >
                {options.map(({ label, val }: any) => (
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
                {...(props || {})} // Spread single props
              >
                {options.map(({ label, val }: any) => (
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
