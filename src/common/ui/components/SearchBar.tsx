import React from "react";

import Image from "next/image";

import { Input, InputProps } from "./input";

const SearchBar = ({ inputProps }: { inputProps?: InputProps }) => {
  return (
    <div className="relative flex flex-1">
      <div className="pointer-events-none absolute left-3.5 top-2/4 flex h-[18px] w-[18px] -translate-y-2/4">
        <Image
          alt="search"
          src="/assets/icons/search-icon.svg"
          width={18}
          height={18}
        />
      </div>
      <Input
        className="w-full border-none bg-none pl-10"
        {...(inputProps || {})}
      />
    </div>
  );
};

export default SearchBar;
