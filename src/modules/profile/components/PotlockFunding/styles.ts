import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
`;
export const PotlockFundingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  background: #fff;
  overflow: hidden;
  .header {
    border-bottom: 0.5px solid #7b7b7b;
    padding: 0.5rem 1rem;
    div {
      font-weight: 600;
    }
    @media screen and (max-width: 768px) {
      .tab {
        display: none;
      }
      .funding {
        display: block;
      }
    }
  }
  .funding-row {
    padding: 1rem;
  }
  .header,
  .funding-row {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    font-size: 14px;
    flex-wrap: wrap;
    @media screen and (max-width: 768px) {
      gap: 4px;
    }
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 156px;
    justify-content: left;
    &.sort {
      cursor: pointer;
      svg {
        transition: rotate 300ms;
      }
    }
    @media screen and (max-width: 768px) {
      white-space: nowrap;
      width: 60px;
    }
  }
  .funding {
    flex: 1;
  }
  .price {
    gap: 1rem;
    font-weight: 600;
    justify-content: left;
    svg {
      width: 1.5em;
    }
  }
  .date {
    justify-content: right;
  }
  @media screen and (max-width: 768px) {
    .price {
      gap: 0.5rem;
    }
    .date {
      width: 100%;
      justify-content: left;
      color: #7b7b7b;
      margin-left: 2.5rem;
    }
  }
`;

export const FundingSrc = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 100%;
  gap: 1rem;
  .profile-image {
    width: 24px;
    height: 24px;
    display: flex !important;
  }
  .funding-src {
    display: flex;
    flex-direction: column;
    .pot-name {
      color: inherit;
      font-weight: inherit;
      display: none;
    }
    a {
      color: #292929;
      transition: 300ms;
      font-weight: 600;
      :hover {
        text-decoration: none;
        color: #dd3345;
      }
    }
    .type {
      color: #7b7b7b;
    }
  }
  @media screen and (max-width: 768px) {
    .funding-src .type {
      display: none;
    }
    .funding-src .pot-name {
      display: inline-block;
    }
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f6f5f3;
  position: relative;
  svg {
    width: 18px;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    pointer-events: none;
  }
  input {
    width: 100%;
    height: 100%;
    padding: 1rem;
    padding-left: 50px;
    border: none;
    background: transparent;
    :focus {
      outline: none;
    }
  }
`;

export const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 24px 0;
  align-items: center;
  .item {
    display: flex;
    height: fit-content;
    gap: 8px;
    padding-right: 1rem;
    align-items: center;
    :nth-child(2) {
      border-right: 1px solid #7b7b7b;
      border-left: 1px solid #7b7b7b;
      padding-left: 1rem;
    }
    :nth-child(3) {
      padding-left: 1rem;
    }
    .item-value {
      font-weight: 600;
    }
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .dropdown {
    margin-left: auto;
    @media screen and (max-width: 480px) {
      margin-right: auto;
      margin-left: 0;
    }
  }
`;

export const Sort = styled.div`
  display: none;
  justify-content: space-between;
  width: 100%;
  div {
    display: flex;
    align-items: center;
    font-weight: 500;
    cursor: pointer;
    gap: 8px;
    color: #7b7b7b;
    svg {
      transition: rotate 300ms;
    }
    &.active {
      color: #292929;
    }
  }
  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

export const DropdownLabel = styled.div<{ digit: number }>`
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

export const ImgIcon = styled.img`
  width: 21px;
  height: 21px;
`;
