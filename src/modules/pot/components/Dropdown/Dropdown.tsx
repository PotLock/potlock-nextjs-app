import { useState } from "react";

import {
  FilterButton,
  FilterIcon,
  FilterItem,
  FilterMenu,
  Screen,
} from "./styles";

type Option = {
  label: string;
  val: any;
  count?: string | number;
};

type Props = {
  sortList: Option[];
  handleSortChange: (option: Option) => void;
  sortVal?: any;
  title?: any;
  FilterMenuCustomClass?: string;
  showCount?: boolean;
  menuStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
};

const Dropdown = (componentProps: Props) => {
  const [openFilter, setOpenFilter] = useState(false);
  const {
    sortList,
    sortVal,
    title,
    handleSortChange,
    FilterMenuCustomClass,
    showCount,
  } = componentProps;
  const menuStyle = componentProps.menuStyle || {};
  const buttonStyle = componentProps.buttonStyle || {};

  return (
    <>
      {openFilter && <Screen onClick={() => setOpenFilter(false)} />}
      <div
        style={{ position: "relative" }}
        onClick={() => setOpenFilter(!openFilter)}
      >
        <FilterButton style={buttonStyle || {}}>
          {sortVal || title || ""}
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
          <FilterMenu
            onClick={(e: any) => e.stopPropagation()}
            className={FilterMenuCustomClass || ""}
            style={menuStyle}
          >
            {sortList.map((option) => (
              <FilterItem
                key={option.val}
                onClick={() => {
                  setOpenFilter(false);
                  handleSortChange(option);
                }}
              >
                {option.label}{" "}
                <div className="count">{showCount ? option.count : ""}</div>
              </FilterItem>
            ))}
          </FilterMenu>
        )}
      </div>
    </>
  );
};

export default Dropdown;
