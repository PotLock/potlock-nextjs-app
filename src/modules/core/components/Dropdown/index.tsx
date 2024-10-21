import { useState } from "react";

import {
  DropdownLabel,
  FilterButton,
  FilterIcon,
  FilterItem,
  FilterMenu,
  Screen,
} from "./styles";

export type Option = {
  label: string;
  type: string;
  count?: string | number;
};

type Props = {
  options: Option[];
  selectedOption: Option;
  onSelect: (option: Option) => void;
  title?: string;
  hideCounter?: boolean;
};

const Dropdown = (props: Props) => {
  const [openFilter, setOpenFilter] = useState(false);
  const { options, title, selectedOption, onSelect, hideCounter } = props;

  return (
    <>
      {openFilter && <Screen onClick={() => setOpenFilter(false)} />}
      <div
        style={{ position: "relative" }}
        onClick={() => setOpenFilter(!openFilter)}
      >
        <FilterButton>
          {selectedOption ? (
            <DropdownLabel digit={2}>
              <div className="label">{selectedOption.label}</div>
              <div className="count">{selectedOption.count}</div>
            </DropdownLabel>
          ) : (
            title || ""
          )}
          <FilterIcon>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.88667L10.1133 6L11.0533 5.06L8 2L4.94 5.06L5.88667 6L8 3.88667ZM8 12.1133L5.88667 10L4.94667 10.94L8 14L11.06 10.94L10.1133 10L8 12.1133Z"
                fill="#7B7B7B"
              />
            </svg>
          </FilterIcon>
        </FilterButton>
        {openFilter && (
          <FilterMenu onClick={(e: any) => e.stopPropagation()}>
            {options.map((option) => (
              <FilterItem
                key={option.type}
                onClick={() => {
                  setOpenFilter(false);
                  onSelect(option);
                }}
              >
                {option.label}{" "}
                {!hideCounter && <div className="count">{option.count}</div>}
              </FilterItem>
            ))}
          </FilterMenu>
        )}
      </div>
    </>
  );
};

export default Dropdown;
