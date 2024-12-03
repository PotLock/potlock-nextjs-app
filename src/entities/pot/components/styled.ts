// TODO: refactor using tailwind!

import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border-top: 1px solid #292929;
  border-right: 1px solid #292929;
  border-bottom: 2px solid #292929;
  border-left: 1px solid #292929;
  overflow: hidden;

  .header {
    font-size: 18px;
    font-weight: 600;
    background: #fef6ee;
    padding: 1rem;
    span {
      color: #ee8949;
    }
  }

  .sort {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    font-size: 11px;
    background: #fef6ee;

    .title {
      font-weight: 500;
      letter-spacing: 0.44px;
      text-transform: uppercase;
    }

    .sort-btn {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 1rem;
  gap: 8px;
  border-bottom: 1px solid #c7c7c7;

  &:last-of-type {
    border-bottom: none;
  }

  .address {
    display: flex;
    text-decoration: none;
    align-items: center;
    font-weight: 600;
    gap: 8px;
    margin-left: 24px;
    flex: 1;
    color: #292929;
    transition: color 200ms ease-in;

    :hover {
      color: #dd3345;
    }
  }

  .profile-image {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex !important;
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
