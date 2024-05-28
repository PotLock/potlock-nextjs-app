import { PopoverProps } from "@radix-ui/react-popover";
import Image from "next/image";

import { Button } from "../common/button";
import { Label } from "../common/label";
import { Popover, PopoverContent, PopoverTrigger } from "../common/popover";
import { ToggleGroup, ToggleGroupItem } from "../common/toggle-group";

// Define the item type
type Item = {
  label: string;
  val: string;
};

// Define the Props type extending PopoverProps
type Props = PopoverProps & {
  options: Record<string, Item[]>;
};

const Filter = ({ options, ...props }: Props) => {
  return (
    <Popover {...props}>
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
      <PopoverContent className="w-80 sm:w-[466px]">
        <ToggleGroup
          className="flex flex-col gap-6"
          variant="outline"
          type="multiple"
        >
          {Object.keys(options).map((menuLabel) => (
            <div className="flex flex-wrap justify-start gap-2" key={menuLabel}>
              <Label className=" w-full text-[#656565] first-of-type:mt-0">
                Filter by {menuLabel}
              </Label>
              {options[menuLabel].map(({ label, val }: any) => (
                <ToggleGroupItem value={val} aria-label="Toggle" key={val}>
                  {label}
                </ToggleGroupItem>
              ))}
            </div>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
