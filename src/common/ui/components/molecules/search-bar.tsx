import React from "react";

import { MdSearch } from "react-icons/md";

import { cn } from "../../utils";
import { Input, InputProps } from "../atoms/input";

export type SearchBarProps = InputProps & {
  className?: string;
};

export const SearchBar: React.FC<SearchBarProps> = ({ className, ...inputProps }) => {
  return (
    <div
      className={cn(
        "relative flex h-[40px] w-full items-center rounded-lg",
        "border-none bg-neutral-50 px-2 outline-none",
        className,
      )}
    >
      <div className="pointer-events-none p-1">
        <MdSearch className="color-neutral-400 h-6 w-6" />
      </div>

      <Input type="search" {...inputProps} />
    </div>
  );
};
