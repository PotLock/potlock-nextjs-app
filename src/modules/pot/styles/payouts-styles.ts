import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 4rem;
  width: 100%;
  @media screen and (min-width: 375px) and (max-width: 768px) {
    width: 99%;
  }
  @media screen and (max-width: 390px) {
    width: 98%;
  }
`;

export const OuterTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  @media screen and (max-width: 768px) {
    padding-right: 10px;
  }
`;

export const OuterText = styled.div`
  color: #7b7b7b;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 24px;
  letter-spacing: 1.12px;
  word-wrap: break-word;
`;

export const Count = styled.div`
  color: #dd3345;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  width: 100%;
  overflow-x: auto;
  flex-wrap: nowrap;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(199, 199, 199, 0.5);
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: flex-start;
  justify-content: space-between;
  width: 110px;
  justify-content: right;
  &.project {
    flex: 1;
    justify-content: left;
  }
  @media only screen and (max-width: 768px) {
    display: none;
    &.project {
      display: flex;
    }
  }
`;

export const HeaderItemText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

export const MobileAmount = styled.div`
  width: 100%;
  margin-left: 2rem;
  display: none;
  max-height: 0px;
  overflow: hidden;
  transition: all 200ms;
  span {
    font-weight: 600;
  }
  @media screen and (max-width: 768px) {
    order: 2;
    display: block;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  gap: 2rem;
  border-top: 1px solid rgba(199, 199, 199, 0.5);
  position: relative;
  .toggle-check {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    display: none;
  }
  .toggle-check:checked ~ svg {
    rotate: 0deg;
  }
  .toggle-check:checked + ${MobileAmount} {
    max-height: 100px;
  }
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    .toggle-check {
      display: block;
    }
  }
`;

export const RowItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 110px;
  justify-content: right;
  &:hover {
    text-decoration: none;
  }
  &.project {
    flex: 1;
    display: flex;
    gap: 1rem;
    justify-content: left;
    transition: 200ms;
    a {
      color: #292929;
      font-weight: 600;
      transition: 200ms;
      &:hover {
        color: #dd3345;
        text-decoration: none;
      }
    }
  }
  @media screen and (max-width: 768px) {
    &.project {
      gap: 0.5rem;
    }
    &.donors,
    &.amount {
      display: none;
    }
  }
`;

export const RowText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  word-wrap: break-word;
  span {
    color: #7b7b7b;
    font-weight: 600;
    display: none;
  }
  @media screen and (max-width: 768px) {
    span {
      display: inline;
    }
    &:last-of-type {
      display: flex;
      gap: 4px;
    }
  }
`;

export const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: #f6f5f3;
  padding: 0.5rem 1rem;
  @media only screen and (max-width: 768px) {
    gap: 8px;
  }
`;

export const SearchBar = styled.input`
  background: none;
  width: 100%;
  outline: none;
  border: none;
  &:focus {
    outline: none;
    border: none;
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`;

export const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #f4b37d;
  border-radius: 6px;
  background: #fef6ee;
  gap: 1rem;
  margin-left: auto;
  margin-bottom: 1.5rem;
`;

export const WarningText = styled.div`
  text-align: center;
  color: #dd3345;
  font-weight: 500;
  font-size: 14px;
`;
export const AlertSvg = styled.svg`
  width: 18px;
  @media screen and (max-width: 768px) {
    width: 1rem;
  }
`;
