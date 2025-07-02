import { useState } from "react";

import { styled } from "styled-components";

// TODO: refactor by breaking into TailwindCSS classes
const FilterButton = styled.div`
  white-space: nowrap;
  display: flex;
  cursor: pointer;
  gap: 12px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  border: 1px solid #292929;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #292929;
  * {
    font-weight: 500;
  }
`;

// TODO: refactor by breaking into TailwindCSS classes
const FilterIcon = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
`;

// TODO: refactor by breaking into TailwindCSS classes
const FilterMenu = styled.div`
  position: absolute;
  background: #fff;
  top: 140%;
  right: 0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid rgba(41, 41, 41, 0.36);
  box-shadow:
    0px 12px 20px -4px rgba(123, 123, 123, 0.32),
    0px 4px 8px -3px rgba(123, 123, 123, 0.2),
    0px 0px 2px 0px rgba(123, 123, 123, 0.36);
  z-index: 3;
`;

// TODO: refactor by breaking into TailwindCSS classes
const FilterItem = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  transition: all 300ms ease-in-out;
  &:hover {
    color: #fff;
    background: #292929;
    border-radius: 6px;
    .count {
      color: #fff;
    }
  }
  .count {
    color: #7b7b7b;
  }
`;

// TODO: refactor by breaking into TailwindCSS classes
const Screen = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;

// TODO: refactor by breaking into TailwindCSS classes
const DropdownLabel = styled.div<{ digit: number }>`
  display: flex;
  gap: 10px;
  align-items: center;
  .label {
    font-weight: 500;
  }
  .count {
    display: flex;
    width: ${({ digit }) => 24 + (digit - 1) * 6}px;
    height: ${({ digit }) => 24 + (digit - 1) * 6}px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ebebeb;
  }
`;

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

export const FundingStats = ({
  sortOptions,
  selectedSortOption,
  stats,
  onSelectSortOption,
}: Props) => {
  if (stats.length === 1) {
    stats[0].hideSeparator = true;
  }

  return (
    <div className="m-[24px_0] flex flex-wrap items-center">
      <div className="hidden md:flex">
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
      <div className="ml-auto sm:ml-auto">
        <Dropdown
          selectedOption={selectedSortOption}
          options={sortOptions}
          onSelect={onSelectSortOption}
        />
      </div>
    </div>
  );
};
