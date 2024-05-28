import { SelectProps, Trigger } from "@radix-ui/react-select";
import Image from "next/image";

import { Button } from "../common/button";
import { Select, SelectContent, SelectItem } from "../common/select";

const SORT_LIST_PROJEECTS = [
  { label: "Most recent", value: "recent" },
  { label: "Least recent", value: "older" },
];

const SortSelect = ({ selectProps }: { selectProps?: SelectProps }) => {
  return (
    <Select {...(selectProps || {})}>
      <Trigger asChild className="w-fit">
        <Button variant="standard-outline">
          <Image
            src={"/assets/icons/sort-icon.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          Sort
        </Button>
      </Trigger>
      <SelectContent>
        {SORT_LIST_PROJEECTS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
