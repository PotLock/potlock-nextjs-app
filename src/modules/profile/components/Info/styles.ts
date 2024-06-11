import { styled } from "styled-components";

export const LinksWrapper = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const ReferralButton = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  div {
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    width: 18px;
  }
  svg path {
    transition: fill 300ms ease-in-out;
  }
  :hover svg path {
    fill: #292929;
  }
`;
