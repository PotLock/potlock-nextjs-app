import { useState } from "react";

import {
  DropdownLabel,
  FilterButton,
  FilterIcon,
  FilterItem,
  FilterMenu,
  Screen,
} from "./styled.deprecated";

export type Option = {
  label: string;
  type: string;
  count?: string | number;
};

type DropdownProps = {
  options: Option[];
  selectedOption: Option;
  onSelect: (option: Option) => void;
  title?: string;
  hideCounter?: boolean;
};

const Dropdown: React.FC<DropdownProps> = (props) => {
  const [openFilter, setOpenFilter] = useState(false);
  const { options, title, selectedOption, onSelect, hideCounter } = props;

  return (
    <>
      {openFilter && <Screen onClick={() => setOpenFilter(false)} />}
      <div style={{ position: "relative" }} onClick={() => setOpenFilter(!openFilter)}>
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
                {option.label} {!hideCounter && <div className="count">{option.count}</div>}
              </FilterItem>
            ))}
          </FilterMenu>
        )}
      </div>
    </>
  );
};

type Props = {
  sortOptions: Option[];
  selectedSortOption: Option;
  stats: Stat[];
  onSelectSortOption: (option: Option) => void;
};

export type Stat = {
  value: string;
  label: string;
  hideSeparator?: boolean;
};

export const Stats = ({ sortOptions, selectedSortOption, stats, onSelectSortOption }: Props) => {
  if (stats.length === 1) {
    stats[0].hideSeparator = true;
  }

  return (
    <div className="m-[24px_0] flex flex-wrap items-center">
      <div className="md:flex hidden">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center">
            <div className="flex h-fit items-center gap-2 pr-4">
              <p className="font-600">{stat.value}</p>
              <p className="item-label">{stat.label}</p>
            </div>
            {!stat.hideSeparator && <div className="h-[18px] border-l border-[#7b7b7b] pl-4" />}
          </div>
        ))}
      </div>
      <div className="sm:ml-auto ml-auto">
        <Dropdown
          selectedOption={selectedSortOption}
          options={sortOptions}
          onSelect={onSelectSortOption}
        />
      </div>
    </div>
  );
};
