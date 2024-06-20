import styled from "styled-components";

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

const FilterIcon = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
`;

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
  box-shadow: 0px 12px 20px -4px rgba(123, 123, 123, 0.32), 0px 4px 8px -3px rgba(123, 123, 123, 0.2),
    0px 0px 2px 0px rgba(123, 123, 123, 0.36);
  z-index: 3;
`;

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
const Screen = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
`;
export { FilterButton, FilterIcon, FilterItem, FilterMenu, Screen };
