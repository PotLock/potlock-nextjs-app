import React from "react";

import { Search } from "lucide-react";
import Image from "next/image";
import { MdSearch } from "react-icons/md";

import { cn } from "../utils";
import { Input, InputProps } from "./atoms/input";

type Props = InputProps & {
  className?: string;
};

export const SearchBar = ({ className, ...inputProps }: Props) => {
  return (
    <div
      className={cn(
        "relative flex flex-1 items-center rounded-lg border-none bg-[#f7f7f7] px-2 outline-none",
        className,
      )}
    >
      <div className="pointer-events-none flex h-[18px] w-[18px]">
        <Image alt="search" src="/assets/icons/search-icon.svg" width={18} height={18} />
        <Search className="h-3 w-3" />
      </div>
      <Input type="search" {...(inputProps || {})} />
    </div>
  );
};
