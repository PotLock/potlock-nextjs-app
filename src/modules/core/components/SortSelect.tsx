import { SelectProps } from "@radix-ui/react-select";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../common/select";

const SORT_LIST_PROJEECTS = [
  { label: "Most recent", value: "recent" },
  { label: "Least recent", value: "older" },
];

const SortSelect = ({ selectProps }: { selectProps?: SelectProps }) => {
  return (
    <Select {...(selectProps || {})}>
      <SelectTrigger iconClassName="hidden" className="w-fit">
        <div className="flex w-fit items-center gap-2">
          <Image
            src={"/assets/icons/sort-icon.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          <div>Sort</div>
        </div>
      </SelectTrigger>
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
