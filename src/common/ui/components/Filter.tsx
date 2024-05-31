import { PopoverProps } from "@radix-ui/react-popover";
import { ToggleGroupMultipleProps } from "@radix-ui/react-toggle-group";
import Image from "next/image";

import { Button } from "./button";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

// Define the item type
type Item = {
  label: string;
  val: string;
};

export type Group = {
  label: string;
  props?: Omit<ToggleGroupMultipleProps, "type">;
  options: Item[];
};

// Define the Props type extending PopoverProps
type Props = {
  popoverProps?: PopoverProps;
  groups: Group[];
};

const Filter = ({ groups, popoverProps }: Props) => {
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
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-80 flex-col gap-6 sm:w-[466px]">
        {groups.map(({ label, options, props }) => (
          <div className="flex flex-col gap-3" key={label}>
            <Label className=" w-full text-[#656565] first-of-type:mt-0">
              Filter by {label}
            </Label>
            <ToggleGroup
              className="flex flex-wrap justify-start gap-2"
              variant="outline"
              {...(props || {})}
              type="multiple"
            >
              {options.map(({ label, val }: any) => (
                <ToggleGroupItem value={val} aria-label="Toggle" key={val}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
