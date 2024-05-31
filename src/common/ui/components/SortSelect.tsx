// import { useCallback } from "react";

import { SelectProps, Trigger } from "@radix-ui/react-select";
import Image from "next/image";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "./button";
import { Select, SelectContent, SelectItem } from "./select";

const SortSelect = ({
  options,
  onValueChange,
  ...selectProps
}: {
  options: { label: string; value: string }[];
  onValueChange?: SelectProps["onValueChange"];
  selectProps?: SelectProps;
}) => {
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);

  //     return params.toString();
  //   },
  //   [searchParams],
  // );

  return (
    <Select
      onValueChange={(value) => {
        // router.push(pathname + "?" + createQueryString("sort", value), {
        //   scroll: false,
        // });
        onValueChange ? onValueChange(value) : {};
      }}
      {...(selectProps || {})}
    >
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
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
